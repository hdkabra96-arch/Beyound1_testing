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

export interface AcademicTopic {
  id: string;
  classId: string;
  subjectId: string;
  chapterId: string;
  title: string;
  description?: string;
  sortOrder: number;
  isEnabled: boolean;
  maxPdfLimit?: number; // default 30
  createdAt?: string;
}

export type PackageType = 'basic' | 'pro' | 'teachers' | 'school';

export type MaterialType =
  | 'Chapter PDF'
  | 'Notes'
  | 'NCERT Solution'
  | 'Question Bank'
  | 'Practice Paper'
  | 'Previous Year Paper'
  | 'MCQ'
  | 'Worksheet'
  | 'Assignment'
  | 'Study Material'
  | 'Reference Material'
  | 'Other';

export type BoardType = 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge' | 'Olympiad';
export type MediumType = 'English' | 'Hindi' | 'Bilingual' | 'Regional';
export type MaterialStatus = 'draft' | 'published' | 'archived';

export interface BasicPackageMetadata {
  packageAccess: 'free' | 'basic_only' | 'public_preview';
  viewOnline: boolean;
  downloadAllowed: boolean;
  downloadLimit: number; // -1 for unlimited
  printAllowed: boolean;
}

export interface ProPackageMetadata {
  detailedDescription: string;
  learningObjective: string;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'olympiad';
  estimatedStudyTime: string;
  tags: string[];
  keywords: string;
  prerequisiteTopic?: string;
  relatedMaterials?: string;
  solutionAvailable: boolean;
  answerKeyAvailable: boolean;
  packageAccess: 'pro_only' | 'basic_pro' | 'public_preview';
  viewOnline: boolean;
  downloadAllowed: boolean;
  printAllowed: boolean;
  downloadLimit: number;
  watermarkEnabled: boolean;
  watermarkText?: string;
  expiryDate?: string;
}

export interface TeacherPackageMetadata {
  teachingNotes: string;
  lessonPlan: string;
  teachingDuration: string;
  learningObjectives: string;
  teachingMethod: 'Interactive Discussion' | 'Hands-on Activity' | 'Direct Instruction' | 'Flipped Classroom' | 'Problem Solving' | 'Other';
  requiredResources: string;
  homeworkAssignment: string;
  answerKey: boolean;
  answerKeyNotes: string;
  teacherInstructions: string;
  evaluationNotes: string;
  packageAccess: 'teacher_only' | 'teacher_admin' | 'selected_teachers';
  selectedTeacherIds: string[];
  viewAllowed: boolean;
  downloadAllowed: boolean;
  printAllowed: boolean;
  shareAllowed: boolean;
  copyAllowed: boolean;
  expiryDate?: string;
}

export interface SchoolPackageMetadata {
  institutionName: string;
  institutionId: string;
  institutionType: 'K-12 School' | 'Coaching Institute' | 'Group of Schools' | 'Franchise Academy' | 'Independent School';
  branch: string;
  academicYear: string;
  department: string;
  divisionSection: string;
  learningObjective: string;
  instructions: string;
  assessmentInfo: string;
  institutionAccess: 'all_institutions' | 'selected_institution' | 'selected_branch' | 'selected_class' | 'selected_section' | 'selected_teachers' | 'selected_students';
  selectedInstitutions?: string[];
  selectedBranches?: string[];
  selectedSections?: string[];
  selectedTeachers?: string[];
  selectedStudents?: string[];
}

export interface PackageMaterial {
  id: string;
  package_type: PackageType;
  class_id: string;
  subject_id: string;
  chapter_id: string;
  topic_id: string;
  subtopic_id?: string;
  subtopic_title?: string;
  academic_year: string;
  board: BoardType;
  medium: MediumType;
  material_type: MaterialType;
  title: string;
  description: string;
  file_url: string;
  thumbnail_url?: string;
  file_name: string;
  file_size: string; // e.g. "2.4 MB"
  file_type: string; // e.g. "PDF", "DOCX", "PPTX", "ZIP"
  visibility: 'public' | 'package_only' | 'restricted' | 'private';
  access_level: string;
  download_allowed: boolean;
  download_limit: number;
  print_allowed: boolean;
  watermark_enabled: boolean;
  expiry_date?: string;
  institution_id?: string;
  branch_id?: string;
  teacher_id?: string;
  status: MaterialStatus;
  created_by: string;
  created_at: string;
  updated_at: string;

  // Package-specific data payloads
  basic_data?: BasicPackageMetadata;
  pro_data?: ProPackageMetadata;
  teacher_data?: TeacherPackageMetadata;
  school_data?: SchoolPackageMetadata;
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
  topic_id?: string;
  topic_title?: string;
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
  pdf_filename?: string;
  pdf_pages_count?: number;
  pdf_file_size?: string;
  disable_download?: boolean; // Strictly true for student notes/materials to prevent download
  key_summary_points?: string[];
  pdf_pages_content?: Array<{
    pageNumber: number;
    heading: string;
    subheading?: string;
    text: string;
    keyPoints?: string[];
    formulaHighlight?: string;
    exampleQuestion?: { question: string; stepSolution: string; answer: string };
  }>;
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
  currency?: 'INR' | 'USD';
  validityDays: number;
  eligibleClassIds: string[];
  description: string;
  isEnabled: boolean;
  practicePaperLimit: number; // e.g. per topic or total, -1 for unlimited
  questionsPerPaper?: number; // e.g. 15, 20, 25
  customPaperLimit: number; // Configurable custom paper request limit e.g. 15, 50, -1 for unlimited
  customPracticeEnabled?: boolean; // toggle whether custom practice papers are allowed
  pdfDownloadEnabled?: boolean; // whether PDF download is permitted
  difficultyLevels?: DifficultyLevel[]; // ['basic', 'medium', 'hard', 'olympiad']
  questionTypes?: string[]; // ['objective', 'subjective', 'competency_based', 'case_based', 'mixed']
  competencyBasedQuestions?: boolean;
  caseBasedQuestions?: boolean;
  hasAnswerKey?: boolean;
  hasSolutions?: boolean;
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
  | 'content-topics'
  | 'content-material-upload'
  | 'content-materials-manage'
  | 'content-practice-papers'
  | 'content-question-bank'
  | 'content-mcqs'
  | 'content-flash-cards'
  | 'content-notes'
  | 'content-previous-papers'
  | 'content-pdfs'
  | 'custom-requests'
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
  | 'affiliates-applications'
  | 'affiliates-approved'
  | 'affiliates-rejected'
  | 'affiliates-suspended'
  | 'affiliates-sales'
  | 'affiliates-commissions'
  | 'affiliates-payouts'
  | 'affiliates-settings'
  | 'admins-all'
  | 'admins-audit'
  | 'admin-users'
  | 'admin-roles'
  | 'admin-logs'
  | 'admin-settings';
