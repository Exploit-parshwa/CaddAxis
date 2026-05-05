# 📦 Feature Breakdown, API Documentation, Security Review, Performance Analysis & Next-Gen Redesign
## CADD Axis — Comprehensive Technical Analysis
**Version:** 2.0 | **Date:** March 10, 2026

---

# SECTION 1: FEATURE BREAKDOWN

## Feature 1: Multi-Role Authentication
- **How it works:** Login form submits to `authenticateAdmin()`. Checks hardcoded super admin creds first, then queries `franchises` table for franchise login (bcrypt compare). Issues JWT with role, email, franchiseId. Sets HttpOnly cookie (`admin_session`) and readable cookie (`ui_role`). Student auth via separate `studentSignUp/studentSignIn` using `student_auth` table.
- **Files:** `actions.js` (L42-70, 184-266, 670-828), `middleware.js`, `admin/login/page.js`, `student/auth/page.js`
- **APIs:** `authenticateAdmin()`, `verifyAdminSession()`, `studentSignUp()`, `studentSignIn()`
- **Data:** `franchises.email`, `franchises.password_hash`, `student_auth.password_hash`, cookies

## Feature 2: Student Lifecycle Management
- **How it works:** Students begin as "enquiry" (via website form or admin creation). Admin can approve admission which changes status to "enrolled" and auto-generates login credentials (`CadXXXX`). Confirmation step collects proof documents, address, alternative phone. Full CRUD with edit/delete capabilities.
- **Files:** `actions.js` (L268-311, 1411-1516), `admin/students/page.js` (688 LOC)
- **APIs:** `getStudents()`, `createStudent()`, `updateStudent()`, `deleteStudent()`, `approveAdmission()`, `confirmStudentAdmission()`, `submitEnquiry()`
- **Data:** `students` table (all columns), `student_auth` table

## Feature 3: Course Catalog Management
- **How it works:** CRUD operations on `courses` table. Courses have slug for URL routing, syllabus (markdown), image_url, fee, duration, and tag (CIVIL/MECHANICAL/ARCHITECTURAL). Public `/courses` page fetches all courses. Detail pages use `getCourseBySlug()` with dynamic `[slug]` routing. Auto-healing: if `tag` column is missing, it's auto-added via ALTER TABLE.
- **Files:** `actions.js` (L472-544), `data/courses.js`, `courses/page.js`, `courses/[slug]/page.js`, `admin/courses/page.js`
- **APIs:** `getCourses()`, `createCourse()`, `updateCourse()`, `getCourseBySlug()`, `deleteCourse()`
- **Data:** `courses` table, `data/courses.js` (static seed)

## Feature 4: Fee & Payment Management
- **How it works:** Payments are recorded with amount, method, date, and auto-generated receipt number (`RCP-{timestamp}-{random}`). Uses database transaction: inserts payment record AND updates student's `fee_paid` atomically. Admin can view all payments or filter by franchise.
- **Files:** `actions.js` (L313-369), `admin/fees/page.js`, `admin/payments/page.js`
- **APIs:** `getPayments()`, `getPaymentsByStudent()`, `createPayment()`
- **Data:** `payments` table, `students.fee_paid` (updated atomically)

## Feature 5: Certificate Generation & Verification
- **How it works:** Certificates have unique IDs. For franchise admins, issuance deducts ₹100 from wallet (transactional: FOR UPDATE lock → balance check → deduct → log transaction → insert certificate → commit). Public verification at `/verify/[id]` checks `certificates` table and renders certificate with QR code (via `qrcode.react`).
- **Files:** `actions.js` (L371-434, 838-903), `actions_franchise.js` (L234-281), `admin/certificates/page.js`, `verify/[id]/page.js`
- **APIs:** `getCertificates()`, `createCertificate()`, `requestCertificate()`, `issueFranchiseCertificate()`
- **Data:** `certificates`, `franchises.wallet_balance`, `transactions`

## Feature 6: Wallet System & Recharge Workflow
- **How it works:** Franchises have a wallet balance stored in `franchises.wallet_balance`. They submit recharge requests with amount, payment method, transaction reference, and proof screenshot. Super admin reviews pending requests and can approve (credits wallet + logs transaction) or reject. Separate `recharge_requests` table tracks the workflow.
- **Files:** `actions.js` (L436-982), `admin/payments/approvals/page.js`, `admin/recharge/page.js`
- **APIs:** `getWalletBalance()`, `rechargeWallet()`, `submitRechargeRequest()`, `getRechargeRequests()`, `processRecharge()`, `addFranchiseCredits()`
- **Data:** `franchises.wallet_balance`, `recharge_requests`, `transactions`

