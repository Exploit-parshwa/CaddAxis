# 🏛️ Software Architecture Document
## CADD Axis — Code Architecture Analysis & Improvement Proposals
**Version:** 2.0 | **Date:** March 10, 2026

---

## 1. Folder Structure

```
CaddAxis/
├── .env                          # Environment variables
├── .env.example                  # Template for new developers
├── .gitignore                    # Git exclusions
├── package.json                  # NPM dependencies & scripts
├── package-lock.json             # Dependency lock file
├── next.config.mjs               # Next.js configuration (minimal)
├── jsconfig.json                 # Path aliases (@/ → src/)
├── caddaxis.db                    # Legacy SQLite database (deprecated)
├── check_schema.js               # Utility: print table schema
│
├── *.txt / *.md                  # 12+ audit/deployment/test reports
│
├── scripts/                      # Database management scripts
│   ├── init-db.js                # SQLite initial schema (legacy)
│   ├── init-mysql.js             # MySQL schema initialization
│   ├── seed-course-details.js    # Seed courses from static data
│   ├── update-schema.js          # Schema V1 migration
│   ├── update-schema-v2.js       # Schema V2 migration
│   ├── update-schema-v3.js       # Schema V3 migration
│   ├── update-mysql.js           # MySQL-specific updates
│   ├── add-otp-columns.js        # Add OTP fields to student_auth
│   ├── test-db.js                # Database connection test
│   ├── test-email.js             # Email sending test
│   ├── check_franchise.mjs       # Verify franchise data
│   └── create_ajara_franchise.mjs # Create test franchise
│
├── public/                       # Static assets
│   ├── images/                   # Page images (hero, student work)
│   ├── logos/                    # Brand logos (CaddAxis + colleges)
│   └── uploads/                  # User-uploaded files (runtime)
│
├── php_frontend/                 # Legacy PHP conversion attempt
│   ├── index.php                 # PHP homepage
│   ├── login.php                 # PHP login page
│   ├── courses.php               # PHP courses page
│   ├── contact.php               # PHP contact page
│   ├── events.php / franchise.php
│   ├── css/                      # PHP stylesheets
│   ├── js/                       # PHP scripts
│   ├── includes/                 # PHP header/footer partials
│   └── assets/                   # PHP static assets
│
└── src/                          # ✅ MAIN APPLICATION SOURCE
    ├── middleware.js              # Route protection (JWT validation)
    │
    ├── app/                      # Next.js App Router pages
    │   ├── layout.js             # Root HTML layout + metadata/SEO
    │   ├── page.js               # Homepage component (landing page)
    │   ├── page.module.css       # Homepage-specific styles
    │   ├── globals.css           # Global stylesheet (12KB)
    │   ├── favicon.ico           # Browser tab icon
    │   ├── sitemap.js            # Dynamic sitemap generator
    │   ├── robots.js             # Robots.txt generator
    │   ├── actions.js            # ⭐ SERVER ACTIONS (1517 LOC, 60+ functions)
    │   ├── actions_franchise.js  # Franchise-specific server actions (309 LOC)
    │   │
    │   ├── about/page.js         # About page
    │   ├── contact/              # Contact page + form submission
    │   ├── courses/              # Course listing + [slug] detail pages
    │   ├── events/page.js        # Public events listing
    │   ├── franchise/page.js     # Franchise opportunity page
    │   ├── locations/page.js     # Franchise locations page
    │   ├── verify/               # Certificate verification
    │   │   ├── page.js           # Verification search
    │   │   └── [id]/page.js      # Specific cert display
    │   │
    │   ├── admin/                # ⭐ ADMIN PANEL (21 sub-routes)
    │   │   ├── layout.js         # Sidebar + main content wrapper
    │   │   ├── login/page.js     # Admin login form
    │   │   ├── dashboard/page.js # Stats dashboard
    │   │   ├── students/page.js  # Student CRUD (688 LOC)
    │   │   ├── courses/page.js   # Course CRUD
    │   │   ├── fees/page.js      # Fee management
    │   │   ├── payments/page.js  # Payment records
    │   │   ├── payments/approvals/ # Wallet recharge approvals
    │   │   ├── certificates/page.js
    │   │   ├── marksheet/page.js
    │   │   ├── exams/page.js
    │   │   ├── staff/page.js
    │   │   ├── event-management/page.js
    │   │   ├── contact-messages/page.js
    │   │   ├── franchise-enquiries/page.js
    │   │   ├── franchise-list/page.js
    │   │   ├── franchise-map/page.js
    │   │   ├── institute-info/page.js
    │   │   ├── accounts/page.js
    │   │   ├── reports/page.js
    │   │   ├── recharge/page.js
    │   │   ├── online-classes/   # Live class management
    │   │   │   └── live/[roomId]/page.js
    │   │   └── website/page.js
    │   │
    │   ├── franchise-panel/      # ⭐ FRANCHISE PORTAL (9 sub-routes)
    │   │   ├── layout.js         # Franchise sidebar
    │   │   ├── login/page.js
    │   │   ├── dashboard/page.js
    │   │   ├── students/page.js
    │   │   ├── certificates/page.js
    │   │   ├── courses/page.js
    │   │   ├── staff/page.js
    │   │   ├── exams/page.js
    │   │   ├── fees/page.js
    │   │   └── wallet/page.js
    │   │
    │   ├── student/              # ⭐ STUDENT PORTAL
    │   │   ├── layout.js         # Minimal wrapper
    │   │   ├── auth/page.js      # Login/Signup forms
    │   │   ├── dashboard/page.js # Student dashboard
    │   │   └── live/page.js      # Live class viewer
    │   │
    │   └── test-schema/page.js   # Dev: DB schema inspection tool
    │
    ├── components/               # ⭐ REUSABLE COMPONENTS (22 files)
    │   ├── Navbar.js             # Main navigation bar
    │   ├── Navbar.module.css     # Navbar styles
    │   ├── Footer.js             # Site footer
    │   ├── CustomCursor.js       # Mouse follower effect
    │   ├── HeroSection.js        # Landing page hero
    │   ├── MagneticHeroContent.js # Interactive hero text
    │   ├── Aurora.js             # WebGL aurora effect
    │   ├── Silk.js               # WebGL silk shader
    │   ├── TechAnim.js           # Technology showcase animation
    │   ├── CivilHeroAnim.js      # Civil engineering animation
    │   ├── GradientBlinds.js     # CSS gradient transition
    │   ├── MeetingRoom.js        # 3D meeting room scene
    │   ├── AnimatedCounter.js    # Number counting animation
    │   ├── EnquiryForm.js        # Contact/enquiry form
    │   ├── EnvelopeSection.js    # Animated envelope section
    │   ├── FranchiseApplicationForm.js # Franchise application
    │   ├── FranchiseGrowthAnim.js # Franchise growth visualization
    │   ├── FranchiseMap.js       # Google Maps integration
    │   ├── StudentAccessSection.js # Student portal promo
    │   ├── SyllabusViewer.js     # Accordion syllabus display
    │   ├── SecureContent.js      # Auth-gated content wrapper
    │   └── JsonLd.js             # JSON-LD structured data
    │
    ├── data/
    │   └── courses.js            # Static course catalog (15 courses)
    │
    ├── database/                 # SQL schema definitions
    │   ├── franchise_schema_master.sql  # V1.1 master schema
    │   └── schema_v2.sql         # V2 migration SQL
    │
    ├── lib/                      # Shared utilities
    │   ├── db.js                 # MySQL connection pool
    │   └── email.js              # Nodemailer SMTP configuration
    │
    ├── pages/                    # Pages Router (legacy)
    │   └── api/                  # API routes (if any)
    │
    └── scripts/                  # Source-level scripts
        ├── debug_schema.js
        ├── deploy_franchise_schema.js
        ├── fix_db_and_add_franchise.js
        ├── seed_courses.js
        ├── setup_franchise_db.js
        └── update_db_schema.js
```

