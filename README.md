# Markland Hotel & Spa — Platform

A production-grade luxury hotel booking platform built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and a full admin dashboard.

## Tech Stack

- **Framework**: Next.js 15 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom luxury design system
- **Animations**: Framer Motion + GSAP + ScrollTrigger
- **Database**: PostgreSQL + Prisma ORM
- **State**: Zustand + Immer
- **Auth**: JWT (jose) + HTTP-only cookies
- **Charts**: Recharts
- **Icons**: Lucide React

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your DATABASE_URL and JWT_SECRET
```

### 3. Set up the database
```bash
# Push schema to your PostgreSQL database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with sample data
npm run db:seed
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

| Path | Description |
|------|-------------|
| `/` | Cinematic homepage |
| `/rooms` | Room listing with filters |
| `/rooms/[slug]` | Individual room detail |
| `/book` | Booking engine (multi-step) |
| `/admin` | Admin dashboard |
| `/admin/bookings` | Booking management |
| `/admin/rooms` | Room management |
| `/admin/guests` | Guest profiles |
| `/admin/analytics` | Revenue & occupancy |
| `/admin/settings` | System settings |
| `/admin-login` | Staff login |

## Admin Credentials (after seeding)

- **Email**: `admin@marklandhotel.com`
- **Password**: `Markland2024!`

> Works without a database using env credentials — see `.env.local.example`.

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/rooms` | List room categories |
| `GET` | `/api/rooms/[slug]` | Room detail |
| `GET` | `/api/rooms/availability` | Live availability check |
| `POST` | `/api/bookings` | Create booking |
| `GET` | `/api/bookings/[id]` | Booking detail |
| `PATCH` | `/api/bookings/[id]` | Update booking status |
| `GET` | `/api/admin/stats` | Dashboard stats |
| `GET` | `/api/admin/bookings` | Admin booking list |
| `GET` | `/api/admin/rooms` | Admin room list |
| `GET` | `/api/admin/guests` | Guest list |
| `POST` | `/api/auth/login` | Staff login |
| `POST` | `/api/auth/logout` | Logout |

## Build

```bash
npm run build
npm run start
```

## Database

Requires PostgreSQL 14+. Set `DATABASE_URL` in `.env.local`.

The app includes graceful fallbacks — availability checking and booking creation work with static data when the database is unavailable, so you can demo the full UI without a database.
