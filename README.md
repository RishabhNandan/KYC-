# SHANTI NEURO CLINIC - Hospital Management & Recommendation Documentation System

A complete, professional, secure, web-based documentation and recommendation management system for **SHANTI NEURO CLINIC**.

## 1. System Features
- **Strict Compliance**: Pure manual-entry recommendation system. Zero automated or AI-assisted clinical diagnosis or modification.
- **Role-Based Access Control**:
  - **Super Admin**: Doctor management, Co-Admin accounts, record modification/deletion permissions, audit log viewing, hospital letterhead configuration.
  - **Co-Admin**: Doctor search/select, patient lookup/registration, manual recommendation entry, PDF generation, history viewing.
- **Official SHANTI NEURO CLINIC Letterhead & PDF Engine**:
  - Live side-by-side letterhead preview.
  - Standardized Record ID generation (`REC-2026-XXXXXX`).
  - Download, Print, and Server/Client PDF generation suitable for A4 paper.
  - Digital Signature integration (drawn canvas or typed signatory).
- **Core Modules**:
  - **Dashboard**: KPI statistics, recent records, activity feed.
  - **Doctor Management**: Add/edit/deactivate specialists, registration numbers, departments.
  - **Patient Management**: Patient directory & quick registration (`PAT-2026-XXXXX`).
  - **Recommendation Form & Live Preview**: Real-time letterhead preview.
  - **Recommendation History**: Searchable, filterable by date, doctor, or keyword.
  - **PDF Documents Library**: Quick preview modals and PDF downloads.
  - **Audit Logs**: Comprehensive security trail tracking logins, edits, PDF generations, deletions.
  - **Users / Co-Admins Management**: Super Admin management of desk co-admins.
  - **Hospital Settings**: Manage hospital contacts, license number, and letterhead disclaimers.

## 2. Tech Stack
- **Frontend**: React 19, Next.js App Router, Tailwind CSS v4, Lucide React
- **Backend**: Next.js Server Handlers / REST API
- **Database & ORM**: Prisma ORM, SQLite DB (`dev.db`)
- **Authentication**: JWT tokens stored in HttpOnly cookies, bcryptjs password hashing
- **PDF Generation**: HTML2Canvas + jsPDF & printable CSS media layout

## 3. Quick Start & Setup

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### Installation & Execution

```bash
# 1. Install dependencies
npm install

# 2. Push Prisma database schema
npx prisma db push

# 3. Seed database with initial hospital data & accounts
node run-seed.js

# 4. Run development server
npm run dev
```

Open `http://localhost:3000` in your web browser.

## 4. Default Credentials

| Role | Email | Password |
| --- | --- | --- |
| **Super Admin** | `admin@shantineuroclinic.com` | `Admin@123` |
| **Desk Co-Admin** | `coadmin@shantineuroclinic.com` | `Coadmin@123` |