---

## 2. Role of Each Major Directory

| Directory | Role | Key Insight |
|---|---|---|
| `src/app/` | Next.js App Router — all pages and server actions | Heart of the application; file-system routing |
| `src/app/admin/` | Admin panel with 21 protected routes | Role-based sidebar; shared layout.js |
| `src/app/franchise-panel/` | Dedicated franchise portal (separate from admin) | Own sidebar; cookie-based auth (not JWT) |
| `src/app/student/` | Student self-service portal | JWT auth with 7-day expiry |
| `src/components/` | 22 reusable React components | Mix of UI (Navbar) and effects (Aurora, Silk) |
| `src/lib/` | 2 shared service singletons | Database pool + Email transport |
| `src/data/` | Static seed data | 15 hardcoded courses (sync disabled) |
| `src/database/` | SQL schema files for reference | Not auto-executed; manual apply |
| `scripts/` | CLI tools for DB operations | Run with `node scripts/init-db.js` |
| `php_frontend/` | Abandoned PHP conversion | Not actively maintained |
| `public/` | Static assets served directly | Images, logos, runtime uploads |

---

## 3. Code Patterns Used

### 3.1 Architecture Pattern: **Server Actions Monolith**

The application does NOT follow MVC, Clean Architecture, or any formal layered pattern. Instead, it uses a pragmatic pattern native to Next.js:

```
┌──────────────────────────────────────────┐
│  Page Component (View + Controller)      │
│  - State management with useState/useEffect
│  - Event handlers call server actions     │
│  - Renders JSX based on fetched data     │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│  Server Actions (Model + Business Logic) │
│  - Auth verification                     │
│  - Input validation                      │
│  - Raw SQL queries                       │
│  - Transaction management                │
│  - Error handling + self-healing         │
└──────────────────────────────────────────┘
```

**Characteristics:**
- No separate controller layer
- No service/repository pattern
- No DTO/validation layer
- No middleware chain beyond route protection
- All business logic in 2 files (~1800 LOC total)

### 3.2 Authentication Pattern: **Dual-Cookie JWT**
- HttpOnly cookie (`admin_session`) for security
- Readable cookie (`ui_role`) for client-side UI decisions
- Two verification libraries: `jose` (middleware/edge) + `jsonwebtoken` (server actions/node)

### 3.3 Data Access Pattern: **Raw SQL with Connection Pool**
- Direct mysql2/promise pool queries
- Parameterized queries for SQL injection prevention
- Manual transaction management (BEGIN/COMMIT/ROLLBACK)
- FOR UPDATE row locks for financial operations

### 3.4 Error Handling Pattern: **Self-Healing Schema**
Functions detect missing tables/columns and auto-create them:
```javascript
catch (e) {
    if (e.code === 'ER_BAD_FIELD_ERROR') {
        await pool.query("ALTER TABLE courses ADD COLUMN tag VARCHAR(100)");
        // Retry the original query
    }
}
```

### 3.5 Multi-Tenancy Pattern: **Application-Level Row Filtering**
```javascript
if (user.role === 'FRANCHISE_ADMIN') {
    sql += ' WHERE franchise_id = ?';
    params.push(user.franchiseId);
}
```

### 3.6 State Management: **Local Component State**
- No global state (no Redux, Zustand, Context API)
- Each page independently fetches and manages its data
- No shared state between admin pages

---

## 4. Core Modules

### Module 1: Authentication & Authorization
- **Files:** `actions.js` (L42-70, 184-266, 670-828), `middleware.js`
- **Functions:** `verifyAdminSession`, `authenticateAdmin`, `studentSignUp`, `studentSignIn`
- **Pattern:** JWT tokens in HttpOnly cookies, bcrypt for passwords

### Module 2: Student Management
- **Files:** `actions.js` (L268-311, 831-835, 1411-1516), `admin/students/page.js`
- **Functions:** `getStudents`, `createStudent`, `updateStudent`, `deleteStudent`, `approveAdmission`, `confirmStudentAdmission`
- **Pattern:** CRUD with role-based filtering + admission workflow

### Module 3: Financial System
- **Files:** `actions.js` (L313-470, 836-982), `actions_franchise.js` (L182-232)
- **Functions:** `getPayments`, `createPayment`, `getWalletBalance`, `rechargeWallet`, `submitRechargeRequest`, `processRecharge`, `addFranchiseCredits`
- **Pattern:** Transactional operations with row-level locking

### Module 4: Certificate System
- **Files:** `actions.js` (L371-434, 838-903), `actions_franchise.js` (L234-281)
- **Functions:** `getCertificates`, `createCertificate`, `requestCertificate`, `issueFranchiseCertificate`
- **Pattern:** Wallet deduction + unique ID enforcement + email notification

### Module 5: Course Management
- **Files:** `actions.js` (L472-544), `data/courses.js`
- **Functions:** `getCourses`, `createCourse`, `updateCourse`, `getCourseBySlug`, `deleteCourse`
- **Pattern:** CRUD with slug-based routing + static seed data

