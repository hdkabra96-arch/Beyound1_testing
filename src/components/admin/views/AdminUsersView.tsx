import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { useAdminAuth } from '../../../services/admin-auth-context';
import { AdminUser, AdminRole } from '../../../types/admin';
import {
  ShieldCheck,
  UserPlus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Key,
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const { adminUsers, auditLogs, addAdminUser, updateAdminUser, toggleAdminUserStatus, deleteAdminUser } = useAdminStore();
  const { currentAdmin } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('content_admin');
  const [new2fa, setNew2fa] = useState(false);

  const filteredUsers = adminUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    addAdminUser({
      name: newName,
      email: newEmail,
      role: newRole,
      isEnabled: true,
      twoFactorEnabled: new2fa,
      lastLogin: 'Never',
    });

    setModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'super_admin':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
            SUPER ADMIN (FULL ACCESS)
          </span>
        );
      case 'content_admin':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
            CONTENT ADMIN
          </span>
        );
      case 'support_admin':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
            SUPPORT ADMIN
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Accounts & Security Audit</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
              Requirements 1 & 18
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage administrative team accounts, enforce 2FA verification, and monitor real-time audit logs of administrative actions.
          </p>
        </div>

        {currentAdmin?.role === 'super_admin' && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Admin User</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Users ({adminUsers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Security Audit Trail ({auditLogs.length} Events)</span>
        </button>
      </div>

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Admin User</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">2FA Security</th>
                    <th className="p-4">Last Login</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {filteredUsers.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold text-xs">
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-extrabold text-white text-xs block">{admin.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{admin.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">{getRoleBadge(admin.role)}</td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                            admin.twoFactorEnabled ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          <Key className="w-3 h-3" />
                          {admin.twoFactorEnabled ? '2FA Enforced' : 'Password Only'}
                        </span>
                      </td>

                      <td className="p-4 text-slate-400 text-[11px] font-mono">{admin.lastLogin}</td>

                      <td className="p-4">
                        <button
                          onClick={() => toggleAdminUserStatus(admin.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            admin.isEnabled
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {admin.isEnabled ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span>{admin.isEnabled ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        {currentAdmin?.role === 'super_admin' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete admin user ${admin.name}?`)) {
                                  deleteAdminUser(admin.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB (Requirement 18) */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-xs">Immutable Action Audit Trail</h3>
                <p className="text-[11px] text-slate-400">Timestamped record of all admin edits, overrides, and logins.</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
                Live Audit Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead className="bg-slate-950/50 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 pl-6">Admin</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Entity Affected</th>
                    <th className="p-3">Details / Changes</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3 pr-6">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors text-[11px]">
                      <td className="p-3 pl-6 font-bold text-indigo-300">{log.adminName}</td>
                      <td className="p-3 font-mono font-bold text-amber-400">{log.action}</td>
                      <td className="p-3 font-bold text-slate-200">{log.entity}</td>
                      <td className="p-3 text-slate-400 max-w-xs truncate">{log.details}</td>
                      <td className="p-3 text-slate-500 font-mono text-[10px]">{log.ipAddress}</td>
                      <td className="p-3 pr-6 text-slate-400 font-mono text-[10px]">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Create New Administrator</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sanya Kapoor"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="sanya@beyondclassroom.in"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Assign Role</label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="content_admin">Content Admin (Manage curriculum & papers)</option>
                  <option value="support_admin">Support Admin (Manage students & queries)</option>
                  <option value="super_admin">Super Admin (Unrestricted platform control)</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={new2fa}
                    onChange={(e) => setNew2fa(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>Enforce Two-Factor Authentication (2FA)</span>
                </label>
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
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
