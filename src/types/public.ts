export type PublicPage =
  | 'home'
  | 'about'
  | 'packages'
  | 'course-content'
  | 'partners'
  | 'team'
  | 'career'
  | 'blog'
  | 'faq'
  | 'contact'
  | 'affiliate'
  | 'privacy'
  | 'refund'
  | 'terms';

export interface ClassGradeInfo {
  id: string;
  gradeNumber: number;
  title: string;
  subtitle: string;
  topicsCount: number;
  worksheetsCount: number;
  quizzesCount: number;
  keyTopics: string[];
  gradient: string;
  badgeBg: string;
  badgeText: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  description: string;
  gradesIncluded: string;
  priceINR: number;
  priceUSD: number;
  period: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  grade: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category?: 'educator' | 'content_specialist' | 'advisor' | 'platform';
  qualification: string;
  specialization?: string;
  experience?: string;
  bio: string;
  avatar: string;
  expertise?: string[];
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  logo: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  gradeLevel: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'curriculum' | 'subscriptions' | 'technical';
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}
