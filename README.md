# Javier Maldonado Real Estate

Production-quality multilingual real estate website and admin portal for **Javier Maldonado**, REALTOR® with **Avila Realty Group Inc., Brokerage**.

**Domain:** https://javiermaldonado.ca

This is a single Next.js full-stack application (frontend + API routes + MongoDB) — not separate frontend/backend folders.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** with brand palette (midnight navy, lake blue, warm copper)
- **Framer Motion**, **GSAP**, **Lenis** for cinematic animations
- **next-intl** — English (`/en`) and Spanish (`/es`)
- **MongoDB Atlas** + **Mongoose**
- **JWT** auth with HTTP-only cookies
- **Cloudinary** for image/PDF uploads
- **Nodemailer** for lead/booking emails
- **React Hook Form** + **Zod**
- **TanStack Query**
- **Vitest** for calculator unit tests

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — strong random secret
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — for seeding admin user
- `CLOUDINARY_*` — Cloudinary credentials
- `SMTP_*` — email server settings
- `FRONTEND_URL` — e.g. `http://localhost:3000`

### 3. Seed admin user

```bash
npm run seed:admin
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en`.

Admin portal: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run test` | Run calculator unit tests |
| `npm run seed:admin` | Create admin user from env vars |

## Project Structure

```
javiermaldonado/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Public pages (en/es)
│   │   ├── admin/             # Admin portal
│   │   └── api/               # Backend API routes
│   ├── components/            # UI components
│   ├── config/                # Site config & calculator rules
│   ├── lib/                   # DB, auth, email, utilities
│   ├── models/                # Mongoose models
│   └── i18n/                  # next-intl routing
├── messages/                  # en.json, es.json translations
├── public/                    # logo.png, static assets
└── scripts/                   # seed-admin.ts
```

## Features

### Public Website
- Cinematic intro experience (once per session)
- 20+ pages in English and Spanish
- Property listings (admin-managed, no MLS scraping)
- 5 financial calculators with date-stamped rules
- Lead forms (buyer, seller, rental, investor, home value)
- Gated resource downloads
- Multi-step consultation booking
- Blog, testimonials, team (CMS-managed)

### Admin Portal (`/admin`)
- Dashboard with stats
- Listings, leads, bookings CRUD
- Testimonials, blog, team, resources, services
- Cloudinary image/PDF uploads
- CSV lead export

## Spanish Content Note

> **Important:** Spanish translations in `messages/es.json` and admin-managed Spanish content should be reviewed by a fluent Spanish speaker before production launch.

## Calculator Rules

Calculator configurations include `effectiveDate` and official source URLs:

- CMHC: `src/config/calculators/cmhc.ts`
- Land Transfer Tax: `src/config/calculators/landTransferTax.ts`

Verify current government rates before launch.

## Deployment

1. Set all environment variables on your hosting platform (Vercel, Railway, etc.)
2. Connect MongoDB Atlas
3. Configure Cloudinary and SMTP
4. Run `npm run build`
5. Run `npm run seed:admin` once
6. Deploy

## Brokerage Attribution

All pages display **Avila Realty Group Inc., Brokerage** attribution. Replace the brokerage logo placeholder on the Contact page and footer when the official logo is supplied.

## License

Private — © Javier Maldonado Real Estate
