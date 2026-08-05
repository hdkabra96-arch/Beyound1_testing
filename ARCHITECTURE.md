# Beyond Classroom — System Architecture & Technical Specification

> **Platform Overview**: Production-Ready Educational Platform delivering Mathematics study materials for Class 1 to Class 8 students. Designed for scale (100,000+ active students), high security, low-latency delivery, and multi-currency subscription monetisation.

---

## Technical Stack Overview

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 14+ (App Router), React 19, TypeScript |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion |
| **Backend & Database** | Supabase (PostgreSQL 15+, Supabase Auth, Supabase Storage, Edge Functions) |
| **State Management** | TanStack Query v5 (Server state), Zustand (Global UI/session state) |
| **Charts & Visualization**| Recharts |
| **Icons** | Lucide React |
| **Payment Gateways** | Razorpay (Domestic INR), Stripe (Global USD/Multi-currency) |
| **Deployment & Edge** | Vercel (Edge Middleware, Serverless Functions, CDN) |

---

## 1. Folder Structure (`Next.js App Router`)

```
beyond-classroom/
├── .env.example
├── .gitignore
├── README.md
├── ARCHITECTURE.md
├── next.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
│
├── public/
│   ├── assets/
│   │   ├── branding/
│   │   └── grade-badges/          # Class 1 to Class 8 icons
│   └── favicon.ico
│
├── supabase/
│   ├── config.toml
│   ├── functions/                 # Supabase Edge Functions
│   │   ├── razorpay-webhook/
│   │   ├── stripe-webhook/
│   │   ├── process-pdf-upload/
│   │   └── calculate-affiliate-payouts/
│   ├── migrations/                # Database Migrations
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_rls_policies.sql
│   │   └── 0003_functions_triggers.sql
│   └── seed.sql                   # Sample curriculum for Class 1-8
│
└── src/
    ├── app/                       # Next.js App Router Hierarchy
    │   ├── (public)/              # Marketing & Public pages
    │   │   ├── page.tsx           # Landing Page
    │   │   ├── curriculum/        # Class 1-8 Curriculum overview
    │   │   ├── pricing/           # Subscription Plans
    │   │   └── layout.tsx
    │   │
    │   ├── (auth)/                # Authentication Routes
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── reset-password/
    │   │   ├── verify-email/
    │   │   └── layout.tsx
    │   │
    │   ├── (dashboard)/           # Authenticated Portals
    │   │   ├── student/           # Student Portal
    │   │   │   ├── page.tsx
    │   │   │   ├── class/[gradeId]/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── subject/[topicId]/
    │   │   │   ├── worksheets/
    │   │   │   ├── progress/
    │   │   │   └── subscription/
    │   │   │
    │   │   ├── admin/             # Admin & Staff Portal
    │   │   │   ├── page.tsx
    │   │   │   ├── curriculum-manager/
    │   │   │   ├── students/
    │   │   │   ├── subscriptions/
    │   │   │   ├── file-library/
    │   │   │   └── analytics/
    │   │   │
    │   │   ├── affiliate/         # Affiliate Partner Portal
    │   │   │   ├── page.tsx
    │   │   │   ├── links/
    │   │   │   ├── conversions/
    │   │   │   └── payouts/
    │   │   │
    │   │   └── layout.tsx         # Dashboard Common Layout
    │   │
    │   └── api/                   # Serverless Next.js API Routes
    │       ├── auth/
    │       │   └── callback/route.ts
    │       ├── webhooks/
    │       │   ├── razorpay/route.ts
    │       │   └── stripe/route.ts
    │       ├── payments/
    │       │   ├── razorpay-order/route.ts
    │       │   └── stripe-checkout/route.ts
    │       └── download/
    │           └── signed-url/route.ts
    │
    ├── components/                # Modular Component Library
    │   ├── ui/                    # Base Primitives (Button, Dialog, Input, Card)
    │   ├── common/                # Navbar, Footer, Sidebar, PageHeader
    │   ├── public/                # HeroSection, ClassGrid, PricingCard
    │   ├── student/               # MaterialViewer, ProgressTracker, QuizCard
    │   ├── admin/                 # MaterialUploader, StudentTable, StatsWidget
    │   ├── affiliate/             # ReferralLinkCard, EarningsChart
    │   └── charts/                # Recharts wrappers (ProgressChart, RevenueChart)
    │
    ├── core/                      # Core Business Architecture
    │   ├── auth/                  # RBAC, Guards, Session helpers
    │   ├── payments/              # Razorpay/Stripe abstractions
    │   └── storage/               # File processing & Signed URL generators
    │
    ├── lib/                       # External SDK Initializers
    │   ├── supabase/
    │   │   ├── client.ts          # Browser Supabase Client
    │   │   ├── server.ts          # Server Component Supabase Client
    │   │   └── middleware.ts      # Auth Middleware Session Refresher
    │   ├── razorpay.ts
    │   ├── stripe.ts
    │   └── utils.ts               # Helpers & Classnames merger
    │
    ├── store/                     # Client Zustand Stores
    │   ├── useUserStore.ts
    │   ├── useCartStore.ts
    │   └── useUIStore.ts
    │
    ├── types/                     # TypeScript Interfaces & DB Definitions
    │   ├── database.types.ts      # Auto-generated Supabase types
    │   ├── curriculum.ts
    │   ├── payment.ts
    │   └── user.ts
    │
    └── middleware.ts              # Next.js Global Edge Middleware
```

