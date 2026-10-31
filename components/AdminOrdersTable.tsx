"use client";

import React, { useState } from "react";
import { Order } from "@/db/schema";
import { formatCents } from "@/lib/pricing";
import { CheckCircle2, Clock, Truck, Loader2 } from "lucide-react";

interface AdminOrdersTableProps {
  initialOrders: Order[];
}

export function AdminOrdersTable({ initialOrders }: AdminOrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      alert(`Status update error: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-10 text-center text-xs text-zinc-500">
        No orders recorded in the system yet.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Order ID</th>
              <th className="p-3.5">Design / Buyer</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Current Status</th>
              <th className="p-3.5">Advance Demo Status</th>
              <th className="p-3.5">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {orders.map((o) => {
              const isUpdating = updatingId === o.id;

              return (
                <tr key={o.id} className="hover:bg-zinc-800/30">
                  <td className="p-3.5 font-mono text-zinc-200">{o.id}</td>
                  <td className="p-3.5">
                    <div className="font-mono text-zinc-300 text-[11px] truncate max-w-[150px]">
                      {o.designId}
                    </div>
                    <div className="text-zinc-500 text-[10px]">{o.buyerId || "guest"}</div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-primary">
                    {formatCents(o.amountCents)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                        o.status === "shipped"
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                          : o.status === "in_production"
                          ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {o.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isUpdating || o.status === "paid"}
                        onClick={() => handleUpdateStatus(o.id, "paid")}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] disabled:opacity-40"
                      >
                        Paid
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating || o.status === "in_production"}
                        onClick={() => handleUpdateStatus(o.id, "in_production")}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-blue-300 text-[10px] disabled:opacity-40"
                      >
                        Production
                      </button>
                      <button
                        type="button"
                        disabled={isUpdating || o.status === "shipped"}
                        onClick={() => handleUpdateStatus(o.id, "shipped")}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-300 text-[10px] disabled:opacity-40"
                      >
                        Shipped
                      </button>
                      {isUpdating && <Loader2 className="w-3 h-3 text-primary animate-spin" />}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-zinc-400 text-[11px]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
