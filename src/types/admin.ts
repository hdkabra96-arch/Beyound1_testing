export type AdminRole = 'super_admin' | 'content_admin' | 'support_admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  isEnabled: boolean;
  twoFactorEnabled: boolean;
  lastLogin: string;
  createdAt?: string;
  permissions?: string[];
}

export type AccountStatus = 'active' | 'disabled' | 'suspended';
export type PackageStatus = 'active' | 'expired' | 'pending' | 'cancelled';
export type PaymentStatus = 'successful' | 'paid' | 'pending' | 'failed' | 'refunded' | 'cancelled';

export interface StudentContentOverrides {
  disabledSubjectIds?: string[];
  disabledChapterIds?: string[];
  disabledContentIds?: string[];
  extraAllowedClassIds?: string[];
  extraAllowedChapterIds?: string[];
  extraAllowedContentIds?: string[];
  downloadsDisabled?: boolean;
  customPaperGenerationDisabled?: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  mobile: string;
  classId: string;
  board: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge';
  packageId: string;
  packageName: string;
  packageStatus: PackageStatus;
  purchaseDate: string;
  expiryDate: string;
  paymentStatus: PaymentStatus;
  accountStatus: AccountStatus;
  lastLogin: string;
  customPaperCountUsed: number;
  customPaperLimit: number;
  accessOverrides?: StudentContentOverrides;
  createdAt: string;
}

export interface AcademicClass {
  id: string;
  gradeNumber: number;
  name: string;
  shortName: string;
  isEnabled: boolean;
  sortOrder: number;
  description: string;
  enrolledStudentsCount?: number;
  subjectsCount?: number;
  chaptersCount?: number;
  practicePapersCount?: number;
}

export interface AcademicSubject {
  id: string;
  classId: string;
  name: string;
  code: string;
  isEnabled: boolean;
  sortOrder: number;
  description?: string;
}

export interface AcademicChapter {
  id: string;
  classId: string;
  subjectId: string;
  chapterNumber: number;
  title: string;
  description: string;
  isEnabled: boolean;
  sortOrder: number;
}

export type ContentType =
  | 'notes'
  | 'practice_paper'
  | 'question_bank'
  | 'mcq'
  | 'flash_cards'
  | 'flashcard'
  | 'previous_papers'
  | 'previous_paper'
  | 'solution'
  | 'pdf';

export type AccessType = 'public' | 'free' | 'paid' | 'package_restricted' | 'class_restricted';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'olympiad' | 'basic';

export interface EducationalContent {
  id: string;
  class_id: string;
  subject_id: string;
  chapter_id: string;
  content_type: ContentType;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  access_type: AccessType;
  package_ids: string[];
  is_published: boolean;
  is_enabled: boolean;
  time_limit_minutes: number;
  total_marks: number;
  question_count: number;
  pdf_url?: string;
  has_answer_key?: boolean;
  has_step_by_step_solutions?: boolean;
  has_hints?: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PackageFeatureMatrix {
  allCurriculumAccess: boolean;
  practicePapers: boolean;
  detailedStepSolutions: boolean;
  pdfDownload: boolean;
  mcqs: boolean;
  flashCards: boolean;
  customPapers: boolean;
  aiFeatures: boolean;
  analyticsDashboard: boolean;
  teacherBranding: boolean;
  batchManagement: boolean;
  prioritySupport: boolean;
  [key: string]: boolean;
}

export interface PackageItem {
  id: string;
  code: string;
  name: string;
  priceINR: number;
  priceUSD: number;
  validityDays: number;
  eligibleClassIds: string[];
  description: string;
  isEnabled: boolean;
  practicePaperLimit: number;
  customPaperLimit: number; // e.g. -1 for unlimited
  features: PackageFeatureMatrix;
  targetAudience: string;
}

export interface PaymentTransaction {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentMobile?: string;
  orderId: string;
  packageId: string;
  packageName: string;
  classId: string;
  amount: number;
  currency: string;
  paymentGateway: 'Razorpay' | 'Stripe' | 'UPI' | 'Manual/Admin' | 'Manual Offline';
  paymentMethod?: string;
  status: PaymentStatus;
  paymentDate: string;
  transactionId: string;
  packageActivationDate: string;
  packageExpiryDate: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
}

export interface DashboardFeatureConfig {
  practicePapers: boolean;
  questionBank: boolean;
  mcqs: boolean;
  flashCards: boolean;
  notes: boolean;
  previousPapers: boolean;
  solutions: boolean;
  progress: boolean;
  reports: boolean;
  downloads: boolean;
  customPracticePaper: boolean;
  notifications: boolean;
  announcements: boolean;
  aiTutor: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'class' | 'package' | 'teachers';
  targetClassId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isPublished: boolean;
  publishDate: string;
  author: string;
}

export interface NotificationItem {
  id: string;
  studentId?: string;
  targetType?: 'all' | 'class' | 'package' | 'student';
  targetId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert' | 'billing' | 'system' | 'academic' | 'content';
  isRead: boolean;
  date?: string;
  createdAt?: string;
}

export interface GlobalWebsiteSettings {
  siteName: string;
  siteTagline: string;
  metaDescription: string;
  supportEmail: string;
  supportPhone: string;
  supportAddress: string;
  maintenanceMode: {
    isEnabled: boolean;
    title: string;
    message: string;
    expectedAvailability: string;
  };
}

export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  entity?: string;
  module?: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export type AdminActiveSection =
  | 'dashboard'
  | 'students-all'
  | 'students-active'
  | 'students-expired'
  | 'students-access-control'
  | 'content-classes'
  | 'content-subjects'
  | 'content-chapters'
  | 'content-practice-papers'
  | 'content-question-bank'
  | 'content-mcqs'
  | 'content-flash-cards'
  | 'content-notes'
  | 'content-previous-papers'
  | 'content-pdfs'
  | 'packages-all'
  | 'packages-features'
  | 'packages-rules'
  | 'payments-transactions'
  | 'payments-successful'
  | 'payments-pending'
  | 'payments-failed'
  | 'payments-refunds'
  | 'website-home'
  | 'website-about'
  | 'website-team'
  | 'website-packages'
  | 'website-contact'
  | 'website-global'
  | 'dashboard-features'
  | 'announcements-list'
  | 'announcements-notifications'
  | 'communication-announcements'
  | 'communication-notifications'
  | 'reports-performance'
  | 'reports-sales'
  | 'reports-revenue'
  | 'reports-students'
  | 'reports-packages'
  | 'reports-content'
  | 'admins-all'
  | 'admins-audit'
  | 'admin-users'
  | 'admin-roles'
  | 'admin-logs'
  | 'admin-settings';
