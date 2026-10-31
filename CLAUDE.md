# PromptWear

AI custom-apparel marketplace. Users describe a design, Ideogram generates the artwork, they place it on a garment mockup, enter their own measurements (chest width, body length), then buy it or publish it to the marketplace. Designers earn 80% of the markup. Hackathon demo: **Stripe TEST mode only.**

Full product spec: [GEMINI_PROMPT.md](GEMINI_PROMPT.md). Cross-agent rules: [AGENTS.md](AGENTS.md).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind · shadcn/ui · Neon Postgres + Drizzle · Ideogram API · Vercel Blob · Stripe (Checkout + webhooks, test mode; designer payouts simulated, no Connect; MVP: buy-now only) · Vercel hosting · Zod · react-hook-form · Konva (design canvas) · Vitest

## Commands

```bash
npm run dev          # local server on :3000
npm run build        # production build
npm run lint
npm test             # Vitest
npm run db:generate  # Drizzle migration from schema
npm run db:migrate
npm run db:seed      # 8 sample published designs
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe projects status --json
```

## Layout

- `app/` routes: `/`, `/design`, `/shop`, `/shop/[slug]`, `/checkout/*`, `/dashboard`, `/admin`
- `app/api/generate` Ideogram · `app/api/checkout` Stripe session · `app/api/webhooks/stripe`
- `lib/ideogram.ts`, `lib/stripe.ts`, `lib/pricing.ts` (fee and price constants live here only), `lib/measurements.ts`
- `db/schema.ts`, `db/seed.ts`, `drizzle/` migrations

## Hard rules

- **Test mode only.** Reject `sk_live_` keys at startup. Keep the "Test mode: no real charges" badge visible.
- **Secrets stay server-side.** Never hard-code, log, or expose `IDEOGRAM_API_KEY`, `STRIPE_SECRET_KEY`, `DATABASE_URL`. Real values live in `.env.local` (gitignored); `.env.example` has names only. Never read or print `.env*` contents in chat.
- **Prices are computed on the server** from `lib/pricing.ts`. Never trust a client-sent amount.
- **Webhooks are idempotent**: verify signature, dedupe on `stripe_events`.
- **Ideogram image URLs expire**: always copy into Vercel Blob before saving.
- Validate every input with Zod; authorize every resource (users touch only their own designs/orders). Admin gated by `ADMIN_EMAILS`.
- Rate-limit `/api/generate` and `/api/checkout`; per-user daily generation cap (default 20).

## Provisioning

Use the Stripe Projects CLI (`stripe-projects` skill) for Neon, Vercel, Blob; pull creds with `stripe projects env --pull`. **Ask before any paid service.** Ideogram is not in the catalog; the user supplies `IDEOGRAM_API_KEY`.

## Skills to use

`stripe-projects` (provisioning) · `stripe-best-practices` (Checkout, Connect, key handling) · `connect-recommend` (payout design) · `stripe-docs` (any docs.stripe.com lookup). Verify the current Ideogram v3 endpoint and params in their docs before changing `lib/ideogram.ts`.

## Conventions

- Strict TypeScript, no unjustified `any`. ESLint clean before finishing.
- Every page has loading, empty, and error states; responsive from 360px; alt text on images.
- Tests required for pricing, measurement validation, webhook handler.
- Match surrounding code style; keep fee model changes in one file.

## Done means

`npm run lint`, `npm test`, and `npm run build` pass; the flow generate → fit → publish → buy (card `4242 4242 4242 4242`) → webhook → order + designer earning works locally. Say plainly what was not verified.

<!-- stripe-projects-cli managed:claude-md:start -->
look at AGENTS.md for your rules
<!-- stripe-projects-cli managed:claude-md:end -->
