import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { parseNoteRow } from '@/lib/notesService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const premiumStatus = searchParams.get('premium');
    const query = searchParams.get('q');

    const { data, error } = await supabaseAdmin
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('API fetch notes error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let parsed = (data || []).map(parseNoteRow);

    if (subject && subject !== 'All Subjects') {
      parsed = parsed.filter(
        (n) => n.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    if (premiumStatus && premiumStatus !== 'all') {
      if (premiumStatus === 'free') {
        parsed = parsed.filter((n) => !n.is_premium || n.price === 0);
      } else if (premiumStatus === 'premium') {
        parsed = parsed.filter((n) => n.is_premium && n.price > 0);
      }
    }

    if (query?.trim()) {
      const q = query.toLowerCase();
      parsed = parsed.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          (n.subject_code && n.subject_code.toLowerCase().includes(q)) ||
          (n.professor && n.professor.toLowerCase().includes(q)) ||
          n.file_name.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ notes: parsed, count: parsed.length });
  } catch (err: unknown) {
    console.error('Notes GET API error:', err);
    const message = err instanceof Error ? err.message : 'Failed to fetch notes';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
