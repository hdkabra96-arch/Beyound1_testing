import React, { useState, useMemo } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { WorksheetRequest } from '../../../types/student';
import {
  Sliders,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Search,
  Filter,
  UploadCloud,
  Send,
  Sparkles,
  Paperclip,
  ExternalLink,
  MessageSquare,
  Calendar,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { ProtectedPdfViewerModal } from '../../ui/ProtectedPdfViewerModal';

export const CustomRequestsAdminView: React.FC = () => {
  const {
    customRequests,
    students,
    classes,
    subjects,
    chapters,
    topics,
    updateCustomRequestStatus,
    assignStaffToRequest,
    addCustomRequestNote,
  } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'in_progress' | 'ready' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRequest, setActiveRequest] = useState<WorksheetRequest | null>(null);

  // Fulfillment state for modal
  const [assignedStaff, setAssignedStaff] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [completedPdfUrl, setCompletedPdfUrl] = useState('/downloads/class5_fractions_master.pdf');
  const [rejectionReason, setRejectionReason] = useState('');

  // Preview Modal
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  const filteredRequests = useMemo(() => {
    return (customRequests || []).filter((req) => {
      if (statusFilter !== 'all' && req.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchId = (req.id || '').toLowerCase().includes(q);
        const matchTitle = (req.customTitle || '').toLowerCase().includes(q);
        const matchChapter = (req.chapterName || '').toLowerCase().includes(q);
        const matchStudent = (req.studentName || '').toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchChapter && !matchStudent) return false;
      }
      return true;
    });
  }, [customRequests, statusFilter, searchQuery]);

  const handleUpdateStatus = (reqId: string, newStatus: WorksheetRequest['status']) => {
    updateCustomRequestStatus(reqId, newStatus, {
      completedPdfUrl: newStatus === 'ready' ? completedPdfUrl : undefined,
      assignedStaff: assignedStaff || undefined,
      adminNotes: adminNoteInput || undefined,
      rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined,
    });

    if (activeRequest && activeRequest.id === reqId) {
      setActiveRequest({
        ...activeRequest,
        status: newStatus,
        completedPdfUrl: newStatus === 'ready' ? completedPdfUrl : activeRequest.completedPdfUrl,
        assignedStaff: assignedStaff || activeRequest.assignedStaff,
        adminNotes: adminNoteInput || activeRequest.adminNotes,
      });
    }
  };

  const getStatusBadge = (status: WorksheetRequest['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Submitted (Pending)
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> In Progress / Preparing
          </span>
        );
      case 'ready':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Ready & Delivered
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Rejected / Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Custom Practice Paper Requests</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold border border-pink-500/30">
              48-Hour Delivery Queue
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review student custom test requests, inspect reference uploads, assign subject experts, and deliver personalized PDFs with BC-XXXXXX tracking IDs.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Requests</span>
          <p className="text-2xl font-black text-white">{customRequests.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-900/30 space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Pending Action</span>
          <p className="text-2xl font-black text-amber-400">
            {customRequests.filter((r) => r.status === 'submitted' || r.status === 'in_progress').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-900/30 space-y-1">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Delivered Ready</span>
          <p className="text-2xl font-black text-emerald-400">
            {customRequests.filter((r) => r.status === 'ready').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Avg Turnaround</span>
          <p className="text-2xl font-black text-indigo-300">24.5 Hrs</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto w-full sm:w-auto">
            {(['all', 'submitted', 'in_progress', 'ready', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'all'
                  ? 'All Requests'
                  : tab === 'submitted'
                  ? 'Submitted (Pending)'
                  : tab === 'in_progress'
                  ? 'In Progress'
                  : tab === 'ready'
                  ? 'Ready'
                  : 'Rejected'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by BC ID, Student, Title..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Student & Class</th>
                <th className="py-3.5 px-4">Topic / Chapter Scope</th>
                <th className="py-3.5 px-4 text-center">Marks</th>
                <th className="py-3.5 px-4">Target Delivery</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No custom paper requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  return (
                    <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-black text-indigo-400 text-xs">
                        {req.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs">{req.studentName || 'Enrolled Student'}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-slate-500" />
                          {req.className || `Class ${req.classId}`} • {req.subjectName || req.subjectId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-200 text-xs">
                          {req.customTitle || req.chapterName || 'Custom Unit Test'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {req.topicName ? `Topic: ${req.topicName}` : `Chapter: ${req.chapterName}`}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-black text-[11px]">
                          {req.totalMarks || 40} Marks
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-300 font-bold text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-400" />
                          {req.expectedDeliveryDate || 'Within 48h'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Requested: {req.requestedAt ? new Date(req.requestedAt).toLocaleDateString() : 'Recent'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setActiveRequest(req);
                            setAssignedStaff(req.assignedStaff || 'Senior Math Educator (Team A)');
                            setAdminNoteInput(req.adminNotes || '');
                            setCompletedPdfUrl(req.completedPdfUrl || '/downloads/class5_fractions_master.pdf');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer shadow"
                        >
                          Manage & Fulfill
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fulfillment Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 font-mono font-bold text-xs">
                    {activeRequest.id}
                  </span>
                  <h3 className="text-base font-extrabold text-white">
                    {activeRequest.customTitle || activeRequest.chapterName}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Submitted by {activeRequest.studentName} ({activeRequest.className}, {activeRequest.subjectName})
                </p>
              </div>

              <button
                onClick={() => setActiveRequest(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Student Request Details Card */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Student Requirements</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Total Marks:</span>
                  <span className="font-extrabold text-indigo-400">{activeRequest.totalMarks || 40} Marks</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Difficulty Tier:</span>
                  <span className="font-bold text-white capitalize">{activeRequest.difficulty || 'Balanced'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Questions:</span>
                  <span className="font-bold text-white">{activeRequest.numQuestions || 15} Questions</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Deadline / Delivery:</span>
                  <span className="font-bold text-emerald-400">{activeRequest.expectedDeliveryDate || '48 Hours'}</span>
                </div>
              </div>

              {activeRequest.specialInstructions && (
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Student Notes / Focus Areas:</span>
                  <p className="p-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs italic">
                    "{activeRequest.specialInstructions}"
                  </p>
                </div>
              )}

              {/* Reference Files Attached by Student */}
              {activeRequest.referenceFiles && activeRequest.referenceFiles.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">Attached Reference Files:</span>
                  <div className="flex flex-wrap gap-2">
                    {activeRequest.referenceFiles.map((file, i) => (
                      <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{file.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Educator Fulfillment Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Educator Assignment & Fulfillment</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Assigned Staff / Educator</label>
                  <input
                    type="text"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Sharma (Math HOD)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Completed Custom PDF URL</label>
                  <input
                    type="text"
                    value={completedPdfUrl}
                    onChange={(e) => setCompletedPdfUrl(e.target.value)}
                    placeholder="/downloads/custom_paper.pdf"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Educator / Admin Feedback Note to Student</label>
                <textarea
                  rows={2}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="e.g. We created this paper with special focus on word problems as requested. Good luck!"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(activeRequest.id, 'in_progress')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold hover:bg-indigo-600/30 cursor-pointer"
                  >
                    Mark In-Progress
                  </button>

                  <button
                    onClick={() => {
                      const reason = prompt('Please enter rejection reason for the student:') || 'Invalid scope parameters';
                      setRejectionReason(reason);
                      handleUpdateStatus(activeRequest.id, 'rejected');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold hover:bg-rose-500/20 cursor-pointer"
                  >
                    Reject Request
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewPdfUrl(completedPdfUrl)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> Preview PDF
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeRequest.id, 'ready')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Deliver to Student</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Protected PDF Viewer Modal */}
      {previewPdfUrl && (
        <ProtectedPdfViewerModal
          isOpen={!!previewPdfUrl}
          onClose={() => setPreviewPdfUrl(null)}
          title={activeRequest?.customTitle || 'Custom Practice Paper'}
          pdfUrl={previewPdfUrl}
          downloadEnabled={true}
          watermarkText={`Beyond Classroom • Custom Order ${activeRequest?.id || ''}`}
          studentName={activeRequest?.studentName || 'Student'}
        />
      )}
    </div>
  );
};
