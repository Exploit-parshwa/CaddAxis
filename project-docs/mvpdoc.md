# 🚀 MVP Document
## CADD Axis — Minimum Viable Product Definition
**Version:** 1.0 | **Date:** March 10, 2026

---

## 1. MVP Philosophy

The MVP for CADD Axis must prove the core hypothesis:

> **"A centralized web platform can replace fragmented Excel-based operations for a franchise education business, improving student lifecycle management and franchise financial control."**

The MVP is NOT the full product. It is the smallest version that:
1. Allows a Super Admin to manage students and courses
2. Allows a Franchise Admin to manage their own students and issue certificates
3. Provides a marketing website that captures enquiries
4. Gives students a basic portal to check their status

---

## 2. Core Features Required for MVP

### ✅ Must-Have (Ship in MVP)

| Feature | Justification |
|---|---|
| **Public Landing Page** | First impression for all visitors; drives enquiries |
| **Course Listing Page** | Visitors need to explore available programs |
| **Contact/Enquiry Form** | Primary lead capture mechanism |
| **Admin Login (JWT)** | Secure access to management features |
| **Student CRUD** | Core entity management (create, read, update, delete) |
| **Student Status Lifecycle** | Enquiry → Enrolled → Completed pipeline |
| **Course CRUD** | Admin ability to manage course catalog |
| **Basic Dashboard** | Key stats: enrollment count, revenue, enquiries |
| **Payment Recording** | Track fee payments per student with receipt generation |
| **Certificate Generation** | Issue certificates with unique verifiable IDs |
| **Certificate Verification** | Public page to verify certificate authenticity |
| **Franchise Account CRUD** | Create franchise partners with email/password |
| **Franchise Data Isolation** | Franchise sees only their own students/certificates |
| **Basic Middleware Auth** | Route protection for admin and student paths |

### 🚫 Deferred (Post-MVP)

| Feature | Reason for Deferral |
|---|---|
| Franchise Wallet System | Complex financial logic; use manual tracking initially |
| Recharge Request/Approval Workflow | Dependent on wallet system |
| Live Classes Module | Can use external Zoom/Meet links without platform integration |
| Recorded Sessions Module | Can share links via external means initially |
| Student Portal (Full) | Students can call admin for status updates initially |
| Exam Management & Results | Can operate offline initially |
| Marksheet Generation | PDF generation is non-critical |
| Staff Management | Small teams can manage without a dedicated module |
| Event Management | Not critical for core operations |
| Franchise Map (Google Maps) | Nice-to-have visualization |
| Franchise Application Pipeline | Manual email handling initially |
| OTP Password Reset | Direct admin password reset sufficient |
| Advanced Animations (Aurora, WebGL effects) | Functional over aesthetic for MVP |
| Self-Healing Schemas | Pre-define schemas; handle migrations manually |
| SEO Optimizations (OG, Sitemap, JSON-LD) | Important but not launch-blocking |

---

## 3. Simplified Architecture for MVP

```
┌─────────────────────────────────────────────┐
│                  Next.js App                │
│  (App Router + Server Actions)              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌──────────────┐          │
│  │ Public Pages │  │ Admin Panel  │          │
│  │ (SSR + CSR) │  │ (CSR CRUD)   │          │
│  └─────┬───────┘  └──────┬───────┘          │
│        │                 │                  │
│  ┌─────▼─────────────────▼───────┐          │
│  │     Server Actions Layer      │          │
│  │     (actions.js - ~500 LOC)   │          │
│  └───────────────┬───────────────┘          │
│                  │                          │
│  ┌───────────────▼───────────────┐          │
│  │     MySQL Connection Pool     │          │
│  │       (mysql2/promise)        │          │
│  └───────────────┬───────────────┘          │
│                  │                          │
└──────────────────┼──────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │     MySQL DB      │
         │  (6 core tables)  │
         └───────────────────┘
```

### MVP Database (6 Tables Only)

| Table | Purpose |
|---|---|
| `students` | Core entity: name, email, phone, course, status, fees, franchise_id |
| `courses` | Course catalog: title, slug, description, fee, duration |
| `payments` | Fee payment records linked to student |
| `certificates` | Issued certificates with unique_id for verification |
| `franchises` | Franchise partner accounts with email, password_hash, city |
| `contact_messages` | Website enquiry/contact form submissions |

---

