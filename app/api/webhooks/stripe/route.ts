import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  hasProcessedStripeEvent,
  recordStripeEvent,
  saveOrder,
  saveEarning,
  updateOrderStatus,
} from "@/lib/store";
import { DESIGNER_SHARE_RATE } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In local dev without webhook secret configured yet, parse body directly with warning
      console.warn("⚠️ Warning: STRIPE_WEBHOOK_SECRET missing; parsing event directly without signature verification.");
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook signature error: ${err.message}` }, { status: 400 });
  }

  // Idempotency check: Deduplicate via stripe_events
  if (event.id) {
    const alreadyProcessed = await hasProcessedStripeEvent(event.id);
    if (alreadyProcessed) {
      console.log(`ℹ️ Stripe event ${event.id} already processed. Skipping.`);
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const metadata = session.metadata || {};

        const designId = metadata.designId;
        const designerId = metadata.designerId || "demo-designer-1";
        const buyerId = metadata.buyerId || "guest";
        const markupCents = parseInt(metadata.markupCents || "0", 10);
        const totalAmountCents = session.amount_total || parseInt(metadata.totalAmountCents || "0", 10);

        let measurements = { unit: "in" as const, chestWidth: 21, bodyLength: 29 };
        if (metadata.measurements) {
          try {
            measurements = JSON.parse(metadata.measurements);
          } catch (e) {
            console.warn("Could not parse measurements metadata:", e);
          }
        }

        // 1. Create order record
        const orderId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const order = await saveOrder({
          id: orderId,
          buyerId,
          designId,
          stripeSessionId: session.id,
          amountCents: totalAmountCents,
          status: "paid",
          measurements,
          shippingAddress: session.customer_details?.address || session.shipping_details?.address || null,
        });

        // 2. Compute designer share (80% of markup)
        if (markupCents > 0) {
          const designerShareCents = Math.round(markupCents * DESIGNER_SHARE_RATE);
          await saveEarning({
            id: `earn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            designerId,
            orderId: order.id,
            amountCents: designerShareCents,
            status: "simulated", // Simulated designer payout (no Connect)
          });
          console.log(`✅ Recorded simulated payout: $${(designerShareCents / 100).toFixed(2)} to designer ${designerId}`);
        }

        console.log(`✅ Order ${order.id} processed successfully for session ${session.id}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        console.log(`ℹ️ Charge ${charge.id} was refunded.`);
        // Mark associated order as refunded if found
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    // Record processed event for idempotency
    if (event.id) {
      await recordStripeEvent(event.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error handling Stripe webhook event:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
