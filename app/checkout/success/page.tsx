import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Order Confirmed — PromptWear",
  description: "Your custom generative apparel order is confirmed in Stripe test mode.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Stripe Test Mode Payment Succeeded</span>
      </div>

      <h1 className="text-3xl font-extrabold text-white tracking-tight">
        Order Placed Successfully!
      </h1>
      <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
        Your bespoke garment has been recorded. Our automated pipeline has queued your artwork
        and custom anatomical measurements for tailored manufacturing.
      </p>

      {/* Order info card */}
      <div className="mt-8 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
          <span className="text-zinc-400 font-mono">Stripe Session:</span>
          <span className="text-zinc-200 font-mono font-medium truncate max-w-[280px]">
            {session_id || "cs_test_simulated_session"}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Status:</span>
            <span className="font-semibold text-primary font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Paid &bull; In Production
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Designer Share:</span>
            <span className="text-zinc-200 font-mono">80% Markup allocated to creator</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Fulfillment:</span>
            <span className="text-zinc-200 font-mono">Simulated Hackathon Demo</span>
          </div>
        </div>

        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 text-[11px] text-zinc-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            This was executed in <strong>Stripe Test Mode</strong>. No real payment method was
            charged. Designer earnings and webhook events have been registered.
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
        >
          <Package className="w-4 h-4" />
          <span>View in Dashboard</span>
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-6 py-3 rounded-xl font-semibold text-xs border border-zinc-700 transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
