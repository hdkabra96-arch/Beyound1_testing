import React, { useState } from 'react';
import { useAffiliate } from '../services/affiliate-context';
import { useAdminStore } from '../services/admin-store';
import {
  AffiliateProfile,
  AffiliateSale,
  AffiliatePayout,
  PaymentMethodType,
} from '../types/affiliate';
import {
  DollarSign,
  Share2,
  Users,
  Gift,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  TrendingUp,
  Percent,
  CreditCard,
  Building2,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  XCircle,
  ShieldAlert,
  Sliders,
  QrCode,
  Download,
  Mail,
  MessageCircle,
  Twitter,
  Linkedin,
  HelpCircle,
  FileText,
  UserCheck,
  Sparkles,
  Search,
  Filter,
  Send,
  Bell,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useToast } from '../components/ui/toast';

export const AffiliatePage: React.FC = () => {
  const {
    currentAffiliate,
    currentAffiliateId,
    affiliates,
    switchAffiliate,
    sales,
    payouts,
    referrals,
    notifications,
    settings,
    packageSettings,
    currentAffiliateStats,
    registerAffiliate,
    updateAffiliateProfile,
    requestPayout,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
  } = useAffiliate();

  const { packages } = useAdminStore();
  const { addToast } = useToast();

  // Page View Modes: 'dashboard' | 'apply' | 'status' | 'faq'
  const [viewMode, setViewMode] = useState<'dashboard' | 'apply' | 'status' | 'faq'>(() => {
    if (!currentAffiliate) return 'apply';
    if (currentAffiliate.status === 'approved') return 'dashboard';
    return 'status';
  });

  // Active Dashboard Sub-Tab
  const [dashboardTab, setDashboardTab] = useState<
    'overview' | 'sales' | 'payouts' | 'creatives' | 'account' | 'notifications'
  >('overview');

  // Copy states
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTextKey, setCopiedTextKey] = useState<string | null>(null);

  // Application Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formCountry, setFormCountry] = useState('India');
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethodType>('upi');
  const [formUpiId, setFormUpiId] = useState('');
  const [formBankHolder, setFormBankHolder] = useState('');
  const [formBankAcc, setFormBankAcc] = useState('');
  const [formBankIfsc, setFormBankIfsc] = useState('');
  const [formBankName, setFormBankName] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formSocial, setFormSocial] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Payout Request Modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(() =>
    Math.max(settings.minimumPayout, currentAffiliateStats.availableForPayout)
  );
  const [payoutMethod, setPayoutMethod] = useState<PaymentMethodType>(
    currentAffiliate?.paymentMethod || 'upi'
  );
  const [payoutUpiId, setPayoutUpiId] = useState(
    currentAffiliate?.paymentDetails.upiId || ''
  );
  const [payoutBankHolder, setPayoutBankHolder] = useState(
    currentAffiliate?.paymentDetails.accountHolderName || ''
  );
  const [payoutBankAcc, setPayoutBankAcc] = useState(
    currentAffiliate?.paymentDetails.accountNumber || ''
  );
  const [payoutBankIfsc, setPayoutBankIfsc] = useState(
    currentAffiliate?.paymentDetails.ifscCode || ''
  );
  const [payoutBankName, setPayoutBankName] = useState(
    currentAffiliate?.paymentDetails.bankName || ''
  );

  // QR Code Modal
  const [showQrModal, setShowQrModal] = useState(false);

  // Search in sales table
  const [salesSearch, setSalesSearch] = useState('');

  // Handle Copy Referral Code
  const handleCopyCode = () => {
    if (!currentAffiliate?.referralCode) return;
    navigator.clipboard.writeText(currentAffiliate.referralCode);
    setCopiedCode(true);
    addToast('success', 'Referral Code Copied!', `Code "${currentAffiliate.referralCode}" copied to clipboard.`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Handle Copy Referral Link
  const handleCopyLink = () => {
    if (!currentAffiliate?.referralLink) return;
    navigator.clipboard.writeText(currentAffiliate.referralLink);
    setCopiedLink(true);
    addToast('success', 'Referral Link Copied!', 'Full tracking URL copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Handle Copy Marketing Text
  const handleCopyMarketingText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextKey(key);
    addToast('success', 'Copied to Clipboard!', 'Promotional text is ready to share.');
    setTimeout(() => setCopiedTextKey(null), 2500);
  };

  // Handle Submit Application
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert('Please accept the Affiliate Terms & Code of Conduct.');
      return;
    }

    setIsSubmittingApp(true);
    setTimeout(() => {
      const paymentDetails =
        formPaymentMethod === 'upi'
          ? { upiId: formUpiId, accountHolderName: formName }
          : {
              accountHolderName: formBankHolder || formName,
              accountNumber: formBankAcc,
              ifscCode: formBankIfsc,
              bankName: formBankName,
            };

      const result = registerAffiliate({
        fullName: formName,
        email: formEmail,
        mobile: formMobile,
        city: formCity,
        country: formCountry,
        paymentMethod: formPaymentMethod,
        paymentDetails,
        applicationReason: formReason,
        websiteOrSocial: formSocial,
      });

      setIsSubmittingApp(false);
      addToast('success', 'Application Submitted!', result.message);
      setViewMode('status');
    }, 800);
  };

  // Handle Request Payout
  const handleConfirmPayoutRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAffiliate) return;

    if (payoutAmount > currentAffiliateStats.availableForPayout) {
      alert(`Requested amount exceeds available balance of ₹${currentAffiliateStats.availableForPayout}`);
      return;
    }

    const paymentDetails =
      payoutMethod === 'upi'
        ? { upiId: payoutUpiId, accountHolderName: currentAffiliate.fullName }
        : {
            accountHolderName: payoutBankHolder,
            accountNumber: payoutBankAcc,
            ifscCode: payoutBankIfsc,
            bankName: payoutBankName,
          };

    const res = requestPayout(currentAffiliate.id, payoutAmount, payoutMethod, paymentDetails);
    if (res.success) {
      addToast('success', 'Payout Requested!', res.message);
      setShowPayoutModal(false);
    } else {
      alert(res.message);
    }
  };

  // Filtered sales for current affiliate
  const affiliateSales = currentAffiliate
    ? sales.filter((s) => s.affiliateId === currentAffiliate.id)
    : [];

  const affiliatePayouts = currentAffiliate
    ? payouts.filter((p) => p.affiliateId === currentAffiliate.id)
    : [];

  const affiliateNotifications = currentAffiliate
    ? notifications.filter((n) => n.affiliateId === currentAffiliate.id)
    : [];

  const referralDiscountPct =
    currentAffiliate?.customDiscountPercentage ?? settings.globalDiscountPercentage;
  const affiliateCommissionPct =
    currentAffiliate?.customCommissionPercentage ?? settings.globalCommissionPercentage;

  // Social share URLs
  const shareText = `Explore Beyond Classroom Mathematics practice packages! Use my partner referral code ${currentAffiliate?.referralCode} to get an instant ${referralDiscountPct}% discount: ${currentAffiliate?.referralLink}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentAffiliate?.referralLink || '')}&text=${encodeURIComponent(shareText)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent('Beyond Classroom Math Discount')}&body=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      {/* Top Demo & Profile Switcher Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 text-[10px]">
              AFFILIATE PORTAL
            </span>
            <span className="text-slate-400 font-medium hidden sm:inline">
              Session Profile:
            </span>
            <select
              value={currentAffiliateId || ''}
              onChange={(e) => {
                if (e.target.value === 'new') {
                  setViewMode('apply');
                } else {
                  switchAffiliate(e.target.value);
                  const selected = affiliates.find((a) => a.id === e.target.value);
                  if (selected?.status === 'approved') setViewMode('dashboard');
                  else setViewMode('status');
                }
              }}
              className="bg-slate-950 border border-slate-700 text-white font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <optgroup label="Sample Affiliate Profiles">
                {affiliates.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.fullName} ({a.status.toUpperCase()} - {a.referralCode || 'No Code'})
                  </option>
                ))}
              </optgroup>
              <option value="new">+ Apply as New Affiliate</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('dashboard')}
              disabled={currentAffiliate?.status !== 'approved'}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setViewMode('status')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'status'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              Application Status
            </button>
            <button
              onClick={() => setViewMode('apply')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'apply'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              Become an Affiliate
            </button>
            <button
              onClick={() => setViewMode('faq')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'faq'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              Program Rules & FAQ
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: BECOME AN AFFILIATE (APPLICATION FORM) */}
      {viewMode === 'apply' && (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
              <Gift className="w-4 h-4 text-indigo-400" />
              <span>Beyond Classroom Partner Program</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Partner With Us & Empower Young Mathematicians
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Join educators, parent communities, coaching institutes, and bloggers promoting structured Class 1–8 mathematics practice. Earn <strong className="text-emerald-400 font-bold">{settings.globalCommissionPercentage}% commission</strong> on every verified package purchase.
            </p>
          </div>

          {/* 3 Pillars Benefit Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">1. Unique Referral Code</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive a dedicated tracking code & URL. Students save {settings.globalDiscountPercentage}% on their subscriptions.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">2. Reliable Commission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earn {settings.globalCommissionPercentage}% per converted order with transparent reporting and monthly payouts to UPI/Bank.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">3. Admin Verified</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applications are reviewed within 24 hours to maintain academic integrity and authentic parent trust.
              </p>
            </div>
          </div>

          {/* Application Form */}
          <form
            onSubmit={handleSubmitApplication}
            className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl"
          >
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Affiliate Application Form</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Please provide accurate details so our academic admin team can review and provision your referral code.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Priya Sharma"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email Address (For Notifications) *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priya.maths@gmail.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98201 23456"
                  value={formMobile}
                  onChange={(e) => setFormMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">City & Country *</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City (e.g. Mumbai)"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Country"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Application Reason & Audience */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Describe Your Audience & Promotion Plan *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Primary mathematics teacher with 2,000+ WhatsApp parent group members and YouTube educational channel..."
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Website, Social Profile, or YouTube Link (Optional)
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/math_educator or https://mywebsite.org"
                value={formSocial}
                onChange={(e) => setFormSocial(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Payout Method Setup */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Payout Method For Commission Withdrawals
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormPaymentMethod('upi')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    formPaymentMethod === 'upi'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>UPI Virtual ID (Instant)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormPaymentMethod('bank_transfer')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    formPaymentMethod === 'bank_transfer'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Bank Account Transfer (NEFT/IMPS)</span>
                </button>
              </div>

              {formPaymentMethod === 'upi' ? (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">UPI ID / VPA *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. name@okaxis or name@paytm"
                    value={formUpiId}
                    onChange={(e) => setFormUpiId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Account Holder Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="As per bank passbook"
                      value={formBankHolder}
                      onChange={(e) => setFormBankHolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Account Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="Account number"
                      value={formBankAcc}
                      onChange={(e) => setFormBankAcc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Bank Name & Branch *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HDFC Bank, Fort Branch"
                      value={formBankName}
                      onChange={(e) => setFormBankName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">IFSC Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HDFC0001234"
                      value={formBankIfsc}
                      onChange={(e) => setFormBankIfsc(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 space-y-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I agree to the Beyond Classroom Affiliate Terms: Self-referrals are strictly prohibited. Promotion must be ethical without spamming coupon scrapers or unauthorized automated bots.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmittingApp}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-black text-sm transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmittingApp ? (
                <span>Submitting Application...</span>
              ) : (
                <>
                  <span>Submit Affiliate Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* VIEW 2: APPLICATION STATUS CHECKER */}
      {viewMode === 'status' && (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl text-center">
            {currentAffiliate?.status === 'pending' && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-2xl animate-pulse">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    APPLICATION UNDER REVIEW
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">
                    Thank You, {currentAffiliate.fullName}!
                  </h2>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Your affiliate application was received on <strong>{currentAffiliate.createdAt}</strong>. Our academic team typically completes reviews within 1 business day.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Application ID:</span>
                    <span className="font-mono text-white">{currentAffiliate.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact Email:</span>
                    <span className="text-indigo-400 font-semibold">{currentAffiliate.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payout Account:</span>
                    <span className="font-mono text-emerald-400 uppercase">
                      {currentAffiliate.paymentMethod} ({currentAffiliate.paymentDetails.upiId || 'Bank Details Provided'})
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Tip: Once approved by an Admin in the Admin Panel, your unique referral code will activate instantly.
                </p>
              </div>
            )}

            {currentAffiliate?.status === 'approved' && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    APPROVED PARTNER
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">
                    Welcome, {currentAffiliate.fullName}!
                  </h2>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Your affiliate portal is fully active. Your referral code is <strong className="text-amber-400 font-mono">{currentAffiliate.referralCode}</strong>.
                  </p>
                </div>

                <button
                  onClick={() => setViewMode('dashboard')}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all shadow-lg cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Open Affiliate Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {currentAffiliate?.status === 'rejected' && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                    APPLICATION NOT APPROVED
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">
                    Application Update
                  </h2>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    We appreciate your interest. Unfortunately, your application could not be approved at this time.
                  </p>
                </div>

                {currentAffiliate.rejectionReason && (
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-left text-xs max-w-md mx-auto">
                    <span className="font-bold text-rose-300 block mb-1">Reason:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{currentAffiliate.rejectionReason}</p>
                  </div>
                )}

                <button
                  onClick={() => setViewMode('apply')}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  Submit New Application
                </button>
              </div>
            )}

            {currentAffiliate?.status === 'suspended' && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    ACCOUNT SUSPENDED
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">
                    Affiliate Privileges Paused
                  </h2>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Your affiliate code tracking is currently suspended.
                  </p>
                </div>

                {currentAffiliate.suspensionReason && (
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-left text-xs max-w-md mx-auto">
                    <span className="font-bold text-amber-300 block mb-1">Suspension Reason:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{currentAffiliate.suspensionReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: APPROVED AFFILIATE DASHBOARD */}
      {viewMode === 'dashboard' && currentAffiliate && currentAffiliate.status === 'approved' && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
          {/* Top Profile & Referral Hub Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Partner Profile Summary */}
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-600/30">
                  {currentAffiliate.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-white">
                      {currentAffiliate.fullName}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>APPROVED PARTNER</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {currentAffiliate.email} • {currentAffiliate.city}, {currentAffiliate.country}
                  </p>
                  <p className="text-[11px] text-indigo-400 font-semibold">
                    Standard Rates: {referralDiscountPct}% Student Discount | {affiliateCommissionPct}% Affiliate Commission
                  </p>
                </div>
              </div>

              {/* Notification & Payout Trigger */}
              <div className="flex items-center gap-2 self-start lg:self-auto">
                <button
                  onClick={() => setDashboardTab('notifications')}
                  className="relative p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Affiliate Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setShowPayoutModal(true)}
                  disabled={currentAffiliateStats.availableForPayout < settings.minimumPayout}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Request Payout (₹{currentAffiliateStats.availableForPayout.toFixed(2)})</span>
                </button>
              </div>
            </div>

            {/* Referral Code Engine Strip */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Unique Code Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Your Unique Referral Code</span>
                  <span className="text-amber-400 text-[10px] font-mono">Gives {referralDiscountPct}% Off</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-900 border border-indigo-500/40 rounded-xl px-4 py-2.5 text-base font-mono font-black text-amber-400 tracking-wider">
                    {currentAffiliate.referralCode}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Unique Tracking Link Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Direct Tracking Link</span>
                  <span className="text-emerald-400 text-[10px]">Auto-Applies Code</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-300 truncate">
                    {currentAffiliate.referralLink}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setShowQrModal(true)}
                    title="Generate QR Code"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Share Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-400 mr-1">1-Click Share:</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Parent Groups</span>
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-800/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram Channels</span>
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Twitter / X</span>
              </a>
              <a
                href={emailShareUrl}
                className="px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-800/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Newsletter</span>
              </a>
            </div>
          </div>

          {/* Performance KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
              <span className="text-[11px] font-bold text-slate-400 block">Link Clicks</span>
              <p className="text-2xl font-black text-white mt-1">{currentAffiliateStats.totalClicks}</p>
              <span className="text-[10px] text-slate-500">Tracked Visitors</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
              <span className="text-[11px] font-bold text-slate-400 block">Student Referrals</span>
              <p className="text-2xl font-black text-indigo-400 mt-1">{currentAffiliateStats.totalReferrals}</p>
              <span className="text-[10px] text-indigo-300">Registered Leads</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
              <span className="text-[11px] font-bold text-slate-400 block">Verified Sales</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{currentAffiliateStats.successfulSales}</p>
              <span className="text-[10px] text-emerald-300 font-semibold">{currentAffiliateStats.conversionRate}% conv. rate</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
              <span className="text-[11px] font-bold text-slate-400 block">Total Sales Value</span>
              <p className="text-2xl font-black text-white mt-1">₹{currentAffiliateStats.totalSalesValue.toLocaleString()}</p>
              <span className="text-[10px] text-slate-500">Gross Student Orders</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
              <span className="text-[11px] font-bold text-slate-400 block">Total Commission</span>
              <p className="text-2xl font-black text-amber-400 mt-1">₹{currentAffiliateStats.totalCommission.toFixed(2)}</p>
              <span className="text-[10px] text-amber-300 font-semibold">Lifetime Earnings</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 shadow-md">
              <span className="text-[11px] font-bold text-emerald-400 block">Available For Payout</span>
              <p className="text-2xl font-black text-emerald-300 mt-1">₹{currentAffiliateStats.availableForPayout.toFixed(2)}</p>
              <span className="text-[10px] text-slate-400">Min: ₹{settings.minimumPayout}</span>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
            {[
              { id: 'overview', label: 'Overview & Insights', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'sales', label: 'Referral Sales Ledger', count: affiliateSales.length, icon: <FileText className="w-4 h-4" /> },
              { id: 'payouts', label: 'Payouts & History', count: affiliatePayouts.length, icon: <DollarSign className="w-4 h-4" /> },
              { id: 'creatives', label: 'Marketing Kit & Banners', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'account', label: 'Account & Payout Details', icon: <Building2 className="w-4 h-4" /> },
              { id: 'notifications', label: 'Notifications', count: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined, icon: <Bell className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = dashboardTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashboardTab(tab.id as any)}
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
                          : tab.id === 'notifications'
                          ? 'bg-rose-500/20 text-rose-300'
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

          {/* TAB 1: OVERVIEW & INSIGHTS */}
          {dashboardTab === 'overview' && (
            <div className="space-y-6">
              {/* Funnel & Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversion Funnel */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl lg:col-span-2">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <span>Referral Conversion Funnel</span>
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                        <span>1. Link Clicks</span>
                        <span>{currentAffiliateStats.totalClicks} Visitors (100%)</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full w-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                        <span>2. Student Registrations</span>
                        <span>
                          {currentAffiliateStats.totalReferrals} Students (
                          {currentAffiliateStats.totalClicks > 0
                            ? Math.round((currentAffiliateStats.totalReferrals / currentAffiliateStats.totalClicks) * 100)
                            : 0}
                          %)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (currentAffiliateStats.totalReferrals / (currentAffiliateStats.totalClicks || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                        <span>3. Paid Package Purchases</span>
                        <span>
                          {currentAffiliateStats.successfulSales} Orders ({currentAffiliateStats.conversionRate}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (currentAffiliateStats.successfulSales / (currentAffiliateStats.totalClicks || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Total Student Discounts Provided:</span>
                    <span className="font-black text-amber-400">₹{currentAffiliateStats.totalDiscountsGiven.toFixed(2)}</span>
                  </div>
                </div>

                {/* Package Commission Rates */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Percent className="w-5 h-5 text-emerald-400" />
                    <span>Commission Rates by Package</span>
                  </h3>

                  <div className="space-y-2.5">
                    {packageSettings.map((pkg) => {
                      const comm = pkg.commissionPercentage ?? affiliateCommissionPct;
                      const disc = pkg.discountPercentage ?? referralDiscountPct;
                      return (
                        <div
                          key={pkg.id}
                          className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white truncate">{pkg.packageName}</span>
                            <span className="text-emerald-400 font-mono font-black">{comm}% Comm.</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Student Discount: {disc}%</span>
                            <span className="text-slate-500">365 Days Pass</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity Stream */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white">Recent Referral Sales Activity</h3>
                  <button
                    onClick={() => setDashboardTab('sales')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Sales</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {affiliateSales.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No sales recorded yet. Share your referral link with students to start earning commissions!
                  </p>
                ) : (
                  <div className="divide-y divide-slate-800/60">
                    {affiliateSales.slice(0, 4).map((sale) => (
                      <div key={sale.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-white">{sale.packageName}</div>
                          <div className="text-[11px] text-slate-400">{sale.studentName} • {sale.className} • {sale.createdAt.split(' ')[0]}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-emerald-400 text-sm">+₹{sale.commissionAmount.toFixed(2)}</div>
                          <span
                            className={`text-[10px] font-black uppercase ${
                              sale.status === 'paid'
                                ? 'text-emerald-400'
                                : sale.status === 'approved'
                                ? 'text-indigo-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {sale.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: REFERRAL SALES LEDGER */}
          {dashboardTab === 'sales' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white">Referral Sales Ledger</h2>
                  <p className="text-xs text-slate-400">Complete itemized record of purchases made with your referral code.</p>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search package or student..."
                    value={salesSearch}
                    onChange={(e) => setSalesSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-black border-b border-slate-800">
                    <tr>
                      <th className="p-4">Date / Sale ID</th>
                      <th className="p-4">Student & Package</th>
                      <th className="p-4 text-right">Original Price</th>
                      <th className="p-4 text-right">Discount Given</th>
                      <th className="p-4 text-right">Final Paid</th>
                      <th className="p-4 text-right">Your Commission</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {affiliateSales
                      .filter(
                        (s) =>
                          !salesSearch ||
                          s.packageName.toLowerCase().includes(salesSearch.toLowerCase()) ||
                          s.studentName.toLowerCase().includes(salesSearch.toLowerCase())
                      )
                      .map((sale) => (
                        <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-mono">
                            <div className="font-bold text-white">{sale.id}</div>
                            <div className="text-[10px] text-slate-400">{sale.createdAt}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{sale.packageName}</div>
                            <div className="text-[11px] text-slate-400">{sale.studentName} ({sale.className})</div>
                          </td>
                          <td className="p-4 text-right text-slate-400">
                            ₹{sale.originalAmount.toFixed(2)}
                          </td>
                          <td className="p-4 text-right font-bold text-amber-400">
                            -₹{sale.discountAmount.toFixed(2)}
                            <span className="text-[10px] text-slate-500 block font-normal">({sale.discountPercentage}%)</span>
                          </td>
                          <td className="p-4 text-right font-bold text-white">
                            ₹{sale.finalAmount.toFixed(2)}
                          </td>
                          <td className="p-4 text-right font-black text-emerald-400 text-sm">
                            ₹{sale.commissionAmount.toFixed(2)}
                            <span className="text-[10px] text-slate-500 block font-normal">({sale.commissionPercentage}%)</span>
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
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
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PAYOUTS & WITHDRAWALS */}
          {dashboardTab === 'payouts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400">Available For Withdrawal</span>
                  <p className="text-2xl font-black text-emerald-400">₹{currentAffiliateStats.availableForPayout.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">Minimum threshold: ₹{settings.minimumPayout}</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400">Pending Review Commission</span>
                  <p className="text-2xl font-black text-amber-400">₹{currentAffiliateStats.pendingCommission.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">Auto-approved after payment verification</p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-400">Lifetime Paid Out</span>
                  <p className="text-2xl font-black text-indigo-400">₹{currentAffiliateStats.paidCommission.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">Successfully settled payouts</p>
                </div>
              </div>

              {/* Payout History Ledger */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white">Payout History & Settlements</h3>
                  <button
                    onClick={() => setShowPayoutModal(true)}
                    disabled={currentAffiliateStats.availableForPayout < settings.minimumPayout}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    + Request Payout
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/70 text-slate-400 font-black border-b border-slate-800">
                      <tr>
                        <th className="p-3">Payout ID</th>
                        <th className="p-3">Requested Date</th>
                        <th className="p-3">Account Transferred</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3">Bank Reference ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {affiliatePayouts.map((p) => (
                        <tr key={p.id}>
                          <td className="p-3 font-mono font-bold text-white">{p.id}</td>
                          <td className="p-3 text-slate-400">{p.requestedAt}</td>
                          <td className="p-3 uppercase font-mono text-indigo-300">
                            {p.paymentMethod}: {p.paymentDetails.upiId || p.paymentDetails.accountNumber}
                          </td>
                          <td className="p-3 text-right font-black text-emerald-400 text-sm">
                            ₹{p.amount.toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                p.status === 'paid'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : p.status === 'approved'
                                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                  : p.status === 'rejected'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-400 text-[11px]">
                            {p.transactionReference || 'Processing Transfer'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MARKETING KIT & CREATIVES */}
          {dashboardTab === 'creatives' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Ready-to-Share Promotional Copy & Templates</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Click to copy pre-formatted WhatsApp, Social, and Email messages with your embedded referral code.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* WhatsApp Parent Group Script */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">WhatsApp Parent Community Script</span>
                      <button
                        onClick={() =>
                          handleCopyMarketingText(
                            `📚 *Beyond Classroom Math Practice Pass*\n\nParents, if your child is in Class 1 to 8, check out Beyond Classroom's structured mathematics practice papers, MCQ quizzes, and visual flash cards.\n\nUse my partner coupon *${currentAffiliate.referralCode}* to get *${referralDiscountPct}% OFF* on the annual pass!\n\n👉 Join here: ${currentAffiliate.referralLink}`,
                            'whatsapp'
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedTextKey === 'whatsapp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Script</span>
                      </button>
                    </div>
                    <p className="text-slate-300 text-xs font-mono bg-slate-900/70 p-3 rounded-xl whitespace-pre-wrap leading-relaxed">
                      {`📚 Beyond Classroom Math Practice Pass\n\nParents, if your child is in Class 1 to 8, check out Beyond Classroom's structured mathematics practice papers, MCQ quizzes, and visual flash cards.\n\nUse my partner coupon ${currentAffiliate.referralCode} to get ${referralDiscountPct}% OFF on the annual pass!\n\n👉 Join here: ${currentAffiliate.referralLink}`}
                    </p>
                  </div>

                  {/* Instagram / Social Caption */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">Social Media & Bio Link Post</span>
                      <button
                        onClick={() =>
                          handleCopyMarketingText(
                            `Make mathematics practice consistent and fun for Class 1 to 8! Beyond Classroom provides 500+ curated chapter-wise worksheets and interactive quizzes. Use code ${currentAffiliate.referralCode} for ${referralDiscountPct}% off your annual subscription. Link in bio! 📐✨ #MathSkills #CBSEMath #BeyondClassroom`,
                            'social'
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedTextKey === 'social' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Post</span>
                      </button>
                    </div>
                    <p className="text-slate-300 text-xs font-mono bg-slate-900/70 p-3 rounded-xl whitespace-pre-wrap leading-relaxed">
                      {`Make mathematics practice consistent and fun for Class 1 to 8! Beyond Classroom provides 500+ curated chapter-wise worksheets and interactive quizzes. Use code ${currentAffiliate.referralCode} for ${referralDiscountPct}% off your annual subscription. Link in bio! 📐✨ #MathSkills #CBSEMath`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT & SETTINGS */}
          {dashboardTab === 'account' && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl max-w-2xl">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>Affiliate Profile & Payout Settings</span>
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Registered Name</label>
                  <input
                    type="text"
                    disabled
                    value={currentAffiliate.fullName}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white opacity-70"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Contact Email</label>
                  <input
                    type="text"
                    disabled
                    value={currentAffiliate.email}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white opacity-70"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400">Payout UPI ID</label>
                  <input
                    type="text"
                    value={currentAffiliate.paymentDetails.upiId || ''}
                    onChange={(e) =>
                      updateAffiliateProfile(currentAffiliate.id, {
                        paymentDetails: { ...currentAffiliate.paymentDetails, upiId: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500">Auto-saved for future payout disbursements.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {dashboardTab === 'notifications' && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-400" />
                  <span>Affiliate Activity Notifications</span>
                </h3>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead(currentAffiliate.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {affiliateNotifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No notifications yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {affiliateNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        n.isRead
                          ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                          : 'bg-indigo-950/20 border-indigo-900/50 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.createdAt}</span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: FAQ & RULES */}
      {viewMode === 'faq' && (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Affiliate Program Guidelines & FAQ</h2>
            <p className="text-xs text-slate-400">Everything you need to know about promoting Beyond Classroom and getting paid.</p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <h3 className="text-sm font-black text-white">How does referral attribution work?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When a student clicks your referral link or enters your unique code during checkout, a 30-day first-party attribution cookie is established. When the student completes payment, your commission is automatically calculated and credited.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <h3 className="text-sm font-black text-white">What is the payout schedule and minimum withdrawal?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Payouts can be requested anytime once your approved balance reaches ₹{settings.minimumPayout}. Transfers are processed to your UPI ID or Bank Account via NEFT/IMPS within 2 business days.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <h3 className="text-sm font-black text-white">Are self-referrals allowed?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No. Affiliates cannot use their own referral code to purchase packages for themselves. Our system automatically blocks self-referral attempts to protect program fairness.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST PAYOUT */}
      {showPayoutModal && currentAffiliate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Request Commission Payout</span>
              </h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmPayoutRequest} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Available Balance:</span>
                  <span className="font-bold text-emerald-400">₹{currentAffiliateStats.availableForPayout.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Minimum Withdrawal:</span>
                  <span className="font-bold text-white">₹{settings.minimumPayout}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Payout Amount (₹)</label>
                <input
                  type="number"
                  min={settings.minimumPayout}
                  max={currentAffiliateStats.availableForPayout}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono font-bold text-white text-sm focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Payout Method</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-indigo-500"
                >
                  <option value="upi">UPI ID (Instant Transfer)</option>
                  <option value="bank_transfer">Bank Account (NEFT/IMPS)</option>
                </select>
              </div>

              {payoutMethod === 'upi' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">UPI Virtual ID</label>
                  <input
                    type="text"
                    required
                    value={payoutUpiId}
                    onChange={(e) => setPayoutUpiId(e.target.value)}
                    placeholder="name@okaxis"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Account Holder Name"
                    value={payoutBankHolder}
                    onChange={(e) => setPayoutBankHolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Account Number"
                    value={payoutBankAcc}
                    onChange={(e) => setPayoutBankAcc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="IFSC Code"
                      value={payoutBankIfsc}
                      onChange={(e) => setPayoutBankIfsc(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Bank Name"
                      value={payoutBankName}
                      onChange={(e) => setPayoutBankName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer"
                >
                  Submit Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QR CODE DISPLAY */}
      {showQrModal && currentAffiliate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center animate-fade-in">
            <h3 className="text-base font-black text-white flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-400" />
              <span>Referral QR Code</span>
            </h3>

            <div className="p-4 rounded-2xl bg-white text-slate-950 mx-auto max-w-[200px] shadow-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-36 h-36 border-4 border-slate-900 p-2 rounded-xl flex items-center justify-center">
                  <QrCode className="w-28 h-28 text-slate-950" />
                </div>
                <span className="text-[10px] font-black text-slate-900 block font-mono">
                  {currentAffiliate.referralCode}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Parents can scan this QR code with their mobile phone camera to open Beyond Classroom with your discount auto-applied.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