## Feature 7: Franchise Partner Management
- **How it works:** Super admin creates franchise accounts with name, city, email, password (bcrypt hashed), address, and optional document upload. Franchise list shows all partners with wallet balances. Franchise stats aggregation pulls student counts, certificate counts, and transaction history. Franchise map renders locations on Google Maps using lat/lng.
- **Files:** `actions_franchise.js` (L74-178), `actions.js` (L100-168), `admin/franchise-list/page.js`, `admin/franchise-map/page.js`, `admin/institute-info/page.js`
- **APIs:** `createFranchise()`, `getFranchises()`, `getFranchiseStats()`, `deleteFranchise()`, `getInstituteInfo()`, `getPublicFranchiseLocations()`
- **Data:** `franchises`, `students` (aggregated), `certificates` (aggregated), `transactions`

## Feature 8: Exam Management & Results
- **How it works:** Admins create exams with title, date, type (online/offline), total marks, and course association. Results are entered per student per exam (marks, grade, remarks). Upsert logic: if result exists for student+exam, it updates; otherwise inserts. Students see results in their dashboard.
- **Files:** `actions.js` (L569-600), `admin/exams/page.js`
- **APIs:** `getExams()`, `createExam()`, `deleteExam()`, `getExamResults()`, `addExamResult()`
- **Data:** `exams`, `exam_results` (joined with `students` and `exams`)

## Feature 9: Live Classes & Recorded Sessions
- **How it works:** Admin schedules live classes with course association, date/time, meeting link (Zoom/Meet), and duration. Students see upcoming classes in their dashboard (filtered by their enrolled course + class_date >= today). Recorded sessions are similar but with video URLs for past content.
- **Files:** `actions.js` (L1029-1072), `admin/online-classes/page.js`, `student/live/page.js`
- **APIs:** `createLiveClass()`, `getLiveClasses()`, `deleteLiveClass()`, `createRecordedSession()`, `getRecordedSessions()`, `deleteRecordedSession()`
- **Data:** `live_classes`, `recorded_sessions`

## Feature 10: Student Portal Dashboard
- **How it works:** After JWT verification, fetches student record, payment history, exam results, and (if enrolled) live classes and recorded sessions for the student's specific course. Access control: `hasAccess = student.status === 'enrolled'`. Non-enrolled students see basic info but no content.
- **Files:** `actions.js` (L1074-1136), `student/dashboard/page.js`
- **APIs:** `getStudentDashboard()`
- **Data:** `students`, `payments`, `exam_results`, `live_classes`, `recorded_sessions`

## Feature 11: Password Reset via OTP
- **How it works:** User requests OTP → system generates 6-digit code, stores in `student_auth.reset_otp` with 10-minute expiry. Sends email via Nodemailer. User enters OTP + new password → system verifies OTP validity and expiry → hashes new password with bcrypt → updates `student_auth.password_hash`.
- **Files:** `actions.js` (L1138-1190), `student/auth/page.js`
- **APIs:** `sendPasswordResetOTP()`, `resetPasswordWithOTP()`
- **Data:** `student_auth.reset_otp`, `student_auth.reset_otp_expiry`

## Feature 12: Event Management
- **How it works:** Standard CRUD for institute events. Each event has title, description, date, time, location, image, and status (upcoming/ongoing/completed). Public events page displays all events; admin can manage via the event management page.
- **Files:** `actions.js` (L602-623), `admin/event-management/page.js`, `events/page.js`
- **APIs:** `getEvents()`, `createEvent()`, `updateEvent()`, `deleteEvent()`
- **Data:** `events` table

## Feature 13: Contact Message Management
- **How it works:** Website visitors submit contact form → stored in `contact_messages` with name, email, phone, subject, message. Admin panel shows all messages with read/unread status. Admin can mark as read, reply (manual), or delete.
- **Files:** `actions.js` (L1367-1409), `admin/contact-messages/page.js`, `contact/page.js`
- **APIs:** `submitContactMessage()`, `getContactMessages()`, `updateContactStatus()`, `deleteContactMessage()`
- **Data:** `contact_messages` table

