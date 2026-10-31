import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getUserDesigns, getUserOrders, getDesignerEarnings } from "@/lib/store";
import { formatCents, GARMENT_CATALOG, GarmentType } from "@/lib/pricing";
import {
  Sparkles,
  ShoppingBag,
  DollarSign,
  Package,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Dashboard — PromptWear",
  description: "Manage your designs, orders, and simulated designer sales earnings.",
};

export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user?.userId || "demo-designer-1";

  const [designs, orders, earnings] = await Promise.all([
    getUserDesigns(userId),
    getUserOrders(userId),
    getDesignerEarnings(userId),
  ]);

  const totalEarningsCents = earnings.reduce((sum, e) => sum + e.amountCents, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded">
              Creator & Buyer Hub
            </span>
            <span className="text-zinc-500 text-xs">/</span>
            <span className="text-zinc-400 text-xs font-mono">{user?.email || "demo@promptwear.dev"}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Dashboard</h1>
        </div>

        <Link
          href="/design"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all w-fit"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Artwork</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Earnings KPI */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Designer Sales Earnings</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-3">
            {formatCents(totalEarningsCents)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-400">
            <span className="text-amber-400 font-medium">Simulated payout (demo)</span>
            <span>&bull;</span>
            <span>80% net markup</span>
          </div>
        </div>

        {/* Designs KPI */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Created Designs</span>
            <Layers className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-3">
            {designs.length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-2">
            {designs.filter((d) => d.status === "published").length} published to marketplace
          </div>
        </div>

        {/* Orders KPI */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
            <span>Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-3">
            {orders.length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-2">
            Stripe test mode transactions
          </div>
        </div>
      </div>

      {/* Section 1: My Designs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>My Designs ({designs.length})</span>
          </h2>
          <Link href="/design" className="text-xs text-primary hover:underline">
            + Create another
          </Link>
        </div>

        {designs.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl text-center text-xs text-zinc-500 space-y-2">
            <p>You haven&apos;t created any designs yet.</p>
            <Link href="/design" className="text-primary hover:underline font-semibold block">
              Open Studio &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {designs.map((d) => (
              <div
                key={d.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 flex gap-3 items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.imageUrl}
                  alt={d.title}
                  className="w-16 h-16 rounded-lg object-cover bg-black"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{d.title}</div>
                  <div className="text-[11px] text-zinc-400 font-mono capitalize">
                    {d.garment} &bull; {d.status}
                  </div>
                  <div className="text-[11px] text-primary font-mono font-medium">
                    +{formatCents(d.markupCents)} markup
                  </div>
                </div>
                {d.status === "published" && (
                  <Link
                    href={`/shop/${d.slug}`}
                    className="p-1.5 text-zinc-400 hover:text-white rounded-md bg-zinc-800"
                    title="View in Shop"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Orders & Status Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          <span>Orders Timeline ({orders.length})</span>
        </h2>

        {orders.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl text-center text-xs text-zinc-500 space-y-2">
            <p>No orders placed yet.</p>
            <Link href="/shop" className="text-primary hover:underline font-semibold block">
              Browse Marketplace to test checkout &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const measurements = o.measurements as {
                unit: string;
                chestWidth: number;
                bodyLength: number;
              };
              const isPaid = true;
              const isProduction = o.status === "in_production" || o.status === "shipped";
              const isShipped = o.status === "shipped";

              return (
                <div
                  key={o.id}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
                    <div>
                      <div className="text-xs font-mono text-zinc-400">Order ID: {o.id}</div>
                      <div className="text-xs text-zinc-500 font-mono">
                        Placed {new Date(o.createdAt).toLocaleDateString()} &bull; Stripe Session:{" "}
                        {o.stripeSessionId.slice(0, 18)}...
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-mono font-bold text-primary">
                        {formatCents(o.amountCents)}
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Test Mode
                      </span>
                    </div>
                  </div>

                  {/* Measurements & Specs */}
                  <div className="text-xs text-zinc-300 flex flex-wrap gap-4">
                    <div>
                      <span className="text-zinc-500">Bespoke Fit:</span>{" "}
                      <span className="font-mono text-zinc-200">
                        {measurements.chestWidth} &times; {measurements.bodyLength}{" "}
                        {measurements.unit}
                      </span>
                    </div>
                    {o.shippingAddress && (
                      <div>
                        <span className="text-zinc-500">Shipping:</span>{" "}
                        <span className="font-mono text-zinc-200">
                          {(o.shippingAddress as any).city || "Anytown"},{" "}
                          {(o.shippingAddress as any).country || "US"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Timeline */}
                  <div className="pt-2">
                    <div className="text-[11px] font-mono text-zinc-400 mb-2">Production Timeline:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Step 1: Paid */}
                      <div
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                          isPaid
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-zinc-950 border-zinc-800 text-zinc-500"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="font-bold">1. Paid</div>
                          <div className="text-[10px] opacity-75">Stripe verified</div>
                        </div>
                      </div>

                      {/* Step 2: In Production */}
                      <div
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                          isProduction
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-zinc-950 border-zinc-800 text-zinc-500"
                        }`}
                      >
                        <Clock className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="font-bold">2. Tailoring</div>
                          <div className="text-[10px] opacity-75">Laser cut to spec</div>
                        </div>
                      </div>

                      {/* Step 3: Shipped */}
                      <div
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                          isShipped
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-zinc-950 border-zinc-800 text-zinc-500"
                        }`}
                      >
                        <Truck className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="font-bold">3. Dispatched</div>
                          <div className="text-[10px] opacity-75">Simulated demo</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 3: Designer Earnings & Simulated Payouts */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <span>Simulated Earnings History ({earnings.length})</span>
        </h2>

        {earnings.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl text-center text-xs text-zinc-500">
            No sales recorded yet. Publish a design with markup to `/shop`, buy it with the test card,
            and your simulated 80% payout will appear here instantly!
          </div>
        ) : (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Earning ID</th>
                    <th className="p-3.5">Related Order</th>
                    <th className="p-3.5">Designer Payout (80%)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {earnings.map((e) => (
                    <tr key={e.id} className="hover:bg-zinc-800/30">
                      <td className="p-3.5 font-mono text-zinc-300">{e.id}</td>
                      <td className="p-3.5 font-mono text-zinc-400">{e.orderId}</td>
                      <td className="p-3.5 font-mono font-bold text-primary">
                        {formatCents(e.amountCents)}
                      </td>
                      <td className="p-3.5">
                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono">
                          Simulated payout (demo)
                        </span>
                      </td>
                      <td className="p-3.5 text-zinc-400 font-mono">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
