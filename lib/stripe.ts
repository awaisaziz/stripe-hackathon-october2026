import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

if (stripeSecretKey.startsWith("sk_live_")) {
  throw new Error(
    "FATAL SECURITY GUARD: Live Stripe secret key (sk_live_) detected! PromptWear strictly operates in Stripe TEST MODE only. Replace STRIPE_SECRET_KEY with a test key (sk_test_...)."
  );
}

// Global singleton instance for server runtime
export const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder_key_for_setup", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
  appInfo: {
    name: "PromptWear",
    version: "1.0.0",
    url: "https://promptwear.dev",
  },
});

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
export const IS_TEST_MODE = !stripeSecretKey.startsWith("sk_live_");
