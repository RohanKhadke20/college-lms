import { supabase } from './supabaseClient';
import { ClassNote, SupabaseNoteRow, PremiumFilter } from '@/types/note';

/**
 * Safely parse a Supabase note row into a typed ClassNote.
 * Handles JSON payload in content_markdown or fallback columns.
 */
export function parseNoteRow(row: SupabaseNoteRow | Record<string, unknown>): ClassNote {
  let meta: Record<string, unknown> = {};
  if (row.content_markdown && typeof row.content_markdown === 'string') {
    try {
      meta = JSON.parse(row.content_markdown);
    } catch {
      meta = { description: row.content_markdown };
    }
  }

  const isPremium = (row as Record<string, unknown>).is_premium ?? meta.is_premium ?? (meta.price ? Number(meta.price) > 0 : false);
  const price = (row as Record<string, unknown>).price ?? meta.price ?? 0;

  return {
    id: String(row.id || ''),
    title: (row as Record<string, unknown>).title as string || 'Untitled Note',
    subject: ((row as Record<string, unknown>).subject as string) || (meta.subject as string) || 'General Engineering',
    subject_code: ((row as Record<string, unknown>).subject_code as string) || (meta.subject_code as string) || 'GEN101',
    professor: ((row as Record<string, unknown>).professor as string) || (meta.professor as string) || 'Faculty Lead',
    department: ((row as Record<string, unknown>).department as string) || (meta.department as string) || 'Academic Department',
    semester: ((row as Record<string, unknown>).semester as string) || (meta.semester as string) || 'Semester 2026',
    file_url: ((row as Record<string, unknown>).file_url as string) || (meta.file_url as string) || '',
    file_name: ((row as Record<string, unknown>).file_name as string) || (meta.file_name as string) || 'document.pdf',
    file_type: ((row as Record<string, unknown>).file_type as string) || (meta.file_type as string) || 'application/pdf',
    file_size: Number((row as Record<string, unknown>).file_size || meta.file_size || 1024 * 1024),
    price: Number(price),
    is_premium: Boolean(isPremium),
    description: (meta.description as string) || '',
    order_index: typeof row.order_index === 'number' ? row.order_index : 0,
    created_at: typeof row.created_at === 'string' ? row.created_at : new Date().toISOString(),
  };
}

/**
 * Fetch notes from Supabase with client-side or server query options
 */
export async function getNotesFromSupabase(options?: {
  subject?: string;
  premiumStatus?: PremiumFilter;
  searchQuery?: string;
}): Promise<ClassNote[]> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes from Supabase:', error);
      return [];
    }

    if (!data) return [];

    let parsed = data.map(parseNoteRow);

    // Filter by subject
    if (options?.subject && options.subject !== 'All Subjects') {
      parsed = parsed.filter(
        (n) => n.subject.toLowerCase() === options.subject?.toLowerCase()
      );
    }

    // Filter by premium status
    if (options?.premiumStatus && options.premiumStatus !== 'all') {
      if (options.premiumStatus === 'free') {
        parsed = parsed.filter((n) => !n.is_premium || n.price === 0);
      } else if (options.premiumStatus === 'premium') {
        parsed = parsed.filter((n) => n.is_premium && n.price > 0);
      }
    }

    // Filter by search query
    if (options?.searchQuery?.trim()) {
      const q = options.searchQuery.toLowerCase();
      parsed = parsed.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          (n.subject_code && n.subject_code.toLowerCase().includes(q)) ||
          (n.professor && n.professor.toLowerCase().includes(q)) ||
          n.file_name.toLowerCase().includes(q)
      );
    }

    return parsed;
  } catch (err) {
    console.error('Unexpected error fetching notes:', err);
    return [];
  }
}