## Feature 14: Franchise Enquiry Pipeline
- **How it works:** Website visitors submit franchise application (name, email, phone, city, investment capacity, message). Admin views all enquiries sorted by date, can update status (pending → contacted → approved/rejected), or delete.
- **Files:** `actions.js` (L1353-1394), `admin/franchise-enquiries/page.js`, `franchise/page.js`
- **APIs:** `submitFranchiseEnquiry()`, `getFranchiseEnquiries()`, `updateFranchiseStatus()`, `deleteFranchiseEnquiry()`
- **Data:** `franchise_enquiries` table

## Feature 15: Dashboard Analytics
- **How it works:** Aggregates key metrics from SQL queries: enrolled student count, enquiry count, total revenue (SUM of payments), today's admissions. Franchise admins see scoped stats (WHERE franchise_id = ?). Super admins see global numbers.
- **Files:** `actions.js` (L625-668), `admin/dashboard/page.js`
- **APIs:** `getDashboardStats()`, `getPublicStats()`
- **Data:** `students` (COUNT by status), `payments` (SUM amount)

## Feature 16: File Upload System
- **How it works:** Accepts file via FormData, validates type (JPEG/PNG/WebP/PDF/ZIP) and size (max 10MB), sanitizes filename, writes to `public/uploads/` directory, returns URL path.
- **Files:** `actions.js` (L72-96)
- **APIs:** `uploadFile(formData)`
- **Data:** Filesystem (`public/uploads/`)

## Feature 17: SEO & Marketing Infrastructure
- **How it works:** Root `layout.js` defines comprehensive metadata (title, description, OG tags, Twitter cards, robots). `sitemap.js` generates XML sitemap for 4 key pages. `robots.js` defines crawling rules. `JsonLd.js` component adds structured data for search engines.
- **Files:** `layout.js`, `sitemap.js`, `robots.js`, `components/JsonLd.js`
- **APIs:** None (static generation)
- **Data:** Hardcoded URLs and metadata

## Feature 18: Premium Visual Effects
- **How it works:** Custom WebGL shaders (`Aurora.js`, `Silk.js`) create animated backgrounds using the `ogl` library. `TechAnim.js` uses Framer Motion for scroll-triggered animations. `CustomCursor.js` renders a custom mouse follower. `GradientBlinds.js` creates CSS-only gradient transitions.
- **Files:** `components/Aurora.js`, `components/Silk.js`, `components/TechAnim.js`, `components/CustomCursor.js`, `components/GradientBlinds.js`, `components/CivilHeroAnim.js`
- **APIs:** None (client-side only)
- **Data:** None

---

# SECTION 2: API DOCUMENTATION

> **Note:** CADD Axis uses Next.js Server Actions, not REST APIs. Functions are called directly from React components. All parameter types are inferred from the implementation.

## Authentication Endpoints

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `authenticateAdmin(formData)` | `{email, password}` as FormData | ❌ No | `{success, role, error?}` |
| `verifyAdminSession()` | None (reads cookies) | ✅ Cookie-based | `{role, email, id, franchiseId?}` or throws |
| `studentSignUp(data)` | `{name, email, phone, password, course}` | ❌ No | `{success, studentId?, error?}` |
| `studentSignIn(email, password)` | string, string | ❌ No | `{success, student?, error?}` |
| `authenticateFranchise(formData)` | `{email, password}` as FormData | ❌ No | `{success, franchiseId?, name?, error?}` |
| `sendPasswordResetOTP(email)` | string | ❌ No | `{success, message?, mock?, error?}` |
| `resetPasswordWithOTP(email, otp, newPassword)` | string × 3 | ❌ No | `{success, error?}` |

