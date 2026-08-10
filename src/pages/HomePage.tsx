import React from 'react';
import { HeroSection } from '../components/public/HeroSection';
import { ClassCurriculumSection } from '../components/public/ClassCurriculumSection';
import { PricingSection } from '../components/public/PricingSection';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { PublicPage } from '../types/public';

interface HomePageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onGradeSelect?: (gradeId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth, onGradeSelect }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <HeroSection onNavigate={onNavigate} onOpenAuth={onOpenAuth} />

      {/* 2. Class 1-8 Curriculum Showcase */}
      <ClassCurriculumSection onNavigate={onNavigate} onGradeSelect={onGradeSelect} />

      {/* 3. Packages & Pricing */}
      <PricingSection onNavigate={onNavigate} onOpenAuth={onOpenAuth} />

      {/* 4. Testimonials */}
      <TestimonialsSection />
    </div>
  );
};