---

## 2. Routing Structure & Middleware Security

The application utilizes Next.js App Router route groups `(public)`, `(auth)`, and `(dashboard)` to segregate layout concerns, combined with Next.js Edge Middleware for non-bypassable authentication and role checks.

### Edge Middleware Route Guard Logic (`/src/middleware.ts`)
```ts
// Pseudocode outline for Edge Guard Routing
const PUBLIC_ROUTES = ['/', '/pricing', '/curriculum', '/about'];
const AUTH_ROUTES = ['/login', '/register', '/reset-password'];
const ROLE_ROUTE_PREFIXES = {
  student: '/student',
  admin: '/admin',
  affiliate: '/affiliate',
};

// 1. Refresh Supabase auth session token in cookies
// 2. Unauthenticated user trying to access /student, /admin, or /affiliate -> Redirect to /login
// 3. Authenticated user trying to access /login -> Redirect to role-appropriate portal
// 4. Role mismatch (e.g. Student trying to access /admin) -> Forbidden (403) or redirect to /student
```

---

## 3. State Management Architecture

A hybrid state pattern separates transient client UI states from server-authoritative data:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STATE MANAGEMENT LAYER                          │
├───────────────────────────────────┬────────────────────────────────────┤
│     Server-Authoritative State    │         Client Local State         │
│     (TanStack / React Query)      │             (Zustand)              │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Study Material Collections      │ • Active Active Class (1-8) Filter │
│ • Subscription Status & Invoices  │ • Sidebar Toggle & UI Modals       │
│ • Student Quiz Results & Progress │ • Current Audio/PDF Reader Zoom    │
│ • Affiliate Conversion Logs       │ • Toast Notifications Queue        │
│ • Real-time Supabase Data Sync    │ • Draft Form Data                  │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 4. Database Schema & RLS Architecture (PostgreSQL + Supabase)

### Complete DDL Script Specification

