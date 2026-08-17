import React, { useState } from 'react';
import { useAdminAuth } from '../../services/admin-auth-context';
import { useTheme } from '../../design-system/theme-context';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  UserCheck,
  RefreshCw,
  Sun,
  Moon,
  Home,
} from 'lucide-react';
import { AdminRole } from '../../types/admin';

interface AdminLoginPageProps {
  onBackToPublicSite: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToPublicSite }) => {
  const { login, verify2FA, isTwoFactorPending, pendingEmail, resetPassword } = useAdminAuth();
  const { effectiveTheme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('admin@beyondclassroom.com');
  const [password, setPassword] = useState('admin123');
  const [otp, setOtp] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.message || 'Login failed.');
      } else if (res.requires2FA) {
        setSuccessMessage('2FA code requested. Default demo OTP is 123456.');
      } else {
        setSuccessMessage(res.message || 'Authenticated successfully.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await verify2FA(otp);
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid OTP code.');
      } else {
        setSuccessMessage('2FA verified successfully.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || '2FA verification error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    const res = await resetPassword(forgotEmail);
    setForgotStatus(res.message);
    setTimeout(() => {
      if (res.success) setShowForgotModal(false);
    }, 2000);
  };

  const fillQuickCredentials = (role: AdminRole) => {
    if (role === 'super_admin') {
      setEmail('admin@beyondclassroom.com');
      setPassword('admin123');
    } else if (role === 'content_admin') {
      setEmail('content@beyondclassroom.com');
      setPassword('content123');
    } else if (role === 'support_admin') {
      setEmail('support@beyondclassroom.com');
      setPassword('support123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      {/* Dynamic Background Ambient Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">BEYOND</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                Admin Console
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Enterprise Management & Access Control</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPublicSite}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-indigo-400" />
            <span>Public Website</span>
          </button>
        </div>
      </header>

      {/* Main Form Center */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-6">
            
            {/* Form Title & Icon */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-1">
                {isTwoFactorPending ? <KeyRound className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {isTwoFactorPending ? 'Two-Factor Authentication' : 'Administrator Sign In'}
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {isTwoFactorPending
                  ? `Enter the 6-digit OTP sent to ${pendingEmail}`
                  : 'Authorized personnel only. Access is monitored and role-restricted.'}
              </p>
            </div>

            {/* Error & Success Alert Banners */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Primary Login Form or 2FA Form */}
            {!isTwoFactorPending ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email input */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
                    <span>Admin Work Email</span>
                    <span className="text-[10px] text-slate-500">Required</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@beyondclassroom.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">Security Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Admin Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handle2FASubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Enter 6-Digit 2FA Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center font-mono text-lg tracking-widest text-indigo-400 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 text-center">
                    Demo OTP is preset to <code className="text-indigo-400 font-bold">123456</code>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify Code & Enter'}
                </button>
              </form>
            )}

            {/* Quick Demo Credentials Switcher */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 text-center">
                Quick Role Tester (Click to Autofill)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('super_admin')}
                  className="p-2 rounded-xl bg-slate-950/60 border border-indigo-500/20 hover:border-indigo-500/60 text-left transition-all group"
                >
                  <p className="text-[11px] font-bold text-indigo-400 group-hover:text-indigo-300">Super Admin</p>
                  <p className="text-[9px] text-slate-500">Full control + 2FA</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('content_admin')}
                  className="p-2 rounded-xl bg-slate-950/60 border border-purple-500/20 hover:border-purple-500/60 text-left transition-all group"
                >
                  <p className="text-[11px] font-bold text-purple-400 group-hover:text-purple-300">Content Admin</p>
                  <p className="text-[9px] text-slate-500">Curriculum & Papers</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('support_admin')}
                  className="p-2 rounded-xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-500/60 text-left transition-all group"
                >
                  <p className="text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300">Support Admin</p>
                  <p className="text-[9px] text-slate-500">Students & Passes</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">Reset Administrator Password</h3>
            <p className="text-xs text-slate-400">
              Enter your registered work email to receive password reset tokens.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@beyondclassroom.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
              {forgotStatus && (
                <p className="text-xs font-semibold text-emerald-400">{forgotStatus}</p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-4 text-center text-xs text-slate-600">
        Beyond Classroom Platform Security Architecture • Role-Based Access Control (RBAC) & Enterprise Encryption
      </footer>
    </div>
  );
};
