import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "@/app/api/webhooks/stripe/route";
import { NextRequest } from "next/server";
import {
  hasProcessedStripeEvent,
  recordStripeEvent,
  getUserOrders,
  getDesignerEarnings,
  saveDesign,
} from "@/lib/store";

describe("Stripe Webhook Handler (app/api/webhooks/stripe/route.ts)", () => {
  const sampleEventId = `evt_test_${Date.now()}`;
  const designerId = "test-designer-suite";
  const testDesignId = `design-test-${Date.now()}`;

  beforeEach(async () => {
    // Seed a test design for foreign key integrity
    await saveDesign({
      id: testDesignId,
      ownerId: designerId,
      title: "Test Cyber Jacket",
      slug: `test-cyber-jacket-${Date.now()}`,
      prompt: "test prompt",
      imageUrl: "https://example.com/test.png",
      garment: "hoodie",
      color: "Onyx Black",
      placement: { x: 50, y: 50, scale: 0.85, rotation: 0, side: "front" },
      status: "published",
      markupCents: 2000, // $20 markup
    });
  });

  it("handles checkout.session.completed, creates order, and records 80% designer earnings", async () => {
    const mockSession = {
      id: `cs_test_${Date.now()}`,
      amount_total: 7300, // $48 base + $5 fit + $20 markup = $73
      customer_details: {
        address: { city: "New York", country: "US" },
      },
      metadata: {
        designId: testDesignId,
        designerId: designerId,
        buyerId: "buyer-user-42",
        markupCents: "2000",
        totalAmountCents: "7300",
        measurements: JSON.stringify({ unit: "in", chestWidth: 23, bodyLength: 30 }),
      },
    };

    const payload = {
      id: sampleEventId,
      type: "checkout.session.completed",
      data: {
        object: mockSession,
      },
    };

    const req = new NextRequest("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);

    // Verify order was stored
    const orders = await getUserOrders("buyer-user-42");
    expect(orders.length).toBeGreaterThanOrEqual(1);
    const foundOrder = orders.find((o) => o.stripeSessionId === mockSession.id);
    expect(foundOrder).toBeDefined();
    expect(foundOrder?.amountCents).toBe(7300);

    // Verify designer earnings: 80% of $20 markup = $16 (1600 cents)
    const earnings = await getDesignerEarnings(designerId);
    expect(earnings.length).toBeGreaterThanOrEqual(1);
    const foundEarning = earnings.find((e) => e.orderId === foundOrder?.id);
    expect(foundEarning?.amountCents).toBe(1600); // exactly 80%
    expect(foundEarning?.status).toBe("simulated");

    // Verify event is marked as processed in stripe_events
    const isProcessed = await hasProcessedStripeEvent(sampleEventId);
    expect(isProcessed).toBe(true);
  });

  it("is idempotent and ignores duplicate events", async () => {
    const duplicatePayload = {
      id: sampleEventId, // same ID as previous test
      type: "checkout.session.completed",
      data: {
        object: {
          id: `cs_test_duplicate_${Date.now()}`,
          metadata: { designId: testDesignId },
        },
      },
    };

    const req = new NextRequest("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify(duplicatePayload),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
    expect(json.alreadyProcessed).toBe(true);
  });
});
