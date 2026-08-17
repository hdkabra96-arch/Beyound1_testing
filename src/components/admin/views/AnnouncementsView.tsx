import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { AnnouncementItem, NotificationItem } from '../../../types/admin';
import {
  Bell,
  Radio,
  Plus,
  Trash2,
  Send,
  Users,
  Eye,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';

export const AnnouncementsView: React.FC = () => {
  const { announcements, notifications, classes, students, addAnnouncement, addNotification, deleteAnnouncement } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'announcements' | 'notifications'>('announcements');

  // Announcement state
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTargetAudience, setNewTargetAudience] = useState<'all' | 'class' | 'package' | 'teachers'>('all');
  const [newTargetClass, setNewTargetClass] = useState('class_5');
  const [newPriority, setNewPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');

  // Direct Notification state
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notifStudentId, setNotifStudentId] = useState(students[0]?.id || '');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'info' | 'success' | 'warning' | 'alert'>('info');

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    addAnnouncement({
      title: newTitle,
      content: newContent,
      targetAudience: newTargetAudience,
      targetClassId: newTargetAudience === 'class' ? newTargetClass : undefined,
      priority: newPriority,
      isPublished: true,
      publishDate: new Date().toISOString().split('T')[0],
      author: 'Beyond Classroom Administration',
    });

    setModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleAddNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;

    addNotification({
      studentId: notifStudentId,
      title: notifTitle,
      message: notifMessage,
      type: notifType,
      isRead: false,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    setNotifModalOpen(false);
    setNotifTitle('');
    setNotifMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Announcements & Notifications</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              Requirement 16
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast platform updates, exam schedule alerts, and deliver personalized notifications directly to student dashboards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotifModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Send Direct Alert</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Broadcast Announcement</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Class & Global Announcements ({announcements.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Direct Student Alerts ({notifications.length})</span>
        </button>
      </div>

      {/* ANNOUNCEMENTS LIST */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-xl space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ann.priority === 'urgent'
                          ? 'bg-rose-500/20 text-rose-400'
                          : ann.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-cyan-500/20 text-cyan-400'
                      }`}
                    >
                      {ann.priority} Priority
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Audience: {ann.targetAudience.toUpperCase()}</span>
                  </div>

                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-extrabold text-white text-sm">{ann.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>By: {ann.author}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {ann.publishDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIRECT NOTIFICATIONS LIST */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Target Student</th>
                <th className="p-4">Alert Notification</th>
                <th className="p-4">Type</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {notifications.map((notif) => {
                const st = students.find((s) => s.id === notif.studentId);

                return (
                  <tr key={notif.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 pl-6">
                      <span className="font-bold text-white">{st?.name || 'All Students'}</span>
                      <span className="block text-[10px] text-slate-500">{st?.email || 'Broadcast'}</span>
                    </td>
                    <td className="p-4">
                      <h4 className="font-extrabold text-slate-200">{notif.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{notif.message}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          notif.type === 'alert'
                            ? 'bg-rose-500/20 text-rose-400'
                            : notif.type === 'warning'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-indigo-500/20 text-indigo-400'
                        }`}
                      >
                        {notif.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">{notif.date}</td>
                    <td className="p-4 pr-6">
                      <span className={`text-[10px] font-bold ${notif.isRead ? 'text-slate-500' : 'text-emerald-400'}`}>
                        {notif.isRead ? 'Read' : 'Delivered'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Broadcast Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Broadcast Class Announcement</h3>
            <form onSubmit={handleAddAnnouncement} className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. State Level Mathematics Olympiad Mock Test 2"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Audience</label>
                  <select
                    value={newTargetAudience}
                    onChange={(e: any) => setNewTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="all">All Enrolled Students</option>
                    <option value="class">Specific Grade</option>
                    <option value="package">Package Subscribers</option>
                    <option value="teachers">Faculty / Mentors</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent Alert</option>
                  </select>
                </div>
              </div>

              {newTargetAudience === 'class' && (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Select Target Grade</label>
                  <select
                    value={newTargetClass}
                    onChange={(e) => setNewTargetClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-slate-300 font-bold block mb-1">Announcement Message</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Details, test timings, instructions..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Alert Modal */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Send Direct Student Alert</h3>
            <form onSubmit={handleAddNotification} className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Recipient Student</label>
                <select
                  value={notifStudentId}
                  onChange={(e) => setNotifStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Alert Title</label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Practice Paper 4 Feedback is Ready"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Notification Type</label>
                <select
                  value={notifType}
                  onChange={(e: any) => setNotifType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="info">Info</option>
                  <option value="success">Success / Milestone</option>
                  <option value="warning">Warning / Expiry</option>
                  <option value="alert">Critical Action</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Alert Message</label>
                <textarea
                  rows={3}
                  required
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Notification body..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNotifModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Send Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