```sql
-- ENABLE REQUIRED EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('student', 'parent', 'admin', 'super_admin', 'affiliate');
CREATE TYPE grade_level AS ENUM ('class_1', 'class_2', 'class_3', 'class_4', 'class_5', 'class_6', 'class_7', 'class_8');
CREATE TYPE material_type AS ENUM ('worksheet', 'formula_sheet', 'video_lesson', 'quiz_paper', 'solution_guide');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'expired', 'trialing');
CREATE TYPE payment_gateway AS ENUM ('razorpay', 'stripe');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    grade grade_level,
    phone_number TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CURRICULUM SUBJECTS & CHAPTERS
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grade grade_level NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    chapter_number INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(grade, chapter_number)
);

CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    topic_order INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. STUDY MATERIALS (PDFs, Worksheets, Solutions)
CREATE TABLE public.study_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    material_type material_type NOT NULL,
    file_path TEXT NOT NULL, -- Path in Supabase Storage
    file_size_bytes BIGINT NOT NULL,
    is_preview_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SUBSCRIPTION PLANS & TRANSACTIONS
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    grade_access grade_level[], -- Array of grades included or NULL for all
    price_inr NUMERIC(10,2) NOT NULL,
    price_usd NUMERIC(10,2) NOT NULL,
    duration_months INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    status subscription_status NOT NULL DEFAULT 'active',
    payment_gateway payment_gateway NOT NULL,
    gateway_subscription_id TEXT,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENT TRANSACTIONS LOG
CREATE TABLE public.payment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    subscription_id UUID REFERENCES public.user_subscriptions(id),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    gateway payment_gateway NOT NULL,
    gateway_payment_id TEXT UNIQUE NOT NULL,
    gateway_order_id TEXT,
    status TEXT NOT NULL,
    raw_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDENT PROGRESS TRACKING
CREATE TABLE public.student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES public.study_materials(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    score_percentage INT,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, material_id)
);

-- 7. AFFILIATE SYSTEM
CREATE TABLE public.affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    commission_rate_percentage NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    total_earnings NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.referral_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id),
    referred_user_id UUID NOT NULL REFERENCES public.profiles(id),
    payment_id UUID NOT NULL REFERENCES public.payment_logs(id),
    commission_amount NUMERIC(10,2) NOT NULL,
    payout_status payout_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- SAMPLE RLS POLICIES
-- Students can read study materials if preview allowed OR active subscription covers grade
CREATE POLICY "Access materials based on subscription" ON public.study_materials
FOR SELECT USING (
    is_preview_allowed = TRUE
    OR EXISTS (
        SELECT 1 FROM public.user_subscriptions us
        JOIN public.subscription_plans sp ON us.plan_id = sp.id
        JOIN public.topics t ON study_materials.topic_id = t.id
        JOIN public.chapters c ON t.chapter_id = c.id
        WHERE us.user_id = auth.uid()
          AND us.status = 'active'
          AND us.current_period_end > NOW()
          AND (c.grade = ANY(sp.grade_access) OR sp.grade_access IS NULL)
    )
    OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);
```

---

## 5. Authentication Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE AUTHENTICATION                         │
└────────────────────────────────────────────────────────────────────────┘
    │                                                                │
    ├──> 1. Student / Parent Sign Up (Email/Password or Google OAuth)│
    │    └── Trigger inserts default 'student' record into `profiles`│
    │                                                                │
    ├──> 2. Login Flow                                               │
    │    ├── Validates credentials via Supabase Auth                 │
    │    ├── Issues HTTP-Only JWT Cookie (`sb-access-token`)         │
    │    └── Next.js Middleware reads token & inspects `profiles`    │
    │                                                                │
    └──> 3. Session Persistence & Security                           │
         ├── Automatic JWT refresh on client/server via middleware   │
         └── Auto logout on cookie expiration or active revocation   │
```

---

## 6. Role-Based Access Control (RBAC) Matrix

| Feature / Resource | Public Guest | Student | Parent | Admin | Affiliate |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Landing Page & Curriculum Previews** | ✅ Read | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| **Class 1-8 Full Study Materials** | ❌ Blocked | 🔐 Subscribed | 🔐 Subscribed | ✅ Full | ❌ Blocked |
| **Progress Tracking & Test History** | ❌ Blocked | 👤 Own Only | 👤 Child Only | ✅ All | ❌ Blocked |
| **Content Upload & Management** | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Full | ❌ Blocked |
| **Referral Link & Earnings Dashboard**| ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ View All | 👤 Own Only |
| **Subscription & Payment Analytics** | ❌ Blocked | ❌ Blocked | ❌ Blocked | ✅ Full | ❌ Blocked |

---

## 7. File Upload & Storage Architecture

Study materials (Worksheets, Formula Books, Answer Keys in PDF format) are protected from unauthorized direct download links using Supabase Storage and Time-Limited Signed URLs.

```
                    ┌──────────────────────────────┐
                    │ Admin Uploads Worksheet PDF │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                   ┌────────────────────────────────┐
                   │ Private Bucket: `math-materials`│
                   └──────────────┬─────────────────┘
                                   │
             ┌─────────────────────┴─────────────────────┐
             │ Request Download / Stream Material         │
             └─────────────────────┬─────────────────────┘
                                   │
                                   ▼
                 ┌───────────────────────────────────┐
                 │ Next.js Server API:               │
                 │ `/api/download/signed-url`        │
                 └─────────────────┬─────────────────┘
                                   │
                      Is Subscription Active?
                     ┌─────────────┴─────────────┐
                    YES                         NO
                     │                           │
                     ▼                           ▼
      Generate 60-Second Signed URL         403 Forbidden
      `supabase.storage.createSignedUrl`    Redirect to Pricing
