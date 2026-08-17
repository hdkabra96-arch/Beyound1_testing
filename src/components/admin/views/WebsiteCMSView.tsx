import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { GlobalWebsiteSettings } from '../../../types/admin';
import {
  Globe,
  Info,
  Users,
  CreditCard,
  Phone,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Save,
  RefreshCw,
  Sparkles,
  Sliders,
  Mail,
  MapPin,
  HelpCircle,
  Eye,
} from 'lucide-react';

interface WebsiteCMSViewProps {
  initialTab?: 'home' | 'about' | 'team' | 'packages' | 'contact' | 'global';
}

export const WebsiteCMSView: React.FC<WebsiteCMSViewProps> = ({ initialTab = 'home' }) => {
  const { globalSettings, updateGlobalSettings, toggleMaintenanceMode } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'team' | 'packages' | 'contact' | 'global'>(initialTab);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local editable form state initialized from store
  const [siteName, setSiteName] = useState(globalSettings.siteName);
  const [siteTagline, setSiteTagline] = useState(globalSettings.siteTagline);
  const [metaDescription, setMetaDescription] = useState(globalSettings.metaDescription);
  const [supportEmail, setSupportEmail] = useState(globalSettings.supportEmail);
  const [supportPhone, setSupportPhone] = useState(globalSettings.supportPhone);
  const [supportAddress, setSupportAddress] = useState(globalSettings.supportAddress);

  // Maintenance mode
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(globalSettings.maintenanceMode.isEnabled);
  const [maintenanceTitle, setMaintenanceTitle] = useState(globalSettings.maintenanceMode.title);
  const [maintenanceMessage, setMaintenanceMessage] = useState(globalSettings.maintenanceMode.message);
  const [maintenanceExpected, setMaintenanceExpected] = useState(globalSettings.maintenanceMode.expectedAvailability);

  // Home Page CMS
  const [heroBadge, setHeroBadge] = useState('CBSE • ICSE • State Board • Class 1 to 8');
  const [heroTitle, setHeroTitle] = useState('Master Mathematics with Confidence');
  const [heroSubtitle, setHeroSubtitle] = useState('Rigorous worksheets, interactive MCQs, step-by-step solutions, and custom paper generators designed by elite educators.');
  const [statNumber1, setStatNumber1] = useState('25,000+');
  const [statLabel1, setStatLabel1] = useState('Practice Questions');
  const [statNumber2, setStatNumber2] = useState('98.4%');
  const [statLabel2, setStatLabel2] = useState('Exam Score Improvement');
  const [statNumber3, setStatNumber3] = useState('100%');
  const [statLabel3, setStatLabel3] = useState('CBSE / ICSE Aligned');

  // About Us CMS
  const [aboutVision, setAboutVision] = useState('Empowering every student to develop deep conceptual clarity and joyful mathematical intuition.');
  const [aboutMission, setAboutMission] = useState('To deliver the highest quality curriculum-aligned mathematics resources with step-by-step reasoning.');
  const [aboutPedagogy, setAboutPedagogy] = useState('Cognitive scaffolding from concrete problem solving to abstract Olympiad thinking.');

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    updateGlobalSettings({
      siteName,
      siteTagline,
      metaDescription,
      supportEmail,
      supportPhone,
      supportAddress,
    });

    toggleMaintenanceMode(maintenanceEnabled, maintenanceMessage, maintenanceTitle, maintenanceExpected);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Website CMS & Global Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              Requirement 14
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Edit content across the public website (Home, About Us, Our Team, Packages, Contact) and toggle site-wide Maintenance Mode.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Publish & Save All Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Website content and global configuration saved successfully.</span>
        </div>
      )}

      {/* Tabs Navigation Header */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'home', label: 'Home Page CMS', icon: <Globe className="w-4 h-4" /> },
          { id: 'about', label: 'About Us CMS', icon: <Info className="w-4 h-4" /> },
          { id: 'team', label: 'Our Team CMS', icon: <Users className="w-4 h-4" /> },
          { id: 'packages', label: 'Pricing Section CMS', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'contact', label: 'Contact & Support', icon: <Phone className="w-4 h-4" /> },
          { id: 'global', label: 'Global Config & Maintenance', icon: <Settings className="w-4 h-4 text-amber-400" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl text-xs space-y-6">
        {/* HOME PAGE CMS */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-white">Home Page Hero & Key Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Hero Pill Badge</label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Main Hero Headline</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Hero Subtitle Paragraph</label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-slate-400 font-bold block">Stat 1</label>
                <input
                  type="text"
                  value={statNumber1}
                  onChange={(e) => setStatNumber1(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-900 rounded text-emerald-400 font-bold"
                />
                <input
                  type="text"
                  value={statLabel1}
                  onChange={(e) => setStatLabel1(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-900 rounded text-slate-300"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-slate-400 font-bold block">Stat 2</label>
                <input
                  type="text"
                  value={statNumber2}
                  onChange={(e) => setStatNumber2(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-900 rounded text-indigo-400 font-bold"
                />
                <input
                  type="text"
                  value={statLabel2}
                  onChange={(e) => setStatLabel2(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-900 rounded text-slate-300"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-slate-400 font-bold block">Stat 3</label>
                <input
                  type="text"
                  value={statNumber3}
                  onChange={(e) => setStatNumber3(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-900 rounded text-purple-400 font-bold"
                />
                <input
                  type="text"
                  value={statLabel3}
                  onChange={(e) => setStatLabel3(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-900 rounded text-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABOUT US CMS */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-white">About Beyond Classroom Mission & Pedagogy</h2>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Our Vision</label>
              <textarea
                rows={2}
                value={aboutVision}
                onChange={(e) => setAboutVision(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Our Mission</label>
              <textarea
                rows={2}
                value={aboutMission}
                onChange={(e) => setAboutMission(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-bold block mb-1">Pedagogical Framework</label>
              <textarea
                rows={2}
                value={aboutPedagogy}
                onChange={(e) => setAboutPedagogy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>
        )}

        {/* OUR TEAM CMS */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-white">Faculty & Leadership Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-400">Lead Curriculum Director</span>
                <input
                  type="text"
                  defaultValue="Dr. Radhika Sharma"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                />
                <input
                  type="text"
                  defaultValue="Ph.D. in Mathematical Pedagogy, Ex-ISI Kolkata"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-purple-400">Head of Olympiad Assessment</span>
                <input
                  type="text"
                  defaultValue="Anand V. Raghavan"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                />
                <input
                  type="text"
                  defaultValue="Senior Mathematics Olympiad Trainer & Author"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* PRICING SECTION CMS */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-white">Packages Page Banner & Guarantee Badges</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Pricing Guarantee Header</label>
                <input
                  type="text"
                  defaultValue="30-Day Score Improvement Guarantee"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Currency Mode</label>
                <select className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white">
                  <option>Dual Currency (INR ₹ / USD $)</option>
                  <option>INR Only</option>
                  <option>USD Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT & SUPPORT CMS */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-white">Contact Info & Official Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Helpline Phone</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 font-bold block mb-1">Headquarters</label>
                <input
                  type="text"
                  value={supportAddress}
                  onChange={(e) => setSupportAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* GLOBAL SETTINGS & MAINTENANCE MODE */}
        {activeTab === 'global' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-white">Global Platform Configuration</h2>
              <p className="text-slate-400">Search engine metadata, brand identification, and maintenance toggles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={siteTagline}
                  onChange={(e) => setSiteTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Meta SEO Description</label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            {/* MAINTENANCE MODE SWITCH */}
            <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">Site-Wide Maintenance Mode</h3>
                    <p className="text-slate-400 text-xs">
                      When enabled, public visitors and students will see a maintenance notice. Administrators retain full access.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMaintenanceEnabled(!maintenanceEnabled)}
                  className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer ${
                    maintenanceEnabled ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                      maintenanceEnabled ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {maintenanceEnabled && (
                <div className="space-y-3 pt-3 border-t border-amber-500/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-amber-300 font-bold block mb-1">Notice Headline</label>
                      <input
                        type="text"
                        value={maintenanceTitle}
                        onChange={(e) => setMaintenanceTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-amber-500/40 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="text-amber-300 font-bold block mb-1">Expected Resume Time</label>
                      <input
                        type="text"
                        value={maintenanceExpected}
                        onChange={(e) => setMaintenanceExpected(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-amber-500/40 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-amber-300 font-bold block mb-1">Maintenance Message Details</label>
                    <textarea
                      rows={2}
                      value={maintenanceMessage}
                      onChange={(e) => setMaintenanceMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-amber-500/40 rounded-xl text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};
