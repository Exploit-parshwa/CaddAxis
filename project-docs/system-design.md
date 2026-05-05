# 🏗️ System Design Document
## CADD Axis — Complete Technical Architecture
**Version:** 2.0 | **Date:** March 10, 2026

---

## 1. High-Level Architecture

CADD Axis follows a **Monolithic Full-Stack** architecture using Next.js as both the frontend framework and backend server, communicating directly with MySQL through a connection pool.

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│                                                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│   │ Public Pages │  │ Admin Panel  │  │Student Portal│      │
│   │  (SSR/CSR)   │  │  (CSR Only)  │  │  (CSR Only)  │      │
│   │ Next.js App  │  │ Next.js App  │  │ Next.js App  │      │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│          │                 │                 │               │
│          └─────────┬───────┴─────────┬───────┘               │
│                    │                 │                        │
│          ┌─────────▼─────────────────▼──────────┐            │
│          │         MIDDLEWARE LAYER              │            │
│          │   (JWT Verification via jose)         │            │
│          │   Routes: /admin/*, /student/*        │            │
│          └─────────────────┬────────────────────┘            │
│                            │                                 │
├────────────────────────────┼─────────────────────────────────┤
│                    SERVER LAYER                               │
│                            │                                 │
│          ┌─────────────────▼────────────────────┐            │
│          │       SERVER ACTIONS LAYER            │            │
│          │                                      │            │
│          │  ┌────────────┐  ┌─────────────────┐ │            │
│          │  │ actions.js │  │actions_franchise│ │            │
│          │  │ (1517 LOC) │  │  .js (309 LOC)  │ │            │
│          │  └──────┬─────┘  └───────┬─────────┘ │            │
│          │         │                │           │            │
│          │  ┌──────▼────────────────▼───────┐   │            │
│          │  │     SHARED SERVICES           │   │            │
│          │  │  ┌────────┐  ┌────────────┐   │   │            │
│          │  │  │ db.js  │  │  email.js   │   │   │            │
│          │  │  │(MySQL) │  │(Nodemailer) │   │   │            │
│          │  │  └────┬───┘  └──────┬─────┘   │   │            │
│          │  └───────┼─────────────┼─────────┘   │            │
│          └──────────┼─────────────┼─────────────┘            │
│                     │             │                           │
└─────────────────────┼─────────────┼───────────────────────────┘
                      │             │
             ┌────────▼──────┐  ┌───▼──────────────┐
             │   MySQL 8.0   │  │   Gmail SMTP     │
             │ (caddaxis_db)  │  │  (Nodemailer)    │
             │ 15+ Tables    │  │                  │
             └───────────────┘  └──────────────────┘
```

---

## 2. Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                          │
│                                                                 │
│  ┌───────────── PRESENTATION LAYER ─────────────────────┐       │
│  │                                                      │       │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │       │
│  │  │ Navbar  │ │ Hero     │ │ Footer   │ │ Cursor   │ │       │
│  │  │ .js     │ │ Section  │ │ .js      │ │ .js      │ │       │
│  │  └─────────┘ └──────────┘ └──────────┘ └──────────┘ │       │
│  │                                                      │       │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │       │
│  │  │ Aurora  │ │ TechAnim │ │ Silk     │ │ Blinds   │ │       │
│  │  │ WebGL   │ │ Canvas   │ │ WebGL    │ │ CSS      │ │       │
│  │  └─────────┘ └──────────┘ └──────────┘ └──────────┘ │       │
│  │                                                      │       │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐  │       │
│  │  │ Enquiry  │ │Franchise │ │  SyllabusViewer      │  │       │
│  │  │ Form     │ │ Form     │ │  (Accordion+Content) │  │       │
│  │  └──────────┘ └──────────┘ └──────────────────────┘  │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌───────────── ROUTING LAYER ──────────────────────────┐       │
│  │                                                      │       │
│  │  /            → page.js     (Homepage)               │       │
│  │  /courses     → page.js     (Course Listing)         │       │
│  │  /courses/[s] → page.js     (Course Detail)          │       │
│  │  /contact     → page.js     (Contact Form)           │       │
│  │  /franchise   → page.js     (Franchise Landing)      │       │
│  │  /verify/[id] → page.js     (Certificate Verify)     │       │
│  │  /admin/*     → 21 routes   (Admin Panel)            │       │
│  │  /franchise-panel/* → 9 rtes (Franchise Portal)      │       │
│  │  /student/*   → 3 routes    (Student Portal)         │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌───────────── BUSINESS LOGIC LAYER ───────────────────┐       │
│  │  actions.js         (60+ exported server actions)    │       │
│  │  actions_franchise  (10+ franchise-specific actions) │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  ┌───────────── DATA ACCESS LAYER ──────────────────────┐       │
│  │  db.js              (MySQL2 Connection Pool)         │       │
│  │  email.js           (SMTP Transport)                 │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Request Lifecycle

### 3.1 Public Page Request (e.g., `/courses`)
```
Browser → GET /courses
    → Next.js Router resolves to src/app/courses/page.js
    → Component renders (client-side)
    → useEffect() calls getCourses() server action
    → actions.js → pool.query('SELECT * FROM courses...')
    → MySQL returns rows
    → JSON serialized back to client
    → React state updated → UI renders course cards
```

### 3.2 Protected Admin Page Request (e.g., `/admin/students`)
```
Browser → GET /admin/students
    → middleware.js intercepts (/admin/* matcher)
    → Extract 'admin_session' cookie
    → IF missing → Redirect to /admin/login
    → IF present → jwtVerify(token, secret)
        → IF invalid → Delete cookie + redirect to /admin/login
        → IF valid → NextResponse.next() → Page renders
    → Component calls getStudents() server action
    → actions.js → verifyAdminSession() (re-verify JWT from cookies)
    → IF SUPER_ADMIN → SELECT * FROM students
    → IF FRANCHISE_ADMIN → SELECT * FROM students WHERE franchise_id = ?
    → Results rendered in table
```

### 3.3 Form Submission (e.g., Create Student)
```
User fills form → clicks Submit
    → createStudent(data) server action called
    → verifyAdminSession() → checks JWT → extracts role + franchiseId
    → INSERT INTO students (...) VALUES (...)
    → Returns { success: true, id: ... }
    → Client refreshes student list
```

### 3.4 Transactional Operation (e.g., Certificate Issuance)
```
Franchise Admin → Issue Certificate
    → createCertificate(data) server action
    → verifyAdminSession() → confirms FRANCHISE_ADMIN
    → pool.getConnection() → BEGIN TRANSACTION
        → SELECT wallet_balance FROM franchises WHERE id = ? FOR UPDATE
        → IF balance < 100 → ROLLBACK → Return "Insufficient Balance"
        → UPDATE franchises SET wallet_balance = wallet_balance - 100
        → INSERT INTO transactions (...) → Log debit
        → INSERT INTO certificates (...) → Create cert record
    → COMMIT
    → Return { success: true }
```

---

## 4. Frontend → Backend → Database Flow

```
┌──────────────────┐
│    React Page    │
│  (Client-Side)   │
│                  │
│  useEffect() ─── ─ ─►  Server Action Call
│                  │       (e.g., getStudents())
│  useState() ◄── ─ ─ ─  Returns plain JS object
│                  │
│  Event Handler ── ─►  Server Action Call
│  (onClick/Form)  │       (e.g., createStudent())
│                  │
│  Render JSX ◄── ─ ─  State update triggers re-render
└──────────────────┘

         │ Server Action
         ▼

┌──────────────────┐
│  actions.js      │
│  (Server-Side)   │
│                  │
│  1. Auth Check   │──► verifyAdminSession() → jwt.verify()
│  2. Input Valid  │──► Basic field checks
│  3. DB Query     │──► pool.query(SQL, params)
│  4. Error Handle │──► try/catch with rollback
│  5. Return Data  │──► Plain JS objects (auto-serialized)
└──────────────────┘

         │ mysql2/promise
         ▼

┌──────────────────┐
│    MySQL 8.0     │
│   (caddaxis_db)   │
│                  │
│  Parameterized   │
│  Queries Only    │
│  (SQL Injection  │
│   Prevention)    │
└──────────────────┘
```

---

## 5. API Layer Design

CADD Axis does NOT use traditional REST API routes. Instead, it leverages **Next.js Server Actions** — functions marked with `'use server'` that are invoked directly from client components.

### Why Server Actions over REST APIs?

| Aspect | REST API Routes | Server Actions (Used) |
|---|---|---|
| File structure | `/api/students/route.js` | Single `actions.js` file |
| Invocation | `fetch('/api/students')` | `getStudents()` direct call |
| Serialization | Manual JSON.parse/stringify | Automatic by Next.js |
| Auth | Repeated middleware in each route | Centralized `verifyAdminSession()` |
| Complexity | Higher (route files, methods, CORS) | Lower (just functions) |

### Server Action Categories

| Category | File | Functions | Description |
|---|---|---|---|
| **Auth** | `actions.js` | `authenticateAdmin`, `verifyAdminSession`, `studentSignUp`, `studentSignIn` | JWT-based authentication |
| **Students** | `actions.js` | `getStudents`, `createStudent`, `updateStudent`, `deleteStudent`, `approveAdmission`, `confirmStudentAdmission` | Full student lifecycle |
| **Payments** | `actions.js` | `getPayments`, `getPaymentsByStudent`, `createPayment` | Fee tracking |
| **Certificates** | `actions.js` | `getCertificates`, `createCertificate`, `requestCertificate` | Cert issuance |
| **Courses** | `actions.js` | `getCourses`, `createCourse`, `updateCourse`, `getCourseBySlug`, `deleteCourse` | Catalog CRUD |
| **Exams** | `actions.js` | `getExams`, `createExam`, `deleteExam`, `getExamResults`, `addExamResult` | Exam management |
| **Events** | `actions.js` | `getEvents`, `createEvent`, `updateEvent`, `deleteEvent` | Event CRUD |
| **Staff** | `actions.js` | `getStaff`, `createStaff`, `updateStaff`, `deleteStaff` | Staff CRUD |
| **Dashboard** | `actions.js` | `getDashboardStats`, `getPublicStats` | Aggregated metrics |
| **Wallet** | `actions.js` | `getWalletBalance`, `rechargeWallet`, `submitRechargeRequest`, `processRecharge`, `getRechargeRequests` | Financial system |
| **Live Classes** | `actions.js` | `createLiveClass`, `getLiveClasses`, `deleteLiveClass`, `createRecordedSession`, `getRecordedSessions` | E-learning content |
| **Enquiries** | `actions.js` | `submitEnquiry`, `submitFranchiseEnquiry`, `submitContactMessage`, `getFranchiseEnquiries`, `getContactMessages` | Lead capture |
| **Franchise** | `actions_franchise.js` | `createFranchise`, `getFranchises`, `getFranchiseStats`, `deleteFranchise`, `authenticateFranchise`, `addFranchiseCredits`, `issueFranchiseCertificate`, `initFranchiseDB` | Partner management |
| **Password** | `actions.js` | `sendPasswordResetOTP`, `resetPasswordWithOTP` | Password recovery |
| **Uploads** | `actions.js` | `uploadFile` | File handling |
| **Schema** | `actions.js` | `syncStaticCourses`, `checkStudentSchema` | Self-healing DB |
| **Student Portal** | `actions.js` | `getStudentDashboard`, `updateStudentProgress` | Student data |

---

## 6. Authentication System

### 6.1 Architecture

```
┌─────────────────────────────────────────────────┐
│                AUTH FLOW                         │
│                                                 │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐│
│  │  Login   │────►│  Verify  │────►│  Issue   ││
│  │  Form    │     │  Creds   │     │  JWT     ││
│  └──────────┘     └──────────┘     └────┬─────┘│
│                                         │      │
│                                    ┌────▼─────┐│
│                                    │ Set      ││
│                                    │ Cookie   ││
│                                    │(HttpOnly)││
│                                    └──────────┘│
└─────────────────────────────────────────────────┘
```

### 6.2 Token Types

| Token | Cookie Name | HttpOnly | Duration | Scope |
|---|---|---|---|---|
| Admin JWT | `admin_session` | ✅ Yes | 8 hours | `/admin/*` routes |
| UI Role | `ui_role` | ❌ No | 8 hours | Client-side UI logic (sidebar filtering) |
| Student JWT | `student_session` | ✅ Yes | 7 days | `/student/*` routes |
| Franchise ID | `franchise_session` | ❌ No | Session | Franchise panel identification |
| Franchise Name | `franchise_name` | ❌ No | Session | Franchise panel display name |

### 6.3 JWT Payload Structure

**Admin/Franchise Token:**
```json
{
  "role": "SUPER_ADMIN | FRANCHISE_ADMIN",
    "email": "admin@caddaxis.com",
  "id": 0,
  "franchiseId": null,
  "city": "Pune",
  "iat": 1710000000,
  "exp": 1710028800
}
```

**Student Token:**
```json
{
  "id": 42,
  "email": "student@example.com",
  "role": "student",
  "iat": 1710000000,
  "exp": 1710604800
}
```

### 6.4 Two-Layer Verification

1. **Middleware Layer** (Edge Runtime)
   - Uses `jose` library (Edge-compatible)
   - Runs BEFORE page rendering
   - Validates token structure and expiry
   - Redirects to login if invalid

2. **Server Action Layer** (Node.js Runtime)
   - Uses `jsonwebtoken` library  
   - Runs WITHIN business logic
   - Extracts role and franchiseId for data scoping
   - Enforces RBAC (Role-Based Access Control)

---

## 7. Multi-Tenancy (Data Isolation)

CADD Axis implements **Row-Level Security** via application logic:

```sql
-- Super Admin: Sees everything
SELECT * FROM students ORDER BY joined_at DESC

-- Franchise Admin: Sees only their data
SELECT * FROM students WHERE franchise_id = ? ORDER BY joined_at DESC

-- Student: Sees only their own data  
SELECT * FROM students WHERE id = ?
```

This pattern is applied consistently across:
- Students, Payments, Certificates, Exams, Transactions, Live Classes, Recorded Sessions

---

## 8. Caching Strategy

### Current Implementation
**No explicit caching layer**. All requests hit MySQL directly.

### Recommended Improvements

| Layer | Strategy | Tool |
|---|---|---|
| **Database Query Results** | Cache frequently-read data | Redis with 60s TTL |
| **Course Catalog** | Cache with manual invalidation | In-memory Map or Redis |
| **Dashboard Stats** | Cache aggregated stats | Redis with 30s TTL |
| **Certificate Verification** | Cache by unique_id | CDN edge cache (Vercel) |
| **Static Assets** | Long cache headers | Next.js static optimization |

---

## 9. Background Jobs

### Current Implementation
**No background job system**. All operations are synchronous within request lifecycle.

### Operations That Should Be Async

| Task | Current | Recommended |
|---|---|---|
| Email dispatch | Awaited in request (blocks response) | Queue (BullMQ + Redis) |
| Certificate PDF generation | Client-side (jsPDF) | Server-side queue with storage |
| Schema migrations | In-request self-healing | Separate migration command |
| Report generation | On-demand SQL aggregation | Pre-computed scheduled job |

---

## 10. Scalability Strategy

### Current Capacity
- **Connection Pool**: 10 concurrent MySQL connections
- **User Capacity**: Handles ~100 concurrent users comfortably
- **Data Volume**: Optimized for ~10,000 student records

### Vertical Scaling (Short-Term)
- Increase MySQL connection pool (10 → 50)
- Add database indexes on frequently queried columns
- Enable MySQL query cache
- Upgrade server CPU/RAM

### Horizontal Scaling (Long-Term)
```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │    (Nginx)      │
                    └────┬──────┬─────┘
                         │      │
                    ┌────▼─┐  ┌─▼────┐
                    │App 1 │  │App 2 │
                    │(Next)│  │(Next)│
                    └──┬───┘  └──┬───┘
                       │         │
                    ┌──▼─────────▼──┐
                    │ MySQL Primary │
                    │  + Read       │
                    │   Replicas    │
                    └───────────────┘
```

---

## 11. Deployment Architecture

### Development Environment (Current)
```
Developer Machine (Windows)
    ├── XAMPP → MySQL 8.0 (localhost:3306)
    ├── Node.js → next dev (localhost:3000)
    └── .env → Local credentials
```

### Production Environment (Recommended)
```
┌──────────────────────────────────────────────────┐
│                  Cloud (AWS/GCP)                 │
│                                                  │
│  ┌────────────┐     ┌──────────────────────┐     │
│  │  Vercel    │     │   AWS RDS / MySQL    │     │
│  │  (Next.js) │────►│   (Managed)          │     │
│  │  Serverless│     │   - Auto backups     │     │
│  └────────────┘     │   - Read replicas    │     │
│                     │   - SSL enforced     │     │
│  ┌────────────┐     └──────────────────────┘     │
│  │  S3/R2     │                                  │
│  │  (Uploads) │     ┌──────────────────────┐     │
│  └────────────┘     │   Redis (ElastiCache)│     │
│                     │   - Session cache    │     │
│  ┌────────────┐     │   - Rate limiting    │     │
│  │ CloudFlare │     └──────────────────────┘     │
│  │   (CDN)    │                                  │
│  └────────────┘                                  │
└──────────────────────────────────────────────────┘
```

---

## 12. Monitoring & Logging

### Current State
- `console.log` / `console.error` for all logging
- No structured logging
- No metrics collection
- No alerting

### Recommended Stack

| Layer | Tool | Purpose |
|---|---|---|
| **Application Logs** | Pino / Winston | Structured JSON logging |
| **Error Tracking** | Sentry | Real-time error monitoring with stack traces |
| **APM** | Vercel Analytics / Datadog | Request latency, throughput, error rates |
| **Database Monitoring** | MySQL slow query log + Grafana | Query performance analysis |
| **Uptime Monitoring** | UptimeRobot / Better Stack | Downtime alerting via SMS/Slack |
| **Security Monitoring** | Rate limiting dashboards | Track login attempts, API abuse |

### Key Metrics to Monitor

| Metric | Alert Threshold |
|---|---|
| Response time (p95) | > 2s |
| Error rate | > 5% of requests |
| Database connection pool utilization | > 80% |
| Login failure rate | > 10/min (brute force indicator) |
| Disk usage (file uploads) | > 80% |
| Certificate verification latency | > 1s |
