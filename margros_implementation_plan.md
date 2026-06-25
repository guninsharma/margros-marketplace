# Margros Marketplace — Implementation Plan
### Weeks 1–2 Scope: Database Setup + Google Auth + Frontend Design
**Internal Reference Document · Engineering Team Only**

---

## How to Use This Document

This plan covers two parallel workstreams — Backend and Frontend — for the Weeks 1–2 scope. Each section is written for that team to execute independently, with explicit handoff points called out where the two teams depend on each other. Read your own section fully before starting. Read the opposing section's handoff points so you know what to ask for and when.

The goal at the end of Week 2: the project repo is running locally for all four engineers, Google login works end-to-end, the database schema is live in Supabase, and the frontend shell has the core pages and layout system in place — ready to be wired to real data in Weeks 3–4.

---

---

# PART 1: BACKEND IMPLEMENTATION PLAN

**Owners: Backend Engineers (2 Pax)**

---

## Section B1 — Project & Infrastructure Setup

### B1.1 Supabase Project Initialisation

Create a new Supabase project via the Supabase dashboard (supabase.com). Select the closest available AWS region to India (ap-south-1 Mumbai is currently available). Name the project `margros-marketplace`.

Once created, record the following from the project settings and store them in a shared `.env.local` file that is gitignored:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # never expose this to the frontend
```

The service role key bypasses Row Level Security (RLS). It is used only in server-side scripts and API routes — never in client-side code.

### B1.2 Enable Required Postgres Extensions

In the Supabase SQL editor, enable the following extensions before any tables are created:

- `pgvector` — required for the `embedding` vector columns that will power smart search in Weeks 5–6. Enable it now so columns can be added to the schema from the start without a later migration.
- `uuid-ossp` — for generating UUID primary keys via `uuid_generate_v4()`.

Run in the SQL editor:
```sql
create extension if not exists "uuid-ossp";
create extension if not exists vector;
```

### B1.3 Monorepo Directory Structure

The Next.js project should be structured as follows. Backend engineers own everything under `/lib`, `/scripts`, and `/supabase`. Frontend engineers own everything under `/app` and `/components`.

```
margros-marketplace/
├── app/                        # Next.js App Router (FE owns this)
│   ├── (auth)/
│   │   └── login/
│   ├── restaurants/
│   ├── staff/
│   ├── vendors/
│   └── layout.tsx
├── components/                 # Shared UI components (FE owns this)
├── lib/                        # Shared logic (BE owns this)
│   ├── supabase/
│   │   ├── client.ts           # Browser-side Supabase client
│   │   └── server.ts           # Server-side Supabase client (uses service role)
│   └── types/
│       └── database.types.ts   # Auto-generated from Supabase schema
├── scripts/                    # Data ingestion scripts (BE owns this)
│   ├── seed-restaurants.ts
│   ├── seed-staff.ts
│   └── seed-vendors.ts
├── supabase/                   # Supabase config (BE owns this)
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.local                  # Gitignored
├── next.config.ts
└── package.json
```

---

## Section B2 — Database Schema

All tables follow these conventions:
- Primary keys are UUIDs using `uuid_generate_v4()`
- All tables include `created_at` and `updated_at` timestamps with automatic triggers
- `is_verified` boolean across all listing tables maps to the "Verified" badge visible on the frontend
- `embedding vector(1536)` columns are included now but will remain `NULL` until the embedding pipeline is built in Weeks 5–6. The column type `1536` matches OpenAI's `text-embedding-3-small` dimensions. If a different embedding API is chosen, update the dimension count accordingly before the first migration runs.

---

### B2.1 Table: `restaurants`

This table holds all restaurant listing data. The `locality` field is the primary geographic filter — it maps to the 7 localities already being collected.

```
Table: restaurants
─────────────────────────────────────────────────────────────
id                  uuid, PK, default uuid_generate_v4()
name                text, NOT NULL
locality            text, NOT NULL          -- e.g. "Yelahanka", "Whitefield"
full_address        text
city                text, default 'Bengaluru'
cuisine_type        text[]                  -- array: ["North Indian", "Chinese"]
category            text                    -- e.g. "QSR", "Fine Dining", "Cafe"
phone               text
email               text
google_maps_url     text
rating              numeric(2,1)            -- e.g. 4.3
review_count        integer
is_verified         boolean, default false
verification_notes  text
embedding           vector(1536)            -- NULL until Weeks 5-6
created_at          timestamptz, default now()
updated_at          timestamptz, default now()
```

**Indexes to create:**
- `idx_restaurants_locality` on `locality` — supports the location filter
- `idx_restaurants_cuisine_type` using GIN on `cuisine_type` — supports array-contains filtering
- `idx_restaurants_category` on `category`
- `idx_restaurants_embedding` using ivfflat on `embedding vector_cosine_ops` — supports similarity search (create after data is loaded)

---

### B2.2 Table: `staff`

This table holds individual staff profiles. The `type` field distinguishes agency-affiliated staff from independent/executive-level individuals — this distinction affects how the frontend renders the contact action (agency contact vs. direct contact).

```
Table: staff
─────────────────────────────────────────────────────────────
id                  uuid, PK, default uuid_generate_v4()
full_name           text, NOT NULL
photo_url           text                    -- Supabase Storage public URL
department          text, NOT NULL          -- "Kitchen", "Service", "Management"
role_title          text                    -- "Head Chef", "Captain", "Waiter"
experience_years    integer
locality            text, NOT NULL
city                text, default 'Bengaluru'
languages           text[]                  -- e.g. ["Kannada", "Hindi", "English"]
salary_expectation  integer                 -- monthly figure in INR
mobile              text                    -- stored with +91 prefix
type                text                    -- "Agency" or "Independent"
agency_name         text                    -- NULL if type = "Independent"
is_verified         boolean, default false
is_available        boolean, default true
verification_notes  text
source_platform     text                    -- "Apna", "LinkedIn", "Direct", etc.
embedding           vector(1536)            -- NULL until Weeks 5-6
created_at          timestamptz, default now()
updated_at          timestamptz, default now()
```

**Indexes to create:**
- `idx_staff_locality` on `locality`
- `idx_staff_department` on `department`
- `idx_staff_type` on `type`
- `idx_staff_is_available` on `is_available`
- `idx_staff_embedding` using ivfflat on `embedding vector_cosine_ops`

---

### B2.3 Table: `vendors`

This table holds vendor and supplier listings. The two-level categorisation (`category_group` and `category`) maps to the four groups defined in Section 2.3 of the product plan.

```
Table: vendors
─────────────────────────────────────────────────────────────
id                  uuid, PK, default uuid_generate_v4()
business_name       text, NOT NULL
category_group      text, NOT NULL          -- "Food & Ingredients", "Printing & Packaging",
                                            -- "Equipment & Materials", "Events"
