import React, { useState, useMemo } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { AcademicTopic } from '../../../types/admin';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Search,
  Filter,
  GraduationCap,
  FolderOpen,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';

export const TopicManagementView: React.FC = () => {
  const { classes, subjects, chapters, topics, contents, addTopic, updateTopic, deleteTopic, toggleTopicStatus } = useAdminStore();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalTopic, setEditModalTopic] = useState<AcademicTopic | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    classId: string;
    subjectId: string;
    chapterId: string;
    title: string;
    description: string;
    topicNumber: number;
    sortOrder: number;
    maxPdfLimit: number;
    isEnabled: boolean;
  }>({
    classId: 'class_5',
    subjectId: 'subj_5_math',
    chapterId: 'ch_5_4',
    title: '',
    description: '',
    topicNumber: 1,
    sortOrder: 1,
    maxPdfLimit: 30,
    isEnabled: true,
  });

  // Filtered Chapters based on selected Class & Subject
  const availableChapters = useMemo(() => {
    return chapters.filter((c) => {
      if (selectedClassId !== 'all' && c.classId !== selectedClassId) return false;
      if (selectedSubjectId !== 'all' && c.subjectId !== selectedSubjectId) return false;
      return true;
    });
  }, [chapters, selectedClassId, selectedSubjectId]);

  // Filtered Topics list
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      if (selectedClassId !== 'all' && t.classId !== selectedClassId) return false;
      if (selectedSubjectId !== 'all' && t.subjectId !== selectedSubjectId) return false;
      if (selectedChapterId !== 'all' && t.chapterId !== selectedChapterId) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = (t.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });
  }, [topics, selectedClassId, selectedSubjectId, selectedChapterId, searchQuery]);

  // Form chapter selection reactive helper
  const formChapters = useMemo(() => {
    return chapters.filter((c) => c.classId === formData.classId && c.subjectId === formData.subjectId);
  }, [chapters, formData.classId, formData.subjectId]);

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.chapterId) return;

    addTopic({
      classId: formData.classId,
      subjectId: formData.subjectId,
      chapterId: formData.chapterId,
      title: formData.title,
      description: formData.description,
      topicNumber: Number(formData.topicNumber || 1),
      sortOrder: Number(formData.sortOrder || 1),
      maxPdfLimit: 30, // Strict maximum 30 PDFs per topic
      isEnabled: formData.isEnabled,
    });

    setAddModalOpen(false);
    setFormData({
      classId: formData.classId,
      subjectId: formData.subjectId,
      chapterId: formData.chapterId,
      title: '',
      description: '',
      topicNumber: formData.topicNumber + 1,
      sortOrder: formData.sortOrder + 1,
      maxPdfLimit: 30,
      isEnabled: true,
    });
  };

  const getTopicPdfCount = (topicId: string) => {
    return contents.filter(
      (c) => c.topic_id === topicId && (c.content_type === 'pdf' || c.pdf_url || c.content_type === 'notes' || c.content_type === 'practice_paper')
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Academic Topic Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              Class → Chapter → Topic Hierarchy
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize syllabus into sub-topics under each chapter. Each topic accommodates up to 30 downloadable & viewable PDF study materials.
          </p>
        </div>

        <button
          onClick={() => {
            const firstClass = classes[0]?.id || 'class_5';
            const firstSubj = subjects.find((s) => s.classId === firstClass)?.id || 'subj_5_math';
            const firstChap = chapters.find((c) => c.classId === firstClass && c.subjectId === firstSubj)?.id || 'ch_5_4';
            setFormData({
              classId: firstClass,
              subjectId: firstSubj,
              chapterId: firstChap,
              title: '',
              description: '',
              topicNumber: (topics.filter((t) => t.chapterId === firstChap).length || 0) + 1,
              sortOrder: (topics.filter((t) => t.chapterId === firstChap).length || 0) + 1,
              maxPdfLimit: 30,
              isEnabled: true,
            });
            setAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Topic</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Class Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Filter Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedChapterId('all');
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Classes (1–8)</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Filter Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedChapterId('all');
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Subjects</option>
              {subjects
                .filter((s) => selectedClassId === 'all' || s.classId === selectedClassId)
                .map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name} ({subj.classId.replace('class_', 'Class ')})
                  </option>
                ))}
            </select>
          </div>

          {/* Chapter Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" /> Filter Chapter
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Chapters ({availableChapters.length})</option>
              {availableChapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  Ch {chap.chapterNumber}: {chap.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" /> Search Topics
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic title..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Topic List Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            Showing {filteredTopics.length} Academic Topics
          </span>
          <span className="text-[11px] text-slate-500">
            Maximum Limit: <strong className="text-indigo-400">30 PDF materials per topic</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Topic Title & Description</th>
                <th className="py-3.5 px-4">Class & Chapter</th>
                <th className="py-3.5 px-4 text-center">PDF Materials (Max 30)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTopics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No topics found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTopics.map((topic, index) => {
                  const classObj = classes.find((c) => c.id === topic.classId);
                  const chapterObj = chapters.find((c) => c.id === topic.chapterId);
                  const pdfCount = getTopicPdfCount(topic.id);
                  const limit = topic.maxPdfLimit || 30;
                  const isFull = pdfCount >= limit;

                  return (
                    <tr key={topic.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 font-bold text-xs">
                        {topic.topicNumber || index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-white text-xs">{topic.title}</div>
                        {topic.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1">{topic.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-indigo-300 text-xs">
                          {classObj?.name || topic.classId}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {chapterObj ? `Ch ${chapterObj.chapterNumber}: ${chapterObj.title}` : topic.chapterId}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border">
                          <span
                            className={
                              isFull
                                ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                                : pdfCount > 0
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                                : 'text-slate-400 bg-slate-800 border-slate-700'
                            }
                          >
                            <FileText className="w-3 h-3 inline mr-1" />
                            {pdfCount} / {limit} PDFs
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleTopicStatus(topic.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            topic.isEnabled
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {topic.isEnabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {topic.isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditModalTopic(topic)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            title="Edit Topic"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete topic "${topic.title}"?`)) {
                                deleteTopic(topic.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                            title="Delete Topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Topic Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Create New Academic Topic</h3>
            <p className="text-[11px] text-slate-400">Add a sub-topic to structure chapter PDF materials and quizzes.</p>

            <form onSubmit={handleCreateTopic} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Class Grade</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => {
                      const newClass = e.target.value;
                      const subjs = subjects.filter((s) => s.classId === newClass);
                      const firstSubj = subjs[0]?.id || '';
                      const chaps = chapters.filter((c) => c.classId === newClass && c.subjectId === firstSubj);
                      setFormData({
                        ...formData,
                        classId: newClass,
                        subjectId: firstSubj,
                        chapterId: chaps[0]?.id || '',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => {
                      const newSubj = e.target.value;
                      const chaps = chapters.filter((c) => c.classId === formData.classId && c.subjectId === newSubj);
                      setFormData({
                        ...formData,
                        subjectId: newSubj,
                        chapterId: chaps[0]?.id || '',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {subjects
                      .filter((s) => s.classId === formData.classId)
                      .map((subj) => (
                        <option key={subj.id} value={subj.id}>
                          {subj.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Chapter</label>
                <select
                  required
                  value={formData.chapterId}
                  onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="">Select Chapter...</option>
                  {formChapters.map((chap) => (
                    <option key={chap.id} value={chap.id}>
                      Ch {chap.chapterNumber}: {chap.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Word Problems on Equivalent Fractions"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of concepts in this topic..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Topic Number</label>
                  <input
                    type="number"
                    value={formData.topicNumber}
                    onChange={(e) => setFormData({ ...formData, topicNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Maximum PDF Quota</label>
                  <input
                    type="number"
                    disabled
                    value={30}
                    className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-indigo-400 font-bold cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-500">Locked at standard 30 PDFs / topic</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {editModalTopic && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Edit Academic Topic</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateTopic(editModalTopic.id, editModalTopic);
                setEditModalTopic(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-slate-300 font-bold block mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  value={editModalTopic.title}
                  onChange={(e) => setEditModalTopic({ ...editModalTopic, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editModalTopic.description || ''}
                  onChange={(e) => setEditModalTopic({ ...editModalTopic, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Topic Number</label>
                  <input
                    type="number"
                    value={editModalTopic.topicNumber}
                    onChange={(e) => setEditModalTopic({ ...editModalTopic, topicNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Max PDF Limit</label>
                  <input
                    type="number"
                    value={editModalTopic.maxPdfLimit || 30}
                    onChange={(e) => setEditModalTopic({ ...editModalTopic, maxPdfLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-indigo-400 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalTopic(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
