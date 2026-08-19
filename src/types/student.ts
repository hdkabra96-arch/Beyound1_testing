import { PackageFeatureMatrix, PaymentStatus, AccountStatus, PackageStatus, DifficultyLevel } from './admin';

export interface PackageEntitlement {
  id: string;
  userId: string;
  studentName: string;
  packageId: string;
  packageName: string;
  classId: string;
  className: string;
  purchaseId: string;
  amountPaid: number;
  currency: 'INR' | 'USD';
  paymentStatus: PaymentStatus;
  purchaseDate: string; // ISO format (YYYY-MM-DD)
  activationDate: string; // ISO format (YYYY-MM-DD)
  expiryDate: string; // ISO format (YYYY-MM-DD)
  status: PackageStatus;
  daysTotal: number;
  daysRemaining: number;
  practicePaperLimit: number; // -1 for unlimited
  customPaperLimit: number; // -1 for unlimited
  customPaperCountUsed: number;
  features: PackageFeatureMatrix;
  createdAt: string;
  updatedAt: string;
}

export type WorksheetRequestStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'in_progress'
  | 'ready'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface StudentReferenceFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'jpg' | 'jpeg' | 'png' | 'image';
  url: string;
  uploadedAt: string;
}

export interface WorksheetRequest {
  id: string; // BC-XXXXXX
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterTitle?: string;
  topicId?: string | null; // Optional/nullable
  topic?: string; // Optional! If blank, "Topic: Not specified"
  difficulty: DifficultyLevel; // 'basic' | 'medium' | 'hard' | 'olympiad'
  totalMarks: 40 | 60 | 80 | number; // Strictly 40, 60, 80 Marks
  questionType?: 'objective' | 'subjective' | 'competency_based' | 'case_based' | 'mixed';
  additionalRequirements?: string;
  referenceFiles?: StudentReferenceFile[];
  status: WorksheetRequestStatus;
  expectedDelivery?: string; // "Within 48 Hours"
  adminFeedback?: string;
  adminNotes?: string;
  assignedStaff?: string;
  readyContentId?: string;
  readyPdfUrl?: string;
  readyPdfFilename?: string;
  requestedDate: string;
  updatedDate: string;
  completedDate?: string;
}

export interface PracticeQuizAttempt {
  id: string;
  studentId: string;
  contentId: string;
  contentTitle: string;
  classId: string;
  subjectId: string;
  chapterId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  maxScore: number;
  timeSpentSeconds: number;
  completedAt: string;
  accuracyPercentage: number;
  selectedAnswers: Record<string | number, number | string>;
}

export interface StudentProgressSummary {
  chaptersCompletedCount: number;
  totalChaptersCount: number;
  practicePapersAttemptedCount: number;
  questionsAttemptedCount: number;
  totalScoreEarned: number;
  accuracyPercentage: number;
  lastPracticedDate?: string;
}

export type StudentDashboardSection =
  | 'overview'
  | 'subjects'
  | 'subject-detail'
  | 'chapter-detail'
  | 'practice-papers'
  | 'worksheet-requests'
  | 'progress'
  | 'my-package'
  | 'payment-history'
  | 'my-account'
  | 'notifications';
