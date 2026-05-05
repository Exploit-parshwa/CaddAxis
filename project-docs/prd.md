# 📋 Product Requirement Document (PRD)
## CADD Axis — Franchise Management & Ed-Tech Platform
**Version:** 2.0 | **Date:** March 10, 2026 | **Status:** Production

---

## 1. Product Overview

**CADD Axis** is a full-stack, multi-tenant Ed-Tech and Franchise Management SaaS platform built for a CAD/CAM/CAE training institute network. The product serves as the complete digital backbone for a franchise-based education business — managing the public-facing marketing website, centralized super-admin operations, franchise partner operations, and student learning portals within a single unified application.

The platform enables a central institute (HQ) to onboard franchise partners across India, manage courses, track student lifecycle (from enquiry → enrollment → certification), handle wallet-based financial transactions between HQ and franchises, and provide students with a self-service portal for accessing live classes, recorded sessions, exam results, and fee status.

---

## 2. Problem Statement

Running a franchise-based education institute across multiple cities creates operational chaos:

| Pain Point | Impact |
|---|---|
| **Manual student tracking** | Enquiries are lost, enrollment data is fragmented across Excel sheets at each center |
| **No centralized financial control** | HQ cannot track franchise revenue, collect royalties, or control certificate issuance costs |
| **Certificate fraud** | Without a verifiable digital certificate system, fake certificates damage brand reputation |
| **Student access to content** | Students have no portal to check fees, exams, or join live classes remotely |
| **Franchise scaling friction** | Adding a new franchise location requires manual setup, training, and infrastructure |
| **No marketing website control** | Each franchise might create separate, inconsistent web presences |

**CADD Axis solves all of these** by providing a single, centralized platform that unifies student management, franchise operations, financial controls, digital certificates, and a premium marketing website.

---

## 3. Target Users / Personas

### 🔴 Persona 1: Super Admin (HQ Administrator)
- **Who:** The institute owner or central operations manager
- **Goals:** Full visibility across all franchise locations, financial oversight, course catalog management, approve/reject franchise wallet recharges, generate reports
- **Access:** `/admin` panel with full privileges

### 🟠 Persona 2: Franchise Admin (Partner / Center Manager)
- **Who:** A franchisee who runs a local CADD Axis center
- **Goals:** Manage local students, issue certificates (paid from wallet), track local fees, manage staff, conduct exams
- **Access:** `/admin` panel (shared UI, filtered by `franchise_id`) OR dedicated `/franchise-panel`

### 🟢 Persona 3: Student
- **Who:** An engineering student or professional enrolled in a CAD/CAM course
- **Goals:** View enrolled courses, check fee payment status, attend live classes, view exam results, access recorded sessions
- **Access:** `/student` portal with JWT-based authentication

### 🔵 Persona 4: Website Visitor (Prospective Student/Franchise Applicant)
- **Who:** Anyone discovering the brand through marketing
- **Goals:** Explore courses, submit enquiries, apply for franchise ownership, verify certificates
- **Access:** Public website (`/`, `/courses`, `/contact`, `/franchise`, `/verify`)

---

## 4. Key Value Proposition

> **"One platform to run your entire franchise education business — from the first website visit to the final certificate."**

| For Super Admins | For Franchise Partners | For Students |
|---|---|---|
| Real-time dashboard across all locations | Self-service portal for student & certificate management | One-click access to courses, fees, live classes |
| Wallet-based financial controls over franchise spending | Transparent wallet system with recharge requests | Verified digital certificates with QR codes |
| Centralized course catalog pushed to all franchises | Exam management and result publication | Exam scores and marksheets |
| Franchise enquiry pipeline management | Revenue and transaction history | Password reset via email OTP |

---

## 5. Core Features

### 5.1 Public Website
- Modern, premium landing page with animated hero, course showcases, college testimonials
- Dynamic course catalog (fetched from DB)
- Franchise application form with investment capacity capture
- Contact form with enquiry management
- Certificate verification portal (`/verify/[id]`)
- SEO-optimized with sitemap, robots.txt, Open Graph, Twitter cards
- Custom cursor, Framer Motion animations, Aurora/Silk WebGL effects

