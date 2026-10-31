import React from "react";
import { AlertCircle, CreditCard, ShieldCheck } from "lucide-react";

export function TestModeBadge() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-semibold tracking-wider uppercase text-[11px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">
            Stripe Test Mode Only
          </span>
          <span className="hidden sm:inline text-amber-300/80">
            No real payments will be charged. Fictional fulfillment demo.
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded border border-amber-500/30">
          <CreditCard className="w-3 h-3 text-amber-400" />
          <span className="text-zinc-400">Test Card:</span>
          <span className="text-amber-200 font-bold select-all">4242 4242 4242 4242</span>
          <span className="text-zinc-500">(any future date & CVC)</span>
        </div>
      </div>
    </div>
  );
}