```

---

## 8. Payment Architecture (Dual Gateway)

The architecture natively supports multi-currency options tailored for both domestic and global students:

- **Razorpay**: Handles INR currency payments via UPI, NetBanking, Debit/Credit Cards in India.
- **Stripe**: Handles USD and multi-currency global transactions.

```
                  ┌────────────────────────────────┐
                  │ Student selects Class Plan     │
                  └───────────────┬────────────────┘
                                  │
                   Currency Check (INR vs USD)
                  ┌───────────────┴────────────────┐
                INR                               USD
                 │                                 │
                 ▼                                 ▼
   Calls `/api/payments/razorpay-order`   Calls `/api/payments/stripe-checkout`
                 │                                 │
                 ▼                                 ▼
       Razorpay SDK Modal                 Stripe Checkout Page
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
                         Webhook Verification
                                  │
                 ┌────────────────┴────────────────┐
                 │ Supabase Webhook Handler       │
                 │ - Verifies cryptographic HMAC  │
                 │ - Guarantees Idempotency       │
                 │ - Provisions `user_subscription`│
                 │ - Credits Affiliate Commission  │
                 └─────────────────────────────────┘
```

---

## 9. Subscription Architecture

1. **Grade-Level Access**:
   - **Single Grade Pass**: Access to materials for a specific class (e.g., Class 5 Mathematics).
   - **All-Access Primary Pass**: Access to Class 1 through Class 5.
   - **All-Access Middle School Pass**: Access to Class 6 through Class 8.
   - **Complete K-8 Pass**: Full access to all study materials for all grades.
2. **Billing Frequencies**: Annual (12 months) and Monthly options.
3. **Grace Period & Retry Logic**: Failed renewal payments allow a 3-day grace period before access revocation (`status = 'past_due'`).

---

## 10. Admin Architecture

The Admin Portal (`/admin`) serves as the central command center for educators and managers:

- **Curriculum Management**: Interactive hierarchy tree to create Chapters, Topics, and attach Worksheets or Answer Guides for Class 1 to Class 8.
- **Material Processing**: Drag-and-Drop uploader supporting chunked uploads for large PDF files, automatic thumbnail extraction, and setting preview flags.
- **Student Analytics**: Active user counts, top downloaded worksheets, average quiz completion rates using Recharts.
- **Revenue Management**: Payment log audit trails, refund toggles, and gateway sync controls.

---

## 11. Student Architecture

The Student Portal (`/student`) prioritizes clarity, encouraging visual learning suited for young learners (Class 1-8):

- **Class Selector**: Quick navigation between Class 1 and Class 8.
- **Visual Topic Explorer**: Color-coded topic cards (e.g., Fractions, Geometry, Algebra, Number Systems) with progress indicators.
- **Interactive PDF Viewer**: Embedded, secure canvas reader with page bookmarking, zoom, and completion toggles.
- **Worksheet & Quiz Engine**: Gamified quizzes with instant score reports, detailed step-by-step solutions, and printable practice sets.

---

## 12. Affiliate Architecture

The Affiliate Portal (`/affiliate`) enables educators, schools, and partners to promote the platform:

- **Unique Code & Link Generator**: Custom referral link creation (`beyondclassroom.com/?ref=TEACHER_JOHN`).
- **Conversion Tracking Engine**: Middleware captures the `ref` cookie parameter (30-day attribution window).
- **Automated Payout Calculations**: Webhook trigger automatically credits 15% commission to the referring affiliate upon successful subscription payment.
- **Analytics Dashboard**: Real-time Recharts graphs for Impressions, Clicks, Conversions, and Pending vs Payout Balances.

---

## Verification & Deployment Strategy

- **Build Pipeline**: Vercel CI/CD pipeline running `next build` with TypeScript strict checks.
- **Environment Configuration**: Key declarations managed safely via `.env.example`.