### 5.2 Admin Panel (Super Admin)
- **Dashboard**: Enrollment stats, revenue YTD, today's admissions, enquiries
- **Students**: Full CRUD + admission workflow (enquiry → enrollment + auto-credential generation)
- **Courses**: CRUD with slug, syllabus, image upload, tag categorization (Civil/Mechanical/Architectural)
- **Fees & Payments**: Payment recording with auto receipt generation, student fee tracking
- **Exams**: Create exams (online/offline), record results with grades
- **Certificates**: Issue certificates with unique IDs, franchise wallet deduction
- **Marksheet**: Student marksheet generation with exam result aggregation
- **Staff**: Manage teaching and admin staff
- **Events**: Create and manage institute events
- **Contact Messages**: View and manage website contact submissions
- **Franchise Enquiries**: Pipeline from franchise application → status tracking
- **Franchise List**: View all franchise partners with wallet balances
- **Franchise Map**: Geographic visualization of franchise locations
- **Institute Info**: Detailed franchise stats (enquiries, enrolled, certificates, revenue, documents)
- **Wallet Approvals**: Approve/reject franchise recharge requests
- **Accounts**: Financial overview per franchise
- **Reports**: System-wide analytics
- **Online Classes**: Schedule live classes with meeting links, manage recorded sessions
- **Website Editor**: Manage website content

### 5.3 Franchise Panel
- **Dashboard**: Center-specific enrollment, batch, and revenue stats with wallet balance
- **Students**: Scoped to franchise's own students
- **Certificates**: Issue certificates (wallet balance deducted at ₹100/cert)
- **Courses**: View authorized course catalog
- **Staff**: Local staff management
- **Exams & Results**: Manage exams and enter student results
- **Wallet & Top-up**: View balance, submit recharge requests with payment proof

### 5.4 Student Portal
- **Authentication**: Sign-up with email/password, sign-in with bcrypt verification
- **Dashboard**: Course details, fee summary, payment history, progress tracking
- **Live Classes**: Access scheduled live classes (Zoom/Meet links) — only if enrolled
- **Recorded Sessions**: Access course recordings — only if enrolled
- **Exam Results**: View all exam scores, grades, and remarks
- **Password Reset**: OTP-based password reset via email

---

## 6. User Journeys

### Journey 1: Student Enquiry → Enrollment → Learning
```
Website Visit → Explore Courses → Submit Enquiry Form
    → Admin receives enquiry (status: 'enquiry')
    → Admin reviews and approves admission (status: 'enrolled')
    → System auto-generates student credentials (CadXXXX)
    → Student logs in to portal
    → Student sees live classes, recorded sessions, exam results
    → Student completes course → Certificate issued
```

### Journey 2: Franchise Application → Onboarding → Operations
```
Franchise page → Submit application (name, city, investment)
    → Super Admin reviews franchise enquiry
    → Super Admin creates franchise account (email/password)
    → Franchise Admin logs into admin panel
    → Franchise Admin manages local students, exams, certificates
    → Franchise Admin recharges wallet (sends proof)
    → Super Admin approves recharge → Wallet credited
    → Franchise issues certificates (wallet debited per cert)
```

### Journey 3: Certificate Verification
```
External verifier → Visits /verify/[cert-id]
    → System looks up certificate by unique_id
    → Displays student name, course, issue date, franchise info
    → QR code for instant mobile verification
```

---

## 7. Use Cases

| # | Use Case | Actor | Trigger |
|---|---|---|---|
| UC-01 | Submit student enquiry | Website Visitor | Fill contact form |
| UC-02 | Approve student admission | Super/Franchise Admin | Click "Approve" on enquiry |
| UC-03 | Record fee payment | Admin | Enter payment in fees module |
| UC-04 | Create/edit course | Super Admin | Course CRUD in admin |
| UC-05 | Issue certificate | Franchise Admin | Select student → generate cert (wallet debit) |
| UC-06 | Recharge wallet | Franchise Admin | Submit recharge request with proof |
| UC-07 | Approve wallet recharge | Super Admin | Approve/reject recharge request |
| UC-08 | Create exam & enter results | Admin | Exam module CRUD |
| UC-09 | Student sign-up/sign-in | Student | Auth forms |
| UC-10 | Verify certificate | Public | Enter cert ID on /verify page |
| UC-11 | Submit franchise application | Visitor | Franchise form on /franchise page |
| UC-12 | Schedule live class | Admin | Online classes module |
| UC-13 | Reset password | Student | Request OTP → enter new password |
| UC-14 | View institute info & documents | Super Admin | Institute info page |

