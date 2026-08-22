import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AcademicClass,
  AcademicSubject,
  AcademicChapter,
  AcademicTopic,
  EducationalContent,
  PackageItem,
  Student,
  PaymentTransaction,
  DashboardFeatureConfig,
  GlobalWebsiteSettings,
  AnnouncementItem,
  NotificationItem,
  AdminActivityLog,
  StudentContentOverrides,
  PackageMaterial,
  PackageType,
  MaterialStatus,
} from '../types/admin';
import { WorksheetRequest } from '../types/student';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
  INITIAL_TOPICS,
  INITIAL_EDUCATIONAL_CONTENT,
  INITIAL_PACKAGES,
  INITIAL_STUDENTS,
  INITIAL_PAYMENTS,
  INITIAL_DASHBOARD_CONFIG,
  INITIAL_GLOBAL_SETTINGS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_WORKSHEET_REQUESTS,
  INITIAL_PACKAGE_MATERIALS,
} from './admin-data';
import { useAdminAuth } from './admin-auth-context';

interface AdminStoreType {
  // Data entities
  classes: AcademicClass[];
  subjects: AcademicSubject[];
  chapters: AcademicChapter[];
  topics: AcademicTopic[];
  contents: EducationalContent[];
  packages: PackageItem[];
  students: Student[];
  payments: PaymentTransaction[];
  customRequests: WorksheetRequest[];
  dashboardConfig: DashboardFeatureConfig;
  globalSettings: GlobalWebsiteSettings;
  announcements: AnnouncementItem[];
  notifications: NotificationItem[];
  activityLogs: AdminActivityLog[];
  packageMaterials: PackageMaterial[];

  // Package-Based Material Actions
  addPackageMaterial: (material: Omit<PackageMaterial, 'id' | 'created_at' | 'updated_at'>) => PackageMaterial;
  updatePackageMaterial: (id: string, material: Partial<PackageMaterial>) => void;
  changeMaterialPackage: (id: string, newPackageType: PackageType, updatedPayload: Partial<PackageMaterial>) => void;
  duplicatePackageMaterial: (id: string) => PackageMaterial;
  replaceMaterialFile: (id: string, fileData: { file_url: string; file_name: string; file_size: string; file_type: string }) => void;
  deletePackageMaterial: (id: string) => void;
  toggleMaterialStatus: (id: string, status: MaterialStatus) => void;

  // Class Actions
  addClass: (cls: Omit<AcademicClass, 'id'>) => void;
  updateClass: (id: string, cls: Partial<AcademicClass>) => void;
  toggleClassStatus: (id: string) => void;
  reorderClasses: (orderedIds: string[]) => void;

  // Subject Actions
  addSubject: (subj: Omit<AcademicSubject, 'id'>) => void;
  updateSubject: (id: string, subj: Partial<AcademicSubject>) => void;
  deleteSubject: (id: string) => void;
  toggleSubjectStatus: (id: string) => void;

  // Chapter Actions
  addChapter: (chap: Omit<AcademicChapter, 'id'>) => void;
  updateChapter: (id: string, chap: Partial<AcademicChapter>) => void;
  deleteChapter: (id: string) => void;
  toggleChapterStatus: (id: string) => void;

  // Topic Actions (Requirement 2 & 4)
  addTopic: (topic: Omit<AcademicTopic, 'id'>) => void;
  updateTopic: (id: string, topic: Partial<AcademicTopic>) => void;
  deleteTopic: (id: string) => void;
  toggleTopicStatus: (id: string) => void;

  // Content Actions (with 30 PDF per topic limit enforcement)
  addContent: (content: Omit<EducationalContent, 'id' | 'created_at' | 'updated_at'>) => void;
  updateContent: (id: string, content: Partial<EducationalContent>) => void;
  deleteContent: (id: string) => void;
  toggleContentPublish: (id: string) => void;
  toggleContentEnabled: (id: string) => void;
  uploadPdfMaterial: (data: {
    classId: string;
    subjectId: string;
    chapterId: string;
    topicId: string;
    title: string;
    description?: string;
    pdfUrl: string;
    pdfFilename: string;
    pdfFileSize?: string;
    pdfPagesCount?: number;
    sortOrder?: number;
    isEnabled?: boolean;
    isPublished?: boolean;
  }) => { success: boolean; error?: string };

  // Custom Practice Paper Request Management (Requirement 18 & 19)
  updateCustomRequestStatus: (
    requestId: string,
    status: WorksheetRequest['status'],
    adminFeedback?: string,
    adminNotes?: string,
    assignedStaff?: string,
    readyPdfUrl?: string,
    readyPdfFilename?: string
  ) => void;
  assignStaffToRequest: (requestId: string, staffName: string) => void;
  addCustomRequestNote: (requestId: string, note: string) => void;

  // Package Actions
  addPackage: (pkg: Omit<PackageItem, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<PackageItem>) => void;
  togglePackageStatus: (id: string) => void;
  updatePackageFeatureMatrix: (packageId: string, featureKey: keyof PackageItem['features'], value: boolean) => void;

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  toggleStudentAccountStatus: (id: string) => void;
  assignStudentPackage: (studentId: string, packageId: string, classId?: string, validityDays?: number) => void;
  extendStudentExpiry: (studentId: string, additionalDays: number) => void;
  updateStudentOverrides: (studentId: string, overrides: StudentContentOverrides) => void;
  adjustCustomPaperLimit: (studentId: string, newLimit: number) => void;
  recordCustomPaperUsage: (studentId: string) => boolean;
  deleteStudent: (id: string) => void;

  // Payment Actions
  addPayment: (payment: Omit<PaymentTransaction, 'id'>) => void;
  updatePaymentStatus: (id: string, status: PaymentTransaction['status']) => void;
  verifyAndActivatePayment: (paymentId: string) => void;

