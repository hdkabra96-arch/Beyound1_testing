import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { AcademicSubject } from '../../../types/admin';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  FolderOpen,
  FileText,
  Search,
  BookOpen,
} from 'lucide-react';

export const SubjectManagementView: React.FC = () => {
  const { classes, subjects, chapters, contents, addSubject, updateSubject, deleteSubject, toggleSubjectStatus } = useAdminStore();

  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalSubject, setEditModalSubject] = useState<AcademicSubject | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form states
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjClass, setNewSubjClass] = useState('class_5');
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjDesc, setNewSubjDesc] = useState('');

  const filteredSubjects = subjects.filter((s) => {
    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName) return;

    addSubject({
      classId: newSubjClass,
      name: newSubjName,
      code: newSubjCode || `SUB_${newSubjName.substring(0, 4).toUpperCase()}`,
      description: newSubjDesc || `${newSubjName} syllabus and question sets.`,
      isEnabled: true,
      sortOrder: subjects.length + 1,
    });

    setAddModalOpen(false);
    setNewSubjName('');
    setNewSubjCode('');
    setNewSubjDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Subjects & Learning Tracks</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              {filteredSubjects.length} Tracks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage subject offerings across Class 1 to 8 (Core Mathematics, Speed & Mental Math, Olympiad Reasoning).
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject Track</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or codes..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedClassFilter}
          onChange={(e) => setSelectedClassFilter(e.target.value)}
          className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Grades (1 to 8)</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((subj) => {
          const classObj = classes.find((c) => c.id === subj.classId);
          const subjChapters = chapters.filter((ch) => ch.subjectId === subj.id);
          const subjContents = contents.filter((cnt) => cnt.subject_id === subj.id);

          return (
            <div
              key={subj.id}
              className={`bg-slate-900/90 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                subj.isEnabled ? 'border-slate-800' : 'border-rose-900/50 bg-slate-950/60 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{subj.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-bold text-indigo-400">
                          {classObj?.shortName || subj.classId}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{subj.code}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSubjectStatus(subj.id)}
                    className={`p-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      subj.isEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}
                    title={subj.isEnabled ? 'Enabled' : 'Disabled'}
                  >
                    {subj.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{subj.description}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-center">
                  <div className="p-2 rounded-xl bg-slate-950/60">
                    <span className="text-[10px] text-slate-500 block font-bold">Chapters</span>
                    <span className="text-xs font-black text-amber-400">{subjChapters.length}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60">
                    <span className="text-[10px] text-slate-500 block font-bold">Total Papers</span>
                    <span className="text-xs font-black text-purple-400">{subjContents.length}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (window.confirm(`Delete subject ${subj.name}?`)) {
                      deleteSubject(subj.id);
                    }
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setEditModalSubject(subj)}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Subject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Subject Modal */}
      {editModalSubject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Edit Subject Track</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditModalSubject(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-slate-300 font-bold block mb-1">Subject Name</label>
                <input
                  type="text"
                  value={editModalSubject.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateSubject(editModalSubject.id, { name: val });
                    setEditModalSubject({ ...editModalSubject, name: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Class Grade</label>
                  <select
                    value={editModalSubject.classId}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateSubject(editModalSubject.id, { classId: val });
                      setEditModalSubject({ ...editModalSubject, classId: val });
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
                  <label className="text-slate-300 font-bold block mb-1">Code</label>
                  <input
                    type="text"
                    value={editModalSubject.code}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateSubject(editModalSubject.id, { code: val });
                      setEditModalSubject({ ...editModalSubject, code: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editModalSubject.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateSubject(editModalSubject.id, { description: val });
                    setEditModalSubject({ ...editModalSubject, description: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalSubject(null)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Add New Subject Track</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  placeholder="e.g. Olympiad Math & Logic"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Class Grade</label>
                  <select
                    value={newSubjClass}
                    onChange={(e) => setNewSubjClass(e.target.value)}
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
                  <label className="text-slate-300 font-bold block mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={newSubjCode}
                    onChange={(e) => setNewSubjCode(e.target.value)}
                    placeholder="e.g. MTH_OLY_5"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newSubjDesc}
                  onChange={(e) => setNewSubjDesc(e.target.value)}
                  placeholder="Course objective and practice syllabus..."
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
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
