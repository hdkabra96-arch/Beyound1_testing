import React, { useState } from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import { Student } from '../../../types/admin';
import {
  User,
  Shield,
  Lock,
  Check,
  Save,
  Key,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Mail,
  BookOpen,
} from 'lucide-react';

export const MyAccountView: React.FC = () => {
  const { currentStudent, updateStudentProfile, activeEntitlement } = useStudent();
  const { classes } = useAdminStore();

  const [name, setName] = useState(currentStudent?.name || '');
  const [mobile, setMobile] = useState(currentStudent?.mobile || '');
  const [board, setBoard] = useState<Student['board']>(currentStudent?.board || 'CBSE');
  const [isSaved, setIsSaved] = useState(false);

  if (!currentStudent || !activeEntitlement) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      name,
      mobile,
      board,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-black text-white tracking-tight">My Profile & Account Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal learning profile details and view authorized curriculum permissions.
        </p>
      </div>

      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600 border-2 border-indigo-400/40 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            {currentStudent.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{currentStudent.name}</h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentStudent.accountStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentStudent.email}</p>
            <p className="text-xs text-indigo-400 font-bold mt-1">
              {activeEntitlement.className} • {activeEntitlement.packageName}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-slate-400 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Student ID</span>
          <span className="font-mono text-slate-200 font-bold">{currentStudent.id}</span>
          <span className="text-[11px] block text-slate-500">Registered: {currentStudent.createdAt}</span>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-white">Personal Information</h3>
            <p className="text-slate-400 text-xs">Editable by student and parents</p>
          </div>
          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Profile Updated Successfully!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
              required
            />
          </div>

          {/* Email Address (Read-only ID) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-400 flex items-center justify-between">
              <span>Primary Email ID</span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" /> Account Identifier
              </span>
            </label>
            <input
              type="email"
              value={currentStudent.email}
              disabled
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-400 text-xs cursor-not-allowed"
            />
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Mobile / WhatsApp Number</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
              placeholder="+91 98000 00000"
            />
          </div>

          {/* Curriculum Board */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Curriculum Board</label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value as Student['board'])}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="CBSE">CBSE (NCERT Standard)</option>
              <option value="ICSE">ICSE (CISCE)</option>
              <option value="State Board">State Board</option>
              <option value="IB">IB (International Baccalaureate)</option>
              <option value="Cambridge">Cambridge IGCSE</option>
            </select>
          </div>
        </div>

        {/* Read-Only System Protected Fields Section (Requirement 12) */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>Backend Protected Entitlement Values (Read-Only)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              These fields are synchronized directly with your verified payment transaction and academic records.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Enrolled Class</span>
              <span className="text-xs font-black text-white mt-0.5 block">{activeEntitlement.className}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Package Plan</span>
              <span className="text-xs font-black text-amber-400 mt-0.5 block">{activeEntitlement.packageName}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Expiry Date</span>
              <span className="text-xs font-black text-white mt-0.5 block">{activeEntitlement.expiryDate}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Payment Status</span>
              <span className="text-xs font-black text-emerald-400 mt-0.5 block uppercase">{activeEntitlement.paymentStatus}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Account Status</span>
              <span className="text-xs font-black text-white mt-0.5 block uppercase">{currentStudent.accountStatus}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Days Remaining</span>
              <span className="text-xs font-black text-emerald-400 mt-0.5 block">{activeEntitlement.daysRemaining} Days</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