## 4. MVP Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Full-stack in one project, no separate API server |
| **Language** | JavaScript (ES6+) | Universal skill; no TypeScript overhead for MVP speed |
| **Styling** | Vanilla CSS + CSS Modules | No build tool dependencies; maximum control |
| **Database** | MySQL 8.0 | Reliable, well-understood, franchise-compatible hosting |
| **Auth** | JWT (jsonwebtoken + jose) | Stateless sessions; no Redis dependency |
| **Passwords** | bcryptjs | Industry standard hashing |
| **Email** | Nodemailer (Gmail SMTP) | Zero-cost for low-volume MVP |
| **Hosting** | XAMPP (Dev) → VPS or Vercel (Prod) | Simple dev, scalable prod |
| **Icons** | Lucide React | Lightweight, tree-shakeable icon set |

---

## 5. Development Phases

### Phase 1: Foundation (Week 1-3)
- [ ] Set up Next.js project with MySQL connection
- [ ] Design and create 6 core database tables
- [ ] Build admin login with JWT authentication
- [ ] Implement middleware for route protection
- [ ] Build student CRUD pages (list, create, edit, delete)
- [ ] Build course CRUD pages
- [ ] Build basic admin dashboard with stats

### Phase 2: Core Business Logic (Week 3-5)
- [ ] Implement student status lifecycle (enquiry → enrolled)
- [ ] Build payment recording with receipt generation
- [ ] Build certificate generation with unique IDs
- [ ] Build public certificate verification page (`/verify/[id]`)
- [ ] Implement franchise account creation
- [ ] Implement franchise data isolation (WHERE franchise_id = ?)
- [ ] Build franchise scoped admin views

### Phase 3: Marketing Website (Week 5-7)
- [ ] Design and build landing page
- [ ] Build course listing page (dynamic from DB)
- [ ] Build contact form with backend submission
- [ ] Build responsive navbar and footer
- [ ] Basic responsive design for mobile
- [ ] Deploy to staging environment

### Buffer & Testing (Week 7-8)
- [ ] End-to-end testing of all user flows
- [ ] Security review (SQL injection, auth bypass, cookie settings)
- [ ] Performance testing on target hardware
- [ ] Bug fixes and polish
- [ ] Production deployment

---

## 6. Launch Strategy

### Pre-Launch Checklist
| Task | Owner |
|---|---|
| Register domain (caddaxis.com) | Business |
| Set up MySQL production database | Engineering |
| Configure SMTP for notifications | Engineering |
| Create Super Admin account | Engineering |
| Create first 2-3 franchise accounts | Business + Engineering |
| Import existing student data (if any) | Business |
| SSL certificate setup | DevOps |

### Launch Approach: **Soft Launch**
1. **Week 1**: Deploy to production with HQ staff only
2. **Week 2**: Onboard 1-2 trusted franchise partners for beta testing
3. **Week 3**: Collect feedback, fix critical issues
4. **Week 4**: Open to all franchise partners
5. **Week 6**: Enable public website for marketing

### Rollback Plan
- Maintain manual Excel tracking in parallel for first 30 days
- Database backups every 6 hours during first month
- Dedicated support channel (WhatsApp group) for franchise admins

---

## 7. Validation Metrics

The MVP is considered **validated** if, within 60 days of launch:

| Metric | Target | Measurement |
|---|---|---|
| **Franchise Adoption** | ≥ 3 franchises actively using the platform daily | Login frequency |
| **Student Records** | ≥ 100 students managed through the platform | Database count |
| **Enquiry Capture** | ≥ 30 website enquiries captured | Contact messages table |
| **Certificate Issuance** | ≥ 10 certificates issued and verified | Certificates table |
| **Payment Recording** | ≥ 50 fee payments recorded | Payments table |
| **Time Savings** | Admin reports spending less time on student tracking | Qualitative survey |
| **Error Rate** | < 5 critical bugs reported per week after Week 2 | Bug tracker |

### Success Criteria
- If **5/7 metrics are met** → Proceed to Phase 2 development
- If **3-4 metrics are met** → Analyze gaps, iterate for 2 more weeks
- If **< 3 metrics are met** → Pivot approach, conduct user interviews

---

## 8. MVP Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Franchise partners resist adoption | Medium | High | In-person training sessions; parallel manual process |
| MySQL downtime on shared hosting | Medium | High | Use managed MySQL (PlanetScale/Railway); daily backups |
| Security breach (weak JWT secret) | Low | Critical | Enforce strong JWT_SECRET in production; rotate keys |
| Slow performance with concurrent users | Low | Medium | Connection pooling (already implemented); query optimization |
| Data migration from Excel fails | Medium | Medium | Build a one-time import script; validate manually |
