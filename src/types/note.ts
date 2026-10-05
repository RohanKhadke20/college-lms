export interface SupabaseNoteRow {
  id: string;
  course_id?: string | null;
  title: string;
  content_markdown: string;
  order_index?: number;
  created_at: string;
}

export interface ClassNote {
  id: string;
  title: string;
  subject: string;
  subject_code?: string;
  professor?: string;
  department?: string;
  semester?: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  price: number;
  is_premium: boolean;
  description?: string;
  order_index?: number;
  created_at: string;
}

export type PremiumFilter = 'all' | 'free' | 'premium';

export interface PurchaseRecord {
  id?: string;
  user_id?: string;
  note_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency?: string;
  status: 'created' | 'paid' | 'failed';
  created_at?: string;
}

export interface RazorpayVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  noteId: string;
}
