# AGENTS.md: PromptWear

Instructions for any coding agent (Gemini, Codex, Cursor, Claude Code) working in this repo. Product spec: [GEMINI_PROMPT.md](GEMINI_PROMPT.md). Claude-specific notes: [CLAUDE.md](CLAUDE.md).

## What this is

PromptWear: users describe apparel designs, Ideogram generates artwork, they fit it to a garment with custom measurements, then buy it or publish it for sale. Designers get 80% of the markup, the platform keeps 20%. Demo project: **Stripe test mode only.**

## Stack

Next.js 15 App Router, TypeScript, Tailwind, shadcn/ui, Neon Postgres with Drizzle, Ideogram API, Vercel Blob, Stripe (Checkout, webhooks, test mode), Vercel, Zod, Konva, Vitest.

**MVP / hackathon scope:** everything is fake money. No Stripe Connect; designer payouts are simulated. Buy-now only (no cart). See section 1b of GEMINI_PROMPT.md.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill values (see below).
3. `npm run db:migrate && npm run db:seed`
4. `npm run dev`
5. In another terminal: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and put the printed `whsec_...` in `STRIPE_WEBHOOK_SECRET`.

Env vars: `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `IDEOGRAM_API_KEY`, `STRIPE_SECRET_KEY` (sk_test_), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_), `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`, `ADMIN_EMAILS`.

Services are provisioned with the Stripe Projects CLI (`stripe projects add <provider>/<service>`, then `stripe projects env --pull`). Ask the human before anything that costs money. The human supplies `IDEOGRAM_API_KEY`.

## Rules (non-negotiable)

- Never commit, print, or log secrets. `.env.local` is gitignored; do not read it aloud.
- Reject `sk_live_` keys at startup. Show a visible test-mode badge in the UI.
- Compute all prices server-side from `lib/pricing.ts`; never accept amounts from the client.
- Stripe webhooks: verify signature, handle `checkout.session.completed` and `charge.refunded`, be idempotent via the `stripe_events` table.
- Ideogram calls happen server-side only (`lib/ideogram.ts`). Copy result images to Vercel Blob; the source URLs expire.
- Validate all input with Zod. Check ownership on every read/write of designs, orders, carts. `/admin` is limited to `ADMIN_EMAILS`.
- Rate-limit `/api/generate` and `/api/checkout`; enforce the per-user daily generation limit.
- Do not add dependencies, change the fee model, or alter the DB schema without noting it in your summary; schema changes need a Drizzle migration.

## Code style

- Strict TypeScript; avoid `any`. Run `npm run lint` before finishing.
- Follow existing patterns and naming; do not reformat unrelated code.
- Every page: loading, empty, and error states. Responsive from 360px, keyboard accessible, alt text on images.
- Add or update Vitest tests for pricing, measurement validation, and the webhook handler when touching them.

## Testing and verification

```bash
npm run lint && npm test && npm run build
```

End-to-end check: generate a design, place it, enter measurements, publish, then buy as a second user with card `4242 4242 4242 4242` (any future date, any CVC). Confirm the webhook creates the order and designer earning.

## Deploy (Vercel)

Set all env vars in Vercel, run migrations against the production Neon DB, set `NEXT_PUBLIC_APP_URL` to the deployed URL, and add a Stripe webhook endpoint at `<url>/api/webhooks/stripe` (copy its signing secret into `STRIPE_WEBHOOK_SECRET`). Keep Stripe in test mode.

## When finishing a task

Summarize what changed, what you ran, and what you did not verify. List anything stubbed or simulated (for example simulated designer payouts if Connect is not wired).

<!-- stripe-projects-cli managed:agents-md:start -->
## Stripe Projects CLI

This repository is initialized for the Stripe project "promptwear".

## Tools used

- [Stripe CLI](https://docs.stripe.com/stripe-cli) with the `projects` plugin to manage third-party services, credentials, and deployments for this project. Use the stripe-projects-cli to manage deploying and access to third party services.
<!-- stripe-projects-cli managed:agents-md:end -->
