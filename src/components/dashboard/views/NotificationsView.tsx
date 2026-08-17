import React from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Award,
  CheckCheck,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { currentStudent, notifications } = useStudent();

  if (!currentStudent) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'billing':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Notifications & Announcements</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay updated with curriculum additions, custom worksheet readiness, and package notices.
          </p>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <Bell className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-300">You're all caught up!</p>
          <p className="text-xs text-slate-500">No new notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                n.isRead ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' : 'bg-slate-900 border-indigo-500/40 shadow-lg text-white'
              }`}
            >
              <div className="w-9 h-9 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-white">{n.title}</h3>
                  <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">{n.date || 'Today'}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
