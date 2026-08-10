import React, { useState } from 'react';
import { TEAM_MEMBERS } from '../data/public-content';
import { TeamMember, PublicPage } from '../types/public';
import {
  Users,
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Sparkles,
  ArrowRight,
  Target,
  Layers,
  Cpu,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Compass,
  FileCheck2,
  Binary
} from 'lucide-react';

interface TeamPageProps {
  onNavigate?: (page: PublicPage) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onNavigate, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'educator' | 'content_specialist' | 'advisor' | 'platform'>('all');

  const educators = TEAM_MEMBERS.filter((m) => m.category === 'educator');
  const contentSpecialists = TEAM_MEMBERS.filter((m) => m.category === 'content_specialist');
  const advisors = TEAM_MEMBERS.filter((m) => m.category === 'advisor');
  const platformTeam = TEAM_MEMBERS.filter((m) => m.category === 'platform');

  const filteredMembers = activeTab === 'all'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter((m) => m.category === activeTab);

  const renderTeamCard = (member: TeamMember, accentTheme: 'green' | 'blue' | 'purple' | 'cyan') => {
    const themeStyles = {
      green: {
        badge: 'bg-emerald-50 text-[#16A34A] border-emerald-200/80',
        icon: 'text-[#16A34A]',
        borderHover: 'hover:border-emerald-300',
        gradientOverlay: 'from-emerald-500/10 via-transparent to-transparent',
      },
      blue: {
        badge: 'bg-blue-50 text-[#2563EB] border-blue-200/80',
        icon: 'text-[#2563EB]',
        borderHover: 'hover:border-blue-300',
        gradientOverlay: 'from-blue-500/10 via-transparent to-transparent',
      },
      purple: {
        badge: 'bg-purple-50 text-[#7C3AED] border-purple-200/80',
        icon: 'text-[#7C3AED]',
        borderHover: 'hover:border-purple-300',
        gradientOverlay: 'from-purple-500/10 via-transparent to-transparent',
      },
      cyan: {
        badge: 'bg-cyan-50 text-[#06B6D4] border-cyan-200/80',
        icon: 'text-[#06B6D4]',
        borderHover: 'hover:border-cyan-300',
        gradientOverlay: 'from-cyan-500/10 via-transparent to-transparent',
      },
    }[accentTheme];

    return (
      <div
        key={member.id}
        className={`group bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between ${themeStyles.borderHover}`}
      >
        <div className="space-y-4">
          {/* Photo Frame (Aspect 4/5) */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 group">
            <img
              src={member.avatar}
              alt={`${member.name} — ${member.role} at Beyond Classroom`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${themeStyles.gradientOverlay} opacity-60 pointer-events-none`} />
            
            {/* Corner Badge */}
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border shadow-sm backdrop-blur-md ${themeStyles.badge}`}>
                {member.category === 'educator' && 'Educator'}
                {member.category === 'content_specialist' && 'Academic Specialist'}
                {member.category === 'advisor' && 'Curriculum Advisor'}
                {member.category === 'platform' && 'Platform Lead'}
              </span>
            </div>
          </div>

          {/* Member Meta */}
          <div className="px-5 space-y-3">
            <div>
              <h3 className="text-lg font-black text-[#111827] group-hover:text-[#2563EB] transition-colors">
                {member.name}
              </h3>
              <p className="text-xs font-bold text-slate-500 tracking-tight">
                {member.role}
              </p>
            </div>

            {/* Qualifications, Specialization, Experience Pills */}
            <div className="space-y-2 pt-1 border-t border-slate-100 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <GraduationCap className={`w-4 h-4 shrink-0 mt-0.5 ${themeStyles.icon}`} />
                <div>
                  <span className="font-extrabold text-slate-900">Qualification: </span>
                  <span className="text-slate-600 font-medium">{member.qualification}</span>
                </div>
              </div>

              {member.specialization && (
                <div className="flex items-start gap-2">
                  <BookOpen className={`w-4 h-4 shrink-0 mt-0.5 ${themeStyles.icon}`} />
                  <div>
                    <span className="font-extrabold text-slate-900">Specialization: </span>
                    <span className="text-slate-600 font-medium">{member.specialization}</span>
                  </div>
                </div>
              )}

              {member.experience && (
                <div className="flex items-start gap-2">
                  <Briefcase className={`w-4 h-4 shrink-0 mt-0.5 ${themeStyles.icon}`} />
                  <div>
                    <span className="font-extrabold text-slate-900">Experience: </span>
                    <span className="text-slate-600 font-semibold">{member.experience}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bio */}
            <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
              {member.bio}
            </p>
          </div>
        </div>

        {/* Expertise tags footer */}
        {member.expertise && member.expertise.length > 0 && (
          <div className="p-5 pt-3 mt-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-2 tracking-wider">
              Focus Areas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {member.expertise.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700 shadow-2xs"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-16 pb-16">
      {/* SECTION 1 — HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-12">
        {/* Soft radial brand gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 via-blue-500/10 via-purple-500/10 via-fuchsia-500/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-extrabold shadow-2xs">
            <Users className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>👥 Meet the Team Behind Beyond Classroom</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-[#16A34A] via-[#06B6D4] via-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              People Behind
            </span>{' '}
            the Learning
          </h1>

          <p className="max-w-3xl mx-auto text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
            At Beyond Classroom, our strength lies in the people behind the content. Our team is made up of experienced educators, subject experts, and academic contributors who are passionate about making mathematics simple, structured, and accessible for every learner.
          </p>
        </div>
      </section>

      {/* CATEGORY FILTER TAB BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-slate-100/80 border border-slate-200 max-w-3xl mx-auto">
          {[
            { id: 'all', label: 'All Team Members' },
            { id: 'educator', label: 'Educators & Experts' },
            { id: 'content_specialist', label: 'Content Specialists' },
            { id: 'advisor', label: 'Curriculum Advisors' },
            { id: 'platform', label: 'Product & Platform' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#111827] shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3, 4, 5, 6, 7 — TEAM CATEGORY SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* SECTION 4 — EDUCATORS & SUBJECT EXPERTS */}
        {(activeTab === 'all' || activeTab === 'educator') && (
          <section className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/40 border border-emerald-100/90 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 text-[#16A34A] text-xs font-extrabold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Classroom Experience</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
                Educators & Subject Experts
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
                Our practice papers are designed by teachers with real classroom experience. They understand student learning patterns, common mistakes, and the level of clarity required at each grade. This ensures every practice paper is relevant, age-appropriate, and concept-focused.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {educators.map((m) => renderTeamCard(m, 'green'))}
            </div>
          </section>
        )}

        {/* SECTION 5 — ACADEMIC CONTENT SPECIALISTS */}
        {(activeTab === 'all' || activeTab === 'content_specialist') && (
          <section className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-blue-50/40 border border-blue-100/90 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-[#2563EB] text-xs font-extrabold uppercase tracking-wider">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Accuracy & Rigor</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
                Academic Content Specialists
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
                Our content team carefully reviews and refines each practice paper to maintain accuracy, consistency, and quality. Every question is checked to ensure it supports step-by-step learning and reinforces key concepts effectively.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contentSpecialists.map((m) => renderTeamCard(m, 'blue'))}
            </div>
          </section>
        )}

        {/* SECTION 6 — CURRICULUM ADVISORS */}
        {(activeTab === 'all' || activeTab === 'advisor') && (
          <section className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-purple-50/40 border border-purple-100/90 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 text-[#7C3AED] text-xs font-extrabold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>School Alignment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
                Curriculum Advisors
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
                We align our content with school standards and curriculum expectations. Our advisors ensure that students practice exactly what they need to succeed in school assessments and beyond.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advisors.map((m) => renderTeamCard(m, 'purple'))}
            </div>
          </section>
        )}

        {/* SECTION 7 — PRODUCT & PLATFORM TEAM */}
        {(activeTab === 'all' || activeTab === 'platform') && (
          <section className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-cyan-50/40 border border-cyan-100/90 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-100 text-[#06B6D4] text-xs font-extrabold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>Seamless Technology</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
                Product & Platform Team
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed">
                Our platform team focuses on creating a smooth and efficient experience, making it easy for teachers and parents to access and use practice papers without complexity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformTeam.map((m) => renderTeamCard(m, 'cyan'))}
            </div>
          </section>
        )}
      </div>

      {/* SECTION 8 — EXPERIENCE & QUALIFICATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-[#2563EB] text-xs font-extrabold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Core Pillars</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight">
            Experience That Shapes Better Learning
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Grounded in academic standards, classroom experience, and platform excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] border border-emerald-200 flex items-center justify-center text-xl">
              🎓
            </div>
            <h3 className="font-extrabold text-base text-[#111827]">Academic Expertise</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Qualified professionals contributing to mathematics learning.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center text-xl">
              👨‍🏫
            </div>
            <h3 className="font-extrabold text-base text-[#111827]">Classroom Experience</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Practical understanding of how students learn.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] border border-purple-200 flex items-center justify-center text-xl">
              📚
            </div>
            <h3 className="font-extrabold text-base text-[#111827]">Curriculum Knowledge</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Content designed around classroom and curriculum expectations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-3 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#06B6D4] border border-cyan-200 flex items-center justify-center text-xl">
              ⚙️
            </div>
            <h3 className="font-extrabold text-base text-[#111827]">Platform Expertise</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Technology designed to simplify access and practice.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9 — OUR SHARED GOAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 via-slate-900 to-slate-950 text-white shadow-2xl border border-indigo-900/60 overflow-hidden text-center space-y-6">
          {/* Subtle multicolor ambient gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 via-blue-500/10 via-purple-500/10 via-fuchsia-500/10 to-orange-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-cyan-300 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md">
              <Target className="w-3.5 h-3.5" />
              <span>Our Shared Goal</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              "To create meaningful mathematics practice that builds confidence, improves understanding, and supports long-term academic success."
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium pt-2">
              At Beyond Classroom, every practice paper reflects the combined effort of a team that believes in the power of human expertise and thoughtful learning design.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 10 — HUMAN EXPERTISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 border border-indigo-200 text-[#2563EB] flex items-center justify-center shrink-0 text-3xl">
            🧠
          </div>
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827]">
              Human Expertise. Thoughtful Learning.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              Behind every practice paper is a team that understands that effective learning is about more than questions and answers. It requires understanding how students think, where they struggle, and how concepts can be presented clearly.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 11 — FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Learn With a Team That Understands Learning
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore structured mathematics practice designed with educational expertise and thoughtful learning design.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate && onNavigate('packages')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#16A34A] via-[#06B6D4] via-[#2563EB] to-[#7C3AED] text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Our Packages</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onNavigate && onNavigate('course-content')}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Explore Class 1–8 Curriculum</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
