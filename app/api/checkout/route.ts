import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { calculatePrice, GarmentType, GARMENT_CATALOG } from "@/lib/pricing";
import { validateMeasurements } from "@/lib/measurements";
import { getDesignById, saveDesign } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

const checkoutSchema = z.object({
  designId: z.string().optional(),
  // Or direct custom design from studio
  customDesign: z
    .object({
      title: z.string().min(1),
      prompt: z.string(),
      imageUrl: z.string().url(),
      placement: z.object({
        x: z.number(),
        y: z.number(),
        scale: z.number(),
        rotation: z.number(),
        side: z.enum(["front", "back"]),
      }),
      markupCents: z.number().int().min(0).default(0),
    })
    .optional(),
  garment: z.enum(["tshirt", "hoodie", "longsleeve", "tank", "crewneck", "tote", "socks", "shoes"]),
  color: z.string().min(1),
  measurements: z.object({
    unit: z.enum(["in", "cm"]),
    chestWidth: z.number().positive(),
    bodyLength: z.number().positive(),
  }),
});

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = checkoutSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { designId, customDesign, garment, color, measurements } = parsed.data;

    // Validate measurements
    const measurementCheck = validateMeasurements(garment as GarmentType, measurements);
    if (!measurementCheck.valid) {
      return NextResponse.json(
        { error: "Invalid measurements", details: measurementCheck.errors },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    let design = designId ? await getDesignById(designId) : null;

    // If bought straight from the Studio without publishing first
    if (!design && customDesign) {
      design = await saveDesign({
        id: `design-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ownerId: user?.userId || "demo-designer-1",
        title: customDesign.title,
        slug: `${customDesign.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        prompt: customDesign.prompt,
        imageUrl: customDesign.imageUrl,
        garment,
        color,
        placement: customDesign.placement,
        status: "draft",
        markupCents: customDesign.markupCents || 0,
        tags: ["custom"],
      });
    }

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // SERVER-SIDE PRICE CALCULATION: Never accept client prices
    const price = calculatePrice({
      garment: garment as GarmentType,
      customFit: true,
      markupCents: design.markupCents,
    });

    const garmentConfig = GARMENT_CATALOG[garment as GarmentType];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "DE", "FR", "AU", "IT", "ES", "NL", "JP"],
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${design.title} — ${garmentConfig.name}`,
              description: `Color: ${color} | Custom Bespoke Fit (${measurements.chestWidth}x${measurements.bodyLength} ${measurements.unit})`,
              images: [design.imageUrl],
            },
            unit_amount: price.totalAmountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        designId: design.id,
        designerId: design.ownerId,
        buyerId: user?.userId || "guest",
        garment,
        color,
        markupCents: price.markupCents.toString(),
        totalAmountCents: price.totalAmountCents.toString(),
        measurements: JSON.stringify(measurements),
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel?design_id=${design.id}`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      price,
    });
  } catch (error: any) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate Stripe Checkout session" },
      { status: 500 }
    );
  }
}