### Module 6: Franchise Management
- **Files:** `actions_franchise.js` (all), `actions.js` (L100-168)
- **Functions:** `createFranchise`, `getFranchises`, `getFranchiseStats`, `deleteFranchise`, `getInstituteInfo`
- **Pattern:** CRUD + statistics aggregation + geographic location data

### Module 7: E-Learning
- **Files:** `actions.js` (L1029-1136)
- **Functions:** `createLiveClass`, `getLiveClasses`, `createRecordedSession`, `getRecordedSessions`, `getStudentDashboard`
- **Pattern:** Content tied to course names; access gated by enrollment status

---

## 5. Dependency Analysis

| Package | Version | Usage | Critical? |
|---|---|---|---|
| `next` | 16.1.1 | Core framework | ✅ Critical |
| `react` / `react-dom` | 19.2.3 | UI rendering | ✅ Critical |
| `mysql2` | 3.16.0 | Database driver | ✅ Critical |
| `jsonwebtoken` | 9.0.3 | JWT for server actions | ✅ Critical |
| `jose` | 6.1.3 | JWT for middleware (Edge) | ✅ Critical |
| `bcryptjs` | 3.0.3 | Password hashing | ✅ Critical |
| `nodemailer` | 7.0.12 | Email dispatch | ⚡ Important |
| `framer-motion` | 12.23.26 | Page animations | 🎨 Enhancement |
| `lucide-react` | 0.562.0 | Icon library | 🎨 Enhancement |
| `@react-google-maps/api` | 2.20.8 | Franchise map visualization | 🎨 Enhancement |
| `jspdf` | 3.0.4 | PDF generation (certificates) | ⚡ Important |
| `jspdf-autotable` | 5.0.2 | Table formatting in PDFs | ⚡ Important |
| `qrcode.react` | 4.2.0 | QR codes on certificates | ⚡ Important |
| `ogl` | 1.0.11 | WebGL effects (Aurora/Silk) | 🎨 Enhancement |
| `clsx` | 2.1.1 | className utility | 🔧 Utility |
| `dotenv` | 17.2.3 | Environment variable loading | 🔧 Utility |
| `socket.io` | 4.8.3 | Real-time (live classes) | 🔮 Future |
| `socket.io-client` | 4.8.3 | Client-side real-time | 🔮 Future |
| `better-sqlite3` | 12.5.0 | Legacy SQLite (unused in prod) | ⚠️ Legacy |
| `@radix-ui/react-icons` | 1.3.2 | Additional icon set | ⚠️ Redundant |
| `prisma` (dev) | 7.2.0 | ORM (not actively used) | ⚠️ Unused |

### Cleanup Suggestions
- Remove `better-sqlite3` (legacy; MySQL is primary)
- Remove `@radix-ui/react-icons` (redundant with `lucide-react`)
- Remove `prisma` (not used in active codebase)
- Evaluate `socket.io` — either implement WebSocket features or remove

---

## 6. Data Flow Inside the Application

```
    ┌─────────────────────────────────────────────────────┐
    │                  CLIENT (Browser)                   │
    │                                                     │
    │  [Page Load]                                        │
    │      │                                              │
    │      ▼                                              │
    │  useEffect → call serverAction()                    │
    │      │                                              │
    │      ▼                                (RPC over     │
    │  [Server Action Call]  ─────────────── HTTP)        │
    │      │                                              │
    │      ▼                                              │
    │  [Receive Response] → setState()                    │
    │      │                                              │
    │      ▼                                              │
    │  [Re-render UI]                                     │
    │                                                     │
    │  [User Action (Form Submit / Button Click)]         │
    │      │                                              │
    │      ▼                                              │
    │  call serverAction(formData / params)               │
    │      │                                              │
    │      ▼                                              │
    │  [Receive {success: true/false}]                    │
    │      │                                              │
    │      ▼                                              │
    │  [Show toast/alert + refresh data]                  │
    └─────────────────────────────────────────────────────┘
                         │
                         │ RPC Call (Next.js Server Action)
                         ▼
    ┌─────────────────────────────────────────────────────┐
    │                  SERVER (Next.js)                   │
    │                                                     │
    │  1. Deserialize arguments                           │
    │  2. verifyAdminSession() → jwt.verify()             │
    │  3. Extract role, franchiseId from JWT              │
    │  4. Build SQL query (with role-based WHERE clause)  │
    │  5. pool.query(sql, params) → MySQL                 │
    │  6. Process results (aggregation, formatting)       │
    │  7. Return plain JS object (auto-serialized)        │
    │                                                     │
    │  For mutations:                                     │
    │  5a. pool.getConnection()                           │
    │  5b. connection.beginTransaction()                  │
    │  5c. Execute multiple queries                       │
    │  5d. connection.commit() or .rollback()             │
    │  5e. connection.release()                           │
    └─────────────────────────────────────────────────────┘
```

