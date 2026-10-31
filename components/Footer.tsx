import Link from "next/link";
import { Shirt, Heart, Sparkles, Shield, DollarSign } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <Shirt className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-white tracking-tight">PROMPTWEAR</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The generative streetwear platform. Describe any aesthetic in natural language, custom-fit it to your exact measurements, and wear or sell your vision.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <span>Powered by</span>
            <span className="text-zinc-300 font-semibold">Ideogram AI</span>
            <span>&</span>
            <span className="text-zinc-300 font-semibold">Stripe</span>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Garments</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/design?garment=hoodie" className="hover:text-primary transition-colors">Heavyweight French Terry Hoodie</Link></li>
            <li><Link href="/design?garment=tshirt" className="hover:text-primary transition-colors">Heavyweight Boxy Tee</Link></li>
            <li><Link href="/design?garment=longsleeve" className="hover:text-primary transition-colors">Ribbed Long Sleeve</Link></li>
            <li><Link href="/design?garment=crewneck" className="hover:text-primary transition-colors">Vintage Wash Crewneck</Link></li>
            <li><Link href="/design?garment=tank" className="hover:text-primary transition-colors">Raw-Edge Ribbed Tank</Link></li>
            <li><Link href="/design?garment=tote" className="hover:text-primary transition-colors">Reinforced Canvas Duck Tote</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Economics</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
              <span><strong>80% Designer share</strong> of all markups</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span><strong>20% Platform fee</strong> for compute & AI</span>
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span><strong>$5.00 Custom-fit fee</strong> for tailored sizing</span>
            </li>
            <li className="mt-2 text-[11px] text-zinc-400 border-t border-zinc-900 pt-2">
              Demo mode: Designer payouts are recorded as simulated earnings.
            </li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">Hackathon Testing</h4>
          <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 text-xs space-y-2">
            <div className="text-amber-300 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Stripe Test Mode Activated
            </div>
            <p className="text-[11px] text-zinc-400">
              Checkout with standard test card <code className="text-zinc-200 bg-black/60 px-1 py-0.5 rounded font-mono">4242 4242 4242 4242</code>.
            </p>
            <div className="text-[11px] text-zinc-400">
              Local webhooks can be forwarded with:
              <pre className="mt-1 bg-black p-1.5 rounded text-[10px] text-zinc-300 overflow-x-auto font-mono">
                stripe listen --forward-to localhost:3000/api/webhooks/stripe
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
        <div>
          &copy; {new Date().getFullYear()} PromptWear. All rights reserved. Hackathon Demonstration.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          <span>for the Stripe Hackathon</span>
        </div>
      </div>
    </footer>
  );
}
