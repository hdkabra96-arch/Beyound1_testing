export type AffiliateStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'disabled';

export type PaymentMethodType = 'upi' | 'bank_transfer';

export interface AffiliatePaymentDetails {
  upiId?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
}

export interface AffiliateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  country: string;
  status: AffiliateStatus;
  referralCode: string;
  referralLink: string;
  paymentMethod: PaymentMethodType;
  paymentDetails: AffiliatePaymentDetails;
  applicationReason: string;
  websiteOrSocial?: string;
  rejectionReason?: string;
  suspensionReason?: string;
  customCommissionPercentage?: number; // Overrides global if set
  customDiscountPercentage?: number;   // Overrides global if set
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  totalClicks: number;
}

export type ReferralStatus = 'clicked' | 'registered' | 'converted';

export interface AffiliateReferral {
  id: string;
  affiliateId: string;
  visitorId: string;
  studentId?: string;
  studentName?: string; // e.g. "Rahul K." (masked for privacy)
  studentEmail?: string; // e.g. "rah***@gmail.com" (masked)
  studentClass?: string;
  referralCode: string;
  firstClickedAt: string;
  registeredAt?: string;
  convertedAt?: string;
  status: ReferralStatus;
  createdAt: string;
}

export type CommissionStatus = 'pending' | 'approved' | 'payable' | 'paid' | 'cancelled' | 'reversed';

export interface AffiliateSale {
  id: string;
  affiliateId: string;
  studentId: string;
  studentName: string; // masked in affiliate views
  studentEmail: string; // masked in affiliate views
  purchaseId: string;
  packageId: string;
  packageName: string;
  classId: string;
  className: string;
  originalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  finalAmount: number;
  commissionPercentage: number;
  commissionBase: 'original_price' | 'final_paid';
  commissionAmount: number;
  paymentStatus: 'successful' | 'refunded' | 'cancelled';
  status: CommissionStatus;
  reversalReason?: string;
  createdAt: string;
  paidAt?: string;
}

export type PayoutStatus = 'requested' | 'approved' | 'processing' | 'paid' | 'rejected';

export interface AffiliatePayout {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  paymentDetails: AffiliatePaymentDetails;
  status: PayoutStatus;
  requestedAt: string;
  approvedAt?: string;
  paidAt?: string;
  transactionReference?: string;
  adminNotes?: string;
  createdAt: string;
}

export type AffiliateNotificationType =
  | 'approval'
  | 'rejection'
  | 'registration'
  | 'sale'
  | 'commission'
  | 'payout'
  | 'system'
  | 'suspension';

export interface AffiliateNotification {
  id: string;
  affiliateId: string;
  title: string;
  message: string;
  type: AffiliateNotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface AffiliateSettings {
  id: string;
  globalDiscountPercentage: number; // default: 10
  globalCommissionPercentage: number; // default: 10
  commissionCalculationBasis: 'original_price' | 'final_paid'; // default: 'original_price'
  minimumPayout: number; // default: 500
  programEnabled: boolean; // default: true
  allowSelfReferral: boolean; // default: false
  updatedAt: string;
}

export interface PackageAffiliateSetting {
  id: string;
  packageId: string;
  packageName: string;
  enabled: boolean;
  discountPercentage?: number;
  commissionPercentage?: number;
  updatedAt: string;
}

export type AffiliateDashboardSection =
  | 'overview'
  | 'my-code'
  | 'referrals'
  | 'sales'
  | 'commission'
  | 'payouts'
  | 'analytics'
  | 'notifications'
  | 'profile'
  | 'help';

export interface AffiliateStatsSummary {
  totalReferrals: number;
  successfulSales: number;
  totalSalesValue: number;
  totalCommission: number;
  pendingCommission: number;
  availableForPayout: number;
  paidCommission: number;
  totalDiscountsGiven: number;
  conversionRate: number;
  totalClicks: number;
}
