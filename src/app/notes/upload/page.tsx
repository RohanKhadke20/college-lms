'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  DollarSign, 
  Sparkles, 
  X,
  FileCode,
  GraduationCap
} from 'lucide-react';

const COMMON_SUBJECTS = [
  'Computer Science',
  'Data Structures & Algorithms',
  'Artificial Intelligence',
  'Engineering Mathematics',
  'Operating Systems',
  'Digital Electronics',
  'Cloud Computing',
  'Database Management Systems',
  'Computer Networks',
  'Cybersecurity & Cryptography'
];

export default function UploadNotePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(COMMON_SUBJECTS[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [professor, setProfessor] = useState('');
  const [semester, setSemester] = useState('Semester 6');
  const [description, setDescription] = useState('');
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Premium state
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState('99');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileSelect = (selectedFile: File) => {
    setErrorMessage('');
    const ext = selectedFile.name.toLowerCase();
    if (!ext.endsWith('.pdf') && !ext.endsWith('.docx') && !ext.endsWith('.doc')) {
      setErrorMessage('Only PDF (.pdf) and Word (.docx, .doc) files are supported.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 50MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!title.trim()) {
      setErrorMessage('Please provide a title for the note.');
      return;
    }

    if (!file) {
      setErrorMessage('Please select a document file (.pdf or .docx) to upload.');
      return;
    }

    const finalSubject = subject === 'Other' ? (customSubject.trim() || 'General') : subject;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('subject', finalSubject);
      formData.append('subjectCode', subjectCode.trim() || 'CS300');
      formData.append('professor', professor.trim() || 'Faculty Department');
      formData.append('semester', semester);
      formData.append('description', description.trim());
      formData.append('isPremium', isPremium ? 'true' : 'false');
      formData.append('price', isPremium ? price : '0');

      const response = await fetch('/api/notes/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload note');
      }

      setSuccessMessage('Note and file uploaded to Supabase successfully!');
      setTimeout(() => {
        router.push('/notes');
      }, 1500);
    } catch (err: unknown) {
      console.error('Upload submission error:', err);
      const message = err instanceof Error ? err.message : 'Error uploading note. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans">
      <Navbar activeTab="Class Notes" />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back navigation & Page title */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="space-y-1">
            <Link
              href="/notes"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Class Notes</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Upload Class Notes & Study Material
            </h1>
            <p className="text-xs text-slate-400">
              Files are securely stored in Supabase Storage (`notes-files`) and indexed in the notes database.
            </p>
          </div>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Upload Failed</p>
              <p className="mt-0.5 text-rose-300/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-semibold">Success</p>
              <p className="mt-0.5 text-emerald-300/90">{successMessage} Redirecting to library...</p>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Note Details */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-400" />
              <span>1. Note Metadata & Course Info</span>
            </h2>

            {/* Note Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Note Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Systems & Consensus Protocols (Raft & Paxos)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Subject and Subject Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Subject <span className="text-rose-400">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {COMMON_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="Other">Other (Custom Subject)</option>
                </select>

                {subject === 'Other' && (
                  <input
                    type="text"
                    required
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter custom subject name..."
                    className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Course / Subject Code
                </label>
                <input
                  type="text"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  placeholder="e.g. CS405, EC204, MATH201"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Professor & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Professor / Instructor Name
                </label>
                <input
                  type="text"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="e.g. Dr. Aris Thorne"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                  <option value="Semester 7">Semester 7</option>
                  <option value="Semester 8">Semester 8</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Overview & Syllabus Topics Covered
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of units, algorithms, derivation proofs, or exam tips included in this set..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Document File Upload */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-indigo-400" />
              <span>2. Attach Document File (PDF / DOCX)</span>
            </h2>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-950/30'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
                }`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-white">
                  Click to select file or drag & drop here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supported formats: PDF (.pdf) or Word (.docx, .doc) up to 50MB
                </p>
                <span className="inline-block mt-3 text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                  Target Bucket: Supabase storage / notes-files
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {file.name.endsWith('.pdf') ? <FileText className="h-5 w-5" /> : <FileCode className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white truncate max-w-sm sm:max-w-md">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'Document'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Pricing & Premium Status */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-400" />
              <span>3. Monetization & Access Tier</span>
            </h2>

            {/* Toggle Row */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Premium Study Note</span>
                  {isPremium && (
                    <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                      Paid Access
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {isPremium
                    ? 'Students must unlock this document with a one-time fee.'
                    : 'Free access for all registered college students.'}
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => setIsPremium(!isPremium)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPremium ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isPremium ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Price input (conditional) */}
            {isPremium && (
              <div className="space-y-3 pt-2 animate-in fade-in">
                <label className="block text-xs font-medium text-slate-300">
                  Price in INR (₹)
                </label>
                <div className="flex items-center gap-2 max-w-xs">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-mono text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="99"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Preset chips */}
                  <div className="flex gap-1.5">
                    {['49', '99', '149', '199'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrice(p)}
                        className={`px-2.5 py-2 text-xs font-mono rounded-lg border transition-all ${
                          price === p
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        ₹{p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/notes"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Uploading to Supabase...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-indigo-200" />
                  <span>Upload & Publish Note</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
