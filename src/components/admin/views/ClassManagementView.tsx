import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { AcademicClass } from '../../../types/admin';
import {
  GraduationCap,
  Plus,
  Edit2,
  Lock,
  Unlock,
  MoveUp,
  MoveDown,
  Layers,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ClassManagementView: React.FC = () => {
  const { classes, subjects, contents, students, addClass, updateClass, toggleClassStatus, reorderClasses } = useAdminStore();

  const [editModalClass, setEditModalClass] = useState<AcademicClass | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newGradeNumber, setNewGradeNumber] = useState<number>(9);
  const [newName, setNewName] = useState('');
  const [newShortName, setNewShortName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    addClass({
      gradeNumber: Number(newGradeNumber),
      name: newName,
      shortName: newShortName || `Class ${newGradeNumber}`,
      description: newDescription || `Grade ${newGradeNumber} Mathematics Curriculum`,
      isEnabled: true,
      sortOrder: classes.length + 1,
    });

    setAddModalOpen(false);
    setNewName('');
    setNewShortName('');
    setNewDescription('');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= classes.length) return;

    const newOrder = [...classes];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    reorderClasses(newOrder.map((c) => c.id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Classes & Grades Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              Class 1 to 8 Master Control
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure academic grade levels, visibility on website and student portals, and display order.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Academic Class</span>
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {classes.map((cls, index) => {
          const classSubjects = subjects.filter((s) => s.classId === cls.id);
          const classContents = contents.filter((c) => c.class_id === cls.id);
          const classStudents = students.filter((s) => s.classId === cls.id);

          return (
            <div
              key={cls.id}
              className={`bg-slate-900/90 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                cls.isEnabled
                  ? 'border-slate-800 shadow-xl'
                  : 'border-rose-900/50 bg-slate-950/60 opacity-70'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-sm">
                      {cls.gradeNumber}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{cls.name}</h3>
                      <span className="text-[10px] text-slate-400 font-semibold">{cls.shortName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleClassStatus(cls.id)}
                    className={`p-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      cls.isEnabled
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                    }`}
                    title={cls.isEnabled ? 'Class is Enabled (Visible to students)' : 'Class is Disabled'}
                  >
                    {cls.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{cls.description}</p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                  <div className="p-2 rounded-xl bg-slate-950/60">
                    <span className="text-[10px] text-slate-500 block font-bold">Subjects</span>
                    <span className="text-xs font-black text-cyan-400">{classSubjects.length}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60">
                    <span className="text-[10px] text-slate-500 block font-bold">Materials</span>
                    <span className="text-xs font-black text-purple-400">{classContents.length}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60">
                    <span className="text-[10px] text-slate-500 block font-bold">Students</span>
                    <span className="text-xs font-black text-indigo-400">{classStudents.length}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Order Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === classes.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Order Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setEditModalClass(cls)}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Class Modal */}
      {editModalClass && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Edit Academic Class</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditModalClass(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-slate-300 font-bold block mb-1">Class Display Name</label>
                <input
                  type="text"
                  value={editModalClass.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateClass(editModalClass.id, { name: val });
                    setEditModalClass({ ...editModalClass, name: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Short Label</label>
                <input
                  type="text"
                  value={editModalClass.shortName}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateClass(editModalClass.id, { shortName: val });
                    setEditModalClass({ ...editModalClass, shortName: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editModalClass.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateClass(editModalClass.id, { description: val });
                    setEditModalClass({ ...editModalClass, description: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalClass(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Add New Academic Class</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Grade Number</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={newGradeNumber}
                    onChange={(e) => setNewGradeNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Short Label</label>
                  <input
                    type="text"
                    value={newShortName}
                    onChange={(e) => setNewShortName(e.target.value)}
                    placeholder="e.g. Class 9"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Class Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Class 9 Mathematics"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Secondary mathematics syllabus..."
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
