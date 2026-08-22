import React, { useState } from 'react';
import { useAdminAuth } from '../../services/admin-auth-context';
import { useAdminStore } from '../../services/admin-store';
import { useTheme } from '../../design-system/theme-context';
import { AdminActiveSection } from '../../types/admin';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserX,
  KeyRound,
  BookOpen,
  GraduationCap,
  Layers,
  FileText,
  HelpCircle,
  Zap,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Globe,
  Info,
  Shield,
  Phone,
  Settings,
  Bell,
  Radio,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Sliders,
  History,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Search,
  Gift,
  Percent,
  DollarSign,
  Sun,
  Moon,
  UploadCloud,
  FolderOpen,
  Crown,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Eye,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: AdminActiveSection;
  onSectionChange: (section: AdminActiveSection) => void;
  onViewPublicSite: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: {
    id: AdminActiveSection;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    roles?: string[];
  }[];
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  onViewPublicSite,
}) => {
  const { currentAdmin, logout, switchAdminRole } = useAdminAuth();
  const { globalSettings, students, payments, contents, customRequests, packageMaterials } = useAdminStore();
  const { effectiveTheme, toggleTheme } = useTheme();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [quickSearch, setQuickSearch] = useState('');
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const pendingPaymentsCount = payments.filter((p) => p.status === 'pending').length;
  const expiredStudentsCount = students.filter((s) => s.packageStatus === 'expired').length;
  const pendingRequestsCount = customRequests ? customRequests.filter((r) => r.status === 'submitted' || r.status === 'in_progress').length : 0;
  const packageMaterialsCount = packageMaterials ? packageMaterials.length : 0;

  const navGroups: NavGroup[] = [
    {
      id: 'dashboard-group',
      label: 'Main',
      icon: <LayoutDashboard className="w-4 h-4" />,
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'custom-requests', label: 'Custom Paper Requests', icon: <Sliders className="w-4 h-4 text-pink-400" />, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending` : undefined },
      ],
    },
    {
      id: 'students-group',
      label: 'Student Directory',
      icon: <Users className="w-4 h-4" />,
      items: [
        { id: 'students-all', label: 'All Students', icon: <Users className="w-4 h-4" />, badge: students.length },
        { id: 'students-active', label: 'Active Students', icon: <UserCheck className="w-4 h-4 text-emerald-500" /> },
        { id: 'students-expired', label: 'Expired Subscriptions', icon: <UserX className="w-4 h-4 text-amber-500" />, badge: expiredStudentsCount > 0 ? expiredStudentsCount : undefined },
        { id: 'students-access-control', label: 'Access Control Overrides', icon: <KeyRound className="w-4 h-4 text-indigo-500" /> },
      ],
    },
    {
      id: 'content-group',
      label: 'Curriculum & Content',
      icon: <BookOpen className="w-4 h-4" />,
      items: [
        { id: 'content-classes', label: 'Class Grades (1–8)', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'content-subjects', label: 'Subjects & Tracks', icon: <Layers className="w-4 h-4" /> },
        { id: 'content-chapters', label: 'Chapter Repository', icon: <FolderOpen className="w-4 h-4" /> },
        { id: 'content-topics', label: 'Topic Management', icon: <Layers className="w-4 h-4 text-indigo-400" />, badge: 'Hierarchical' },
        { id: 'content-material-upload', label: 'Package Material Upload', icon: <UploadCloud className="w-4 h-4 text-blue-500" />, badge: 'Wizard' },
        { id: 'content-materials-manage', label: 'Manage Materials', icon: <FolderOpen className="w-4 h-4 text-emerald-500" />, badge: packageMaterialsCount > 0 ? `${packageMaterialsCount}` : undefined },
        { id: 'content-practice-papers', label: 'Practice Papers', icon: <FileText className="w-4 h-4" />, badge: 'Core' },
        { id: 'content-question-bank', label: 'Question Bank & Hints', icon: <HelpCircle className="w-4 h-4" /> },
        { id: 'content-mcqs', label: 'MCQs & Speed Quizzes', icon: <Zap className="w-4 h-4 text-amber-500" /> },
        { id: 'content-flash-cards', label: 'Visual Flash Cards', icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
        { id: 'content-notes', label: 'Chapter Notes', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'content-previous-papers', label: 'Previous Years Papers', icon: <FileText className="w-4 h-4" /> },
        { id: 'content-pdfs', label: 'PDF Library & Downloads', icon: <FileText className="w-4 h-4" /> },
      ],
    },
    {
      id: 'packages-group',
      label: 'Packages & Pricing',
      icon: <CreditCard className="w-4 h-4" />,
      items: [
        { id: 'packages-all', label: 'All Packages (1-8)', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'packages-features', label: 'Package Feature Matrix', icon: <Sliders className="w-4 h-4 text-indigo-500" /> },
        { id: 'packages-rules', label: 'Class Access Rules', icon: <Shield className="w-4 h-4" /> },
      ],
    },
    {
      id: 'payments-group',
      label: 'Billing & Payments',
      icon: <CreditCard className="w-4 h-4" />,
      items: [
        { id: 'payments-transactions', label: 'All Transactions', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'payments-successful', label: 'Successful Payments', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
        { id: 'payments-pending', label: 'Pending Verification', icon: <Clock className="w-4 h-4 text-amber-500" />, badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined },
        { id: 'payments-failed', label: 'Failed / Cancelled', icon: <XCircle className="w-4 h-4 text-rose-500" /> },
        { id: 'payments-refunds', label: 'Refunds & Adjustments', icon: <RotateCcw className="w-4 h-4" /> },
      ],
    },
    {
      id: 'affiliates-group',
      label: 'Affiliates & Referrals',
      icon: <Gift className="w-4 h-4 text-amber-400" />,
      items: [
        { id: 'affiliates-applications', label: 'Affiliate Applications', icon: <Clock className="w-4 h-4 text-amber-500" /> },
        { id: 'affiliates-approved', label: 'Approved Affiliates', icon: <UserCheck className="w-4 h-4 text-emerald-500" /> },
        { id: 'affiliates-sales', label: 'Referral Sales Ledger', icon: <TrendingUp className="w-4 h-4 text-indigo-500" /> },
        { id: 'affiliates-commissions', label: 'Commission Approval', icon: <Percent className="w-4 h-4 text-purple-500" /> },
        { id: 'affiliates-payouts', label: 'Payout Settlements', icon: <DollarSign className="w-4 h-4 text-emerald-500" /> },
        { id: 'affiliates-rejected', label: 'Rejected Applications', icon: <UserX className="w-4 h-4 text-rose-500" /> },
        { id: 'affiliates-suspended', label: 'Suspended / Disabled', icon: <ShieldAlert className="w-4 h-4 text-amber-500" /> },
        { id: 'affiliates-settings', label: 'Affiliate Rules & Rates', icon: <Settings className="w-4 h-4 text-indigo-400" /> },
      ],
    },
    {
      id: 'website-group',
      label: 'Website CMS & Pages',
      icon: <Globe className="w-4 h-4" />,
      items: [
        { id: 'website-home', label: 'Home Page CMS', icon: <Globe className="w-4 h-4" /> },
        { id: 'website-about', label: 'About Us Content', icon: <Info className="w-4 h-4" /> },
        { id: 'website-team', label: 'Team Members', icon: <Users className="w-4 h-4" /> },
        { id: 'website-packages', label: 'Pricing Section CMS', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'website-contact', label: 'Contact & Support', icon: <Phone className="w-4 h-4" /> },
        { id: 'website-global', label: 'Global Settings & Maintenance', icon: <Settings className="w-4 h-4 text-amber-500" /> },
      ],
    },
    {
      id: 'communication-group',
      label: 'Broadcast & Messaging',
      icon: <Radio className="w-4 h-4" />,
      items: [
        { id: 'communication-announcements', label: 'Announcements', icon: <Radio className="w-4 h-4" /> },
        { id: 'communication-notifications', label: 'Targeted Notifications', icon: <Bell className="w-4 h-4" /> },
      ],
    },
    {
      id: 'reports-group',
      label: 'Reports & Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      items: [
        { id: 'reports-revenue', label: 'Revenue Analytics', icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
        { id: 'reports-students', label: 'Student Growth & Retention', icon: <Users className="w-4 h-4 text-indigo-500" /> },
        { id: 'reports-content', label: 'Content Usage & Downloads', icon: <FileText className="w-4 h-4 text-purple-500" /> },
        { id: 'reports-packages', label: 'Package Conversions', icon: <CreditCard className="w-4 h-4 text-amber-500" /> },
      ],
    },
    {
      id: 'admin-group',
      label: 'Administration & Security',
      icon: <ShieldAlert className="w-4 h-4" />,
      items: [
        { id: 'admin-users', label: 'Admin Accounts & Roles', icon: <Shield className="w-4 h-4 text-indigo-500" /> },
        { id: 'admin-roles', label: 'Permissions Matrix', icon: <Sliders className="w-4 h-4" /> },
        { id: 'admin-logs', label: 'Activity & Audit Logs', icon: <History className="w-4 h-4" /> },
        { id: 'admin-settings', label: 'Dashboard Control Config', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  const getRoleBadge = () => {
    switch (currentAdmin?.role) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold">SUPER ADMIN</span>;
      case 'content_admin':
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold">CONTENT ADMIN</span>;
      case 'support_admin':
        return <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">SUPPORT ADMIN</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-400 text-[10px] font-bold">ADMIN</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Maintenance Mode Alert Banner if active */}
      {globalSettings.maintenanceMode.isEnabled && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              MAINTENANCE MODE IS CURRENTLY ACTIVE FOR PUBLIC VISITORS. Administrators bypass this restriction.
            </span>
          </div>
          <button
            onClick={() => onSectionChange('website-global')}
            className="underline hover:text-white cursor-pointer"
          >
            Manage Setting
          </button>
        </div>
      )}

      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left cluster: Hamburger + Brand logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white">BEYOND CLASSROOM</span>
                <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Admin Panel
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Class 1–8 Content & Access Control Suite
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Search Navigator */}
        <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search students, classes, papers..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Right cluster: Role quick switcher + Public Site Preview + Profile + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              {getRoleBadge()}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleSwitcher && (
              <div
                onClick={() => setShowRoleSwitcher(false)}
                className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fade-in"
              >
                <p className="text-[10px] font-bold text-slate-500 px-2 py-1 uppercase">Switch Demo Role</p>
                <button
                  onClick={() => switchAdminRole('super_admin')}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800 font-bold text-indigo-400 flex items-center justify-between"
                >
                  <span>Super Admin</span>
                  <span className="text-[10px] text-slate-500">Full Access</span>
                </button>
                <button
                  onClick={() => switchAdminRole('content_admin')}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800 font-bold text-purple-400 flex items-center justify-between"
                >
                  <span>Content Admin</span>
                  <span className="text-[10px] text-slate-500">Curriculum</span>
                </button>
                <button
                  onClick={() => switchAdminRole('support_admin')}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800 font-bold text-cyan-400 flex items-center justify-between"
                >
                  <span>Support Admin</span>
                  <span className="text-[10px] text-slate-500">Students</span>
                </button>
              </div>
            )}
          </div>

          {/* View Live Website Button */}
          <button
            onClick={onViewPublicSite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            title="Preview Public Website"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Site</span>
          </button>

          {/* User profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              {currentAdmin?.name.charAt(0) || 'A'}
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Framework Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar (Desktop fixed + Mobile Drawer) */}
        <aside
          className={`
            fixed lg:sticky top-15 lg:top-15 z-30 h-[calc(100vh-3.75rem)] w-72 bg-slate-900 border-r border-slate-800/90
            flex flex-col transition-transform duration-300 ease-in-out shrink-0
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Admin Info Banner */}
          <div className="p-4 pb-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 font-extrabold text-xs">
                {currentAdmin?.name.substring(0, 2).toUpperCase() || 'SA'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{currentAdmin?.name || 'Super Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentAdmin?.email || 'admin@beyondclassroom.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links Scrollable List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 pr-2 custom-scrollbar">
            {navGroups.map((group) => {
              const isCollapsed = collapsedGroups[group.id];
              return (
                <div key={group.id} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      {group.icon}
                      <span>{group.label}</span>
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-slate-500" />
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="space-y-0.5 pt-0.5">
                      {group.items.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onSectionChange(item.id);
                              setMobileSidebarOpen(false);
                            }}
                            className={`
                              w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer
                              ${
                                isActive
                                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span className={isActive ? 'text-white' : 'text-slate-400'}>
                                {item.icon}
                              </span>
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.badge !== undefined && (
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-indigo-500/20 text-indigo-400'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom quick metrics & version */}
          <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Beyond Classroom v2.4</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RBAC Live
            </span>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
