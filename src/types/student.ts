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
  | 'rejected'
  | 'completed';

export interface WorksheetRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterTitle: string;
  topic: string;
  difficulty: DifficultyLevel;
  numberOfQuestions: number;
  marks: number;
  questionType: 'objective' | 'subjective' | 'competency_based' | 'case_based' | 'mixed';
  additionalRequirements?: string;
  status: WorksheetRequestStatus;
  adminFeedback?: string;
  readyContentId?: string;
  readyPdfUrl?: string;
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
