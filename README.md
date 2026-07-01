# Margros Marketplace

A modern, premium, light-themed hospitality network directory for Bengaluru. This platform connects restaurant operators, kitchen and service professionals, and industrial suppliers in a single, verified layer.

The frontend is built using a clean, white-dominant design system inspired by premium SaaS applications like Stripe, Linear, and Airbnb.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Motion (Framer Motion)](https://motion.dev/)
- **Database / Auth**: [Supabase](https://supabase.com/)

---

## Getting Started

Follow these steps to run the application locally.

### 1. Prerequisites
Ensure you have **Node.js (v18.x or later)** and **npm** installed on your system.

### 2. Environment Configuration
Create a `.env.local` file at the root of the project and populate it with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Installation
Install all dependencies using npm:
```bash
npm install
```

### 4. Run Development Server
Start the Next.js development server:
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## Project Structure

- `app/` — Pages, layout templates, and API endpoints (Next.js App Router).
  - `app/page.tsx` — Marketing landing page.
  - `app/(marketplace)/` — Main marketplace pages (restaurants, staff, vendors).
  - `app/login/` — Sleek authentication gateway.
- `components/` — Modular React UI components (Grids, filters, navigation layout).
- `components/ui/` — Design primitives (Floating dock, vanish input, etc.).
- `lib/` — Supabase integration clients (ssr and client configuration).
- `public/` — Static assets (logos and icons).
- `supabase/` — Database migrations and schema definitions.

---

## Production Build

To run a production-ready optimized build:
```bash
# Compile and build the Next.js production code
npm run build

# Start the built application server
npm run start
```
