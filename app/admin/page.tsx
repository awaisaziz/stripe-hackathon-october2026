import { getCurrentUser } from "@/lib/auth";
import { getAllOrders } from "@/lib/store";
import { formatCents } from "@/lib/pricing";
import { AdminOrdersTable } from "@/components/AdminOrdersTable";
import { Shield, Lock, DollarSign, Package, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Admin Control — PromptWear",
  description: "Operations control and test orders fulfillment status advancement.",
};

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Admin Access Restricted</h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          This portal is restricted to authorized accounts listed in <code>ADMIN_EMAILS</code>.
          Signed in as: <strong className="text-zinc-200">{user?.email || "guest"}</strong>
        </p>
      </div>
    );
  }

  const orders = await getAllOrders();
  const totalVolumeCents = orders.reduce((sum, o) => sum + o.amountCents, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Admin Operations</span>
            </span>
            <span className="text-zinc-500 text-xs">&bull;</span>
            <span className="text-zinc-400 text-xs font-mono">{user.email}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Orders Fulfillment Center</h1>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-xl text-amber-200 text-xs font-mono">
          Demo Mode: Advance statuses below to test dashboard timeline
        </div>
      </div>

      {/* Admin KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
          <div className="text-xs text-zinc-400 font-mono">Stripe Test Volume (GMV)</div>
          <div className="text-3xl font-bold font-mono text-primary mt-2">
            {formatCents(totalVolumeCents)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Across all test card checkouts</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
          <div className="text-xs text-zinc-400 font-mono">Total Orders</div>
          <div className="text-3xl font-bold font-mono text-white mt-2">{orders.length}</div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {orders.filter((o) => o.status === "shipped").length} marked shipped
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
          <div className="text-xs text-zinc-400 font-mono">Platform Revenue (20% Markup)</div>
          <div className="text-3xl font-bold font-mono text-amber-400 mt-2">
            {formatCents(Math.round(totalVolumeCents * 0.05))}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Simulated platform earnings</div>
        </div>
      </div>

      {/* Orders Table with status changer */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          <span>All Customer Orders</span>
        </h2>
        <AdminOrdersTable initialOrders={orders} />
      </div>
    </div>
  );
}