## Student Endpoints

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `getStudents()` | None | ✅ Admin/Franchise | `Student[]` (filtered by role) |
| `createStudent(data)` | `{name, email, phone, course, status, fee_total, fee_paid}` | ✅ Admin/Franchise | `{success, id}` |
| `updateStudent(id, data)` | id: number, data: StudentFields | ✅ Admin | `{success}` |
| `deleteStudent(id)` | id: number | ✅ Super Admin only | `{success}` |
| `approveAdmission(studentId)` | id: number | ✅ Admin | `{success, generatedPassword?}` |
| `confirmStudentAdmission(id, data)` | id: number, `{alt_phone, address, proofs, custom_proof, uploaded_proofs}` | ✅ Admin | `{success, generatedPassword?}` |
| `updateStudentProgress(studentId, progress)` | id: number, progress: number | ✅ Admin | `{success}` |
| `getStudentDashboard(requestedId)` | id: number (ignored, uses JWT) | ✅ Student | `{student, payments, liveClasses, recordedSessions, examResults, hasAccess}` |
| `submitEnquiry(formData)` | `{name, email, phone, course}` as FormData | ❌ No | `{success, error?}` |

## Course Endpoints

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `getCourses()` | None | ❌ No | `Course[]` |
| `createCourse(data)` | `{title, duration, fee, description, slug, image_url, syllabus, tag}` | ✅ Admin | `{success, id}` |
| `updateCourse(id, data)` | id: number, CourseFields | ✅ Admin | `{success}` |
| `getCourseBySlug(slug)` | slug: string | ❌ No | `Course \| FallbackCourse` |
| `deleteCourse(id)` | id: number | ✅ Admin | `{success}` |

## Payment Endpoints

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `getPayments()` | None | ✅ Admin/Franchise | `PaymentRow[]` (joined with student) |
| `getPaymentsByStudent(studentId)` | id: number | ✅ Admin | `Payment[]` |
| `createPayment(data)` | `{student_id, amount, payment_method, payment_date, notes}` | ✅ Admin | `{success, receipt_number}` |

## Certificate Endpoints

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `getCertificates()` | None | ✅ Admin/Franchise | `Certificate[]` |
| `createCertificate(data)` | `{student_name, course_name, unique_id}` | ✅ Admin/Franchise | `{success, error?}` |
| `requestCertificate(data)` | `{franchiseId, studentId, courseName, amount}` | ✅ Franchise | `{success, message?, error?}` |
| `issueFranchiseCertificate(data)` | `{franchiseId, studentId, courseName, uniqueId}` | ✅ Franchise | `{success, error?}` |

## Wallet & Financial Endpoints

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `getWalletBalance()` | None | ✅ Franchise | `{balance}` |
| `rechargeWallet(amount)` | amount: number | ✅ Franchise | `{success, newBalance?}` |
| `submitRechargeRequest(data)` | `{amount, paymentMethod, transactionRef, proofUrl}` | ✅ Franchise | `{success}` |
| `getRechargeRequests(status)` | status: string ('all'\|'pending'\|...) | ✅ Super Admin | `RechargeRequest[]` |
| `processRecharge(requestId, action)` | id: number, action: 'approve'\|'reject' | ✅ Super Admin | `{success}` |
| `addFranchiseCredits(data)` | `{franchiseId, amount}` | ✅ Admin | `{success, certificates}` |
| `getFranchiseTransactions(franchiseId)` | id: number | ✅ Admin | `Transaction[]` |

## Franchise Endpoints

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `createFranchise(data)` | `{name, city, email, password, address, docUrl}` | ✅ Super Admin | `{success, id}` |
| `getFranchises()` | None | ✅ Super Admin | `Franchise[]` (no passwords) |
| `getFranchiseStats(id)` | id: number | ✅ Admin | `{franchise, transactions, studentCount, certCount}` |
| `deleteFranchise(id)` | id: number | ✅ Super Admin | `{success}` |
| `getInstituteInfo()` | None | ✅ Admin/Franchise | `FranchiseWithStats[]` |
| `getPublicFranchiseLocations()` | None | ❌ No | `{id, name, city, lat?, lng?}[]` |
| `initFranchiseDB()` | None | ✅ Admin | `{success, message}` |

## Exam Endpoints

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `getExams()` | None | ✅ Admin | `Exam[]` |
| `createExam(data)` | `{title, date, type, total_marks, course_name}` | ✅ Admin | `{success, id}` |
| `deleteExam(id)` | id: number | ✅ Admin | `{success}` |
| `getExamResults(studentId)` | id: number | ✅ Admin | `ExamResult[]` (joined with exam details) |
| `addExamResult(data)` | `{student_id, exam_id, marks_obtained, grade, remarks}` | ✅ Admin | `{success, updated?}` |

