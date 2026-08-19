import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AffiliateProfile,
  AffiliateReferral,
  AffiliateSale,
  AffiliatePayout,
  AffiliateNotification,
  AffiliateSettings,
  PackageAffiliateSetting,
  AffiliateStatsSummary,
  PaymentMethodType,
  AffiliatePaymentDetails,
} from '../types/affiliate';
import {
  INITIAL_AFFILIATES,
  INITIAL_AFFILIATE_REFERRALS,
  INITIAL_AFFILIATE_SALES,
  INITIAL_AFFILIATE_PAYOUTS,
  INITIAL_AFFILIATE_NOTIFICATIONS,
  INITIAL_AFFILIATE_SETTINGS,
  INITIAL_PACKAGE_AFFILIATE_SETTINGS,
} from './affiliate-data';
import { useAdminStore } from './admin-store';

interface ReferralValidationResult {
  valid: boolean;
  code: string;
  affiliateId?: string;
  affiliateName?: string;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  message: string;
  isSelfReferral?: boolean;
}

interface AffiliateContextType {
  // Current Affiliate Session
  currentAffiliate: AffiliateProfile | null;
  currentAffiliateId: string | null;
  setCurrentAffiliateId: (id: string | null) => void;
  switchAffiliate: (affiliateId: string) => void;
  
  // All Affiliates Data
  affiliates: AffiliateProfile[];
  referrals: AffiliateReferral[];
  sales: AffiliateSale[];
  payouts: AffiliatePayout[];
  notifications: AffiliateNotification[];
  settings: AffiliateSettings;
  packageSettings: PackageAffiliateSetting[];
  
  // Active referral attribution in current browser session
  activeAttributedCode: string | null;
  clearAttributedCode: () => void;
  setManualReferralCode: (code: string) => void;

  // Stats for current affiliate
  currentAffiliateStats: AffiliateStatsSummary;

  // Registration & Profile
  registerAffiliate: (data: {
    fullName: string;
    email: string;
    mobile: string;
    city: string;
    country: string;
    paymentMethod: PaymentMethodType;
    paymentDetails: AffiliatePaymentDetails;
    applicationReason: string;
    websiteOrSocial?: string;
  }) => { success: boolean; affiliateId: string; message: string };
  updateAffiliateProfile: (id: string, updates: Partial<AffiliateProfile>) => void;

  // Admin Review Operations
  approveAffiliate: (id: string, customCode?: string) => void;
  rejectAffiliate: (id: string, reason: string) => void;
  suspendAffiliate: (id: string, reason: string) => void;
  reactivateAffiliate: (id: string) => void;
  disableAffiliate: (id: string) => void;
  updateAffiliateCustomRates: (id: string, customDiscountPct?: number, customCommissionPct?: number) => void;

  // Referral Validation & Checkout Engine
  validateReferralCode: (
    code: string,
    packagePrice: number,
    packageId?: string,
    studentEmail?: string
  ) => ReferralValidationResult;

  // Idempotent Sale & Commission Recording on Payment Verification
  recordReferralSaleOnPayment: (data: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    packageId: string;
    packageName: string;
    classId: string;
    className: string;
    originalPrice: number;
    paidAmount: number;
    purchaseId: string;
    referralCode?: string;
  }) => { recorded: boolean; sale?: AffiliateSale; message: string };

  // Commission Operations
  approveCommission: (saleId: string) => void;
  reverseCommission: (saleId: string, reason: string) => void;
  markCommissionAsPaid: (saleId: string) => void;

  // Payout Operations
  requestPayout: (
    affiliateId: string,
    amount: number,
    paymentMethod: PaymentMethodType,
    paymentDetails: AffiliatePaymentDetails
  ) => { success: boolean; payoutId?: string; message: string };
  approvePayout: (payoutId: string) => void;
  markPayoutPaid: (payoutId: string, transactionReference: string, adminNotes?: string) => void;
  rejectPayout: (payoutId: string, reason: string) => void;

  // Settings
  updateAffiliateSettings: (updates: Partial<AffiliateSettings>) => void;
  updatePackageAffiliateSetting: (packageId: string, updates: Partial<PackageAffiliateSetting>) => void;

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (affiliateId: string) => void;
  unreadNotificationsCount: number;
}