---

## 7. Proposed Better Architecture

### Current Issues
1. **Single-file business logic** (`actions.js` = 1517 LOC) — hard to navigate, test, and maintain
2. **No input validation layer** — basic field checks mixed with business logic
3. **No TypeScript** — no compile-time type safety
4. **No testing** — zero test files in the project
5. **Inline styles** — all admin pages use inline React styles (not CSS classes)
6. **No state management** — each page refetches data independently
7. **No error boundary** — unhandled errors crash pages silently

### Proposed: Modular Layered Architecture

```
src/
├── app/                          # Pages (View Layer)
│   ├── (public)/                 # Public pages group
│   ├── (admin)/                  # Admin pages group
│   ├── (franchise)/              # Franchise pages group
│   └── (student)/                # Student pages group
│
├── actions/                      # Server Actions (Controller Layer)
│   ├── auth.actions.ts           # Authentication only
│   ├── student.actions.ts        # Student CRUD
│   ├── course.actions.ts         # Course CRUD
│   ├── payment.actions.ts        # Financial operations
│   ├── certificate.actions.ts    # Certificate system
│   ├── franchise.actions.ts      # Franchise management
│   ├── exam.actions.ts           # Exam management
│   ├── content.actions.ts        # Live classes, recordings
│   └── enquiry.actions.ts        # Contact, franchise enquiries
│
├── services/                     # Business Logic (Service Layer)
│   ├── auth.service.ts           # JWT creation, verification
│   ├── wallet.service.ts         # Wallet operations
│   ├── email.service.ts          # Email templates + dispatch
│   └── certificate.service.ts    # Certificate generation logic
│
├── repositories/                 # Data Access (Repository Layer)
│   ├── student.repository.ts     # Student SQL queries
│   ├── course.repository.ts      # Course SQL queries
│   ├── franchise.repository.ts   # Franchise SQL queries
│   └── base.repository.ts        # Shared query helpers
│
├── schemas/                      # Input Validation (Zod)
│   ├── student.schema.ts
│   ├── course.schema.ts
│   └── payment.schema.ts
│
├── types/                        # TypeScript Interfaces
│   ├── student.types.ts
│   ├── course.types.ts
│   └── auth.types.ts
│
├── components/                   # UI Components
│   ├── ui/                       # Atomic components (Button, Card, Input)
│   ├── layout/                   # Layout components (Sidebar, Header)
│   ├── effects/                  # Visual effects (Aurora, Silk)
│   └── forms/                    # Form components
│
├── hooks/                        # Custom React Hooks
│   ├── useAuth.ts                # Auth state management
│   ├── useFetch.ts               # Data fetching with loading/error states
│   └── useToast.ts               # Notification system
│
├── lib/                          # Infrastructure
│   ├── db.ts                     # Connection pool
│   ├── email.ts                  # SMTP transport
│   ├── cache.ts                  # Redis cache wrapper
│   └── logger.ts                 # Structured logging
│
├── middleware.ts                  # Route protection
│
└── __tests__/                    # Test files
    ├── actions/
    ├── services/
    └── repositories/
```

### Key Improvements

| Current | Proposed |
|---|---|
| 1 monolithic actions.js (1517 LOC) | 9 focused action files (~150 LOC each) |
| Raw SQL in business logic | Repository pattern isolates data access |
| No input validation | Zod schemas for every mutation |
| JavaScript | TypeScript with strict mode |
| Inline styles | Component library with design tokens |
| No tests | Jest + Testing Library |
| console.log logging | Pino structured logging |
| No caching | Redis cache layer |
| No error boundaries | React Error Boundaries + Sentry |