## Content & Events

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `createLiveClass(data)` | `{course_name, title, description, class_date, class_time, duration_minutes, meeting_link, platform}` | ✅ Admin | `{success, id}` |
| `getLiveClasses(courseName?)` | courseName: string (optional) | ✅ Admin | `LiveClass[]` |
| `deleteLiveClass(id)` | id: number | ✅ Admin | `{success}` |
| `createRecordedSession(data)` | `{course_name, title, description, recorded_date, duration_minutes, video_url}` | ✅ Admin | `{success, id}` |
| `getRecordedSessions(courseName?)` | courseName: string (optional) | ✅ Admin | `RecordedSession[]` |
| `deleteRecordedSession(id)` | id: number | ✅ Admin | `{success}` |
| `getEvents()` | None | ❌ No | `Event[]` |
| `createEvent(data)` | Event fields | ✅ Admin | `{success, id}` |
| `updateEvent(id, data)` | id: number, Event fields | ✅ Admin | `{success}` |
| `deleteEvent(id)` | id: number | ✅ Admin | `{success}` |

## Staff & Enquiry

| Function | Parameters | Auth Required | Returns |
|---|---|---|---|
| `getStaff()` | None | ✅ Admin | `Staff[]` |
| `createStaff(data)` | `{name, email, role, phone}` | ✅ Admin | `{success, id}` |
| `updateStaff(id, data)` | id: number, Staff fields | ✅ Admin | `{success}` |
| `deleteStaff(id)` | id: number | ✅ Admin | `{success}` |
| `submitFranchiseEnquiry(formData)` | FormData | ❌ No | `{success}` |
| `submitContactMessage(formData)` | FormData | ❌ No | `{success}` |
| `getFranchiseEnquiries()` | None | ✅ Admin | `FranchiseEnquiry[]` |
| `getContactMessages()` | None | ✅ Admin | `ContactMessage[]` |

## Error Handling

All server actions follow this pattern:
```javascript
// Success
{ success: true, data?: any, id?: number }

// Failure
{ success: false, error: "Human-readable error message" }

// Auth failure
throws new Error("Unauthorized")
```

---

# SECTION 3: SECURITY REVIEW

## 3.1 Authentication Mechanism

| Aspect | Implementation | Rating |
|---|---|---|
| Password storage | bcryptjs with salt round 10 | ✅ Good |
| Token type | JWT (HS256) | ✅ Good |
| Token storage | HttpOnly cookie with Secure flag (prod) | ✅ Good |
| Token expiry | Admin: 8h, Student: 7d | ✅ Good |
| SameSite | Strict (admin), Lax (UI role) | ✅ Good |
| Secret management | Environment variable with fallback | ⚠️ Weak |

## 3.2 Authorization

| Check | Implementation | Rating |
|---|---|---|
| Route protection | Middleware JWT verification on `/admin/*`, `/student/*` | ✅ Good |
| Role-based access | `verifyAdminSession()` in every server action | ✅ Good |
| Data isolation | WHERE clause filtering by franchise_id | ✅ Good |
| IDOR protection | Student dashboard ignores `requestedId`, uses JWT instead | ✅ Good |
| Super Admin only actions | Explicit role check before destructive operations | ✅ Good |

## 3.3 Vulnerabilities Found

### 🔴 Critical

| # | Vulnerability | Location | Impact |
|---|---|---|---|
| V-01 | **Hardcoded admin credentials** | `actions.js:189` — `admin@caddaxis.com / admin123` | Anyone who reads code can gain Super Admin access |
| V-02 | **Fallback JWT secret in code** | `actions.js:25` — `caddaxis-secure-key-2026` | If env var is missing, all tokens share known secret |
| V-03 | **SQL string interpolation** | `actions.js:931` — `WHERE rr.status = '${status}'` | SQL injection possible via status parameter |
| V-04 | **Plain-text password fallback** | `actions.js:228` — `password === franchise.password_hash || password === 'franchise123'` | Dev backdoor left in production code |

### 🟡 Medium

