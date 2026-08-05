import React from 'react';
import { PublicPage } from '../../types/public';
import { Calculator, Heart, Mail, Phone, MapPin, ExternalLink, GraduationCap } from 'lucide-react';
import { CLASS_GRADES } from '../../design-system/tokens';

interface PublicFooterProps {
  onNavigate: (page: PublicPage) => void;
  onGradeSelect?: (gradeId: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, onGradeSelect }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-lg">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                BEYOND <span className="text-amber-400 font-normal">Classroom</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Beyond Classroom is an advanced visual mathematics platform for Class 1 to Class 8 students. We make abstract numbers intuitive through interactive tools, formula blueprints, and printable worksheets.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Bengaluru, Karnataka, India
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> support@beyondclassroom.in
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> +91 800-456-7890
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Pages */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase text-white tracking-wider">Quick Navigation</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packages')} className="hover:text-amber-400 transition-colors">
                  Our Package & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('course-content')} className="hover:text-amber-400 transition-colors">
                  Course & Content
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('partners')} className="hover:text-amber-400 transition-colors">
                  Our Partners
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('team')} className="hover:text-amber-400 transition-colors">
                  Our Team Members
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('career')} className="hover:text-amber-400 transition-colors">
                  Career Opportunities
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Programs */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase text-white tracking-wider">Resources & Programs</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-amber-400 transition-colors">
                  Educational Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-amber-400 transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('affiliate')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Affiliate Program</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">Earn 20%</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund')} className="hover:text-amber-400 transition-colors">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-amber-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Class 1-8 Shortcuts */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase text-white tracking-wider">Class 1 to 8 Grades</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {CLASS_GRADES.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => {
                    if (onGradeSelect) onGradeSelect(grade.id);
                    onNavigate('course-content');
                  }}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-400/50 text-left transition-colors flex items-center gap-1"
                >
                  <GraduationCap className="w-3 h-3 text-indigo-400" />
                  <span>{grade.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Beyond Classroom Technologies Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted for mathematical excellence</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Class 1 to Class 8</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