  // Config & Settings Actions
  updateDashboardConfig: (key: keyof DashboardFeatureConfig, value: boolean) => void;
  updateGlobalSettings: (settings: Partial<GlobalWebsiteSettings>) => void;
  toggleMaintenanceMode: (enabled: boolean, message?: string, title?: string, expected?: string) => void;

  // Announcements & Notifications
  addAnnouncement: (announcement: Omit<AnnouncementItem, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, announcement: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;
  sendNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'> & { isRead?: boolean }) => void;

  // Core Access Control Validator (Requirement 26 & 30)
  canUserAccessContent: (studentId: string, contentId: string) => { allowed: boolean; reason?: string };
  canStudentUseFeature: (studentId: string, featureKey: keyof DashboardFeatureConfig) => { allowed: boolean; reason?: string };
  canStudentDownloadPDF: (studentId: string, contentId: string) => { allowed: boolean; reason?: string };
  canStudentGenerateCustomPaper: (studentId: string) => { allowed: boolean; remainingCount: number; reason?: string };

  // Reset to Factory Defaults
  resetAllDataToFactoryDefaults: () => void;
}

const AdminStoreContext = createContext<AdminStoreType | undefined>(undefined);

const STORAGE_KEYS = {
  CLASSES: 'bc_admin_classes_v2',
  SUBJECTS: 'bc_admin_subjects_v2',
  CHAPTERS: 'bc_admin_chapters_v2',
  TOPICS: 'bc_admin_topics_v2',
  CONTENTS: 'bc_admin_contents_v2',
  PACKAGES: 'bc_admin_packages_v2',
  STUDENTS: 'bc_admin_students_v2',
  PAYMENTS: 'bc_admin_payments_v2',
  CUSTOM_REQUESTS: 'bc_admin_custom_requests_v2',
  DASHBOARD_CONFIG: 'bc_admin_dash_config_v2',
  GLOBAL_SETTINGS: 'bc_admin_global_settings_v2',
  ANNOUNCEMENTS: 'bc_admin_announcements_v2',
  NOTIFICATIONS: 'bc_admin_notifications_v2',
  ACTIVITY_LOGS: 'bc_admin_activity_logs_v2',
  PACKAGE_MATERIALS: 'bc_admin_package_materials_v2',
};

function loadStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentAdmin } = useAdminAuth();

  const [classes, setClasses] = useState<AcademicClass[]>(() => loadStorage(STORAGE_KEYS.CLASSES, INITIAL_CLASSES));
  const [subjects, setSubjects] = useState<AcademicSubject[]>(() => loadStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS));
  const [chapters, setChapters] = useState<AcademicChapter[]>(() => loadStorage(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS));
  const [topics, setTopics] = useState<AcademicTopic[]>(() => loadStorage(STORAGE_KEYS.TOPICS, INITIAL_TOPICS));
  const [contents, setContents] = useState<EducationalContent[]>(() => loadStorage(STORAGE_KEYS.CONTENTS, INITIAL_EDUCATIONAL_CONTENT));
  const [packages, setPackages] = useState<PackageItem[]>(() => loadStorage(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES));
  const [students, setStudents] = useState<Student[]>(() => loadStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS));
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => loadStorage(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS));
  const [customRequests, setCustomRequests] = useState<WorksheetRequest[]>(() => loadStorage(STORAGE_KEYS.CUSTOM_REQUESTS, INITIAL_WORKSHEET_REQUESTS));
  const [dashboardConfig, setDashboardConfig] = useState<DashboardFeatureConfig>(() => loadStorage(STORAGE_KEYS.DASHBOARD_CONFIG, INITIAL_DASHBOARD_CONFIG));
  const [globalSettings, setGlobalSettings] = useState<GlobalWebsiteSettings>(() => loadStorage(STORAGE_KEYS.GLOBAL_SETTINGS, INITIAL_GLOBAL_SETTINGS));
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => loadStorage(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>(() => loadStorage(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS));
  const [packageMaterials, setPackageMaterials] = useState<PackageMaterial[]>(() => loadStorage(STORAGE_KEYS.PACKAGE_MATERIALS, INITIAL_PACKAGE_MATERIALS));

  // Persistence hooks
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CHAPTERS, JSON.stringify(chapters)); }, [chapters]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics)); }, [topics]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CONTENTS, JSON.stringify(contents)); }, [contents]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages)); }, [packages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CUSTOM_REQUESTS, JSON.stringify(customRequests)); }, [customRequests]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DASHBOARD_CONFIG, JSON.stringify(dashboardConfig)); }, [dashboardConfig]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.GLOBAL_SETTINGS, JSON.stringify(globalSettings)); }, [globalSettings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PACKAGE_MATERIALS, JSON.stringify(packageMaterials)); }, [packageMaterials]);

  // Logging helper
  const logActivity = useCallback((action: string, module: string, details: string) => {
    const newLog: AdminActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      adminId: currentAdmin?.id || 'system',
      adminName: currentAdmin?.name || 'System / Admin',
      adminRole: currentAdmin?.role || 'super_admin',
      action,
      module,
      details,
      ipAddress: '103.21.144.12',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  }, [currentAdmin]);

  // Class operations
  const addClass = (cls: Omit<AcademicClass, 'id'>) => {
    const id = `class_${cls.gradeNumber}`;
    const newClass: AcademicClass = { ...cls, id };
    setClasses((prev) => [...prev, newClass]);
    logActivity('Class Added', 'Class Management', `Added ${cls.name}`);
  };

  const updateClass = (id: string, cls: Partial<AcademicClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...cls } : c)));
    logActivity('Class Updated', 'Class Management', `Updated ${id}`);
  };

  const toggleClassStatus = (id: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isEnabled;
          logActivity('Class Status Toggled', 'Class Management', `${c.name} is now ${next ? 'Enabled' : 'Disabled'}`);
          return { ...c, isEnabled: next };
        }
        return c;
      })
    );
  };

  const reorderClasses = (orderedIds: string[]) => {
    setClasses((prev) => {
      const map = new Map<string, AcademicClass>(prev.map((c) => [c.id, c]));
      return orderedIds
        .map((id, index) => {
          const item = map.get(id);
          if (!item) return null;
          return { ...item, sortOrder: index + 1 };
        })
        .filter((c): c is AcademicClass => c !== null);
    });
    logActivity('Classes Reordered', 'Class Management', 'Updated curriculum class sort order');
  };

  // Subject operations
  const addSubject = (subj: Omit<AcademicSubject, 'id'>) => {
    const id = `subj_${Date.now()}`;
    setSubjects((prev) => [...prev, { ...subj, id }]);
    logActivity('Subject Created', 'Subject Management', `Created subject ${subj.name} for ${subj.classId}`);
  };

  const updateSubject = (id: string, subj: Partial<AcademicSubject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...subj } : s)));
    logActivity('Subject Updated', 'Subject Management', `Updated subject ${id}`);
  };

  const deleteSubject = (id: string) => {
    const item = subjects.find((s) => s.id === id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    logActivity('Subject Deleted', 'Subject Management', `Deleted ${item?.name || id}`);
  };

  const toggleSubjectStatus = (id: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = !s.isEnabled;
          logActivity('Subject Status Toggled', 'Subject Management', `${s.name} is now ${next ? 'Enabled' : 'Disabled'}`);
          return { ...s, isEnabled: next };
        }
        return s;
      })
    );
  };

  // Chapter operations
  const addChapter = (chap: Omit<AcademicChapter, 'id'>) => {
    const id = `ch_${Date.now()}`;
    setChapters((prev) => [...prev, { ...chap, id }]);
    logActivity('Chapter Created', 'Chapter Management', `Created Chapter ${chap.chapterNumber}: ${chap.title}`);
  };

  const updateChapter = (id: string, chap: Partial<AcademicChapter>) => {
    setChapters((prev) => prev.map((c) => (c.id === id ? { ...c, ...chap } : c)));
    logActivity('Chapter Updated', 'Chapter Management', `Updated Chapter ${id}`);
  };

  const deleteChapter = (id: string) => {
    const item = chapters.find((c) => c.id === id);
    setChapters((prev) => prev.filter((c) => c.id !== id));
    logActivity('Chapter Deleted', 'Chapter Management', `Deleted ${item?.title || id}`);
  };

  const toggleChapterStatus = (id: string) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isEnabled;
          logActivity('Chapter Status Toggled', 'Chapter Management', `${c.title} is now ${next ? 'Enabled' : 'Disabled'}`);
          return { ...c, isEnabled: next };
        }
        return c;
      })
    );
  };

  // Topic operations (Requirement 2 & 4)
  const addTopic = (topic: Omit<AcademicTopic, 'id'>) => {
    const id = `top_${Date.now()}`;
    const newTopic: AcademicTopic = {
      ...topic,
      id,
      maxPdfLimit: topic.maxPdfLimit || 30,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTopics((prev) => [...prev, newTopic]);
    logActivity('Topic Created', 'Curriculum Management', `Created Topic: ${topic.title}`);
  };

  const updateTopic = (id: string, topic: Partial<AcademicTopic>) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...topic } : t)));
    logActivity('Topic Updated', 'Curriculum Management', `Updated Topic ${id}`);
  };

  const deleteTopic = (id: string) => {
    const item = topics.find((t) => t.id === id);
    setTopics((prev) => prev.filter((t) => t.id !== id));
    logActivity('Topic Deleted', 'Curriculum Management', `Deleted Topic ${item?.title || id}`);
  };

  const toggleTopicStatus = (id: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.isEnabled;
          logActivity('Topic Status Toggled', 'Curriculum Management', `${t.title} is now ${next ? 'Enabled' : 'Disabled'}`);
          return { ...t, isEnabled: next };
        }
        return t;
      })
    );
  };

  // Content operations with 30 PDF Limit Enforcement (Requirement 4)
  const addContent = (content: Omit<EducationalContent, 'id' | 'created_at' | 'updated_at'>) => {
    // 30 PDFs limit check per topic
    if (content.topic_id && (content.content_type === 'pdf' || content.pdf_url || content.content_type === 'notes' || content.content_type === 'practice_paper')) {
      const topicObj = topics.find((t) => t.id === content.topic_id);
      const limit = topicObj?.maxPdfLimit || 30;
      const count = contents.filter((c) => c.topic_id === content.topic_id && (c.content_type === 'pdf' || c.pdf_url || c.content_type === 'notes' || c.content_type === 'practice_paper')).length;
      if (count >= limit) {
        throw new Error(`This topic already contains the maximum of ${limit} PDF materials.`);
      }
    }

    const id = `cnt_${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newContent: EducationalContent = {
      ...content,
      id,
      created_at: now,
      updated_at: now,
    };
    setContents((prev) => [newContent, ...prev]);
    logActivity('Content Created', 'Educational Content', `Created ${content.content_type.toUpperCase()}: ${content.title}`);
  };

  // Dedicated Material Upload with strict 30-PDF limit
  const uploadPdfMaterial = (data: {
    classId: string;
    subjectId: string;
    chapterId: string;
    topicId: string;
    title: string;
    description?: string;
    pdfUrl: string;
    pdfFilename: string;
    pdfFileSize?: string;
    pdfPagesCount?: number;
    sortOrder?: number;
    isEnabled?: boolean;
    isPublished?: boolean;
  }): { success: boolean; error?: string } => {
    const topicObj = topics.find((t) => t.id === data.topicId);
    const limit = topicObj?.maxPdfLimit || 30;
    const currentCount = contents.filter(
      (c) => c.topic_id === data.topicId && (c.content_type === 'pdf' || c.pdf_url || c.content_type === 'notes' || c.content_type === 'practice_paper')
    ).length;

    if (currentCount >= limit) {
      return {
        success: false,
        error: `This topic already contains the maximum of ${limit} PDF materials.`,
      };
    }

    const id = `cnt_pdf_${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newContent: EducationalContent = {
      id,
      class_id: data.classId,
      subject_id: data.subjectId,
      chapter_id: data.chapterId,
      topic_id: data.topicId,
      topic_title: topicObj?.title,
      content_type: 'pdf',
      title: data.title,
      description: data.description || 'Uploaded educational reference PDF.',
      difficulty: 'medium',
      access_type: 'package_restricted',
      package_ids: ['pkg_basic', 'pkg_pro', 'pkg_teacher', 'pkg_school'],
      is_published: data.isPublished !== undefined ? data.isPublished : true,
      is_enabled: data.isEnabled !== undefined ? data.isEnabled : true,
      time_limit_minutes: 0,
      total_marks: 0,
      question_count: 0,
      pdf_url: data.pdfUrl,
      pdf_filename: data.pdfFilename,
      pdf_file_size: data.pdfFileSize || '2.4 MB',
      pdf_pages_count: data.pdfPagesCount || 3,
      sort_order: data.sortOrder || currentCount + 1,
      created_at: now,
      updated_at: now,
    };

    setContents((prev) => [newContent, ...prev]);
    logActivity('PDF Material Uploaded', 'Material Repository', `Uploaded PDF "${data.title}" to topic "${topicObj?.title || data.topicId}"`);
    return { success: true };
  };

  const updateContent = (id: string, content: Partial<EducationalContent>) => {
    const now = new Date().toISOString().split('T')[0];
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...content, updated_at: now } : c))
    );
    logActivity('Content Updated', 'Educational Content', `Updated content item ${id}`);
  };

  const deleteContent = (id: string) => {
    const item = contents.find((c) => c.id === id);
    setContents((prev) => prev.filter((c) => c.id !== id));
    logActivity('Content Deleted', 'Educational Content', `Deleted ${item?.title || id}`);
  };

  const toggleContentPublish = (id: string) => {
    setContents((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.is_published;
          logActivity('Content Publish Toggled', 'Educational Content', `${c.title} is now ${next ? 'Published' : 'Unpublished'}`);
          return { ...c, is_published: next };
        }
        return c;
      })
    );
  };

  const toggleContentEnabled = (id: string) => {
    setContents((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.is_enabled;
          logActivity('Content Enabled Toggled', 'Educational Content', `${c.title} is now ${next ? 'Enabled' : 'Disabled'}`);
          return { ...c, is_enabled: next };
        }
        return c;
      })
    );
  };

  // Custom Practice Paper Request Management (Requirement 18 & 19)
  const updateCustomRequestStatus = (
    requestId: string,
    status: WorksheetRequest['status'],
    adminFeedback?: string,
    adminNotes?: string,
    assignedStaff?: string,
    readyPdfUrl?: string,
    readyPdfFilename?: string
  ) => {
    const now = new Date().toISOString().split('T')[0];
    let studentIdForNotif: string | null = null;
    let requestTopic = '';

    setCustomRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          studentIdForNotif = req.studentId;
          requestTopic = req.topic || req.chapterTitle || 'Custom Paper';
          return {
            ...req,
            status,
            adminFeedback: adminFeedback !== undefined ? adminFeedback : req.adminFeedback,
            adminNotes: adminNotes !== undefined ? adminNotes : req.adminNotes,
            assignedStaff: assignedStaff !== undefined ? assignedStaff : req.assignedStaff,
            readyPdfUrl: readyPdfUrl !== undefined ? readyPdfUrl : req.readyPdfUrl,
            readyPdfFilename: readyPdfFilename !== undefined ? readyPdfFilename : req.readyPdfFilename,
            updatedDate: now,
            completedDate: status === 'ready' || status === 'completed' ? now : req.completedDate,
          };
        }
        return req;
      })
    );

    // Sync to local storage for student context
    try {
      const currentStored = loadStorage<WorksheetRequest[]>('bc_student_worksheets_v2', []);
      const updated = currentStored.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              adminFeedback: adminFeedback !== undefined ? adminFeedback : r.adminFeedback,
              adminNotes: adminNotes !== undefined ? adminNotes : r.adminNotes,
              assignedStaff: assignedStaff !== undefined ? assignedStaff : r.assignedStaff,
              readyPdfUrl: readyPdfUrl !== undefined ? readyPdfUrl : r.readyPdfUrl,
              readyPdfFilename: readyPdfFilename !== undefined ? readyPdfFilename : r.readyPdfFilename,
              updatedDate: now,
              completedDate: status === 'ready' || status === 'completed' ? now : r.completedDate,
            }
          : r
      );
      localStorage.setItem('bc_student_worksheets_v2', JSON.stringify(updated));
    } catch {
      // ignore
    }

    logActivity(
      'Custom Paper Status Updated',
      'Worksheet Requests',
      `Request ${requestId} status changed to ${status.toUpperCase()}`
    );

    // If marked ready, trigger student notification
    if ((status === 'ready' || status === 'completed') && studentIdForNotif) {
      sendNotification({
        title: 'Custom Practice Paper Ready! 📄',
        message: `Your requested custom practice paper for "${requestTopic}" is now prepared and ready for practice and download.`,
        targetType: 'student',
        targetId: studentIdForNotif,
        type: 'success',
      });
    }
  };

  const assignStaffToRequest = (requestId: string, staffName: string) => {
    setCustomRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, assignedStaff: staffName, updatedDate: new Date().toISOString().split('T')[0] } : req))
    );
    logActivity('Staff Assigned to Custom Request', 'Worksheet Requests', `Assigned ${staffName} to ${requestId}`);
  };

  const addCustomRequestNote = (requestId: string, note: string) => {
    setCustomRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, adminNotes: note, updatedDate: new Date().toISOString().split('T')[0] } : req))
    );
  };

  // Package-Based Material Operations
  const addPackageMaterial = (
    material: Omit<PackageMaterial, 'id' | 'created_at' | 'updated_at'>
  ): PackageMaterial => {
    const id = `mat_${material.package_type}_${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newMaterial: PackageMaterial = {
      ...material,
      id,
      created_at: now,
      updated_at: now,
      created_by: currentAdmin?.name || 'Administrator',
    };
    setPackageMaterials((prev) => [newMaterial, ...prev]);
    logActivity(
      'Material Uploaded',
      'Material Management',
      `Uploaded [${material.package_type.toUpperCase()}] "${material.title}" (${material.file_name})`
    );
    return newMaterial;
  };

  const updatePackageMaterial = (id: string, material: Partial<PackageMaterial>) => {
    const now = new Date().toISOString().split('T')[0];
    setPackageMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...material, updated_at: now };
          return updated;
        }
        return m;
      })
    );
    logActivity('Material Updated', 'Material Management', `Updated material details for ${id}`);
  };

  const changeMaterialPackage = (
    id: string,
    newPackageType: PackageType,
    updatedPayload: Partial<PackageMaterial>
  ) => {
    const now = new Date().toISOString().split('T')[0];
    setPackageMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated: PackageMaterial = {
            ...m,
            ...updatedPayload,
            package_type: newPackageType,
            updated_at: now,
          };
          // Clean up conflicting package-specific fields if transitioning between distinct types
          if (newPackageType === 'basic') {
            delete updated.teacher_data;
            delete updated.school_data;
          } else if (newPackageType === 'pro') {
            delete updated.teacher_data;
            delete updated.school_data;
          } else if (newPackageType === 'teachers') {
            delete updated.school_data;
          } else if (newPackageType === 'school') {
            delete updated.teacher_data;
          }
          return updated;
        }
        return m;
      })
    );
    logActivity(
      'Material Package Migrated',
      'Material Management',
      `Migrated material ${id} to ${newPackageType.toUpperCase()} package`
    );
  };

  const duplicatePackageMaterial = (id: string): PackageMaterial => {
    const existing = packageMaterials.find((m) => m.id === id);
    if (!existing) {
      throw new Error(`Material with id ${id} not found.`);
    }
    const clonedId = `mat_${existing.package_type}_${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const duplicated: PackageMaterial = {
      ...JSON.parse(JSON.stringify(existing)),
      id: clonedId,
      title: `${existing.title} (Copy)`,
      status: 'draft',
      created_at: now,
      updated_at: now,
      created_by: currentAdmin?.name || 'Administrator',
    };
    setPackageMaterials((prev) => [duplicated, ...prev]);
    logActivity('Material Duplicated', 'Material Management', `Duplicated ${existing.title} -> ${duplicated.title}`);
    return duplicated;
  };

  const replaceMaterialFile = (
    id: string,
    fileData: { file_url: string; file_name: string; file_size: string; file_type: string }
  ) => {
    const now = new Date().toISOString().split('T')[0];
    setPackageMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...fileData, updated_at: now } : m))
    );
    logActivity('Material File Replaced', 'Material Management', `Replaced physical file for ${id} with ${fileData.file_name}`);
  };

  const deletePackageMaterial = (id: string) => {
    const target = packageMaterials.find((m) => m.id === id);
    setPackageMaterials((prev) => prev.filter((m) => m.id !== id));
    logActivity('Material Deleted', 'Material Management', `Deleted material ${target?.title || id}`);
  };

  const toggleMaterialStatus = (id: string, status: MaterialStatus) => {
    const now = new Date().toISOString().split('T')[0];
    setPackageMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status, updated_at: now } : m))
    );
    logActivity('Material Status Changed', 'Material Management', `Set status to ${status.toUpperCase()} for ${id}`);
  };

  // Package operations
  const addPackage = (pkg: Omit<PackageItem, 'id'>) => {
    const id = `pkg_${Date.now()}`;
    setPackages((prev) => [...prev, { ...pkg, id }]);
    logActivity('Package Created', 'Package Management', `Created package ${pkg.name} (${pkg.code})`);
  };

  const updatePackage = (id: string, pkg: Partial<PackageItem>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...pkg } : p)));
    logActivity('Package Updated', 'Package Management', `Updated package ${id}`);
  };

  const togglePackageStatus = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.isEnabled;
          logActivity('Package Status Toggled', 'Package Management', `${p.name} is now ${next ? 'Active' : 'Disabled'}`);
          return { ...p, isEnabled: next };
        }
        return p;
      })
    );
  };

  const updatePackageFeatureMatrix = (
    packageId: string,
    featureKey: keyof PackageItem['features'],
    value: boolean
  ) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id === packageId) {
          const updatedFeatures = { ...p.features, [featureKey]: value };
          logActivity(
            'Feature Matrix Updated',
            'Package Features',
            `Set ${String(featureKey)} to ${value ? 'ON' : 'OFF'} for ${p.name}`
          );
          return { ...p, features: updatedFeatures };
        }
        return p;
      })
    );
  };

  // Student operations
  const addStudent = (student: Omit<Student, 'id' | 'createdAt' | 'lastLogin'>) => {
    const id = `std_${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newStudent: Student = {
      ...student,
      id,
      lastLogin: 'Never',
      createdAt: now,
    };
    setStudents((prev) => [newStudent, ...prev]);
    logActivity('Student Registered', 'Student Management', `Added student ${student.name} (${student.email})`);
  };

  const updateStudent = (id: string, student: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...student } : s)));
    logActivity('Student Updated', 'Student Management', `Modified student profile for ${id}`);
  };

  const toggleStudentAccountStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus: Student['accountStatus'] = s.accountStatus === 'active' ? 'disabled' : 'active';
          logActivity('Student Status Changed', 'Student Management', `${s.name} account is now ${nextStatus}`);
          return { ...s, accountStatus: nextStatus };
        }
        return s;
      })
    );
  };

  const assignStudentPackage = (
    studentId: string,
    packageId: string,
    classId?: string,
    validityDays = 365
  ) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return;

    const purchaseDate = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + validityDays);
    const expiryDate = expDate.toISOString().split('T')[0];

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            packageId: pkg.id,
            packageName: pkg.name,
            packageStatus: 'active',
            classId: classId || s.classId,
            purchaseDate,
            expiryDate,
            paymentStatus: 'paid',
            customPaperLimit: pkg.customPaperLimit,
          };
        }
        return s;
      })
    );
    logActivity(
      'Package Assigned',
      'Student Entitlement',
      `Assigned ${pkg.name} to student ${studentId} until ${expiryDate}`
    );
  };

  const extendStudentExpiry = (studentId: string, additionalDays: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const currentExp = new Date(s.expiryDate);
          const baseDate = isNaN(currentExp.getTime()) || currentExp < new Date() ? new Date() : currentExp;
          baseDate.setDate(baseDate.getDate() + additionalDays);
          const newExp = baseDate.toISOString().split('T')[0];
          logActivity('Expiry Extended', 'Student Management', `Extended ${s.name} validity by ${additionalDays} days (New expiry: ${newExp})`);
          return { ...s, expiryDate: newExp, packageStatus: 'active' };
        }
        return s;
      })
    );
  };

  const updateStudentOverrides = (studentId: string, overrides: StudentContentOverrides) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          logActivity('Access Overrides Modified', 'Student Access Control', `Updated custom content permissions for ${s.name}`);
          return { ...s, accessOverrides: overrides };
        }
        return s;
      })
    );
  };

  const adjustCustomPaperLimit = (studentId: string, newLimit: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          logActivity('Custom Paper Limit Adjusted', 'Student Management', `Adjusted limit for ${s.name} to ${newLimit === -1 ? 'Unlimited' : newLimit}`);
          return { ...s, customPaperLimit: newLimit };
        }
        return s;
      })
    );
  };

  const recordCustomPaperUsage = (studentId: string): boolean => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return false;
    if (student.customPaperLimit !== -1 && student.customPaperCountUsed >= student.customPaperLimit) {
      return false; // Limit reached
    }
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, customPaperCountUsed: s.customPaperCountUsed + 1 } : s))
    );
    return true;
  };

  const deleteStudent = (id: string) => {
    const st = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    logActivity('Student Removed', 'Student Management', `Deleted student record for ${st?.name || id}`);
  };

  // Payment operations
  const addPayment = (payment: Omit<PaymentTransaction, 'id'>) => {
    const id = `txn_${Date.now()}`;
    setPayments((prev) => [{ ...payment, id }, ...prev]);
    logActivity('Payment Recorded', 'Payment Management', `Transaction ${payment.orderId} for ₹${payment.amount} recorded.`);
  };

  const updatePaymentStatus = (id: string, status: PaymentTransaction['status']) => {
    setPayments((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          logActivity('Payment Status Updated', 'Payment Management', `Order ${p.orderId} updated to ${status}`);
          return { ...p, status };
        }
        return p;
      })
    );
  };

  const verifyAndActivatePayment = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    // Update payment record to successful
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 365);
    const expiryDateStr = expDate.toISOString().split('T')[0];

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'successful',
              packageActivationDate: now.split(' ')[0],
              packageExpiryDate: expiryDateStr,
            }
          : p
      )
    );

    // Automatically activate student package entitlement
    assignStudentPackage(payment.studentId, payment.packageId, payment.classId, 365);

    // Send confirmation notification
    sendNotification({
      title: 'Payment Verified & Package Activated',
      message: `Your payment of ₹${payment.amount} for ${payment.packageName} has been verified. Full access is now unlocked!`,
      targetType: 'student',
      targetId: payment.studentId,
      type: 'billing',
    });

    logActivity(
      'Payment Verified & Entitlement Provisioned',
      'Payment Management',
      `Auto-provisioned ${payment.packageName} for student ${payment.studentName} (Order: ${payment.orderId})`
    );
  };

  // Config & Settings
  const updateDashboardConfig = (key: keyof DashboardFeatureConfig, value: boolean) => {
    setDashboardConfig((prev) => {
      const updated = { ...prev, [key]: value };
      logActivity('Dashboard Config Updated', 'Dashboard Configuration', `Set feature ${key} to ${value ? 'ON' : 'OFF'}`);
      return updated;
    });
  };

  const updateGlobalSettings = (settings: Partial<GlobalWebsiteSettings>) => {
    setGlobalSettings((prev) => {
      const updated = { ...prev, ...settings };
      logActivity('Global Website Settings Updated', 'Global Settings', 'Updated website metadata, branding or SEO config');
      return updated;
    });
  };

  const toggleMaintenanceMode = (
    enabled: boolean,
    message?: string,
    title?: string,
    expected?: string
  ) => {
    setGlobalSettings((prev) => {
      const updated: GlobalWebsiteSettings = {
        ...prev,
        maintenanceMode: {
          isEnabled: enabled,
          title: title || prev.maintenanceMode.title,
          message: message || prev.maintenanceMode.message,
          expectedAvailability: expected || prev.maintenanceMode.expectedAvailability,
        },
      };
      logActivity(
        'Maintenance Mode Toggled',
        'Website Security',
        `Website maintenance mode is now ${enabled ? 'ACTIVE' : 'DEACTIVATED'}`
      );
      return updated;
    });
  };

  // Announcements & Notifications
  const addAnnouncement = (announcement: Omit<AnnouncementItem, 'id' | 'createdAt'>) => {
    const id = `ann_${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    setAnnouncements((prev) => [{ ...announcement, id, createdAt }, ...prev]);
    logActivity('Announcement Broadcast', 'Communication', `Published announcement: ${announcement.title}`);
  };

  const updateAnnouncement = (id: string, announcement: Partial<AnnouncementItem>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...announcement } : a)));
    logActivity('Announcement Updated', 'Communication', `Updated announcement ${id}`);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    logActivity('Announcement Deleted', 'Communication', `Deleted announcement ${id}`);
  };

  const sendNotification = (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'> & { isRead?: boolean }) => {
    const id = `notif_${Date.now()}`;
    const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setNotifications((prev) => [{ ...notification, id, createdAt, isRead: notification.isRead ?? false }, ...prev]);
    logActivity('Notification Sent', 'Communication', `Sent notification to ${notification.targetType || 'user'}: ${notification.title}`);
  };

  // -------------------------------------------------------------
  // CORE ACCESS CONTROL SERVICE (Requirements 8, 10, 11, 26, 30)
  // -------------------------------------------------------------
  const canUserAccessContent = useCallback(
    (studentId: string, contentId: string): { allowed: boolean; reason?: string } => {
      const content = contents.find((c) => c.id === contentId);
      if (!content) {
        return { allowed: false, reason: 'Content item does not exist.' };
      }

      // Rule 1: Content must be published and enabled
      if (!content.is_published) {
        return { allowed: false, reason: 'This content is unpublished.' };
      }
      if (!content.is_enabled) {
        return { allowed: false, reason: 'This content has been temporarily disabled by administration.' };
      }

      // Public / Free content is accessible to all
      if (content.access_type === 'public' || content.access_type === 'free') {
        return { allowed: true };
      }

      // Find student record
      const student = students.find((s) => s.id === studentId);
      if (!student) {
        return { allowed: false, reason: 'Authentication required to view this content.' };
      }

      // Check student account status
      if (student.accountStatus !== 'active') {
        return { allowed: false, reason: `Student account is ${student.accountStatus}. Please contact support.` };
      }

      // Check package validity & expiration
      if (student.packageStatus !== 'active') {
        return { allowed: false, reason: `Package is currently ${student.packageStatus}. Please renew to access.` };
      }

      const expiry = new Date(student.expiryDate);
      if (!isNaN(expiry.getTime()) && expiry < new Date()) {
        return { allowed: false, reason: 'Your subscription package has expired on ' + student.expiryDate };
      }

      // Check Student-Specific Overrides (Requirement 11)
      const overrides = student.accessOverrides;
      if (overrides) {
        // Explicitly disabled by admin
        if (overrides.disabledContentIds?.includes(contentId)) {
          return { allowed: false, reason: 'Access to this specific material has been disabled by administrator.' };
        }
        if (overrides.disabledChapterIds?.includes(content.chapter_id)) {
          return { allowed: false, reason: 'Access to this chapter has been disabled for your profile by administrator.' };
        }
        if (overrides.disabledSubjectIds?.includes(content.subject_id)) {
          return { allowed: false, reason: 'Access to this subject has been disabled for your profile by administrator.' };
        }

        // Explicitly granted extra access
        if (overrides.extraAllowedContentIds?.includes(contentId)) {
          return { allowed: true };
        }
        if (overrides.extraAllowedChapterIds?.includes(content.chapter_id)) {
          return { allowed: true };
        }
        if (overrides.extraAllowedClassIds?.includes(content.class_id)) {
          return { allowed: true };
        }
      }

      // Strict Class Enforcement (Requirement 10)
      // Student must only see content for their assigned class unless overridden
      if (content.class_id !== student.classId) {
        return {
          allowed: false,
          reason: `Content belongs to ${content.class_id.replace('_', ' ').toUpperCase()} while student is enrolled in ${student.classId.replace('_', ' ').toUpperCase()}.`,
        };
      }

      // Check Package Assignment
      if (content.access_type === 'package_restricted') {
        if (!content.package_ids.includes(student.packageId)) {
          return {
            allowed: false,
            reason: `This premium material requires an upgraded package (${content.package_ids.join(', ')}).`,
          };
        }
      }

      // Check Package Feature Matrix
      const pkg = packages.find((p) => p.id === student.packageId);
      if (pkg) {
        if (content.content_type === 'practice_paper' && !pkg.features.practicePapers) {
          return { allowed: false, reason: 'Practice papers are not included in your current package tier.' };
        }
        if (content.content_type === 'mcq' && !pkg.features.mcqs) {
          return { allowed: false, reason: 'Interactive MCQs are not included in your package tier.' };
        }
      }

      return { allowed: true };
    },
    [contents, students, packages]
  );

  const canStudentUseFeature = useCallback(
    (studentId: string, featureKey: keyof DashboardFeatureConfig): { allowed: boolean; reason?: string } => {
      // Global master switch
      if (!dashboardConfig[featureKey]) {
        return { allowed: false, reason: `Feature '${String(featureKey)}' is disabled platform-wide by admin.` };
      }

      const student = students.find((s) => s.id === studentId);
      if (!student) {
        return { allowed: false, reason: 'Authentication required.' };
      }

      if (student.accountStatus !== 'active') {
        return { allowed: false, reason: `Account is ${student.accountStatus}.` };
      }

      if (student.packageStatus === 'expired') {
        return { allowed: false, reason: 'Package has expired.' };
      }

      const pkg = packages.find((p) => p.id === student.packageId);
      if (pkg) {
        if (featureKey === 'practicePapers' && !pkg.features.practicePapers) return { allowed: false, reason: 'Not in package tier' };
        if (featureKey === 'downloads' && !pkg.features.pdfDownload) return { allowed: false, reason: 'Downloads not allowed in package' };
        if (featureKey === 'customPracticePaper' && !pkg.features.customPapers) return { allowed: false, reason: 'Custom paper generator not in package' };
        if (featureKey === 'aiTutor' && !pkg.features.aiFeatures) return { allowed: false, reason: 'AI tutor not included in package' };
      }

      // Check individual override
      if (student.accessOverrides) {
        if (featureKey === 'downloads' && student.accessOverrides.downloadsDisabled) {
          return { allowed: false, reason: 'Downloads disabled for your account by administrator.' };
        }
        if (featureKey === 'customPracticePaper' && student.accessOverrides.customPaperGenerationDisabled) {
          return { allowed: false, reason: 'Custom paper generation disabled by administrator.' };
        }
      }

      return { allowed: true };
    },
    [dashboardConfig, students, packages]
  );

  const canStudentDownloadPDF = useCallback(
    (studentId: string, contentId: string): { allowed: boolean; reason?: string } => {
      const accessCheck = canUserAccessContent(studentId, contentId);
      if (!accessCheck.allowed) return accessCheck;

      const student = students.find((s) => s.id === studentId);
      if (student?.accessOverrides?.downloadsDisabled) {
        return { allowed: false, reason: 'PDF downloads have been disabled for your account by administration.' };
      }

      const pkg = packages.find((p) => p.id === student?.packageId);
      if (pkg && !pkg.features.pdfDownload) {
        return { allowed: false, reason: 'PDF downloads are restricted on this package tier.' };
      }

      return { allowed: true };
    },
    [canUserAccessContent, students, packages]
  );

  const canStudentGenerateCustomPaper = useCallback(
    (studentId: string): { allowed: boolean; remainingCount: number; reason?: string } => {
      const student = students.find((s) => s.id === studentId);
      if (!student) {
        return { allowed: false, remainingCount: 0, reason: 'Authentication required.' };
      }

      if (student.accountStatus !== 'active' || student.packageStatus !== 'active') {
        return { allowed: false, remainingCount: 0, reason: 'Active subscription required.' };
      }

      if (student.accessOverrides?.customPaperGenerationDisabled) {
        return { allowed: false, remainingCount: 0, reason: 'Custom paper generation has been disabled for this student.' };
      }

      if (student.customPaperLimit === -1) {
        return { allowed: true, remainingCount: 999999 }; // Unlimited
      }

      const remaining = student.customPaperLimit - student.customPaperCountUsed;
      if (remaining <= 0) {
        return {
          allowed: false,
          remainingCount: 0,
          reason: `You have exhausted your custom practice paper quota (${student.customPaperCountUsed}/${student.customPaperLimit}). Contact admin to extend.`,
        };
      }

      return { allowed: true, remainingCount: remaining };
    },
    [students]
  );

  const resetAllDataToFactoryDefaults = () => {
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setChapters(INITIAL_CHAPTERS);
    setTopics(INITIAL_TOPICS);
    setContents(INITIAL_EDUCATIONAL_CONTENT);
    setPackages(INITIAL_PACKAGES);
    setStudents(INITIAL_STUDENTS);
    setPayments(INITIAL_PAYMENTS);
    setDashboardConfig(INITIAL_DASHBOARD_CONFIG);
    setGlobalSettings(INITIAL_GLOBAL_SETTINGS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setPackageMaterials(INITIAL_PACKAGE_MATERIALS);
    localStorage.clear();
    logActivity('System Reset', 'Administration', 'Factory reset restored all sample curriculum, students, packages, and materials.');
  };

  return (
    <AdminStoreContext.Provider
      value={{
        classes,
        subjects,
        chapters,
        topics,
        contents,
        packages,
        students,
        payments,
        customRequests,
        dashboardConfig,
        globalSettings,
        announcements,
        notifications,
        activityLogs,
        packageMaterials,

        addPackageMaterial,
        updatePackageMaterial,
        changeMaterialPackage,
        duplicatePackageMaterial,
        replaceMaterialFile,
        deletePackageMaterial,
        toggleMaterialStatus,

        addClass,
        updateClass,
        toggleClassStatus,
        reorderClasses,

        addSubject,
        updateSubject,
        deleteSubject,
        toggleSubjectStatus,

        addChapter,
        updateChapter,
        deleteChapter,
        toggleChapterStatus,

        addTopic,
        updateTopic,
        deleteTopic,
        toggleTopicStatus,

        addContent,
        updateContent,
        deleteContent,
        toggleContentPublish,
        toggleContentEnabled,
        uploadPdfMaterial,

        updateCustomRequestStatus,
        assignStaffToRequest,
        addCustomRequestNote,

        addPackage,
        updatePackage,
        togglePackageStatus,
        updatePackageFeatureMatrix,

        addStudent,
        updateStudent,
        toggleStudentAccountStatus,
        assignStudentPackage,
        extendStudentExpiry,
        updateStudentOverrides,
        adjustCustomPaperLimit,
        recordCustomPaperUsage,
        deleteStudent,

        addPayment,
        updatePaymentStatus,
        verifyAndActivatePayment,

        updateDashboardConfig,
        updateGlobalSettings,
        toggleMaintenanceMode,

        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        sendNotification,

        canUserAccessContent,
        canStudentUseFeature,
        canStudentDownloadPDF,
        canStudentGenerateCustomPaper,

        resetAllDataToFactoryDefaults,
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminStoreContext);
  if (!context) {
    throw new Error('useAdminStore must be used within an AdminStoreProvider');
  }
  return context;
};