| # | Vulnerability | Location | Impact |
|---|---|---|---|
| V-05 | **No CSRF protection** | Server actions + cookies | Potential cross-site request forgery |
| V-06 | **File upload path traversal** | `actions.js:86` — sanitizes but writes to `public/` | Uploaded files publicly accessible without auth |
| V-07 | **No rate limiting on auth** | `checkRateLimit` defined but never called | Brute force attacks possible |
| V-08 | **Mock login when DB is down** | `actions.js:806-824` | Bypasses auth entirely in error scenarios |
| V-09 | **Non-HttpOnly franchise cookie** | `franchise-panel/layout.js` | Client-side session cookie vulnerable to XSS |
| V-10 | **OTP stored in database without hashing** | `actions.js:1153` | Database breach exposes active OTPs |

### 🟢 Low

| # | Vulnerability | Location | Impact |
|---|---|---|---|
| V-11 | **No password complexity requirements** | `studentSignUp` | Users can set weak passwords |
| V-12 | **Email enumeration** | `studentSignIn` returns different messages for "not found" vs "wrong password" | Reveals valid emails |
| V-13 | **Incomplete password reset** | `resetPasswordWithOTP` hashes password but never writes it | Password never actually updates |

## 3.4 Security Improvements

| Priority | Recommendation |
|---|---|
| 🔴 P0 | Remove hardcoded admin credentials; use bcrypt-hashed password from DB |
| 🔴 P0 | Remove JWT secret fallback; fail hard if missing in production |
| 🔴 P0 | Fix SQL concatenation in `getRechargeRequests` (use parameterized query) |
| 🔴 P0 | Remove dev password fallbacks (`franchise123`, mock logins) |
| 🟡 P1 | Implement CSRF tokens or verify Origin header |
| 🟡 P1 | Move uploads to private directory; serve via authenticated route |
| 🟡 P1 | Enable rate limiter (`checkRateLimit`) on login actions |
| 🟡 P1 | Hash OTPs before storing in database |
| 🟡 P1 | Fix `resetPasswordWithOTP` to actually write the new hash |
| 🟢 P2 | Enforce password complexity (min 8 chars, mixed case, number) |
| 🟢 P2 | Normalize auth error messages to prevent email enumeration |
| 🟢 P2 | Add security audit logging for all auth events |

---

# SECTION 4: PERFORMANCE ANALYSIS

## 4.1 Performance Bottlenecks

### Bottleneck 1: N+1 Query in `getInstituteInfo()`
- **Location:** `actions.js:104-168`
- **Issue:** For EACH franchise, executes 5 separate queries (enquiries, students, certificates, documents, revenue)
- **Impact:** With 20 franchises = 100+ queries per page load
- **Fix:** Use JOINs and subqueries in a single query, or batch with `IN ()` clause

### Bottleneck 2: No Connection Reuse in Transactions
- **Location:** Various `pool.getConnection()` calls
- **Issue:** After transaction commit, additional queries use `pool.query` instead of re-using the connection
- **Impact:** Extra connection overhead for post-transaction reads
- **Fix:** Use the existing connection for all queries within the same function

### Bottleneck 3: No Database Indexing on Query Patterns
- **Location:** Across all actions
- **Issue:** Common queries like `WHERE status='enrolled' AND franchise_id=?` lack composite indexes
- **Impact:** Full table scans as data grows
- **Fix:** Add composite indexes (see Database Design doc)

### Bottleneck 4: Client-Side PDF Generation
- **Location:** `admin/marksheet/page.js` (uses jsPDF in browser)
- **Issue:** Complex PDFs generated in user's browser — slow on mobile devices
- **Impact:** UI freeze during PDF generation
- **Fix:** Server-side PDF generation (Puppeteer or wkhtmltopdf)

### Bottleneck 5: No Response Caching
- **Location:** All server actions
- **Issue:** Every page load re-fetches from database
- **Impact:** Unnecessary database load for rarely-changing data (courses, events)
- **Fix:** Redis cache layer with TTL (courses: 5 min, dashboard: 30s)

### Bottleneck 6: Synchronous Email Sending
- **Location:** `actions.js:893` — `await sendEmail(...)` inside certificate transaction
- **Issue:** Email SMTP connection blocks the response
- **Impact:** 2-5 second delay for the user
- **Fix:** Fire-and-forget or queue-based email dispatch

### Bottleneck 7: Large Bundle Size
- **Location:** `package.json` — `ogl`, `framer-motion`, `socket.io-client`
- **Issue:** Heavy libraries loaded on all pages (including admin)
- **Impact:** Slow initial page load
- **Fix:** Dynamic imports (`next/dynamic`) for WebGL effects and animation libraries

