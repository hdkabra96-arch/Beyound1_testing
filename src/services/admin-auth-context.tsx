import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRole } from '../types/admin';
import { INITIAL_ADMIN_USERS } from './admin-data';

interface AdminAuthContextType {
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  isTwoFactorPending: boolean;
  pendingEmail: string | null;
  adminUsers: AdminUser[];
  login: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; message?: string }>;
  verify2FA: (otp: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  switchAdminRole: (role: AdminRole) => void;
  updateAdminStatus: (adminId: string, status: 'active' | 'disabled') => void;
  toggle2FA: (adminId: string) => void;
  createAdminUser: (userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  deleteAdminUser: (adminId: string) => void;
  hasPermission: (requiredRole: AdminRole[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'beyond_classroom_admin_session_v1';
const ADMIN_USERS_STORAGE_KEY = 'beyond_classroom_admin_users_v1';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
    } catch {
      return INITIAL_ADMIN_USERS;
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isTwoFactorPending, setIsTwoFactorPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(adminUsers));
    } catch (e) {
      console.error('Failed to persist admin users', e);
    }
  }, [adminUsers]);

  useEffect(() => {
    try {
      if (currentAdmin) {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(currentAdmin));
      } else {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to persist admin session', e);
    }
  }, [currentAdmin]);

  const login = async (email: string, password: string): Promise<{ success: boolean; requires2FA?: boolean; message?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = adminUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, message: 'Invalid administrator email address or password.' };
    }

    if (user.status === 'disabled') {
      return { success: false, message: 'This administrator account has been disabled by Super Admin.' };
    }

    // Passwords for demo accounts or standard check
    if (password !== 'admin123' && password !== 'content123' && password !== 'support123' && password.length < 6) {
      return { success: false, message: 'Invalid password. (Use default demo passwords: admin123, content123, support123)' };
    }

    if (user.twoFactorEnabled) {
      setIsTwoFactorPending(true);
      setPendingEmail(user.email);
      return { success: true, requires2FA: true, message: '2FA authentication required. Enter the 6-digit OTP sent to your registered device.' };
    }

    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setCurrentAdmin(updatedUser);
    setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    return { success: true, message: `Welcome back, ${user.name} (${user.role.replace('_', ' ').toUpperCase()})` };
  };

  const verify2FA = async (otp: string): Promise<{ success: boolean; message?: string }> => {
    if (!pendingEmail) {
      return { success: false, message: 'No 2FA verification session found.' };
    }

    // Default accepted OTP for demonstration is 123456 or any 6-digit code
    if (otp.trim() === '123456' || otp.trim().length === 6) {
      const user = adminUsers.find((u) => u.email.toLowerCase() === pendingEmail.toLowerCase());
      if (user) {
        const updatedUser = {
          ...user,
          lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        setCurrentAdmin(updatedUser);
        setAdminUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
        setIsTwoFactorPending(false);
        setPendingEmail(null);
        return { success: true, message: '2FA authentication successful. Access granted.' };
      }
    }

    return { success: false, message: 'Invalid 2FA OTP code. Try entering 123456.' };
  };

  const logout = () => {
    setCurrentAdmin(null);
    setIsTwoFactorPending(false);
    setPendingEmail(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    if (!currentAdmin) {
      return { success: false, message: 'Not authenticated.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }
    return { success: true, message: 'Password updated successfully and encrypted in secure store.' };
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const user = adminUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'No administrator account found with this email.' };
    }
    return { success: true, message: `Password reset instructions and temporary credential link sent to ${email}.` };
  };

  const switchAdminRole = (role: AdminRole) => {
    const matching = adminUsers.find((u) => u.role === role && u.status === 'active') || adminUsers[0];
    setCurrentAdmin(matching);
  };

  const updateAdminStatus = (adminId: string, status: 'active' | 'disabled') => {
    if (currentAdmin?.role !== 'super_admin') {
      throw new Error('Only Super Admin can modify administrator status.');
    }
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === adminId ? { ...u, status } : u))
    );
  };

  const toggle2FA = (adminId: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === adminId ? { ...u, twoFactorEnabled: !u.twoFactorEnabled } : u))
    );
    if (currentAdmin?.id === adminId) {
      setCurrentAdmin((prev) => (prev ? { ...prev, twoFactorEnabled: !prev.twoFactorEnabled } : null));
    }
  };

  const createAdminUser = (userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    if (currentAdmin?.role !== 'super_admin') {
      throw new Error('Only Super Admin can create new administrators.');
    }
    const newAdmin: AdminUser = {
      ...userData,
      id: `adm_${Date.now()}`,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAdminUsers((prev) => [...prev, newAdmin]);
  };

  const deleteAdminUser = (adminId: string) => {
    if (currentAdmin?.role !== 'super_admin') {
      throw new Error('Only Super Admin can remove administrators.');
    }
    setAdminUsers((prev) => prev.filter((u) => u.id !== adminId));
  };

  const hasPermission = (requiredRoles: AdminRole[]): boolean => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === 'super_admin') return true;
    return requiredRoles.includes(currentAdmin.role);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        currentAdmin,
        isAuthenticated: !!currentAdmin,
        isTwoFactorPending,
        pendingEmail,
        adminUsers,
        login,
        verify2FA,
        logout,
        changePassword,
        resetPassword,
        switchAdminRole,
        updateAdminStatus,
        toggle2FA,
        createAdminUser,
        deleteAdminUser,
        hasPermission,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
