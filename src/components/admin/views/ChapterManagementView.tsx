import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { AcademicChapter } from '../../../types/admin';
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  FileText,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const ChapterManagementView: React.FC = () => {
  const { classes, subjects, chapters, contents, addChapter, updateChapter, deleteChapter, toggleChapterStatus } = useAdminStore();

  const [selectedClassFilter, setSelectedClassFilter] = useState('class_5');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalChapter, setEditModalChapter] = useState<AcademicChapter | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form states
  const [newChapNumber, setNewChapNumber] = useState<number>(1);
  const [newChapTitle, setNewChapTitle] = useState('');
  const [newChapClass, setNewChapClass] = useState('class_5');
  const [newChapSubject, setNewChapSubject] = useState('subj_core_5');
  const [newChapDesc, setNewChapDesc] = useState('');

  const classSubjects = subjects.filter((s) => s.classId === selectedClassFilter);

  const filteredChapters = chapters.filter((ch) => {
    const matchesClass = selectedClassFilter === 'all' || ch.classId === selectedClassFilter;
    const matchesSubject = selectedSubjectFilter === 'all' || ch.subjectId === selectedSubjectFilter;
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSubject && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapTitle) return;

    addChapter({
      classId: newChapClass,
      subjectId: newChapSubject,
      chapterNumber: Number(newChapNumber),
      title: newChapTitle,
      description: newChapDesc || `Chapter ${newChapNumber} study material and worksheets.`,
      isEnabled: true,
      sortOrder: chapters.length + 1,
    });

    setAddModalOpen(false);
    setNewChapTitle('');
    setNewChapDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Chapter Repository</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              {filteredChapters.length} Chapters
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize structured chapters per grade & subject track. Manage chapter visibility and sequence.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Chapter</span>
        </button>
      </div>

      {/* Filter cluster */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters by title or topic..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={selectedClassFilter}
            onChange={(e) => {
              setSelectedClassFilter(e.target.value);
              setSelectedSubjectFilter('all');
            }}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Subjects</option>
            {classSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chapters Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Chapter #</th>
                <th className="p-4">Chapter Title & Details</th>
                <th className="p-4">Grade & Subject</th>
                <th className="p-4">Content Items</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredChapters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No chapters found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredChapters.map((chap) => {
                  const classObj = classes.find((c) => c.id === chap.classId);
                  const subjObj = subjects.find((s) => s.id === chap.subjectId);
                  const chapContents = contents.filter((c) => c.chapter_id === chap.id);

                  return (
                    <tr key={chap.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Chapter Number Badge */}
                      <td className="p-4 pl-6">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-sm flex items-center justify-center">
                          {chap.chapterNumber}
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="p-4">
                        <h4 className="font-extrabold text-white text-xs">{chap.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{chap.description}</p>
                      </td>

                      {/* Grade & Subject */}
                      <td className="p-4">
                        <span className="font-bold text-indigo-300">{classObj?.shortName || chap.classId}</span>
                        <span className="block text-[10px] text-cyan-400">{subjObj?.name || chap.subjectId}</span>
                      </td>

                      {/* Content count */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-purple-400 font-bold text-[10px]">
                          {chapContents.length} Papers / Sets
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleChapterStatus(chap.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            chap.isEnabled
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {chap.isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{chap.isEnabled ? 'Published' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditModalChapter(chap)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                            title="Edit Chapter"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete chapter ${chap.title}?`)) {
                                deleteChapter(chap.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Chapter"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Edit Chapter Modal */}
      {editModalChapter && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Edit Chapter</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditModalChapter(null);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Chapter #</label>
                  <input
                    type="number"
                    value={editModalChapter.chapterNumber}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateChapter(editModalChapter.id, { chapterNumber: val });
                      setEditModalChapter({ ...editModalChapter, chapterNumber: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-300 font-bold block mb-1">Chapter Title</label>
                  <input
                    type="text"
                    value={editModalChapter.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateChapter(editModalChapter.id, { title: val });
                      setEditModalChapter({ ...editModalChapter, title: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editModalChapter.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateChapter(editModalChapter.id, { description: val });
                    setEditModalChapter({ ...editModalChapter, description: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalChapter(null)}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Add New Chapter</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Class Grade</label>
                  <select
                    value={newChapClass}
                    onChange={(e) => {
                      setNewChapClass(e.target.value);
                      const matchingSubjs = subjects.filter((s) => s.classId === e.target.value);
                      if (matchingSubjs.length > 0) setNewChapSubject(matchingSubjs[0].id);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Subject</label>
                  <select
                    value={newChapSubject}
                    onChange={(e) => setNewChapSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {subjects
                      .filter((s) => s.classId === newChapClass)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Chapter #</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newChapNumber}
                    onChange={(e) => setNewChapNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-300 font-bold block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newChapTitle}
                    onChange={(e) => setNewChapTitle(e.target.value)}
                    placeholder="e.g. Decimals & Percentages"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newChapDesc}
                  onChange={(e) => setNewChapDesc(e.target.value)}
                  placeholder="Topics covered, practice guidelines..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