### Bottleneck 8: No Pagination
- **Location:** All list queries (`getStudents`, `getPayments`, `getEvents`, etc.)
- **Issue:** Returns ALL records (`SELECT * FROM ... ORDER BY ...`)
- **Impact:** Degraded performance with thousands of records
- **Fix:** Add `LIMIT ? OFFSET ?` with page parameters

## 4.2 Query Optimization Suggestions

| Query | Current | Optimized |
|---|---|---|
| Dashboard enrolled count | `SELECT count(*) FROM students WHERE status='enrolled'` | Add index on `(status)` |
| Franchise student list | `WHERE franchise_id = ?` | Add index on `(franchise_id, status)` |
| Payment history | `JOIN students ON p.student_id = s.id` | Ensure `student_id` is indexed |
| Certificate verification | `WHERE unique_id = ?` | Already has UNIQUE index ✅ |
| Live classes for student | `WHERE course_name = ? AND class_date >= CURDATE()` | Add composite index `(course_name, class_date)` |

---

# SECTION 5: NEXT-GENERATION REDESIGN

## 5.1 Vision
Transform CADD Axis from a monolithic XAMPP application into a **cloud-native, AI-augmented, scalable SaaS platform** capable of serving 500+ franchise locations and 100,000+ students.

## 5.2 Modern Tech Stack

| Layer | Current | Proposed | Rationale |
|---|---|---|---|
| **Language** | JavaScript | TypeScript 5.x | Type safety, better DX |
| **Framework** | Next.js 16 | Next.js 16 (App Router) | Keep (excellent foundation) |
| **API Layer** | Server Actions (raw) | tRPC + Server Actions | Type-safe API contracts |
| **ORM** | Raw SQL (mysql2) | Prisma 7 + Raw SQL | Schema management, migrations, type generation |
| **Database** | MySQL (XAMPP) | PostgreSQL (Supabase/Neon) | Better JSON support, row-level security |
| **Auth** | Custom JWT | NextAuth.js v5 + Prisma | OAuth support, session management, magic links |
| **Cache** | None | Redis (Upstash) | Sub-ms response for hot data |
| **File Storage** | Local `public/uploads/` | AWS S3 / Cloudflare R2 | Scalable, CDN-backed storage |
| **Email** | Gmail SMTP | Resend / AWS SES | Reliable delivery, templates, analytics |
| **Real-time** | Socket.io (unused) | Supabase Realtime / Ably | Live class presence, admin notifications |
| **Payments** | Manual recording | Razorpay / Stripe | Automated fee collection |
| **Search** | SQL LIKE | Meilisearch / Algolia | Full-text search across students, courses |
| **Monitoring** | console.log | Sentry + Vercel Analytics | Error tracking + performance monitoring |
| **CI/CD** | Manual deployment | GitHub Actions + Vercel | Automated testing, staging, production deploy |

## 5.3 Microservices Architecture (If Beneficial)

For CADD Axis's current scale (10-50 franchises), a monolith is appropriate. However, at 200+ franchises, consider extracting:

```
┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Web Gateway    │  │  Auth Service    │  │  Admin Service   │
│  (Next.js SSR)  │──│  (NextAuth/JWT)  │──│  (Student CRUD)  │
│                 │  │  ─ Login/Signup  │  │  ─ Payments      │
│  ─ Public pages │  │  ─ Session mgmt  │  │  ─ Exams         │
│  ─ Student UI   │  │  ─ Role issuing  │  │  ─ Staff         │
│  ─ Admin UI     │  └──────────────────┘  └──────────────────┘
│  ─ Franchise UI │
└────────┬────────┘  ┌──────────────────┐  ┌──────────────────┐
         │          │  Wallet Service   │  │  Content Service │
         │          │  ─ Balance mgmt   │  │  ─ Courses       │
         └──────────│  ─ Transactions   │  │  ─ Live classes  │
                    │  ─ Recharge flow  │  │  ─ Recordings    │
                    └──────────────────┘  │  ─ Certificates  │
                                          └──────────────────┘
         ┌──────────────────┐
         │  Notification    │
         │  Service         │
         │  ─ Email         │
         │  ─ WhatsApp      │
         │  ─ Push          │
         └──────────────────┘
```