category            text, NOT NULL          -- e.g. "Vegetables", "Catering Material"
description         text
locality            text, NOT NULL
city                text, default 'Bengaluru'
phone               text
email               text
whatsapp            text
contact_person_name text
is_verified         boolean, default false
verification_notes  text
embedding           vector(1536)            -- NULL until Weeks 5-6
created_at          timestamptz, default now()
updated_at          timestamptz, default now()
```

**Indexes to create:**
- `idx_vendors_locality` on `locality`
- `idx_vendors_category_group` on `category_group`
- `idx_vendors_category` on `category`
- `idx_vendors_embedding` using ivfflat on `embedding vector_cosine_ops`

---

### B2.4 Table: `contact_logs`

This table records every time a user clicks the "Contact" action on any listing. No chat happens yet — this is purely event logging. The `listing_type` and `listing_id` together identify which listing was contacted. When in-platform chat is built later, this table becomes the seed for the conversation history model.

```
Table: contact_logs
─────────────────────────────────────────────────────────────
id                  uuid, PK, default uuid_generate_v4()
user_id             uuid, NOT NULL, FK → auth.users(id) ON DELETE CASCADE
listing_type        text, NOT NULL          -- "restaurant", "staff", "vendor"
listing_id          uuid, NOT NULL
contacted_at        timestamptz, default now()
```

**Note on foreign keys:** `listing_id` intentionally does not have a FK constraint at the database level because it references three different tables depending on `listing_type`. Referential integrity is enforced at the application layer (API route) instead.

**Indexes to create:**
- `idx_contact_logs_user_id` on `user_id`
- `idx_contact_logs_listing_id` on `listing_id`
- Composite: `idx_contact_logs_user_listing` on `(user_id, listing_id)`

---

### B2.5 Table: `profiles`

Supabase Auth handles user creation in the `auth.users` table, which the application cannot directly modify. This `profiles` table extends each authenticated user with application-level metadata. It is created and updated via a Postgres trigger on `auth.users`.

```
Table: profiles
─────────────────────────────────────────────────────────────
id                  uuid, PK, FK → auth.users(id) ON DELETE CASCADE
full_name           text
avatar_url          text
role                text, default 'owner'   -- "owner" for now; expand later
created_at          timestamptz, default now()
updated_at          timestamptz, default now()
```

**Trigger:** Create a `handle_new_user()` function that fires `AFTER INSERT ON auth.users` and inserts a corresponding row into `public.profiles`, pulling `full_name` and `avatar_url` from `raw_user_meta_data` (Google OAuth populates these automatically).

---

## Section B3 — Row Level Security (RLS)

RLS must be enabled on all tables. These are the policies for the Weeks 1–2 scope. More granular policies (e.g., allowing listing owners to edit their own records) are added in later weeks.

**`restaurants`, `staff`, `vendors`** — Public read, no public write:
- `SELECT`: allow for all (`using (true)`)
- `INSERT`, `UPDATE`, `DELETE`: allow only for `service_role` (i.e., only the backend scripts and admin API routes, never the browser client)

**`contact_logs`** — Authenticated users only:
- `INSERT`: allow if `auth.uid() = user_id`
- `SELECT`: allow if `auth.uid() = user_id` (users can only see their own logs)

**`profiles`** — Self-read/write:
- `SELECT`: allow if `auth.uid() = id`
- `UPDATE`: allow if `auth.uid() = id`

---

## Section B4 — Authentication: Google OAuth via Supabase Auth

### B4.1 Supabase Dashboard Configuration

In the Supabase project dashboard, navigate to Authentication → Providers → Google. Enable the Google provider. You will need a Google OAuth 2.0 Client ID and Secret, created in the Google Cloud Console:

1. Go to console.cloud.google.com → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application type)
3. Add the following to Authorised Redirect URIs:
   - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
4. Paste the Client ID and Secret into the Supabase Google provider settings

### B4.2 Auth Callback Route (Backend API Route)

Create a Next.js API route at `app/auth/callback/route.ts`. This route handles the OAuth redirect from Google, exchanges the auth code for a session using the Supabase server client, and redirects the user to the homepage.

The route must:
- Accept a `GET` request with `code` and `next` query parameters
- Call `supabase.auth.exchangeCodeForSession(code)`
- On success, redirect to `next` or `/`
- On error, redirect to `/login?error=auth_failed`

### B4.3 Auth Middleware

Create a `middleware.ts` at the project root. This file runs on every request and refreshes the Supabase session token if it is near expiry. It should use the `@supabase/ssr` package's `createServerClient` pattern.

Protected routes for this version: `/` (homepage requires login to see contact details). All listing pages (`/restaurants`, `/staff`, `/vendors`) are publicly viewable. The "Contact" reveal action on a listing page requires an authenticated session — enforce this at the API route level, not the page level.

### B4.4 Supabase Client Helpers

Create two client helpers in `/lib/supabase/`:

- `client.ts`: Browser-side client using `createBrowserClient` from `@supabase/ssr`. Used in client components.
- `server.ts`: Server-side client using `createServerClient` from `@supabase/ssr` with cookie handling. Used in Server Components and API routes.

---

## Section B5 — API Routes (Weeks 1–2 Scope)

These are the only API routes needed for the current scope. They are thin — they read from Supabase and return JSON. Complex logic (filtering, pagination) is handled by Supabase query params, not custom server logic.

### `POST /api/contact-log`

Records a contact action. Requires authentication. Request body: `{ listing_type, listing_id }`. Validates that `listing_type` is one of `["restaurant", "staff", "vendor"]`. Inserts a row into `contact_logs` using the server-side Supabase client with the authenticated user's ID. Returns `{ success: true }`.

This is the only write route in Weeks 1–2. All listing data is read directly from Supabase using the browser client on the frontend.

### `GET /api/auth/session`

Returns the current session's user object (id, email, name, avatar). Used by the frontend to determine whether to show the "Contact" reveal or a "Log in to view contact" prompt. This route simply calls `supabase.auth.getUser()` server-side and returns the sanitised result.

---

## Section B6 — Type Generation

After the schema migrations are applied, run the Supabase CLI to auto-generate TypeScript types:

```bash
npx supabase gen types typescript --project-id <ref> > lib/types/database.types.ts
```

Commit this file to the repo. Re-run and re-commit whenever the schema changes. The frontend team imports from this file for type-safe database queries — do not let it go stale.

---

## Section B7 — Handoff Points to Frontend Team

| What | When | Format |
|---|---|---|
| `.env.local` variables (Supabase URL + anon key) | Day 1 | Shared via secure channel (not git) |
| `database.types.ts` generated file | After first migration | Committed to `/lib/types/` in the repo |
| Confirmation that RLS is live and `SELECT` is open | End of Week 1 | Slack/message |
| `/api/contact-log` endpoint is live and documented | End of Week 2 | README note in `/app/api/` |
| Auth callback route is working (test with a real Google login) | End of Week 2 | Demo to FE team |

---

---

# PART 2: FRONTEND IMPLEMENTATION PLAN

**Owners: Frontend Engineers (2 Pax)**

---

## Section F1 — Design Direction

Before writing any code, align on the visual identity. This is a marketplace for the restaurant industry in Bengaluru — the audience is practical, mobile-first, and has low tolerance for platforms that feel slow or confusing. The design must communicate trustworthiness and density of information without feeling cluttered.

**Design Tokens (to be defined in a single `globals.css` or Tailwind config before any component work begins):**

```
Palette (6 values):
─────────────────────────────────────────────────────────────
--color-ink:        #1A1A1A   (primary text, headings)
--color-surface:    #FAFAF8   (page background — off-white, not pure white)
--color-card:       #FFFFFF   (listing cards)
--color-accent:     #D4501A   (primary CTA — a warm, Indian-kitchen red-orange)
--color-muted:      #6B6B6B   (secondary text, labels)
--color-border:     #E5E5E0   (card borders, dividers)
```

**Typography:**
- Display/Headings: `Instrument Serif` (Google Fonts) — humanist serif, warm, not cold corporate
- Body/UI: `Inter` (Google Fonts) — highly legible at small sizes, works well in tables and filter UIs
- Data/Labels: `Inter` at reduced weight and slightly increased letter-spacing

**Signature element:** Verified listings display a small flame icon (not a checkmark) next to the badge — specific to the restaurant industry, immediately legible, and distinct from every generic "blue tick" pattern. This is the one branding moment; everything else is disciplined and restrained.

**Layout principle:** The directory view is the product. Every page exists to serve the search and filter UI. Navigation is minimal — the filter sidebar and listing cards are the hero. Do not invest in elaborate homepage animations; invest in the listing page feeling fast and trustworthy.

---

## Section F2 — Project Setup

### F2.1 Dependencies

Initialise the Next.js project with the App Router and TypeScript:

```bash
npx create-next-app@latest margros-marketplace \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

