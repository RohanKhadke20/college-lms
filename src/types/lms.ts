export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  department: string;
  professor: string;
  semester: string;
  uploadDate: string;
  pageCount: number;
  readTime: string;
  price: number; // 0 for free
  isPurchased?: boolean;
  downloads: number;
  rating: number;
  reviewsCount: number;
  previewSnippet: string;
  aiSummary: {
    overview: string;
    keyPoints: string[];
    examTips: string[];
    formulaSheet?: string[];
  };
  tags: string[];
}

export type SubjectFilterOption = 
  | 'All Subjects'
  | 'Computer Science'
  | 'Engineering Mathematics'
  | 'Data Structures & Algorithms'
  | 'Artificial Intelligence'
  | 'Operating Systems'
  | 'Digital Electronics'
  | 'Cloud Computing';
