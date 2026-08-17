import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { Student, PackageStatus, PaymentStatus, AccountStatus, AdminActiveSection } from '../../../types/admin';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  KeyRound,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  CreditCard,
  Layers,
  ChevronDown,
  Lock,
  Unlock,
  Sliders,
  History,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface StudentManagementViewProps {
  filterMode?: 'all' | 'active' | 'expired';
  onNavigateToAccessControl?: (studentId: string) => void;
}

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  filterMode = 'all',
  onNavigateToAccessControl,
}) => {
  const {
    students,
    classes,
    packages,
    payments,
    addStudent,
    updateStudent,
    toggleStudentAccountStatus,
    assignStudentPackage,
    extendStudentExpiry,
    adjustCustomPaperLimit,
    deleteStudent,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedPackageFilter, setSelectedPackageFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>(
    filterMode === 'active' ? 'active' : filterMode === 'expired' ? 'expired' : 'all'
  );

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalStudent, setEditModalStudent] = useState<Student | null>(null);
  const [assignPkgStudent, setAssignPkgStudent] = useState<Student | null>(null);
  const [extendExpiryStudent, setExtendExpiryStudent] = useState<Student | null>(null);
  const [viewHistoryStudent, setViewHistoryStudent] = useState<Student | null>(null);
  const [quotaModalStudent, setQuotaModalStudent] = useState<Student | null>(null);

  // Add Student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentMobile, setNewStudentMobile] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('class_5');
  const [newStudentBoard, setNewStudentBoard] = useState<'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge'>('CBSE');
  const [newStudentPkg, setNewStudentPkg] = useState('pkg_pro');

  // Filtered Students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.mobile.includes(searchQuery);

    const matchesClass = selectedClassFilter === 'all' || student.classId === selectedClassFilter;
    const matchesPkg = selectedPackageFilter === 'all' || student.packageId === selectedPackageFilter;
    const matchesStatus =
      selectedStatusFilter === 'all' ||
      (selectedStatusFilter === 'active' && student.packageStatus === 'active') ||
      (selectedStatusFilter === 'expired' && student.packageStatus === 'expired') ||
      (selectedStatusFilter === 'disabled' && student.accountStatus === 'disabled');

    return matchesSearch && matchesClass && matchesPkg && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;

    const pkg = packages.find((p) => p.id === newStudentPkg) || packages[1];
    const purchaseDate = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 365);

    addStudent({
      name: newStudentName,
      email: newStudentEmail,
      mobile: newStudentMobile || '+91 98000 00000',
      classId: newStudentClass,
      board: newStudentBoard,
      packageId: pkg.id,
      packageName: pkg.name,
      packageStatus: 'active',
      purchaseDate,
      expiryDate: expDate.toISOString().split('T')[0],
      paymentStatus: 'paid',
      accountStatus: 'active',
      customPaperCountUsed: 0,
      customPaperLimit: pkg.customPaperLimit,
    });

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentMobile('');
    setAddModalOpen(false);
  };

  const getPackageBadge = (pkgId: string) => {
    switch (pkgId) {
      case 'pkg_pro':
        return <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">PRO (5-8)</span>;
      case 'pkg_basic':
        return <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">BASIC (1-4)</span>;
      case 'pkg_teachers':
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-bold">TEACHERS</span>;
      case 'pkg_school':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold">INSTITUTION</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-400 text-[10px] font-bold">{pkgId}</span>;
    }
  };

  const getStatusBadge = (packageStatus: PackageStatus, accountStatus: AccountStatus) => {
    if (accountStatus === 'disabled') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
          <XCircle className="w-3 h-3" /> Disabled
        </span>
      );
    }
    if (packageStatus === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
          <CheckCircle2 className="w-3 h-3" /> Active Pass
        </span>
      );
    }
    if (packageStatus === 'expired') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
          <Clock className="w-3 h-3" /> Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 text-[10px] font-bold">
        {packageStatus}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Student Directory & Profiles</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete administration over Class 1–8 students, assigned passes, validity dates, custom paper limits, and granular content access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Cluster */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Classes (1 to 8)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Package Filter */}
          <select
            value={selectedPackageFilter}
            onChange={(e) => setSelectedPackageFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Packages</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Pass</option>
            <option value="expired">Expired Subscriptions</option>
            <option value="disabled">Disabled Accounts</option>
          </select>
        </div>
      </div>

      {/* Main Student Management Table (Requirement 3) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Student Info</th>
                <th className="p-4">Grade & Board</th>
                <th className="p-4">Assigned Package</th>
                <th className="p-4">Validity / Expiry</th>
                <th className="p-4">Custom Papers</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No students found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const classObj = classes.find((c) => c.id === student.classId);
                  const isExpired = student.packageStatus === 'expired';
                  const hasOverrides =
                    student.accessOverrides &&
                    ((student.accessOverrides.disabledChapterIds?.length || 0) > 0 ||
                      (student.accessOverrides.extraAllowedClassIds?.length || 0) > 0 ||
                      student.accessOverrides.downloadsDisabled);

                  return (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Name & Contact */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white text-xs">{student.name}</span>
                              {hasOverrides && (
                                <span
                                  className="w-2 h-2 rounded-full bg-amber-400 shrink-0"
                                  title="Custom Content Overrides Active"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>{student.email}</span>
                              <span>•</span>
                              <span>{student.mobile}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Grade & Board */}
                      <td className="p-4">
                        <span className="font-bold text-indigo-300">{classObj?.shortName || student.classId}</span>
                        <span className="block text-[10px] text-slate-400">{student.board}</span>
                      </td>

                      {/* Package */}
                      <td className="p-4">
                        {getPackageBadge(student.packageId)}
                        <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">
                          {student.packageName}
                        </span>
                      </td>

                      {/* Purchase & Expiry */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className={`text-[11px] font-bold ${isExpired ? 'text-rose-400' : 'text-slate-200'}`}>
                            Exp: {student.expiryDate}
                          </span>
                          <span className="block text-[10px] text-slate-500">Bought: {student.purchaseDate}</span>
                        </div>
                      </td>

                      {/* Custom Paper Quota */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-200">
                            {student.customPaperCountUsed} / {student.customPaperLimit === -1 ? '∞' : student.customPaperLimit}
                          </span>
                          <button
                            onClick={() => setQuotaModalStudent(student)}
                            className="block text-[10px] text-indigo-400 hover:underline cursor-pointer"
                          >
                            Adjust Limit
                          </button>
                        </div>
                      </td>

                      {/* Account & Package Status */}
                      <td className="p-4">{getStatusBadge(student.packageStatus, student.accountStatus)}</td>

                      {/* Last Login */}
                      <td className="p-4 text-[11px] text-slate-400">{student.lastLogin}</td>

                      {/* Actions Cluster */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Access Control Direct Button */}
                          <button
                            onClick={() => onNavigateToAccessControl?.(student.id)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all cursor-pointer"
                            title="Manage Individual Student Content Access & Overrides"
                          >
                            <Sliders className="w-4 h-4" />
                          </button>

                          {/* Extend Expiry */}
                          <button
                            onClick={() => setExtendExpiryStudent(student)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                            title="Extend Validity"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>

                          {/* Assign Package */}
                          <button
                            onClick={() => setAssignPkgStudent(student)}
                            className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
                            title="Assign or Change Package"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          {/* Toggle Active / Disabled */}
                          <button
                            onClick={() => toggleStudentAccountStatus(student.id)}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              student.accountStatus === 'active'
                                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                            }`}
                            title={student.accountStatus === 'active' ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {student.accountStatus === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => setEditModalStudent(student)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                            title="Edit Student Info"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Student */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete student ${student.name}?`)) {
                                deleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                            title="Delete Student"
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

      {/* Add Student Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Enroll New Student</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Diya Sengupta"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="diya@example.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={newStudentMobile}
                    onChange={(e) => setNewStudentMobile(e.target.value)}
                    placeholder="+91 98765 12345"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Curriculum Board</label>
                  <select
                    value={newStudentBoard}
                    onChange={(e: any) => setNewStudentBoard(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">IB / International</option>
                    <option value="Cambridge">Cambridge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Enrolled Class Grade</label>
                  <select
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Initial Package Pass</label>
                  <select
                    value={newStudentPkg}
                    onChange={(e) => setNewStudentPkg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    {packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.priceINR})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Info Modal */}
      {editModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Edit Student Profile</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditModalStudent(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-slate-300 font-bold block mb-1">Student Name</label>
                <input
                  type="text"
                  value={editModalStudent.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateStudent(editModalStudent.id, { name: val });
                    setEditModalStudent({ ...editModalStudent, name: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Email</label>
                  <input
                    type="email"
                    value={editModalStudent.email}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateStudent(editModalStudent.id, { email: val });
                      setEditModalStudent({ ...editModalStudent, email: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Mobile</label>
                  <input
                    type="text"
                    value={editModalStudent.mobile}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateStudent(editModalStudent.id, { mobile: val });
                      setEditModalStudent({ ...editModalStudent, mobile: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Enrolled Grade</label>
                  <select
                    value={editModalStudent.classId}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateStudent(editModalStudent.id, { classId: val });
                      setEditModalStudent({ ...editModalStudent, classId: val });
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
                  <label className="text-slate-300 font-bold block mb-1">Board</label>
                  <select
                    value={editModalStudent.board}
                    onChange={(e: any) => {
                      const val = e.target.value;
                      updateStudent(editModalStudent.id, { board: val });
                      setEditModalStudent({ ...editModalStudent, board: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">IB</option>
                    <option value="Cambridge">Cambridge</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalStudent(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Package Modal */}
      {assignPkgStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Assign Package to {assignPkgStudent.name}</h3>
            <p className="text-slate-400">
              Select package tier to immediately grant class entitlements and custom test quotas.
            </p>

            <div className="space-y-2">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => {
                    assignStudentPackage(assignPkgStudent.id, pkg.id, assignPkgStudent.classId, pkg.validityDays);
                    setAssignPkgStudent(null);
                  }}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-left flex items-center justify-between transition-all group"
                >
                  <div>
                    <p className="font-bold text-white group-hover:text-indigo-400">{pkg.name}</p>
                    <p className="text-[10px] text-slate-400">{pkg.targetAudience} • {pkg.validityDays} Days</p>
                  </div>
                  <span className="text-xs font-black text-emerald-400">₹{pkg.priceINR}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAssignPkgStudent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Extend Validity Modal */}
      {extendExpiryStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Extend Expiry: {extendExpiryStudent.name}</h3>
            <p className="text-slate-400">Current Expiry: <strong className="text-white">{extendExpiryStudent.expiryDate}</strong></p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  extendStudentExpiry(extendExpiryStudent.id, 30);
                  setExtendExpiryStudent(null);
                }}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-center font-bold text-emerald-400"
              >
                + 30 Days
              </button>
              <button
                onClick={() => {
                  extendStudentExpiry(extendExpiryStudent.id, 90);
                  setExtendExpiryStudent(null);
                }}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-center font-bold text-indigo-400"
              >
                + 90 Days
              </button>
              <button
                onClick={() => {
                  extendStudentExpiry(extendExpiryStudent.id, 365);
                  setExtendExpiryStudent(null);
                }}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-center font-bold text-purple-400"
              >
                + 1 Year
              </button>
            </div>

            <button
              onClick={() => setExtendExpiryStudent(null)}
              className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Adjust Custom Paper Quota Modal */}
      {quotaModalStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Adjust Custom Paper Quota</h3>
            <p className="text-slate-400">
              Student: <strong className="text-white">{quotaModalStudent.name}</strong>
              <br />
              Currently used: <strong className="text-indigo-400">{quotaModalStudent.customPaperCountUsed}</strong> / {quotaModalStudent.customPaperLimit === -1 ? 'Unlimited' : quotaModalStudent.customPaperLimit}
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  adjustCustomPaperLimit(quotaModalStudent.id, -1);
                  setQuotaModalStudent(null);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-200 font-bold"
              >
                Set to Unlimited (∞)
              </button>
              <button
                onClick={() => {
                  adjustCustomPaperLimit(quotaModalStudent.id, 50);
                  setQuotaModalStudent(null);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-200 font-bold"
              >
                Set to 50 Papers
              </button>
              <button
                onClick={() => {
                  adjustCustomPaperLimit(quotaModalStudent.id, 100);
                  setQuotaModalStudent(null);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-200 font-bold"
              >
                Set to 100 Papers
              </button>
            </div>

            <button
              onClick={() => setQuotaModalStudent(null)}
              className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