const STORAGE_KEYS = {
  CURRENT_AFFILIATE_ID: 'bc_affiliate_current_id_v2',
  AFFILIATES: 'bc_affiliates_list_v2',
  REFERRALS: 'bc_affiliate_referrals_v2',
  SALES: 'bc_affiliate_sales_v2',
  PAYOUTS: 'bc_affiliate_payouts_v2',
  NOTIFICATIONS: 'bc_affiliate_notifications_v2',
  SETTINGS: 'bc_affiliate_settings_v2',
  PACKAGE_SETTINGS: 'bc_affiliate_pkg_settings_v2',
  ATTRIBUTION_CODE: 'bc_referral_attribution_v2',
};

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

// Helper to generate clean unique referral codes (e.g. BC-K7M29 or BC-NAME)
export function generateUniqueReferralCode(fullName: string, existingCodes: string[]): string {
  const cleanName = fullName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5);
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  let candidate = cleanName ? `BC-${cleanName}${randomChars.slice(0, 3)}` : `BC-${randomChars}`;
  
  // Ensure uniqueness
  let counter = 1;
  while (existingCodes.map((c) => c.toUpperCase()).includes(candidate.toUpperCase())) {
    candidate = `BC-${cleanName || 'MATH'}${Math.floor(100 + Math.random() * 900)}`;
    counter++;
    if (counter > 20) {
      candidate = `BCX${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      break;
    }
  }
  return candidate;
}

export const AffiliateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { packages } = useAdminStore();

  const [affiliates, setAffiliates] = useState<AffiliateProfile[]>(() =>
    loadStorage(STORAGE_KEYS.AFFILIATES, INITIAL_AFFILIATES)
  );

  const [referrals, setReferrals] = useState<AffiliateReferral[]>(() =>
    loadStorage(STORAGE_KEYS.REFERRALS, INITIAL_AFFILIATE_REFERRALS)
  );

  const [sales, setSales] = useState<AffiliateSale[]>(() =>
    loadStorage(STORAGE_KEYS.SALES, INITIAL_AFFILIATE_SALES)
  );

  const [payouts, setPayouts] = useState<AffiliatePayout[]>(() =>
    loadStorage(STORAGE_KEYS.PAYOUTS, INITIAL_AFFILIATE_PAYOUTS)
  );

  const [notifications, setNotifications] = useState<AffiliateNotification[]>(() =>
    loadStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_AFFILIATE_NOTIFICATIONS)
  );

  const [settings, setSettings] = useState<AffiliateSettings>(() =>
    loadStorage(STORAGE_KEYS.SETTINGS, INITIAL_AFFILIATE_SETTINGS)
  );

  const [packageSettings, setPackageSettings] = useState<PackageAffiliateSetting[]>(() =>
    loadStorage(STORAGE_KEYS.PACKAGE_SETTINGS, INITIAL_PACKAGE_AFFILIATE_SETTINGS)
  );

  const [currentAffiliateId, setCurrentAffiliateId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_AFFILIATE_ID);
    return saved !== null ? saved : 'aff_1'; // Default to Hardik Kabra (Approved)
  });

  const [activeAttributedCode, setActiveAttributedCode] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ATTRIBUTION_CODE);
  });

  // First-party URL Referral Code Capture on Mount (e.g. ?ref=BC-HARDIK10 or ?ref=BCX7K29)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref') || urlParams.get('referral');
      if (refParam) {
        const cleanRef = refParam.trim().toUpperCase();
        // Check if referral code belongs to an active, approved affiliate
        const matchedAffiliate = affiliates.find(
          (a) => a.referralCode.toUpperCase() === cleanRef && a.status === 'approved'
        );

        if (matchedAffiliate) {
          localStorage.setItem(STORAGE_KEYS.ATTRIBUTION_CODE, cleanRef);
          setActiveAttributedCode(cleanRef);

          // Increment click and track referral event
          setAffiliates((prev) =>
            prev.map((a) =>
              a.id === matchedAffiliate.id ? { ...a, totalClicks: (a.totalClicks || 0) + 1 } : a
            )
          );

          // Record click referral
          const visitorId = `vis_${Math.random().toString(36).substring(2, 9)}`;
          const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
          const newReferral: AffiliateReferral = {
            id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 4)}`,
            affiliateId: matchedAffiliate.id,
            visitorId,
            referralCode: cleanRef,
            firstClickedAt: nowStr,
            status: 'clicked',
            createdAt: nowStr,
          };
          setReferrals((prev) => [newReferral, ...prev]);
        }
      }
    } catch {
      // safe fallback
    }
  }, [affiliates]);

  // Persistence Hooks
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AFFILIATES, JSON.stringify(affiliates)); }, [affiliates]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals)); }, [referrals]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts)); }, [payouts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PACKAGE_SETTINGS, JSON.stringify(packageSettings)); }, [packageSettings]);

  useEffect(() => {
    if (currentAffiliateId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_AFFILIATE_ID, currentAffiliateId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_AFFILIATE_ID);
    }
  }, [currentAffiliateId]);

  useEffect(() => {
    if (activeAttributedCode) {
      localStorage.setItem(STORAGE_KEYS.ATTRIBUTION_CODE, activeAttributedCode);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ATTRIBUTION_CODE);
    }
  }, [activeAttributedCode]);

  const clearAttributedCode = useCallback(() => {
    setActiveAttributedCode(null);
    localStorage.removeItem(STORAGE_KEYS.ATTRIBUTION_CODE);
  }, []);

  const setManualReferralCode = useCallback((code: string) => {
    const clean = code.trim().toUpperCase();
    setActiveAttributedCode(clean);
    localStorage.setItem(STORAGE_KEYS.ATTRIBUTION_CODE, clean);
  }, []);

  // Current active affiliate object
  const currentAffiliate = useMemo(() => {
    if (!currentAffiliateId) return null;
    return affiliates.find((a) => a.id === currentAffiliateId) || null;
  }, [affiliates, currentAffiliateId]);

  const switchAffiliate = useCallback((affiliateId: string) => {
    const found = affiliates.find((a) => a.id === affiliateId);
    if (found) {
      setCurrentAffiliateId(found.id);
    }
  }, [affiliates]);

  // Compute live dynamic stats for the active affiliate
  const currentAffiliateStats = useMemo<AffiliateStatsSummary>(() => {
    if (!currentAffiliate) {
      return {
        totalReferrals: 0,
        successfulSales: 0,
        totalSalesValue: 0,
        totalCommission: 0,
        pendingCommission: 0,
        availableForPayout: 0,
        paidCommission: 0,
        totalDiscountsGiven: 0,
        conversionRate: 0,
        totalClicks: 0,
      };
    }

    const affReferrals = referrals.filter((r) => r.affiliateId === currentAffiliate.id);
    const affSales = sales.filter((s) => s.affiliateId === currentAffiliate.id);
    const validSales = affSales.filter((s) => s.status !== 'cancelled' && s.status !== 'reversed');

    const totalReferrals = affReferrals.length;
    const successfulSales = validSales.length;
    const totalSalesValue = validSales.reduce((sum, s) => sum + s.originalAmount, 0);
    const totalDiscountsGiven = validSales.reduce((sum, s) => sum + s.discountAmount, 0);

    const totalCommission = validSales.reduce((sum, s) => sum + s.commissionAmount, 0);
    const pendingCommission = affSales
      .filter((s) => s.status === 'pending')
      .reduce((sum, s) => sum + s.commissionAmount, 0);

    // Available for payout = approved / payable commissions that haven't been paid yet, minus active payout requests
    const payableCommission = affSales
      .filter((s) => s.status === 'approved' || s.status === 'payable')
      .reduce((sum, s) => sum + s.commissionAmount, 0);

    const paidCommission = affSales
      .filter((s) => s.status === 'paid')
      .reduce((sum, s) => sum + s.commissionAmount, 0);

    const pendingPayoutsAmount = payouts
      .filter((p) => p.affiliateId === currentAffiliate.id && (p.status === 'requested' || p.status === 'processing'))
      .reduce((sum, p) => sum + p.amount, 0);

    const availableForPayout = Math.max(0, payableCommission - pendingPayoutsAmount);

    const totalClicks = currentAffiliate.totalClicks || totalReferrals * 3 || 1;
    const conversionRate = totalClicks > 0 ? (successfulSales / totalClicks) * 100 : 0;

    return {
      totalReferrals,
      successfulSales,
      totalSalesValue: Math.round(totalSalesValue * 100) / 100,
      totalCommission: Math.round(totalCommission * 100) / 100,
      pendingCommission: Math.round(pendingCommission * 100) / 100,
      availableForPayout: Math.round(availableForPayout * 100) / 100,
      paidCommission: Math.round(paidCommission * 100) / 100,
      totalDiscountsGiven: Math.round(totalDiscountsGiven * 100) / 100,
      conversionRate: Math.round(conversionRate * 10) / 10,
      totalClicks,
    };
  }, [currentAffiliate, referrals, sales, payouts]);

  // Notifications for current affiliate
  const unreadNotificationsCount = useMemo(() => {
    if (!currentAffiliate) return 0;
    return notifications.filter((n) => n.affiliateId === currentAffiliate.id && !n.isRead).length;
  }, [currentAffiliate, notifications]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback((affiliateId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.affiliateId === affiliateId ? { ...n, isRead: true } : n))
    );
  }, []);

  // Affiliate Registration (Status: Pending)
  const registerAffiliate = useCallback(
    (data: {
      fullName: string;
      email: string;
      mobile: string;
      city: string;
      country: string;
      paymentMethod: PaymentMethodType;
      paymentDetails: AffiliatePaymentDetails;
      applicationReason: string;
      websiteOrSocial?: string;
    }) => {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newId = `aff_${Date.now()}`;
      
      const newAffiliate: AffiliateProfile = {
        id: newId,
        userId: `user_${Date.now()}`,
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        mobile: data.mobile.trim(),
        city: data.city.trim(),
        country: data.country.trim() || 'India',
        status: 'pending',
        referralCode: '',
        referralLink: '',
        paymentMethod: data.paymentMethod,
        paymentDetails: data.paymentDetails,
        applicationReason: data.applicationReason,
        websiteOrSocial: data.websiteOrSocial,
        createdAt: nowStr,
        updatedAt: nowStr,
        totalClicks: 0,
      };

      setAffiliates((prev) => [newAffiliate, ...prev]);
      setCurrentAffiliateId(newId);

      // Add system notification for applicant
      const notif: AffiliateNotification = {
        id: `notif_${Date.now()}`,
        affiliateId: newId,
        title: 'Application Submitted Successfully',
        message: 'Your affiliate application is under review by our admin team. You will be notified upon approval.',
        type: 'system',
        isRead: false,
        createdAt: nowStr,
      };
      setNotifications((prev) => [notif, ...prev]);

      return {
        success: true,
        affiliateId: newId,
        message: 'Your affiliate application has been submitted successfully.',
      };
    },
    []
  );

  const updateAffiliateProfile = useCallback((id: string, updates: Partial<AffiliateProfile>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAffiliates((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: nowStr } : a))
    );
  }, []);

  // Admin Action: Approve Application
  const approveAffiliate = useCallback(
    (id: string, customCode?: string) => {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setAffiliates((prev) => {
        const target = prev.find((a) => a.id === id);
        if (!target) return prev;

        const existingCodes = prev.map((a) => a.referralCode).filter(Boolean);
        const code = customCode?.trim().toUpperCase() || generateUniqueReferralCode(target.fullName, existingCodes);
        const referralLink = `https://beyondclassroom.in/?ref=${code}`;

        return prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'approved',
                referralCode: code,
                referralLink,
                approvedBy: 'Admin Team',
                approvedAt: nowStr,
                updatedAt: nowStr,
              }
            : a
        );
      });

      // Send approval notification
      const notif: AffiliateNotification = {
        id: `notif_${Date.now()}`,
        affiliateId: id,
        title: '🎉 Affiliate Application Approved!',
        message: 'Your affiliate application has been approved. Your unique referral code and dashboard are now live.',
        type: 'approval',
        isRead: false,
        createdAt: nowStr,
      };
      setNotifications((prev) => [notif, ...prev]);
    },
    []
  );

  // Admin Action: Reject Application
  const rejectAffiliate = useCallback((id: string, reason: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAffiliates((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'rejected',
              rejectionReason: reason,
              updatedAt: nowStr,
            }
          : a
      )
    );

    const notif: AffiliateNotification = {
      id: `notif_${Date.now()}`,
      affiliateId: id,
      title: 'Affiliate Application Update',
      message: `Your affiliate application was not approved. Reason: ${reason}`,
      type: 'rejection',
      isRead: false,
      createdAt: nowStr,
    };
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  // Admin Action: Suspend Affiliate
  const suspendAffiliate = useCallback((id: string, reason: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAffiliates((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'suspended',
              suspensionReason: reason,
              updatedAt: nowStr,
            }
          : a
      )
    );

    const notif: AffiliateNotification = {
      id: `notif_${Date.now()}`,
      affiliateId: id,
      title: '⚠️ Affiliate Account Suspended',
      message: `Your affiliate account has been temporarily suspended. Reason: ${reason}`,
      type: 'suspension',
      isRead: false,
      createdAt: nowStr,
    };
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  // Admin Action: Reactivate Suspended
  const reactivateAffiliate = useCallback((id: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAffiliates((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'approved',
              suspensionReason: undefined,
              updatedAt: nowStr,
            }
          : a
      )
    );

    const notif: AffiliateNotification = {
      id: `notif_${Date.now()}`,
      affiliateId: id,
      title: '✅ Affiliate Account Reactivated',
      message: 'Your affiliate account has been reactivated. Referral tracking and commissions are active again.',
      type: 'system',
      isRead: false,
      createdAt: nowStr,
    };
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  // Admin Action: Disable Affiliate
  const disableAffiliate = useCallback((id: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAffiliates((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'disabled', updatedAt: nowStr } : a))
    );
  }, []);

  // Admin Action: Custom Rates
  const updateAffiliateCustomRates = useCallback(
    (id: string, customDiscountPct?: number, customCommissionPct?: number) => {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setAffiliates((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                customDiscountPercentage: customDiscountPct,
                customCommissionPercentage: customCommissionPct,
                updatedAt: nowStr,
              }
            : a
        )
      );
    },
    []
  );

  // Backend Referral Code Validation & Calculation Engine
  const validateReferralCode = useCallback(
    (
      code: string,
      packagePrice: number,
      packageId?: string,
      studentEmail?: string
    ): ReferralValidationResult => {
      if (!code || !code.trim()) {
        return {
          valid: false,
          code: '',
          discountPercentage: 0,
          discountAmount: 0,
          finalAmount: packagePrice,
          commissionPercentage: 0,
          commissionAmount: 0,
          message: 'Please enter a referral code.',
        };
      }

      if (!settings.programEnabled) {
        return {
          valid: false,
          code,
          discountPercentage: 0,
          discountAmount: 0,
          finalAmount: packagePrice,
          commissionPercentage: 0,
          commissionAmount: 0,
          message: 'The affiliate & referral program is currently disabled.',
        };
      }

      const cleanCode = code.trim().toUpperCase();
      const affiliate = affiliates.find(
        (a) => a.referralCode.toUpperCase() === cleanCode
      );

      if (!affiliate) {
        return {
          valid: false,
          code: cleanCode,
          discountPercentage: 0,
          discountAmount: 0,
          finalAmount: packagePrice,
          commissionPercentage: 0,
          commissionAmount: 0,
          message: 'Invalid referral code. Please check and try again.',
        };
      }

      if (affiliate.status !== 'approved') {
        let msg = 'This referral code is not active.';
        if (affiliate.status === 'suspended') msg = 'This referral partner account is currently suspended.';
        if (affiliate.status === 'disabled') msg = 'This referral code has been disabled.';
        if (affiliate.status === 'pending') msg = 'This referral code is awaiting admin approval.';

        return {
          valid: false,
          code: cleanCode,
          discountPercentage: 0,
          discountAmount: 0,
          finalAmount: packagePrice,
          commissionPercentage: 0,
          commissionAmount: 0,
          message: msg,
        };
      }

      // Self-referral protection check
      if (studentEmail && affiliate.email.toLowerCase() === studentEmail.toLowerCase()) {
        return {
          valid: false,
          code: cleanCode,
          discountPercentage: 0,
          discountAmount: 0,
          finalAmount: packagePrice,
          commissionPercentage: 0,
          commissionAmount: 0,
          isSelfReferral: true,
          message: 'Self-referral is not permitted. You cannot use your own affiliate referral code.',
        };
      }

      // Package-specific checks
      let discountPct = affiliate.customDiscountPercentage ?? settings.globalDiscountPercentage;
      let commissionPct = affiliate.customCommissionPercentage ?? settings.globalCommissionPercentage;

      if (packageId) {
        const pkgSetting = packageSettings.find((p) => p.packageId === packageId);
        if (pkgSetting) {
          if (!pkgSetting.enabled) {
            return {
              valid: false,
              code: cleanCode,
              discountPercentage: 0,
              discountAmount: 0,
              finalAmount: packagePrice,
              commissionPercentage: 0,
              commissionAmount: 0,
              message: 'Referral discounts are not available for this selected package.',
            };
          }
          if (pkgSetting.discountPercentage !== undefined) {
            discountPct = pkgSetting.discountPercentage;
          }
          if (pkgSetting.commissionPercentage !== undefined) {
            commissionPct = pkgSetting.commissionPercentage;
          }
        }
      }

      const discountAmount = Math.round((packagePrice * (discountPct / 100)) * 100) / 100;
      const finalAmount = Math.max(0, Math.round((packagePrice - discountAmount) * 100) / 100);

      // Commission Base Calculation
      const commissionBase = settings.commissionCalculationBasis === 'final_paid' ? finalAmount : packagePrice;
      const commissionAmount = Math.round((commissionBase * (commissionPct / 100)) * 100) / 100;

      return {
        valid: true,
        code: cleanCode,
        affiliateId: affiliate.id,
        affiliateName: affiliate.fullName,
        discountPercentage: discountPct,
        discountAmount,
        finalAmount,
        commissionPercentage: commissionPct,
        commissionAmount,
        message: `✓ Referral code applied! You received a ${discountPct}% discount.`,
      };
    },
    [affiliates, settings, packageSettings]
  );

  // Idempotent Sale & Commission Recording on Verified Payment
  const recordReferralSaleOnPayment = useCallback(
    (data: {
      studentId: string;
      studentName: string;
      studentEmail: string;
      packageId: string;
      packageName: string;
      classId: string;
      className: string;
      originalPrice: number;
      paidAmount: number;
      purchaseId: string;
      referralCode?: string;
    }) => {
      const codeToUse = data.referralCode || activeAttributedCode;
      if (!codeToUse) {
        return { recorded: false, message: 'No referral code attributed.' };
      }

      // Idempotency: Check if sale already created for this purchaseId
      const existingSale = sales.find((s) => s.purchaseId === data.purchaseId);
      if (existingSale) {
        return {
          recorded: false,
          sale: existingSale,
          message: 'Sale for this purchase is already recorded.',
        };
      }

      const validation = validateReferralCode(
        codeToUse,
        data.originalPrice,
        data.packageId,
        data.studentEmail
      );

      if (!validation.valid || !validation.affiliateId) {
        return { recorded: false, message: validation.message };
      }

      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const saleId = `sale_${Date.now()}`;

      // Mask student name and email for privacy
      const nameParts = data.studentName.trim().split(' ');
      const maskedName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1].charAt(0)}.` : data.studentName;
      const emailParts = data.studentEmail.split('@');
      const maskedEmail = emailParts.length === 2 ? `${emailParts[0].slice(0, 3)}***@${emailParts[1]}` : data.studentEmail;

      const newSale: AffiliateSale = {
        id: saleId,
        affiliateId: validation.affiliateId,
        studentId: data.studentId,
        studentName: maskedName,
        studentEmail: maskedEmail,
        purchaseId: data.purchaseId,
        packageId: data.packageId,
        packageName: data.packageName,
        classId: data.classId,
        className: data.className,
        originalAmount: data.originalPrice,
        discountPercentage: validation.discountPercentage,
        discountAmount: validation.discountAmount,
        finalAmount: data.paidAmount || validation.finalAmount,
        commissionPercentage: validation.commissionPercentage,
        commissionBase: settings.commissionCalculationBasis,
        commissionAmount: validation.commissionAmount,
        paymentStatus: 'successful',
        status: 'approved', // Auto approved on verified payment
        createdAt: nowStr,
      };

      setSales((prev) => [newSale, ...prev]);

      // Update or create referral record
      setReferrals((prev) => {
        const existingRefIndex = prev.findIndex(
          (r) => r.affiliateId === validation.affiliateId && (r.studentId === data.studentId || r.studentEmail === maskedEmail)
        );

        if (existingRefIndex >= 0) {
          const updated = [...prev];
          updated[existingRefIndex] = {
            ...updated[existingRefIndex],
            status: 'converted',
            convertedAt: nowStr,
            studentClass: data.className,
          };
          return updated;
        }

        const newRef: AffiliateReferral = {
          id: `ref_${Date.now()}`,
          affiliateId: validation.affiliateId!,
          visitorId: `vis_${Date.now()}`,
          studentId: data.studentId,
          studentName: maskedName,
          studentEmail: maskedEmail,
          studentClass: data.className,
          referralCode: validation.code,
          firstClickedAt: nowStr,
          registeredAt: nowStr,
          convertedAt: nowStr,
          status: 'converted',
          createdAt: nowStr,
        };
        return [newRef, ...prev];
      });

      // Send real-time notification to the affiliate
      const notif: AffiliateNotification = {
        id: `notif_${Date.now()}`,
        affiliateId: validation.affiliateId,
        title: `💰 New Referral Sale: ${data.packageName}`,
        message: `A student (${maskedName}) purchased ${data.packageName} using your referral code ${validation.code}. You earned ₹${validation.commissionAmount.toFixed(2)} commission!`,
        type: 'sale',
        isRead: false,
        createdAt: nowStr,
      };
      setNotifications((prev) => [notif, ...prev]);

      return {
        recorded: true,
        sale: newSale,
        message: `Referral sale recorded with ₹${validation.commissionAmount} commission for affiliate.`,
      };
    },
    [activeAttributedCode, sales, validateReferralCode, settings]
  );

  // Commission Actions
  const approveCommission = useCallback((saleId: string) => {
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: 'approved' } : s))
    );
  }, []);

  const reverseCommission = useCallback((saleId: string, reason: string) => {
    setSales((prev) =>
      prev.map((s) =>
        s.id === saleId
          ? {
              ...s,
              status: 'reversed',
              reversalReason: reason,
            }
          : s
      )
    );

    const sale = sales.find((s) => s.id === saleId);
    if (sale) {
      const notif: AffiliateNotification = {
        id: `notif_${Date.now()}`,
        affiliateId: sale.affiliateId,
        title: 'Commission Reversed',
        message: `Commission of ₹${sale.commissionAmount.toFixed(2)} on sale #${sale.id} was reversed. Reason: ${reason}`,
        type: 'system',
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  }, [sales]);

  const markCommissionAsPaid = useCallback((saleId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: 'paid', paidAt: nowStr } : s))
    );
  }, []);

  // Payout Actions
  const requestPayout = useCallback(
    (
      affiliateId: string,
      amount: number,
      paymentMethod: PaymentMethodType,
      paymentDetails: AffiliatePaymentDetails
    ) => {
      const affiliate = affiliates.find((a) => a.id === affiliateId);
      if (!affiliate) return { success: false, message: 'Affiliate not found.' };

      if (amount < settings.minimumPayout) {
        return {
          success: false,
          message: `Minimum payout threshold is ₹${settings.minimumPayout}. Your requested amount is ₹${amount}.`,
        };
      }

      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const payoutId = `payout_${Date.now()}`;

      const newPayout: AffiliatePayout = {
        id: payoutId,
        affiliateId,
        affiliateName: affiliate.fullName,
        affiliateEmail: affiliate.email,
        amount,
        paymentMethod,
        paymentDetails,
        status: 'requested',
        requestedAt: nowStr,
        createdAt: nowStr,
      };

      setPayouts((prev) => [newPayout, ...prev]);

      const notif: AffiliateNotification = {
        id: `notif_${Date.now()}`,
        affiliateId,
        title: 'Payout Request Submitted',
        message: `Your payout request #${payoutId} for ₹${amount.toFixed(2)} has been received and is being processed.`,
        type: 'payout',
        isRead: false,
        createdAt: nowStr,
      };
      setNotifications((prev) => [notif, ...prev]);

      return {
        success: true,
        payoutId,
        message: `Payout request of ₹${amount} submitted successfully.`,
      };
    },
    [affiliates, settings]
  );

  const approvePayout = useCallback((payoutId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: 'approved',
              approvedAt: nowStr,
            }
          : p
      )
    );
  }, []);

  const markPayoutPaid = useCallback(
    (payoutId: string, transactionReference: string, adminNotes?: string) => {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      let targetAffiliateId = '';
      let targetAmount = 0;

      setPayouts((prev) =>
        prev.map((p) => {
          if (p.id === payoutId) {
            targetAffiliateId = p.affiliateId;
            targetAmount = p.amount;
            return {
              ...p,
              status: 'paid',
              paidAt: nowStr,
              transactionReference,
              adminNotes,
            };
          }
          return p;
        })
      );

      // Also mark oldest approved commissions for this affiliate as paid up to targetAmount
      if (targetAffiliateId) {
        let remainingToMark = targetAmount;
        setSales((prev) =>
          prev.map((s) => {
            if (s.affiliateId === targetAffiliateId && s.status === 'approved' && remainingToMark > 0) {
              remainingToMark -= s.commissionAmount;
              return { ...s, status: 'paid', paidAt: nowStr };
            }
            return s;
          })
        );

        const notif: AffiliateNotification = {
          id: `notif_${Date.now()}`,
          affiliateId: targetAffiliateId,
          title: '✅ Payout Transferred Successfully',
          message: `Payout of ₹${targetAmount.toFixed(2)} has been transferred. Transaction Reference: ${transactionReference}`,
          type: 'payout',
          isRead: false,
          createdAt: nowStr,
        };
        setNotifications((prev) => [notif, ...prev]);
      }
    },
    []
  );

  const rejectPayout = useCallback((payoutId: string, reason: string) => {
    let targetAffiliateId = '';
    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id === payoutId) {
          targetAffiliateId = p.affiliateId;
          return {
            ...p,
            status: 'rejected',
            adminNotes: reason,
          };
        }
        return p;
      })
    );

    if (targetAffiliateId) {
      const notif: AffiliateNotification = {
        id: `notif_${Date.now()}`,
        affiliateId: targetAffiliateId,
        title: 'Payout Request Rejected',
        message: `Your payout request #${payoutId} could not be processed. Reason: ${reason}`,
        type: 'payout',
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  }, []);

  // Settings
  const updateAffiliateSettings = useCallback((updates: Partial<AffiliateSettings>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSettings((prev) => ({ ...prev, ...updates, updatedAt: nowStr }));
  }, []);

  const updatePackageAffiliateSetting = useCallback(
    (packageId: string, updates: Partial<PackageAffiliateSetting>) => {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setPackageSettings((prev) =>
        prev.map((p) => (p.packageId === packageId ? { ...p, ...updates, updatedAt: nowStr } : p))
      );
    },
    []
  );

  return (
    <AffiliateContext.Provider
      value={{
        currentAffiliate,
        currentAffiliateId,
        setCurrentAffiliateId,
        switchAffiliate,
        affiliates,
        referrals,
        sales,
        payouts,
        notifications,
        settings,
        packageSettings,
        activeAttributedCode,
        clearAttributedCode,
        setManualReferralCode,
        currentAffiliateStats,
        registerAffiliate,
        updateAffiliateProfile,
        approveAffiliate,
        rejectAffiliate,
        suspendAffiliate,
        reactivateAffiliate,
        disableAffiliate,
        updateAffiliateCustomRates,
        validateReferralCode,
        recordReferralSaleOnPayment,
        approveCommission,
        reverseCommission,
        markCommissionAsPaid,
        requestPayout,
        approvePayout,
        markPayoutPaid,
        rejectPayout,
        updateAffiliateSettings,
        updatePackageAffiliateSetting,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
      }}
    >
      {children}
    </AffiliateContext.Provider>
  );
};

export const useAffiliate = () => {
  const context = useContext(AffiliateContext);
  if (!context) {
    throw new Error('useAffiliate must be used within an AffiliateProvider');
  }
  return context;
};
