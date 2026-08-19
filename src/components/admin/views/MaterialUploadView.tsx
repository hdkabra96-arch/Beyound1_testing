import React, { useState, useMemo } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Layers,
  FolderOpen,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  FileCheck,
  Check,
} from 'lucide-react';
import { ProtectedPdfViewerModal } from '../../ui/ProtectedPdfViewerModal';

export const MaterialUploadView: React.FC = () => {
  const { classes, subjects, chapters, topics, contents, uploadPdfMaterial, deleteContent, toggleContentPublish } = useAdminStore();

  // Hierarchy Selection State
  const [selectedClassId, setSelectedClassId] = useState<string>('class_5');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('subj_5_math');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch_5_4');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('top_5_4_1');

  // Form Fields for new PDF Material
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfFilename, setPdfFilename] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('1.8 MB');
  const [pdfPagesCount, setPdfPagesCount] = useState(4);
  const [isPublished, setIsPublished] = useState(true);

  // Status & Feedback
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Preview Modal
  const [previewContent, setPreviewContent] = useState<any | null>(null);

  // Filtered Subjects based on selected Class
  const availableSubjects = useMemo(() => {
    return subjects.filter((s) => s.classId === selectedClassId);
  }, [subjects, selectedClassId]);

  // Filtered Chapters based on selected Class and Subject
  const availableChapters = useMemo(() => {
    return chapters.filter((c) => c.classId === selectedClassId && c.subjectId === selectedSubjectId);
  }, [chapters, selectedClassId, selectedSubjectId]);

  // Filtered Topics based on selected Chapter
  const availableTopics = useMemo(() => {
    return topics.filter((t) => t.chapterId === selectedChapterId);
  }, [topics, selectedChapterId]);

  // Count current PDFs in the selected topic
  const currentPdfsInTopic = useMemo(() => {
    return contents.filter(
      (c) =>
        c.topic_id === selectedTopicId &&
        (c.content_type === 'pdf' || c.pdf_url || c.content_type === 'notes' || c.content_type === 'practice_paper')
    );
  }, [contents, selectedTopicId]);

  const activeTopicObj = useMemo(() => {
    return topics.find((t) => t.id === selectedTopicId);
  }, [topics, selectedTopicId]);

  const topicLimit = activeTopicObj?.maxPdfLimit || 30;
  const isTopicFull = currentPdfsInTopic.length >= topicLimit;

  // Handle Class change
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    const subjs = subjects.filter((s) => s.classId === classId);
    const firstSubj = subjs[0]?.id || '';
    setSelectedSubjectId(firstSubj);

    const chaps = chapters.filter((c) => c.classId === classId && c.subjectId === firstSubj);
    const firstChap = chaps[0]?.id || '';
    setSelectedChapterId(firstChap);

    const tops = topics.filter((t) => t.chapterId === firstChap);
    setSelectedTopicId(tops[0]?.id || '');
    setUploadError(null);
    setUploadSuccess(null);
  };

  // Handle Subject change
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const chaps = chapters.filter((c) => c.classId === selectedClassId && c.subjectId === subjectId);
    const firstChap = chaps[0]?.id || '';
    setSelectedChapterId(firstChap);

    const tops = topics.filter((t) => t.chapterId === firstChap);
    setSelectedTopicId(tops[0]?.id || '');
    setUploadError(null);
    setUploadSuccess(null);
  };

  // Handle Chapter change
  const handleChapterChange = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    const tops = topics.filter((t) => t.chapterId === chapterId);
    setSelectedTopicId(tops[0]?.id || '');
    setUploadError(null);
    setUploadSuccess(null);
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPdfFilename(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setPdfFileSize(`${sizeMB} MB`);
      if (!title) {
        // Auto derive clean title
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(cleanName);
      }
    }
  };

  // Submit Upload
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(null);

    if (!selectedTopicId) {
      setUploadError('Please select a topic to upload the PDF into.');
      return;
    }

    if (!title.trim()) {
      setUploadError('Please enter a title for the material.');
      return;
    }

    if (isTopicFull) {
      setUploadError(`Upload blocked: This topic already contains the maximum limit of ${topicLimit} PDF materials.`);
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const result = uploadPdfMaterial({
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        chapterId: selectedChapterId,
        topicId: selectedTopicId,
        title: title.trim(),
        description: description.trim() || `Comprehensive reference study material and practice set for ${activeTopicObj?.title}.`,
        pdfUrl: '/downloads/class5_fractions_master.pdf', // Standard high-quality bundled mock PDF
        pdfFilename: pdfFilename || `${title.replace(/\s+/g, '_')}.pdf`,
        pdfFileSize: pdfFileSize,
        pdfPagesCount: pdfPagesCount,
        isPublished: isPublished,
        isEnabled: true,
      });

      setIsUploading(false);

      if (result.success) {
        setUploadSuccess(`Successfully uploaded "${title}" to topic "${activeTopicObj?.title}"!`);
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        setPdfFilename('');
      } else {
        setUploadError(result.error || 'Failed to upload PDF material.');
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Curriculum PDF Material Upload</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Max 30 PDFs / Topic Enforced
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Follow the strict hierarchy: <strong>Class → Chapter → Topic → Upload PDF</strong>. Limits are verified at UI and state layers.
          </p>
        </div>
      </div>

      {/* Main Upload Grid: Left = Hierarchy + Upload Form, Right = Existing PDFs in Topic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Flow & Upload (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Hierarchical Cascading Selectors */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-[10px] font-black flex items-center justify-center text-white">
                  1
                </span>
                Select Curriculum Hierarchy
              </h2>
              <span className="text-[11px] text-indigo-400 font-bold">Class → Chapter → Topic</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Class */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Class
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-purple-400" /> Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                >
                  {availableSubjects.map((subj) => (
                    <option key={subj.id} value={subj.id}>
                      {subj.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <FolderOpen className="w-3.5 h-3.5 text-cyan-400" /> Chapter
                </label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => handleChapterChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                >
                  {availableChapters.map((chap) => (
                    <option key={chap.id} value={chap.id}>
                      Ch {chap.chapterNumber}: {chap.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topic Selector */}
            <div className="pt-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" /> Select Topic (PDF Destination)
                </span>
                <span className="text-[10px] text-slate-400">
                  {availableTopics.length} topics available in this chapter
                </span>
              </label>

              {availableTopics.length === 0 ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>No topics created in this chapter yet. Create topics first in Topic Management.</span>
                </div>
              ) : (
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-extrabold text-indigo-300 focus:outline-none focus:border-indigo-500"
                >
                  {availableTopics.map((top) => {
                    const count = contents.filter(
                      (c) =>
                        c.topic_id === top.id &&
                        (c.content_type === 'pdf' || c.pdf_url || c.content_type === 'notes' || c.content_type === 'practice_paper')
                    ).length;
                    return (
                      <option key={top.id} value={top.id}>
                        Topic {top.topicNumber}: {top.title} ({count}/30 PDFs)
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {/* Topic Quota Status Badge */}
            {activeTopicObj && (
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                  isTopicFull
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : currentPdfsInTopic.length >= 25
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <div>
                    <span className="font-bold block">
                      {activeTopicObj.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Capacity Limit: {topicLimit} PDFs maximum
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black font-mono block">
                    {currentPdfsInTopic.length} / {topicLimit}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {isTopicFull ? 'Full Quota Reached' : `${topicLimit - currentPdfsInTopic.length} Slots Left`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: PDF Upload Form */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-[10px] font-black flex items-center justify-center text-white">
                  2
                </span>
                PDF Details & File Upload
              </h2>
            </div>

            {uploadError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              {/* File Dropzone */}
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">PDF Document File</label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    isTopicFull
                      ? 'border-rose-900/50 bg-rose-950/20 opacity-60 cursor-not-allowed'
                      : selectedFile
                      ? 'border-emerald-500/50 bg-emerald-950/20'
                      : 'border-slate-700 hover:border-indigo-500 bg-slate-950/60'
                  }`}
                  onClick={() => {
                    if (!isTopicFull) {
                      document.getElementById('pdf-file-input')?.click();
                    }
                  }}
                >
                  <input
                    id="pdf-file-input"
                    type="file"
                    accept=".pdf"
                    disabled={isTopicFull}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <UploadCloud
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectedFile ? 'text-emerald-400' : isTopicFull ? 'text-rose-400' : 'text-indigo-400'
                    }`}
                  />

                  {selectedFile ? (
                    <div>
                      <span className="font-extrabold text-emerald-300 text-xs block">{selectedFile.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                      </span>
                    </div>
                  ) : isTopicFull ? (
                    <div>
                      <span className="font-bold text-rose-400 block">Topic Full (30 / 30 PDFs)</span>
                      <span className="text-[11px] text-slate-400">Delete older materials or select another topic.</span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-slate-200 block">Click to select PDF or drag & drop</span>
                      <span className="text-[11px] text-slate-400">Standard educational format (.pdf), up to 25MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Material Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Parts & Wholes Practice Worksheet 1 (Solutions Included)"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional guidance, hints, or chapter references for students..."
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Pages & Publishing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Page Count</label>
                  <input
                    type="number"
                    min={1}
                    value={pdfPagesCount}
                    onChange={(e) => setPdfPagesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-200 font-bold text-xs">Publish Immediately</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isTopicFull || isUploading || !selectedTopicId}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    isTopicFull || isUploading || !selectedTopicId
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white shadow-emerald-600/30'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading & Validating Material...' : 'Upload PDF to Topic'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Existing PDF Materials in Topic (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-white">Topic Materials Repository</h3>
                <p className="text-[11px] text-slate-400">
                  {currentPdfsInTopic.length} PDFs in {activeTopicObj?.title || 'Selected Topic'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold text-xs">
                {currentPdfsInTopic.length} / {topicLimit}
              </span>
            </div>

            {currentPdfsInTopic.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">No PDFs uploaded in this topic yet.</p>
                <p className="text-[11px] text-slate-500">Use the form to add up to 30 PDF materials.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {currentPdfsInTopic.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-xs leading-snug">{item.title}</h4>
                          <span className="text-[10px] text-slate-400">
                            {item.pdf_filename || `${item.id}.pdf`} • {item.pdf_file_size || '2.1 MB'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleContentPublish(item.id)}
                        className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                          item.is_published ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                        }`}
                        title={item.is_published ? 'Published' : 'Unpublished'}
                      >
                        {item.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                      <span className="text-slate-500 font-mono text-[10px]">#{idx + 1}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewContent(item)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold hover:bg-indigo-600/30 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Preview
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete material "${item.title}"?`)) {
                              deleteContent(item.id);
                            }
                          }}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete PDF"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Protected PDF Viewer Modal */}
      {previewContent && (
        <ProtectedPdfViewerModal
          isOpen={!!previewContent}
          onClose={() => setPreviewContent(null)}
          title={previewContent.title}
          pdfUrl={previewContent.pdf_url || '/downloads/class5_fractions_master.pdf'}
          downloadEnabled={true}
          watermarkText="Beyond Classroom • Admin Preview"
          studentName="Administrator"
        />
      )}
    </div>
  );
};
