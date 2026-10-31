import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { saveDesign, getPublishedDesigns, getUserDesigns } from "@/lib/store";

const designSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  prompt: z.string().min(1, "Prompt is required"),
  imageUrl: z.string().url("Valid image URL required"),
  garment: z.enum(["tshirt", "hoodie", "longsleeve", "tank", "crewneck", "tote", "socks", "shoes"]),
  color: z.string().min(1),
  placement: z.object({
    x: z.number(),
    y: z.number(),
    scale: z.number(),
    rotation: z.number(),
    side: z.enum(["front", "back"]),
  }),
  status: z.enum(["draft", "published"]).default("published"),
  markupCents: z.number().int().min(0).max(50000).default(1000),
  tags: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine") === "true";

  if (mine) {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const designs = await getUserDesigns(user.userId);
    return NextResponse.json({ designs });
  }

  const designs = await getPublishedDesigns();
  return NextResponse.json({ designs });
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = designSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const ownerId = user?.userId || "demo-designer-1";

    const slug = `${parsed.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;

    const newDesign = await saveDesign({
      id: `design-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ownerId,
      title: parsed.data.title,
      slug,
      prompt: parsed.data.prompt,
      imageUrl: parsed.data.imageUrl,
      garment: parsed.data.garment,
      color: parsed.data.color,
      placement: parsed.data.placement,
      status: parsed.data.status,
      markupCents: parsed.data.markupCents,
      tags: parsed.data.tags,
    });

    return NextResponse.json({ design: newDesign }, { status: 201 });
  } catch (error: any) {
    console.error("Save design error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save design" },
      { status: 500 }
    );
  }
}
