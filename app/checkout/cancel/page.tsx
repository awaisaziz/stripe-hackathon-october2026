import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Checkout Cancelled — PromptWear",
};

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ design_id?: string }>;
}) {
  const { design_id } = await searchParams;

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
        <XCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Checkout Cancelled</h1>
        <p className="text-zinc-400 text-xs leading-relaxed">
          Your payment was not processed and no charges were made. Your design and measurements
          are safely preserved.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/design"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-black px-5 py-2.5 rounded-xl font-bold text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Return to Studio</span>
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-5 py-2.5 rounded-xl text-xs hover:bg-zinc-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    </div>
  );
}
