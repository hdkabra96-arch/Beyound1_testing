import React, { useState } from 'react';
import { useAdminAuth } from '../../services/admin-auth-context';
import { AdminActiveSection } from '../../types/admin';
import { AdminLayout } from './AdminLayout';
import { AdminLoginPage } from './AdminLoginPage';

// Import all dedicated views
import { AdminDashboardView } from './views/AdminDashboardView';
import { StudentManagementView } from './views/StudentManagementView';
import { StudentAccessControlView } from './views/StudentAccessControlView';
import { ClassManagementView } from './views/ClassManagementView';
import { SubjectManagementView } from './views/SubjectManagementView';
import { ChapterManagementView } from './views/ChapterManagementView';
import { ContentManagementView } from './views/ContentManagementView';
import { PackageManagementView } from './views/PackageManagementView';
import { PaymentManagementView } from './views/PaymentManagementView';
import { DashboardConfigView } from './views/DashboardConfigView';
import { WebsiteCMSView } from './views/WebsiteCMSView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { ReportsAnalyticsView } from './views/ReportsAnalyticsView';
import { AdminUsersView } from './views/AdminUsersView';
import { AffiliateManagementView } from './views/AffiliateManagementView';
import { TopicManagementView } from './views/TopicManagementView';
import { MaterialUploadView } from './views/MaterialUploadView';
import { CustomRequestsAdminView } from './views/CustomRequestsAdminView';
import { PackageMaterialUploadWizard } from './materials/PackageMaterialUploadWizard';
import { ManageMaterialsView } from './views/ManageMaterialsView';

interface AdminRootProps {
  onViewPublicSite: () => void;
}

export const AdminRoot: React.FC<AdminRootProps> = ({ onViewPublicSite }) => {
  const { currentAdmin } = useAdminAuth();
  const [activeSection, setActiveSection] = useState<AdminActiveSection>('dashboard');

  // If not logged into admin, display AdminLoginPage
  if (!currentAdmin) {
    return <AdminLoginPage onCancel={onViewPublicSite} />;
  }

  // Render the current view according to activeSection
  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardView onNavigate={(sec) => setActiveSection(sec)} />;

      case 'custom-requests':
        return <CustomRequestsAdminView />;

      // Students
      case 'students-all':
        return <StudentManagementView initialFilter="all" />;
      case 'students-active':
        return <StudentManagementView initialFilter="active" />;
      case 'students-expired':
        return <StudentManagementView initialFilter="expired" />;
      case 'students-access-control':
        return <StudentAccessControlView />;

      // Curriculum & Classes
      case 'content-classes':
        return <ClassManagementView />;
      case 'content-subjects':
        return <SubjectManagementView />;
      case 'content-chapters':
        return <ChapterManagementView />;
      case 'content-topics':
        return <TopicManagementView />;
      case 'content-material-upload':
        return (
          <PackageMaterialUploadWizard
            onNavigateToManage={() => setActiveSection('content-materials-manage')}
          />
        );
      case 'content-materials-manage':
        return (
          <ManageMaterialsView
            onNavigateToUpload={() => setActiveSection('content-material-upload')}
          />
        );
      case 'content-practice-papers':
        return <ContentManagementView initialTypeFilter="practice_paper" />;
      case 'content-question-bank':
        return <ContentManagementView initialTypeFilter="question_bank" />;
      case 'content-mcqs':
        return <ContentManagementView initialTypeFilter="mcq" />;
      case 'content-flash-cards':
        return <ContentManagementView initialTypeFilter="flash_cards" />;
      case 'content-notes':
        return <ContentManagementView initialTypeFilter="notes" />;
      case 'content-previous-papers':
        return <ContentManagementView initialTypeFilter="previous_papers" />;
      case 'content-pdfs':
        return <ContentManagementView initialTypeFilter="all" />;

      // Packages & Pricing
      case 'packages-all':
      case 'packages-features':
      case 'packages-rules':
        return <PackageManagementView />;

      // Billing & Payments
      case 'payments-transactions':
        return <PaymentManagementView initialStatusFilter="all" />;
      case 'payments-successful':
        return <PaymentManagementView initialStatusFilter="successful" />;
      case 'payments-pending':
        return <PaymentManagementView initialStatusFilter="pending" />;
      case 'payments-failed':
        return <PaymentManagementView initialStatusFilter="failed" />;
      case 'payments-refunds':
        return <PaymentManagementView initialStatusFilter="refunded" />;

      // Affiliates & Referrals
      case 'affiliates-applications':
        return <AffiliateManagementView initialTab="applications" />;
      case 'affiliates-approved':
        return <AffiliateManagementView initialTab="approved" />;
      case 'affiliates-rejected':
        return <AffiliateManagementView initialTab="rejected" />;
      case 'affiliates-suspended':
        return <AffiliateManagementView initialTab="suspended" />;
      case 'affiliates-sales':
        return <AffiliateManagementView initialTab="sales" />;
      case 'affiliates-commissions':
        return <AffiliateManagementView initialTab="commissions" />;
      case 'affiliates-payouts':
        return <AffiliateManagementView initialTab="payouts" />;
      case 'affiliates-settings':
        return <AffiliateManagementView initialTab="settings" />;

      // Website CMS
      case 'website-home':
        return <WebsiteCMSView initialTab="home" />;
      case 'website-about':
        return <WebsiteCMSView initialTab="about" />;
      case 'website-team':
        return <WebsiteCMSView initialTab="team" />;
      case 'website-packages':
        return <WebsiteCMSView initialTab="packages" />;
      case 'website-contact':
        return <WebsiteCMSView initialTab="contact" />;
      case 'website-global':
        return <WebsiteCMSView initialTab="global" />;

      // Dashboard Feature Switches & Settings
      case 'dashboard-features':
      case 'admin-settings':
        return <DashboardConfigView />;

      // Announcements & Notifications
      case 'announcements-list':
      case 'announcements-notifications':
      case 'communication-announcements':
      case 'communication-notifications':
        return <AnnouncementsView />;

      // Reports & Analytics
      case 'reports-performance':
      case 'reports-sales':
      case 'reports-revenue':
      case 'reports-students':
      case 'reports-packages':
      case 'reports-content':
        return <ReportsAnalyticsView />;

      // Admin Management & Audit
      case 'admins-all':
      case 'admins-audit':
      case 'admin-users':
      case 'admin-roles':
      case 'admin-logs':
        return <AdminUsersView />;

      default:
        return <AdminDashboardView onNavigate={(sec) => setActiveSection(sec)} />;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onViewPublicSite={onViewPublicSite}
    >
      {renderActiveView()}
    </AdminLayout>
  );
};