## 5.4 AI Integration Opportunities

| Use Case | AI Capability | Implementation |
|---|---|---|
| **Smart Course Recommendations** | Recommend courses based on student profile, browsing history, and career goals | OpenAI/Gemini API + embeddings |
| **Automated Exam Grading** | Grade subjective answers (CAD project descriptions) with AI scoring | GPT-4 with rubric-based prompts |
| **Chatbot for Enquiries** | 24/7 AI assistant on website answering course questions | Vercel AI SDK + RAG from course data |
| **Demand Prediction** | Predict which courses will be popular next quarter | Time-series analysis on enrollment data |
| **Fraud Detection** | Detect unusual certificate issuance patterns | Anomaly detection on transaction data |
| **Resume Generator** | Auto-generate student resumes from profile + course completion data | Template + AI content generation |

## 5.5 Event-Driven Architecture

```
┌─────────┐     ┌──────────────┐     ┌───────────────────┐
│  Event  │────►│  Message     │────►│  Event Handlers   │
│ Source  │     │  Queue       │     │                   │
└─────────┘     │ (Redis/SQS)  │     │  ─ Send Email     │
                └──────────────┘     │  ─ Update Stats   │
                                     │  ─ Trigger Webhook│
Events:                              │  ─ Log Audit      │
─ student.enrolled                   │  ─ Notify Admin   │
─ payment.received                   └───────────────────┘
─ certificate.issued
─ recharge.approved
─ franchise.created
─ exam.result.published
```

## 5.6 Real-Time Capabilities

| Feature | Technology | User Experience |
|---|---|---|
| Live class attendance tracking | WebSocket (Supabase Realtime) | Admin sees who's in the live class |
| Fee payment notifications | Server-Sent Events | Admin dashboard auto-updates on new payments |
| Wallet balance updates | WebSocket | Franchise sees balance change in real-time after approval |
| Admin notification feed | WebSocket | Bell icon with unread count for new enquiries, recharge requests |
| Student progress tracking | Polling → WebSocket | Real-time progress bar during live class |

## 5.7 Better Database Design
See the "Proposed Scalable Schema" in `database-design.md` — key improvements:
- UUID-based public identifiers (vs sequential IDs)
- Proper `enrollments` junction table (normalized student-course)
- Soft deletes (`deleted_at`) across all entities
- `updated_at` audit timestamps on all tables
- BIGINT primary keys for long-term scalability
- Proper ENUMs instead of VARCHAR for status fields

## 5.8 Modern Frontend Architecture

| Current | Proposed |
|---|---|
| Inline styles on all pages | Design system with CSS-in-JS (styled-components) or Tailwind CSS |
| No component library | shadcn/ui component library (accessible, customizable) |
| No form library | React Hook Form + Zod validation |
| No state management | Zustand for global state (auth, notifications) |
| No loading states | Suspense boundaries + skeleton loaders |
| No error handling UI | Error boundaries with fallback UI |
| No dark mode | Theme provider with system preference detection |
| No responsive admin | Mobile-first admin with collapsible sidebar |
| No data tables | TanStack Table with sorting, filtering, pagination |
| No charts | Recharts or Nivo for dashboard visualizations |

## 5.9 DevOps Improvements

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  Developer  │────►│  GitHub +    │────►│  Vercel       │
│  Push Code  │     │  Actions     │     │  (Production) │
└─────────────┘     │              │     └───────────────┘
                    │  ─ Lint      │
                    │  ─ Type Check│     ┌───────────────┐
                    │  ─ Unit Tests│────►│  Staging      │
                    │  ─ E2E Tests │     │  (Preview)    │
                    │  ─ Build     │     └───────────────┘
                    └──────────────┘

Infrastructure as Code:
─ Terraform for AWS/GCP resources
─ Docker for local development consistency
─ GitHub Environments for secrets management

Monitoring:
─ Sentry for error tracking
─ Vercel Analytics for performance
─ Grafana + Prometheus for infrastructure
─ PagerDuty for on-call alerting
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
on: [push]
jobs:
  test:
    - npm run lint
    - npm run typecheck
    - npm run test:unit
    - npm run test:e2e
  deploy:
    needs: test
    - vercel deploy --prod
```