---

## 8. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Multi-role authentication (Super Admin, Franchise, Student) with JWT | **P0** |
| FR-02 | Role-based data isolation (franchise sees only own students/certs) | **P0** |
| FR-03 | Student CRUD with status lifecycle (enquiry → enrolled → completed) | **P0** |
| FR-04 | Course catalog management with slug-based routing | **P0** |
| FR-05 | Payment recording with transactional consistency (begin/commit/rollback) | **P0** |
| FR-06 | Certificate generation with unique ID and wallet deduction | **P0** |
| FR-07 | Wallet system with recharge request/approval workflow | **P1** |
| FR-08 | Exam management with results entry and student linkage | **P1** |
| FR-09 | Contact/Franchise enquiry capture and management | **P1** |
| FR-10 | Student portal with secure dashboard data | **P1** |
| FR-11 | Live class scheduling + recorded session management | **P1** |
| FR-12 | Certificate public verification page with QR code | **P1** |
| FR-13 | Email notifications (OTP, certificate approval) via configurable SMTP | **P2** |
| FR-14 | File upload (images, documents, proof PDFs) with type/size validation | **P2** |
| FR-15 | Self-healing database schemas (auto-create tables/columns on error) | **P2** |
| FR-16 | SEO optimization (sitemap, robots, OG tags, JSON-LD) | **P2** |

---

## 9. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | JWT-based sessions with HttpOnly cookies; bcrypt password hashing; parameterized SQL queries; CORS-safe cookie settings; file upload size (10MB) and type validation |
| **Performance** | MySQL connection pooling (limit: 10); keep-alive connections; instant response for dashboard API calls |
| **Scalability** | Multi-franchise architecture with `franchise_id` scoping; designed for horizontal DB scaling |
| **Availability** | Mock/fallback data when DB is offline (demo mode); self-healing schemas for zero-downtime upgrades |
| **Maintainability** | Server actions pattern avoids separate API layer; single `actions.js` file contains all business logic |
| **Compliance** | Production-only SSL enforcement; audit-ready certificate trail |

---

## 10. Success Metrics

| Metric | Target |
|---|---|
| Franchise onboarding time | < 30 minutes (account creation → first student enrolled) |
| Student enquiry → enrollment conversion | > 40% |
| Certificate verification response time | < 500ms |
| Franchise wallet transaction accuracy | 100% (transactional consistency) |
| System uptime | 99.5% |
| Active franchise locations | 10+ within Year 1 |
| Monthly active students | 500+ across network |

---

## 11. Product Roadmap

### Phase 1 — Foundation ✅ (Completed)
- Public website with SEO
- Admin panel with student CRUD
- Course management
- Basic certificate generation
- Student enquiry system

### Phase 2 — Franchise System ✅ (Completed)
- Multi-franchise architecture
- Wallet-based financial system
- Recharge request/approval workflow
- Role-based access control
- Franchise panel (dedicated)

### Phase 3 — Student Portal ✅ (Completed)
- Student authentication (sign-up / sign-in)
- Student dashboard
- Live class access
- Recorded session viewing
- Exam results display
- Password reset via OTP

### Phase 4 — Scale & Polish 🔜 (Next)
- Payment gateway integration (Razorpay/Stripe)
- Advanced reporting & analytics dashboards
- Mobile app (React Native)
- AI-powered course recommendations
- Bulk student import via CSV/Excel
- Multi-language support (Hindi, Marathi)
- WhatsApp integration for notifications

### Phase 5 — Enterprise 🔮 (Future)
- White-label franchise portals
- LMS with video hosting
- API marketplace for third-party integrations
- Placement tracking module
- Alumni network portal

---

## 12. Future Opportunities

1. **Placement Management**: Track student placements, employer connections, and placement rates per franchise
2. **AI Proctored Exams**: Integrate webcam-based proctoring for online exams
3. **Learning Management System (LMS)**: Built-in video player with progress tracking, quizzes, and assignments
4. **Payment Gateway**: Razorpay/Stripe for direct online fee payment from students
5. **WhatsApp Business API**: Automated notifications for admissions, fee reminders, and class schedules
6. **Franchise Marketplace**: Allow franchises to compete for top performance badges
7. **Mobile Application**: Flutter/React Native app for students and franchise managers
8. **Government Compliance Module**: NSDC/Skill India integration for accredited certificate issuance