Install required packages:

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-checkbox
npm install lucide-react
npm install clsx tailwind-merge
```

**Package rationale:**
- `@supabase/ssr` — the correct Supabase package for Next.js App Router (handles cookies and server components correctly)
- `@radix-ui/*` — unstyled, accessible primitives for modals, selects, and checkboxes (filter UI)
- `lucide-react` — icon set; used for the flame verified icon, search, filter, phone icons
- `clsx` + `tailwind-merge` — utility for conditionally composing Tailwind class names cleanly

### F2.2 Tailwind Configuration

Extend `tailwind.config.ts` to register the design tokens as custom colours and font families. Map `--color-accent`, `--color-ink`, etc., from the CSS variables into the Tailwind theme so components can use `text-accent`, `bg-ink`, and so on consistently.

Set `fontFamily.display` to `['Instrument Serif', 'serif']` and `fontFamily.sans` to `['Inter', 'sans-serif']`.

---

## Section F3 — Page Routes & Responsibilities

The App Router structure maps directly to the three directory types and the auth flow:

```
app/
├── layout.tsx                  # Root layout: global nav, font loading, session provider
├── page.tsx                    # Homepage: hero + directory entry points
├── (auth)/
│   └── login/
│       └── page.tsx            # Login page: Google sign-in button only
│   └── callback/
│       └── route.ts            # Handled by BACKEND — FE does not touch this
├── restaurants/
│   ├── page.tsx                # Restaurant directory: search, filters, listing grid
│   └── [id]/
│       └── page.tsx            # Individual restaurant detail page
├── staff/
│   ├── page.tsx                # Staff directory
│   └── [id]/
│       └── page.tsx            # Individual staff profile page
└── vendors/
    ├── page.tsx                # Vendor directory
    └── [id]/
        └── page.tsx            # Individual vendor detail page
```

---

## Section F4 — Component Architecture

Build components in this order. Earlier components are dependencies of later ones — do not build listing cards before the design tokens and layout wrapper are stable.

### F4.1 Foundation Layer (Build First)

**`components/ui/` — Primitive components:**

These are thin wrappers around Radix UI primitives, styled with the design tokens. Build these before any page-specific components.

- `Button.tsx` — variants: `primary` (accent fill), `secondary` (outline), `ghost` (text only). Used for CTAs, filter actions, login trigger.
- `Badge.tsx` — variants: `verified` (flame icon + "Verified"), `category` (neutral pill). The verified badge appears on all three listing types.
- `Input.tsx` — text input styled for the search bar. Includes a search icon prefix slot.
- `Select.tsx` — wraps Radix Select. Used in filter dropdowns (locality, department, category group).
- `Checkbox.tsx` — wraps Radix Checkbox. Used for multi-select filters (cuisine type, languages).
- `Card.tsx` — base card wrapper with border and shadow. Listing cards are built on top of this.
- `Avatar.tsx` — circular image with fallback initials. Used on staff profile cards.

### F4.2 Layout Layer

**`components/layout/`:**

- `Navbar.tsx` — top navigation. Contains: Margros wordmark (left), section links (Restaurants | Staff | Vendors), and auth state (Google avatar + name if logged in, "Sign in" button if not). Keep it minimal — the directory is the product, not the nav.
- `FilterSidebar.tsx` — the core interactive element of every directory page. This is a shared component that accepts a configuration object describing which filters to show (different for Restaurants vs. Staff vs. Vendors). On mobile, it is a bottom sheet (triggered by a "Filters" button). On desktop, it is a fixed left sidebar.
- `ListingGrid.tsx` — accepts an array of listing items and a card component type, renders in a responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop).
- `SearchBar.tsx` — the global search input rendered at the top of each directory page. In Weeks 1–2, this performs basic text search. In Weeks 5–6, it is wired to the embeddings API — the component itself does not need to change.

### F4.3 Listing Card Components

Three distinct card designs, one per directory type. All three share the base `Card` component but have different field layouts.

**`components/cards/RestaurantCard.tsx`**

Displays per listing: restaurant name (display font), locality + category pill, cuisine type tags, star rating + review count, verified badge (if applicable), and a "View" button. Does not show phone number — that is on the detail page only.

**`components/cards/StaffCard.tsx`**

Displays per listing: avatar photo (with initials fallback), full name, role title + department, experience years ("5 yrs"), locality, languages as small pills, salary expectation (if available, shown as "~₹25,000/mo"), verified badge, and an "View Profile" button. Does not show mobile number — revealed on detail page after login check.

**`components/cards/VendorCard.tsx`**

Displays per listing: business name, category group + specific category, locality, contact person name (if available), verified badge, and "View" button.

### F4.4 Detail Page Components

**`components/detail/ContactReveal.tsx` — Critical Component**

This component is the same across all three detail pages. It renders the "Contact" action. Behaviour:
- If the user is **not authenticated**: renders a "Sign in to view contact details" button that redirects to `/login?next=[current_url]`
- If the user **is authenticated**: renders a "Show Contact" button. On click, it calls `POST /api/contact-log` (fire-and-forget, no loading state needed), then reveals the phone number and/or email inline. The phone number is rendered as a `tel:` link so mobile users can tap to call directly.

This component must accept props for `listingType`, `listingId`, and `contactData` (the phone/email values, passed from the parent server component). It should never fetch contact data itself — it only receives it and controls whether to display it.

**This is the most important component in the entire frontend.** The "Contact" reveal is the platform's core action. It must be reliable, fast, and work on mobile without any friction. Build and test it first among the detail components.

**`components/detail/DetailHeader.tsx`**

The top section of any listing detail page: large name/title, location, verified badge, category tags. Shared layout across all three detail page types with slight field variations.

---

## Section F5 — Page-by-Page Specifications

### F5.1 Homepage (`app/page.tsx`)

**Purpose:** Entry point. Direct users immediately to the right directory. Do not over-invest here — this page is not the product.

**Content:**
- Headline: "Find chefs, staff, and suppliers for your restaurant." — plain, direct, no tagline creativity needed here.
- Three large directory entry cards: Restaurants, Staff, Vendors. Each has an icon, a one-line description, and a link button.
- No hero image, no animation. The page loads instantly.

### F5.2 Restaurant Directory (`app/restaurants/page.tsx`)

**Filter configuration for `FilterSidebar`:**
- Locality (single-select dropdown) — values: the 7 localities being collected. Pull these as a static list for now; they can become dynamic later.
- Category (multi-select checkboxes): QSR, Casual Dining, Fine Dining, Cafe, Bakery, Cloud Kitchen
- Cuisine Type (multi-select checkboxes): North Indian, South Indian, Chinese, Continental, Fast Food, etc.
- Verified Only (single toggle/checkbox)

**Search bar behaviour (Weeks 1–2):** Basic `ilike` text search against `name` and `locality`. The search input is debounced (300ms) — do not fire a query on every keystroke.

**Listing data:** Fetched server-side using a Next.js Server Component. Pass the `searchParams` from the URL (which the filter sidebar writes to) into the Supabase query. This means the filter state lives in the URL — shareable links work out of the box, and no client-side state management library is needed for filtering.

**Empty state:** "No restaurants found for these filters. Try removing a filter or searching a different area." — with a "Clear all filters" link.

### F5.3 Restaurant Detail Page (`app/restaurants/[id]/page.tsx`)

**Content:**
- Restaurant name (display font, large)
- Locality, full address, Google Maps link (if available)
- Category + cuisine type tags
- Rating + review count
- Verified badge (if applicable)
- `ContactReveal` component — shows phone and email
- Static note: "Contact the restaurant directly to discuss availability."

### F5.4 Staff Directory (`app/staff/page.tsx`)

**Filter configuration:**
- Locality (single-select)
- Department (single-select): Kitchen, Service, Management
- Role Title (text input, optional — for searching "Head Chef" specifically)
- Experience (range-style select): "Any", "0–2 years", "3–5 years", "5+ years", "10+ years"
- Type (single-select): All, Agency, Independent
- Available Only (toggle, default on)

**Sorting:** Default sort is `is_verified DESC, created_at DESC` — verified listings appear first.

### F5.5 Staff Detail Page (`app/staff/[id]/page.tsx`)

**Content:**
- Large avatar photo with initials fallback
- Full name (display font)
- Role title + department
- Experience years, languages, locality
- Salary expectation (formatted as "~₹XX,XXX/month" or "Not specified")
- Type (Agency/Independent) — if Agency, show agency name
- Verified badge
- `ContactReveal` component — shows mobile number as a `tel:` link
- Source platform (small muted label: "Listed via Apna" — this builds trust that the profile is real)

### F5.6 Vendor Directory (`app/vendors/page.tsx`)

**Filter configuration:**
- Category Group (single-select): Food & Ingredients, Printing & Packaging, Equipment & Materials, Events
- Category (dependent single-select — options change based on Category Group selection)
- Locality (single-select)
- Verified Only (toggle)

**Note on dependent filters:** The Category dropdown's options should update when Category Group changes. Implement this as a client component with local state — when Category Group changes, reset the Category selection and filter the options array. No API call needed; the category mapping is a static constant in the codebase.

### F5.7 Vendor Detail Page (`app/vendors/[id]/page.tsx`)

**Content:**
- Business name (display font)
- Category group + specific category
- Locality + city
- Description (if available)
- Contact person name (if available)
- Verified badge
- `ContactReveal` component — shows phone, email, WhatsApp link

### F5.8 Login Page (`app/(auth)/login/page.tsx`)

**Content:** Simple centred card. Margros wordmark, one-line description ("Margros Marketplace — for the restaurant industry"), and a single "Continue with Google" button.

The button calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/auth/callback' } })` from the browser client. That is the entirety of the auth logic on the frontend — Supabase and the backend handle everything else.

After login, the user is redirected to the `next` URL parameter if it exists (e.g., the listing page they were trying to access), or to `/` if not.

---

## Section F6 — Data Fetching Pattern

### Server Components (default pattern)

Directory pages and detail pages are React Server Components. They call Supabase directly using the server-side client from `lib/supabase/server.ts`. Filter values are read from `searchParams` (the URL query string). This pattern means:

- No `useEffect` / `useState` for data fetching
- Filter state is in the URL, making it shareable and bookmarkable
- Fast initial page loads (no client-side waterfall)

### Client Components (exceptions)

Only use `'use client'` for:
- `FilterSidebar` — needs to respond to user interaction and update the URL query string using `useRouter` and `useSearchParams`
- `SearchBar` — needs debouncing logic
- `ContactReveal` — needs to handle the click event and call the API route
- `Navbar` — needs to read auth state from the browser session

Do not make entire pages client components. Keep the data-fetching layer in server components.

### URL-Driven Filter State

When the user changes a filter, the `FilterSidebar` updates the URL query string (e.g., `/staff?locality=Yelahanka&department=Kitchen&available=true`). The page re-renders with the new `searchParams`, which are passed to the Supabase query. This is the correct Next.js App Router pattern — do not use Zustand, Jotai, or any state management library for filter state.

---

## Section F7 — Mobile Considerations

The primary user — a restaurant owner browsing for a chef or vendor — is almost certainly on a mobile phone. Every component must be designed mobile-first.

Critical mobile behaviours:
- `FilterSidebar` collapses into a bottom sheet on screens below `md` breakpoint. A sticky "Filter & Sort" button floats above the listing grid on mobile.
- `ListingGrid` is single-column on mobile.
- Phone numbers in `ContactReveal` are `<a href="tel:+91...">` links — tapping them opens the dialler directly.
- WhatsApp numbers in vendor detail pages are `<a href="https://wa.me/91...">` links — tapping them opens WhatsApp directly.
- Touch targets (buttons, filter options) are minimum 44px tall.

---

## Section F8 — Handoff Points to Backend Team

| What | When | Format |
|---|---|---|
| Confirmed filter field names (must match DB column names exactly) | Start of Week 1 | Short message/doc |
| Static lists needed: localities (7 values), cuisine types, vendor categories | Start of Week 1 | Constants file committed to `/lib/constants.ts` |
| Confirmation of `ContactReveal` API endpoint contract: request body shape, response shape | Start of Week 2 | README note |
| Auth session shape — what fields are on the user object returned from `/api/auth/session` | Start of Week 2 | Type definition in `database.types.ts` |

---

## Section F9 — What Is Out of Scope (Do Not Build)

- In-app chat or messaging of any kind
- Any form for staff/vendors to self-register or edit their own listings (this is admin-managed data in this version)
- A dashboard for restaurant owners to track who they've contacted (the `contact_logs` table logs it; no UI for it yet)
- Rating or review submission
- Commission or payment flows
- The Influencer dataset — no frontend surface for it

---

---

# PART 3 — SHARED CONVENTIONS

Both teams must agree on these before writing a single line of code.

## Naming Conventions

- Database columns: `snake_case`
- TypeScript variables and functions: `camelCase`
- React components: `PascalCase`
- URL route segments: `kebab-case` (Next.js default)
- Environment variables: `SCREAMING_SNAKE_CASE`

## Locality Values (Canonical List)

Agree on the exact spelling and casing of all 7 locality names before the schema is created. The filter dropdown on the frontend uses these exact strings; the database column stores these exact strings. A mismatch means filters will not work. Decide now, write them into `/lib/constants.ts`, and do not change them without a database migration.

## `is_verified` Convention

A listing with `is_verified = true` shows the verified flame badge. The default is `false`. Verification is set by the data team / admin — there is no self-verification UI in this version.

## `updated_at` Trigger

Create a reusable Postgres function `set_updated_at()` that sets `updated_at = now()` on any row update. Attach it as a trigger to all four tables. This ensures `updated_at` is always accurate without relying on the application layer.

---

© 2026 Margros. Internal Use Only. Do not distribute.
