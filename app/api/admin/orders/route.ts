import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getAllOrders, updateOrderStatus } from "@/lib/store";

const updateStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["paid", "in_production", "shipped", "refunded"]),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const orders = await getAllOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const json = await req.json();
    const parsed = updateStatusSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status update payload" }, { status: 400 });
    }

    const updated = await updateOrderStatus(parsed.data.orderId, parsed.data.status);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, status: parsed.data.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
