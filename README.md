# PromptWear — Generative Apparel Marketplace

> **"Describe it. Wear it."**

PromptWear is an AI-powered custom apparel marketplace. Users describe a design in plain text, Ideogram AI generates print-ready artwork variations, users place the graphic on a live interactive garment mockup, enter custom anatomical measurements (chest width & body length) for bespoke tailored fitting, and either **buy it** or **publish it to the marketplace**. When a design sells, the creator earns **80% of the markup**, and the platform keeps 20%.

> [!IMPORTANT]
> **Stripe Test Mode Only:** PromptWear operates strictly in Stripe test mode. All payments use test cards (e.g. `4242 4242 4242 4242`) and no real money is charged. Live keys (`sk_live_`) are blocked at startup.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (dark streetwear theme, custom cyberpunk accents)
- **Database & ORM**: PostgreSQL (Docker Supabase locally, Neon / Supabase in production) + Drizzle ORM
- **AI Artwork Generation**: Ideogram API v3 (server-side only with prompt engineering)
- **Asset Storage**: Vercel Blob (persists generated artwork)
- **Payments**: Stripe Checkout + Idempotent Webhooks (Test mode only)
- **Auth**: Clerk (with built-in demo-mode fallback)
- **Testing**: Vitest (pricing, measurements, and webhook idempotency suites)
- **Containerization**: Docker Compose (Local Supabase PostgreSQL + Supabase Studio GUI)

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── admin/orders/       # Demo order status advancement
│   │   ├── checkout/           # Stripe Checkout Session creation (server-priced)
│   │   ├── designs/            # Save drafts and publish designs
│   │   ├── generate/           # Ideogram API generative artwork endpoint
│   │   └── webhooks/stripe/    # Idempotent Stripe webhook receiver
│   ├── admin/page.tsx          # Admin fulfillment control & test GMV metrics
│   ├── checkout/
│   │   ├── cancel/page.tsx     # Cancelled payment screen
│   │   └── success/page.tsx    # Order confirmed screen
│   ├── dashboard/page.tsx      # My designs, order timeline, simulated earnings
│   ├── design/page.tsx         # 3-step studio: garment, Ideogram AI, measurements
│   ├── shop/
│   │   ├── page.tsx            # Marketplace browse with garment and search filters
│   │   └── [slug]/page.tsx     # Product detail, 3D placement, custom fit & Buy Now
│   ├── globals.css             # Tailwind dark streetwear styles & accents
│   ├── layout.tsx              # Root layout with TestModeBadge, Navbar, Footer
│   └── page.tsx                # Streetwear landing page with prompt jump-to-studio
├── components/
│   ├── AdminOrdersTable.tsx    # Interactive order status advancement table
│   ├── AuthProvider.tsx        # Clerk wrapper with graceful demo fallback
│   ├── DesignStudio.tsx        # Complete 3-step design studio
│   ├── Footer.tsx              # Footer with garment links & economic model
│   ├── LandingPromptInput.tsx  # Hero prompt bar with preset chips
│   ├── MeasurementsPicker.tsx  # In/cm toggle, baseline size suggest, validation
│   ├── MockupCanvas.tsx        # Garment canvas with drag/scale/rotate & front/back
│   ├── Navbar.tsx              # Brand logo, studio/shop/dashboard/admin nav
│   ├── ProductPurchase.tsx     # Marketplace purchase & custom fit module
│   └── TestModeBadge.tsx       # Prominent test mode card banner
├── db/
│   ├── schema.ts               # Drizzle PostgreSQL schema (8 tables)
│   └── seed.ts                 # Seeds 8 sample published designs & demo users
├── docker-compose.yml          # Local Supabase PostgreSQL + Supabase Studio GUI
├── drizzle/                    # Generated SQL migration files
├── lib/
│   ├── auth.ts                 # Clerk auth helper with demo user fallback
│   ├── db.ts                   # Drizzle client (Supabase Docker / Neon / Hosted)
│   ├── ideogram.ts             # Ideogram v3 client + prompt engineering + Blob
│   ├── measurements.ts         # Anatomical limits & size suggestion logic
│   ├── pricing.ts              # Server-side pricing calculation & 80/20 fee split
│   ├── store.ts                # Resilient query & persistence layer
│   └── stripe.ts               # Stripe singleton with live-mode security guard
├── tests/
│   ├── measurements.test.ts    # Measurement limits & conversion unit tests
│   ├── pricing.test.ts         # Fee split & price calculation tests
│   └── webhook.test.ts         # Stripe webhook idempotency & earnings tests
├── .env.example                # Example environment variables template
└── vercel.json                 # Vercel deployment configuration
```

---

## Local Setup Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24)
- **Docker**: For running local Supabase database
- **Stripe CLI**: For local webhook forwarding (`stripe listen`)

### 2. Run Local Supabase on Docker
Start the local Supabase PostgreSQL database and Supabase Studio dashboard:

```bash
npm run docker:up
```
- **PostgreSQL**: `localhost:5432` (`postgres://postgres:postgres@localhost:5432/postgres`)
- **Supabase Studio GUI**: Open [http://localhost:54323](http://localhost:54323) in your browser to view tables and data visually!

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```ini
# Local Docker Supabase PostgreSQL
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

# Stripe (TEST MODE ONLY - sk_test_... / pk_test_...)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Ideogram AI
IDEOGRAM_API_KEY=your_ideogram_api_key_here

# App URL & Admin
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAILS=designer@promptwear.demo

# Optional: Vercel Blob & Clerk (built-in fallbacks enabled if omitted)
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### 4. Run Migrations & Seed Data
Generate and apply migrations to your local Supabase database, then seed 8 curated streetwear drops:

```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Forward Stripe Webhooks Locally
In another terminal, start the Stripe webhook listener:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the printed `whsec_...` signing secret into your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

---

## Testing & Quality Verification

Run the full automated Vitest test suite and linter:

```bash
npm test
npm run lint
npm run build
```

---

## 3-Minute Demo Script

Follow this step-by-step script for a demo recording or live review:

1. **Browse Landing Page (`/`)**:
   - Notice the prominent **"Stripe Test Mode Only"** banner with test card `4242 4242 4242 4242`.
   - In the hero prompt input, type: `"Cyberpunk mecha samurai in neon turquoise"` and click **Generate**.
2. **Design Studio (`/design`)**:
   - Choose **Oversized Heavy Fleece Hoodie** in **Onyx Black**.
   - Review the 4 variations rendered by Ideogram v3 (or aesthetic sample graphics if no key entered).
   - Select variation #1. On the interactive garment canvas, **drag** to center, adjust **Scale (85%)**, and toggle **Front/Back**.
   - In Step 3 (Measurements), toggle between **Inches** and **cm**, click the **L** size preset to auto-fill `24" chest x 30" length`. Notice the live **+$5.00 Bespoke Fit** fee in the unit cost breakdown.
   - Adjust designer markup to **$15.00** (shows $12.00 / 80% designer share).
   - Click **Publish to Marketplace**.
3. **Marketplace (`/shop/[slug]`)**:
   - Your newly published piece appears live with custom tags and price breakdown.
   - Click **Buy Now with Stripe**.
4. **Stripe Test Checkout**:
   - Enter card: `4242 4242 4242 4242`, any future MM/YY (e.g. `12/28`), CVC `123`, and any test shipping address.
   - Submit payment.
5. **Order Success & Webhook Fulfillment**:
   - You are redirected to `/checkout/success` with the verified Stripe session ID.
   - The Stripe webhook triggers:
     - Creates order record in `orders`
     - Credits simulated designer payout (80% of markup) in `earnings`
     - Idempotency recorded in `stripe_events`
6. **Dashboard & Admin Verification**:
   - Open `/dashboard` to view the order timeline (Paid &bull; In Tailoring) and simulated earnings.
   - Open `/admin` to view platform GMV volume and click status buttons to advance the order to **Shipped**!

---

## Vercel Deployment Checklist

1. **Push code to GitHub repository**.
2. **Import repository into Vercel**:
   - Framework Preset: `Next.js`
   - Build Command: `next build`
   - Output Directory: `.next`
3. **Configure Environment Variables in Vercel Project Settings**:
   - `DATABASE_URL`: Hosted PostgreSQL connection string (Supabase Postgres or Neon)
   - `STRIPE_SECRET_KEY`: `sk_test_...` (Never use `sk_live_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: `pk_test_...`
   - `STRIPE_WEBHOOK_SECRET`: Production webhook secret (see Step 4)
   - `IDEOGRAM_API_KEY`: Your Ideogram API key
   - `BLOB_READ_WRITE_TOKEN`: Vercel Blob store token
   - `NEXT_PUBLIC_APP_URL`: Your deployed Vercel domain (e.g. `https://promptwear.vercel.app`)
   - `ADMIN_EMAILS`: Your administrator email
4. **Configure Stripe Production Webhook**:
   - In [Stripe Dashboard (Test Mode)](https://dashboard.stripe.com/test/webhooks), click **Add endpoint**.
   - URL: `https://<your-vercel-domain>/api/webhooks/stripe`
   - Events to send: `checkout.session.completed`, `charge.refunded`
   - Copy the signing secret (`whsec_...`) into Vercel's `STRIPE_WEBHOOK_SECRET` environment variable.
5. **Run Migrations on Remote DB**:
   - Run `npm run db:migrate && npm run db:seed` pointing to the production database.

---

## Hackathon Scope & Simulated Features

Per Section 1b of the product specification:
- **Designer Payouts**: Simulated only. Designer earnings rows are recorded at 80% of the markup and displayed as *"Simulated payout (demo)"* in the creator dashboard. Stripe Connect onboarding is not wired.
- **Physical Fulfillment**: Simulated. Real garments are not manufactured or shipped. Statuses advance manually via `/admin`.
- **Cart**: Buy-now checkout flow is optimized for the hackathon happy path.
