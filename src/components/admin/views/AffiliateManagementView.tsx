import React, { useState } from 'react';
import { useAffiliate } from '../../../services/affiliate-context';
import { useAdminStore } from '../../../services/admin-store';
import {
  AffiliateProfile,
  AffiliateStatus,
  AffiliateSale,
  AffiliatePayout,
  CommissionStatus,
  PayoutStatus,
} from '../../../types/affiliate';
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Percent,
  DollarSign,
  Gift,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Sliders,
  Settings,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Building2,
  Smartphone,
  Copy,
  ChevronRight,
  Eye,
  FileText,
  RotateCcw,
  Check,
  X,
  Sparkles,
  Info,
  BadgeAlert,
} from 'lucide-react';
import { useToast } from '../../ui/toast';

interface AffiliateManagementViewProps {
  initialTab?:
    | 'applications'
    | 'approved'
    | 'rejected'
    | 'suspended'
    | 'sales'
    | 'commissions'
    | 'payouts'
    | 'settings';
}

export const AffiliateManagementView: React.FC<AffiliateManagementViewProps> = ({
  initialTab = 'applications',
}) => {
  const {
    affiliates,
    sales,
    payouts,
    referrals,
    settings,
    packageSettings,
    approveAffiliate,
    rejectAffiliate,
    suspendAffiliate,
    reactivateAffiliate,
    disableAffiliate,
    updateAffiliateCustomRates,
    approveCommission,
    reverseCommission,
    markCommissionAsPaid,
    approvePayout,
    markPayoutPaid,
    rejectPayout,
    updateAffiliateSettings,
    updatePackageAffiliateSetting,
  } = useAffiliate();

  const { packages } = useAdminStore();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateProfile | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReasonInput, setSuspendReasonInput] = useState('');
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [customDiscountInput, setCustomDiscountInput] = useState<number>(10);
  const [customCommissionInput, setCustomCommissionInput] = useState<number>(10);

  // Commission Reversal modal
  const [selectedSale, setSelectedSale] = useState<AffiliateSale | null>(null);
  const [showReverseModal, setShowReverseModal] = useState(false);
  const [reversalReasonInput, setReversalReasonInput] = useState('');

  // Payout processing modal
  const [selectedPayout, setSelectedPayout] = useState<AffiliatePayout | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutTxnRef, setPayoutTxnRef] = useState('');
  const [payoutAdminNotes, setPayoutAdminNotes] = useState('');
  const [showRejectPayoutModal, setShowRejectPayoutModal] = useState(false);
  const [rejectPayoutReason, setRejectPayoutReason] = useState('');

  // Counts
  const pendingAppsCount = affiliates.filter((a) => a.status === 'pending').length;
  const approvedCount = affiliates.filter((a) => a.status === 'approved').length;
  const rejectedCount = affiliates.filter((a) => a.status === 'rejected').length;
  const suspendedCount = affiliates.filter((a) => a.status === 'suspended' || a.status === 'disabled').length;
  const pendingPayoutsCount = payouts.filter((p) => p.status === 'requested').length;

  const totalSalesVolume = sales
    .filter((s) => s.status !== 'cancelled' && s.status !== 'reversed')
    .reduce((sum, s) => sum + s.originalAmount, 0);

  const totalCommissionPaid = sales
    .filter((s) => s.status === 'paid')
    .reduce((sum, s) => sum + s.commissionAmount, 0);

  const totalCommissionPending = sales
    .filter((s) => s.status === 'approved' || s.status === 'pending')
    .reduce((sum, s) => sum + s.commissionAmount, 0);

  // Handlers
  const handleOpenApprove = (aff: AffiliateProfile) => {
    setSelectedAffiliate(aff);
    const cleanName = aff.fullName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6);
    setCustomCodeInput(`BC-${cleanName || 'PARTNER'}10`);
    setShowApproveModal(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedAffiliate) return;
    approveAffiliate(selectedAffiliate.id, customCodeInput);
    addToast('success', 'Affiliate Approved!', `${selectedAffiliate.fullName} has been approved with code ${customCodeInput}.`);
    setShowApproveModal(false);
    setSelectedAffiliate(null);
  };

  const handleOpenReject = (aff: AffiliateProfile) => {
    setSelectedAffiliate(aff);
    setRejectReasonInput('Application does not meet our active audience or promotional criteria.');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!selectedAffiliate) return;
    rejectAffiliate(selectedAffiliate.id, rejectReasonInput);
    addToast('info', 'Application Rejected', `Application for ${selectedAffiliate.fullName} was rejected.`);
    setShowRejectModal(false);
    setSelectedAffiliate(null);
  };

  const handleOpenSuspend = (aff: AffiliateProfile) => {
    setSelectedAffiliate(aff);
    setSuspendReasonInput('Suspected self-referral or policy violation.');
    setShowSuspendModal(true);
  };

  const handleConfirmSuspend = () => {
    if (!selectedAffiliate) return;
    suspendAffiliate(selectedAffiliate.id, suspendReasonInput);
    addToast('warning', 'Affiliate Suspended', `${selectedAffiliate.fullName} account has been suspended.`);
    setShowSuspendModal(false);
    setSelectedAffiliate(null);
  };

  const handleOpenRates = (aff: AffiliateProfile) => {
    setSelectedAffiliate(aff);
    setCustomDiscountInput(aff.customDiscountPercentage ?? settings.globalDiscountPercentage);
    setCustomCommissionInput(aff.customCommissionPercentage ?? settings.globalCommissionPercentage);
    setShowRatesModal(true);
  };

  const handleSaveRates = () => {
    if (!selectedAffiliate) return;
    updateAffiliateCustomRates(selectedAffiliate.id, customDiscountInput, customCommissionInput);
    addToast('success', 'Custom Rates Saved', `Updated rates for ${selectedAffiliate.fullName}.`);
    setShowRatesModal(false);
    setSelectedAffiliate(null);
  };

  const handleOpenReverse = (sale: AffiliateSale) => {
    setSelectedSale(sale);
    setReversalReasonInput('Student requested order refund or cancellation.');
    setShowReverseModal(true);
  };

  const handleConfirmReverse = () => {
    if (!selectedSale) return;
    reverseCommission(selectedSale.id, reversalReasonInput);
    addToast('warning', 'Commission Reversed', `Commission for sale #${selectedSale.id} has been marked reversed.`);
    setShowReverseModal(false);
    setSelectedSale(null);
  };

  const handleOpenPayoutProcess = (p: AffiliatePayout) => {
    setSelectedPayout(p);
    setPayoutTxnRef(`UPI/AXIS/${Date.now()}/REF${Math.floor(1000 + Math.random() * 9000)}`);
    setPayoutAdminNotes('Transferred via primary corporate bank gateway.');
    setShowPayoutModal(true);
  };

  const handleConfirmPayoutPaid = () => {
    if (!selectedPayout) return;
    markPayoutPaid(selectedPayout.id, payoutTxnRef, payoutAdminNotes);
    addToast('success', 'Payout Marked as Paid!', `₹${selectedPayout.amount} marked as paid to ${selectedPayout.affiliateName}.`);
    setShowPayoutModal(false);
    setSelectedPayout(null);
  };

  const handleConfirmPayoutReject = () => {
    if (!selectedPayout) return;
    rejectPayout(selectedPayout.id, rejectPayoutReason || 'Payment account verification mismatch.');
    addToast('info', 'Payout Request Rejected', `Payout request #${selectedPayout.id} was rejected.`);
    setShowRejectPayoutModal(false);
    setSelectedPayout(null);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Affiliate & Partner Program Management
              </h1>
              <p className="text-xs text-slate-400">
                Review applications, track referral sales, govern commissions, process payouts & configure rules.
              </p>
            </div>
          </div>
        </div>

        {/* Global Program Status Switcher */}
        <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-2xl self-start sm:self-auto">
          <div className="text-right">
            <p className="text-[11px] font-bold text-slate-400">Program Status</p>
            <p className={`text-xs font-black ${settings.programEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
              {settings.programEnabled ? 'ACTIVE & ACCEPTING' : 'DISABLED'}
            </p>
          </div>
          <button
            onClick={() => updateAffiliateSettings({ programEnabled: !settings.programEnabled })}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              settings.programEnabled
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {settings.programEnabled ? 'Pause Program' : 'Enable Program'}
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Applications</span>
          </p>
          <p className="text-2xl font-black text-white mt-1">{pendingAppsCount}</p>
          <span className="text-[10px] text-amber-400 font-semibold">Requires Review</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Affiliates</span>
          </p>
          <p className="text-2xl font-black text-white mt-1">{approvedCount}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Generating Referrals</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span>Total Sales Volume</span>
          </p>
          <p className="text-2xl font-black text-white mt-1">₹{totalSalesVolume.toLocaleString()}</p>
          <span className="text-[10px] text-indigo-300 font-semibold">{sales.length} verified orders</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-purple-400" />
            <span>Commissions Due</span>
          </p>
          <p className="text-2xl font-black text-white mt-1">₹{totalCommissionPending.toFixed(2)}</p>
          <span className="text-[10px] text-purple-300 font-semibold">Approved & Payable</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md col-span-2 sm:col-span-4 lg:col-span-1">
          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Paid Out</span>
          </p>
          <p className="text-2xl font-black text-white mt-1">₹{totalCommissionPaid.toFixed(2)}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">{payouts.filter(p => p.status === 'paid').length} payouts settled</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'applications', label: 'Applications', count: pendingAppsCount, icon: <Clock className="w-4 h-4" /> },
          { id: 'approved', label: 'Approved Affiliates', count: approvedCount, icon: <UserCheck className="w-4 h-4" /> },
          { id: 'sales', label: 'Referral Sales', count: sales.length, icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'commissions', label: 'Commissions', icon: <Percent className="w-4 h-4" /> },
          { id: 'payouts', label: 'Payout Management', count: pendingPayoutsCount > 0 ? pendingPayoutsCount : undefined, icon: <DollarSign className="w-4 h-4" /> },
          { id: 'rejected', label: 'Rejected', count: rejectedCount, icon: <XCircle className="w-4 h-4" /> },
          { id: 'suspended', label: 'Suspended / Disabled', count: suspendedCount, icon: <ShieldAlert className="w-4 h-4" /> },
          { id: 'settings', label: 'Affiliate Settings', icon: <Settings className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.id === 'applications' || tab.id === 'payouts'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-black text-white">Pending Affiliate Applications</h2>
            <div className="text-xs text-slate-400">
              Showing <strong>{affiliates.filter((a) => a.status === 'pending').length}</strong> applicants
            </div>
          </div>

          {affiliates.filter((a) => a.status === 'pending').length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white">All caught up!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no pending affiliate applications waiting for review right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {affiliates
                .filter((a) => a.status === 'pending')
                .map((aff) => (
                  <div
                    key={aff.id}
                    className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-slate-700 transition-all shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-white">{aff.fullName}</h3>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                            PENDING REVIEW
                          </span>
                        </div>
                        <p className="text-xs text-indigo-400 font-semibold">{aff.email}</p>
                        <p className="text-xs text-slate-400 font-medium">{aff.mobile} • {aff.city}, {aff.country}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Applied: {aff.createdAt.split(' ')[0]}
                      </span>
                    </div>

                    {/* Reason */}
                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                      <p className="font-bold text-slate-300 text-[11px]">Reason for Joining & Audience:</p>
                      <p className="text-slate-400 italic text-[11px] leading-relaxed">
                        "{aff.applicationReason}"
                      </p>
                      {aff.websiteOrSocial && (
                        <p className="pt-1 text-[11px] text-indigo-300 flex items-center gap-1 font-semibold">
                          <ExternalLink className="w-3 h-3" />
                          <span>{aff.websiteOrSocial}</span>
                        </p>
                      )}
                    </div>

                    {/* Payment Account */}
                    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                      <span>Payout Method: <strong className="text-white uppercase">{aff.paymentMethod}</strong></span>
                      <span className="font-mono text-slate-300 text-[11px]">
                        {aff.paymentDetails.upiId || aff.paymentDetails.accountNumber || 'Provided'}
                      </span>
                    </div>

                    {/* Review Actions */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenApprove(aff)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Generate Code</span>
                      </button>
                      <button
                        onClick={() => handleOpenReject(aff)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPROVED AFFILIATES */}
      {activeTab === 'approved' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white">Approved Referral Partners</h2>
              <p className="text-xs text-slate-400">Active affiliates with live referral codes and commission privileges.</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search affiliate, code or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-black border-b border-slate-800">
                <tr>
                  <th className="p-4">Affiliate</th>
                  <th className="p-4">Referral Code</th>
                  <th className="p-4">Payout Account</th>
                  <th className="p-4 text-center">Referrals</th>
                  <th className="p-4 text-center">Sales Generated</th>
                  <th className="p-4 text-right">Commission Earned</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {affiliates
                  .filter((a) => a.status === 'approved')
                  .filter(
                    (a) =>
                      !searchTerm ||
                      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((aff) => {
                    const affSales = sales.filter((s) => s.affiliateId === aff.id && s.status !== 'reversed');
                    const affSalesSum = affSales.reduce((sum, s) => sum + s.originalAmount, 0);
                    const affCommSum = affSales.reduce((sum, s) => sum + s.commissionAmount, 0);
                    const affRefsCount = referrals.filter((r) => r.affiliateId === aff.id).length;

                    return (
                      <tr key={aff.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="font-black text-white text-sm">{aff.fullName}</div>
                          <div className="text-[11px] text-slate-400">{aff.email}</div>
                          <div className="text-[10px] text-slate-500">{aff.city}, {aff.country}</div>
                        </td>
                        <td className="p-4">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono font-black text-xs">
                            <span>{aff.referralCode}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Discount: {aff.customDiscountPercentage ?? settings.globalDiscountPercentage}% | Comm: {aff.customCommissionPercentage ?? settings.globalCommissionPercentage}%
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-xs font-bold text-white uppercase">{aff.paymentMethod}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {aff.paymentDetails.upiId || aff.paymentDetails.accountNumber || '—'}
                          </div>
                        </td>
                        <td className="p-4 text-center font-bold text-white text-sm">
                          {affRefsCount}
                        </td>
                        <td className="p-4 text-center">
                          <div className="font-black text-white text-sm">{affSales.length} orders</div>
                          <div className="text-[10px] text-emerald-400 font-bold">₹{affSalesSum.toLocaleString()}</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="font-black text-emerald-400 text-sm">₹{affCommSum.toFixed(2)}</div>
                          <div className="text-[10px] text-slate-400">10% rate</div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenRates(aff)}
                              title="Custom Commission & Discount Rates"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenSuspend(aff)}
                              title="Suspend Affiliate"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-950/60 text-amber-400 border border-slate-700 cursor-pointer"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => disableAffiliate(aff.id)}
                              title="Disable Account"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-rose-400 border border-slate-700 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REFERRAL SALES */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white">All Referral Sales & Conversions</h2>
              <p className="text-xs text-slate-400">Auditable log of student purchases attributed to affiliate partners.</p>
            </div>
            <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-xl">
              {sales.length} Total Sales
            </span>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-black border-b border-slate-800">
                <tr>
                  <th className="p-4">Sale ID / Date</th>
                  <th className="p-4">Affiliate</th>
                  <th className="p-4">Student & Package</th>
                  <th className="p-4 text-right">Original Price</th>
                  <th className="p-4 text-right">Discount</th>
                  <th className="p-4 text-right">Final Paid</th>
                  <th className="p-4 text-right">Commission</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sales.map((sale) => {
                  const affiliate = affiliates.find((a) => a.id === sale.affiliateId);
                  return (
                    <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono">
                        <div className="font-bold text-white">{sale.id}</div>
                        <div className="text-[10px] text-slate-400">{sale.createdAt}</div>
                        <div className="text-[10px] text-indigo-400 font-semibold">{sale.purchaseId}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{affiliate?.fullName || 'Unknown'}</div>
                        <div className="text-[10px] font-mono text-amber-400">{affiliate?.referralCode || '—'}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{sale.studentName}</div>
                        <div className="text-[11px] text-slate-400">{sale.packageName} • {sale.className}</div>
                      </td>
                      <td className="p-4 text-right font-semibold text-slate-300">
                        ₹{sale.originalAmount.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-bold text-amber-400">
                        -₹{sale.discountAmount.toFixed(2)}
                        <span className="text-[10px] text-slate-400 block font-normal">({sale.discountPercentage}%)</span>
                      </td>
                      <td className="p-4 text-right font-black text-white">
                        ₹{sale.finalAmount.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-black text-emerald-400 text-sm">
                        ₹{sale.commissionAmount.toFixed(2)}
                        <span className="text-[10px] text-slate-400 block font-normal">({sale.commissionPercentage}%)</span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            sale.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : sale.status === 'approved'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : sale.status === 'reversed'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {sale.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {sale.status !== 'reversed' && (
                          <button
                            onClick={() => handleOpenReverse(sale)}
                            title="Reverse Commission on Refund"
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-rose-400 border border-slate-700 text-[11px] font-bold cursor-pointer"
                          >
                            Reverse
                          </button>
                        )}
                        {sale.status === 'reversed' && (
                          <span className="text-[10px] text-rose-400 italic">
                            Reversed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSIONS CONTROL */}
      {activeTab === 'commissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white">Commissions Audit & Status Control</h2>
              <p className="text-xs text-slate-400">Approve commissions for payout, mark as paid, or reverse on refund.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs font-bold text-amber-400">Pending Review</p>
              <p className="text-xl font-black text-white mt-1">
                {sales.filter((s) => s.status === 'pending').length} items (₹
                {sales
                  .filter((s) => s.status === 'pending')
                  .reduce((sum, s) => sum + s.commissionAmount, 0)
                  .toFixed(2)}
                )
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs font-bold text-indigo-400">Approved & Payable</p>
              <p className="text-xl font-black text-white mt-1">
                {sales.filter((s) => s.status === 'approved').length} items (₹
                {sales
                  .filter((s) => s.status === 'approved')
                  .reduce((sum, s) => sum + s.commissionAmount, 0)
                  .toFixed(2)}
                )
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs font-bold text-emerald-400">Paid Out</p>
              <p className="text-xl font-black text-white mt-1">
                {sales.filter((s) => s.status === 'paid').length} items (₹
                {sales
                  .filter((s) => s.status === 'paid')
                  .reduce((sum, s) => sum + s.commissionAmount, 0)
                  .toFixed(2)}
                )
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-black border-b border-slate-800">
                <tr>
                  <th className="p-4">Affiliate</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Calculation Base</th>
                  <th className="p-4 text-right">Commission Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Audit & Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sales.map((sale) => {
                  const affiliate = affiliates.find((a) => a.id === sale.affiliateId);
                  return (
                    <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{affiliate?.fullName}</div>
                        <div className="text-[10px] text-slate-400">{affiliate?.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{sale.packageName}</div>
                        <div className="text-[10px] text-slate-400">{sale.className}</div>
                      </td>
                      <td className="p-4 text-[11px]">
                        <span className="font-mono text-slate-300">
                          {sale.commissionBase === 'final_paid'
                            ? `Final Paid (₹${sale.finalAmount})`
                            : `Original Price (₹${sale.originalAmount})`}
                        </span>
                        <span className="text-slate-500 block">× {sale.commissionPercentage}%</span>
                      </td>
                      <td className="p-4 text-right font-black text-emerald-400 text-sm">
                        ₹{sale.commissionAmount.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            sale.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : sale.status === 'approved'
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : sale.status === 'reversed'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {sale.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {sale.status === 'pending' && (
                            <button
                              onClick={() => approveCommission(sale.id)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {sale.status === 'approved' && (
                            <button
                              onClick={() => markCommissionAsPaid(sale.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          )}
                          {sale.status !== 'reversed' && (
                            <button
                              onClick={() => handleOpenReverse(sale)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-rose-300 border border-slate-700 text-[11px] font-bold cursor-pointer"
                            >
                              Reverse
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAYOUT MANAGEMENT */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white">Payout Requests & Settlement</h2>
              <p className="text-xs text-slate-400">Process affiliate withdrawal requests and record transaction references.</p>
            </div>
            <div className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
              Min Threshold: ₹{settings.minimumPayout}
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-black border-b border-slate-800">
                <tr>
                  <th className="p-4">Payout ID / Date</th>
                  <th className="p-4">Affiliate</th>
                  <th className="p-4">Payment Account</th>
                  <th className="p-4 text-right">Requested Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Txn Reference</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono">
                      <div className="font-bold text-white">{payout.id}</div>
                      <div className="text-[10px] text-slate-400">{payout.requestedAt}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{payout.affiliateName}</div>
                      <div className="text-[10px] text-slate-400">{payout.affiliateEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white uppercase">{payout.paymentMethod}</div>
                      <div className="text-[11px] font-mono text-indigo-300">
                        {payout.paymentDetails.upiId || payout.paymentDetails.accountNumber || '—'}
                      </div>
                    </td>
                    <td className="p-4 text-right font-black text-emerald-400 text-sm">
                      ₹{payout.amount.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          payout.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : payout.status === 'processing'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : payout.status === 'approved'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : payout.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-400 max-w-[200px] truncate">
                      {payout.transactionReference || 'Pending Transfer'}
                    </td>
                    <td className="p-4 text-right">
                      {payout.status === 'requested' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenPayoutProcess(payout)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] shadow-sm cursor-pointer"
                          >
                            Process & Settle
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPayout(payout);
                              setShowRejectPayoutModal(true);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-rose-400 border border-slate-700 text-[11px] font-bold cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {payout.status === 'paid' && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Settled ({payout.paidAt?.split(' ')[0]})</span>
                        </span>
                      )}
                      {payout.status === 'rejected' && (
                        <span className="text-[10px] text-rose-400 italic">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: REJECTED APPLICATIONS */}
      {activeTab === 'rejected' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white">Rejected Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {affiliates
              .filter((a) => a.status === 'rejected')
              .map((aff) => (
                <div key={aff.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-white">{aff.fullName}</h3>
                      <p className="text-xs text-slate-400">{aff.email} • {aff.city}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      REJECTED
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-1">
                    <p className="font-bold text-rose-300">Rejection Reason:</p>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{aff.rejectionReason || 'Did not meet criteria'}</p>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleOpenApprove(aff)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                    >
                      Re-evaluate & Approve
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 7: SUSPENDED / DISABLED */}
      {activeTab === 'suspended' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white">Suspended & Disabled Affiliates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {affiliates
              .filter((a) => a.status === 'suspended' || a.status === 'disabled')
              .map((aff) => (
                <div key={aff.id} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-white">{aff.fullName}</h3>
                      <p className="text-xs text-slate-400">{aff.email} • Code: <strong className="text-indigo-300">{aff.referralCode}</strong></p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 uppercase">
                      {aff.status}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-xs space-y-1">
                    <p className="font-bold text-amber-300">Suspension Reason / Note:</p>
                    <p className="text-slate-300 text-[11px]">{aff.suspensionReason || 'Policy violation or manual disable'}</p>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => reactivateAffiliate(aff.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Reactivate Account
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 8: SETTINGS & RULES */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Global Affiliate & Referral Rules</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Global Student Discount */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Student Referral Discount</span>
                  <span className="text-indigo-400 font-mono font-black">{settings.globalDiscountPercentage}%</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={settings.globalDiscountPercentage}
                  onChange={(e) =>
                    updateAffiliateSettings({ globalDiscountPercentage: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-500">Applied when student inputs valid referral code at checkout.</p>
              </div>

              {/* Global Affiliate Commission */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Affiliate Commission Rate</span>
                  <span className="text-emerald-400 font-mono font-black">{settings.globalCommissionPercentage}%</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={settings.globalCommissionPercentage}
                  onChange={(e) =>
                    updateAffiliateSettings({ globalCommissionPercentage: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-500">Credited to affiliate on verified package purchase.</p>
              </div>

              {/* Commission Calculation Basis */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-bold text-slate-300">Commission Calculation Basis</label>
                <select
                  value={settings.commissionCalculationBasis}
                  onChange={(e) =>
                    updateAffiliateSettings({
                      commissionCalculationBasis: e.target.value as 'original_price' | 'final_paid',
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="original_price">1. Original Package Price (e.g. ₹1999 × 10% = ₹199.90)</option>
                  <option value="final_paid">2. Final Paid Amount (e.g. ₹1799.10 × 10% = ₹179.91)</option>
                </select>
                <p className="text-[10px] text-slate-500">Base rule used to compute affiliate commission server-side.</p>
              </div>

              {/* Minimum Payout Amount */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Minimum Payout Threshold</span>
                  <span className="text-amber-400 font-mono font-black">₹{settings.minimumPayout}</span>
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={settings.minimumPayout}
                  onChange={(e) => updateAffiliateSettings({ minimumPayout: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-500">Affiliates can only request withdrawals when balance exceeds this.</p>
              </div>

              {/* Self-Referral Prevention Setting */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-bold text-slate-300">Self-Referral Enforcement</label>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Strictly Blocked</span>
                  <span className="text-[10px] text-slate-400 font-medium">Matching email & ID protected</span>
                </div>
                <p className="text-[10px] text-slate-500">Prevents affiliates from earning commissions on self-purchases.</p>
              </div>
            </div>
          </div>

          {/* Package Specific Override Matrix */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-white">Package-Specific Referral Overrides</h3>
            <p className="text-xs text-slate-400">Enable/disable referral participation or specify custom percentages per package.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 text-slate-400 font-black border-b border-slate-800">
                  <tr>
                    <th className="p-3">Package</th>
                    <th className="p-3">Affiliate Status</th>
                    <th className="p-3 text-center">Custom Discount %</th>
                    <th className="p-3 text-center">Custom Commission %</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {packageSettings.map((pkgSet) => (
                    <tr key={pkgSet.id}>
                      <td className="p-3 font-bold text-white">{pkgSet.packageName}</td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            updatePackageAffiliateSetting(pkgSet.packageId, { enabled: !pkgSet.enabled })
                          }
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                            pkgSet.enabled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {pkgSet.enabled ? '✓ Enabled' : '✕ Disabled'}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={pkgSet.discountPercentage ?? 10}
                          onChange={(e) =>
                            updatePackageAffiliateSetting(pkgSet.packageId, {
                              discountPercentage: Number(e.target.value),
                            })
                          }
                          className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs font-bold text-white"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          value={pkgSet.commissionPercentage ?? 10}
                          onChange={(e) =>
                            updatePackageAffiliateSetting(pkgSet.packageId, {
                              commissionPercentage: Number(e.target.value),
                            })
                          }
                          className="w-16 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs font-bold text-white"
                        />
                      </td>
                      <td className="p-3 text-right text-[11px] text-indigo-400 font-semibold">
                        Auto Saved
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: APPROVE APPLICATION */}
      {showApproveModal && selectedAffiliate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Approve Affiliate Application</span>
              </h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              You are approving <strong>{selectedAffiliate.fullName}</strong> ({selectedAffiliate.email}). A unique referral code and live affiliate portal access will be generated.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Unique Referral Code</label>
              <input
                type="text"
                value={customCodeInput}
                onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase())}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono font-black text-amber-400 text-sm focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400">
                Referral Link will be: <span className="text-indigo-400 font-mono">https://beyondclassroom.in/?ref={customCodeInput}</span>
              </p>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT APPLICATION */}
      {showRejectModal && selectedAffiliate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Reject Application</span>
            </h3>

            <p className="text-xs text-slate-300">
              Rejecting <strong>{selectedAffiliate.fullName}</strong>. Please specify an optional reason:
            </p>

            <textarea
              rows={3}
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUSPEND AFFILIATE */}
      {showSuspendModal && selectedAffiliate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Suspend Affiliate Account</span>
            </h3>

            <p className="text-xs text-slate-300">
              Suspending <strong>{selectedAffiliate.fullName}</strong> will immediately disable their referral link and pause all pending commission earnings.
            </p>

            <textarea
              rows={3}
              value={suspendReasonInput}
              onChange={(e) => setSuspendReasonInput(e.target.value)}
              placeholder="Reason for suspension..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSuspend}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs"
              >
                Suspend Affiliate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM RATES */}
      {showRatesModal && selectedAffiliate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Custom Rates: {selectedAffiliate.fullName}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300">Custom Student Discount %</label>
                <input
                  type="number"
                  value={customDiscountInput}
                  onChange={(e) => setCustomDiscountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Custom Affiliate Commission %</label>
                <input
                  type="number"
                  value={customCommissionInput}
                  onChange={(e) => setCustomCommissionInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRatesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRates}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black"
              >
                Save Custom Rates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REVERSE COMMISSION */}
      {showReverseModal && selectedSale && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <span>Reverse Commission (Audit Trail)</span>
            </h3>

            <p className="text-xs text-slate-300">
              Reversing commission of <strong>₹{selectedSale.commissionAmount.toFixed(2)}</strong> on sale #{selectedSale.id}. This creates an auditable reversal record and updates affiliate balances without erasing history.
            </p>

            <textarea
              rows={3}
              value={reversalReasonInput}
              onChange={(e) => setReversalReasonInput(e.target.value)}
              placeholder="Reason (e.g. Order cancelled by student within refund window)..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowReverseModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReverse}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black"
              >
                Confirm Reversal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SETTLE PAYOUT */}
      {showPayoutModal && selectedPayout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Process Payout Settlement</span>
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Affiliate:</span>
                <span className="font-bold text-white">{selectedPayout.affiliateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-black text-emerald-400 text-sm">₹{selectedPayout.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Method & Account:</span>
                <span className="font-mono text-indigo-300">
                  {selectedPayout.paymentMethod.toUpperCase()} ({selectedPayout.paymentDetails.upiId || selectedPayout.paymentDetails.accountNumber})
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Bank / UPI Transaction Reference</label>
              <input
                type="text"
                value={payoutTxnRef}
                onChange={(e) => setPayoutTxnRef(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Admin Notes</label>
              <input
                type="text"
                value={payoutAdminNotes}
                onChange={(e) => setPayoutAdminNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPayoutModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayoutPaid}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md"
              >
                Confirm Paid & Settle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT PAYOUT */}
      {showRejectPayoutModal && selectedPayout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Reject Payout Request</span>
            </h3>

            <p className="text-xs text-slate-300">
              Rejecting payout #{selectedPayout.id} of ₹{selectedPayout.amount.toFixed(2)}. The funds will remain in the affiliate's balance.
            </p>

            <textarea
              rows={3}
              value={rejectPayoutReason}
              onChange={(e) => setRejectPayoutReason(e.target.value)}
              placeholder="Reason for rejecting payout (e.g. invalid IFSC or closed UPI handle)..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRejectPayoutModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayoutReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
