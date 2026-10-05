import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const subject = (formData.get('subject') as string) || 'General';
    const subjectCode = (formData.get('subjectCode') as string) || 'GEN101';
    const professor = (formData.get('professor') as string) || 'Course Faculty';
    const department = (formData.get('department') as string) || 'Academic Affairs';
    const semester = (formData.get('semester') as string) || 'Semester 2026';
    const description = (formData.get('description') as string) || '';
    const priceStr = (formData.get('price') as string) || '0';
    const isPremiumStr = (formData.get('isPremium') as string) || 'false';

    if (!title.trim()) {
      return NextResponse.json(
        { error: 'Note title is required.' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: 'Document file (PDF or DOCX) is required.' },
        { status: 400 }
      );
    }

    // Allowed file types
    const allowedExtensions = ['.pdf', '.docx', '.doc'];
    const fileName = file.name;
    const lowerName = fileName.toLowerCase();
    const hasValidExt = allowedExtensions.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      return NextResponse.json(
        { error: 'Only PDF (.pdf) and Word (.docx, .doc) files are supported.' },
        { status: 400 }
      );
    }

    // Size limit: 50MB
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 50MB.' },
        { status: 400 }
      );
    }

    const price = Math.max(0, parseFloat(priceStr) || 0);
    const isPremium = isPremiumStr === 'true' || price > 0;

    // 1. Sanitize file name and create unique path in storage
    const sanitizedBase = fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_');
    const storagePath = `${Date.now()}-${sanitizedBase}`;

    // Convert file to ArrayBuffer / Buffer for upload
    const fileBytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);

    // 2. Upload file to Supabase Storage bucket 'notes-files'
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('notes-files')
      .upload(storagePath, fileBuffer, {
        contentType: file.type || 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 3. Obtain public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('notes-files')
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData.publicUrl;

    // 4. Construct metadata payload
    const metadata = {
      subject,
      subject_code: subjectCode,
      professor,
      department,
      semester,
      file_url: publicUrl,
      file_name: fileName,
      file_size: file.size,
      file_type: file.type || (lowerName.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
      price,
      is_premium: isPremium,
      description,
      storage_path: uploadData.path,
    };

    // 5. Insert metadata record into 'notes' table
    const { data: noteRow, error: insertError } = await supabaseAdmin
      .from('notes')
      .insert([
        {
          title: title.trim(),
          content_markdown: JSON.stringify(metadata),
          order_index: 0,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase notes table insert error:', insertError);
      return NextResponse.json(
        { error: `Failed to insert note metadata: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Note uploaded and recorded successfully!',
        note: {
          id: noteRow.id,
          title: noteRow.title,
          ...metadata,
          created_at: noteRow.created_at,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('Upload handler error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error while processing upload.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
