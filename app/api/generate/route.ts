import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateArtwork } from "@/lib/ideogram";
import { getCurrentUser } from "@/lib/auth";
import { db, schema, hasLiveDb } from "@/lib/db";

const generateSchema = z.object({
  prompt: z.string().min(2, "Prompt must be at least 2 characters").max(1000, "Prompt is too long"),
  style: z.string().optional(),
  aspectRatio: z.enum(["ASPECT_1_1", "ASPECT_4_5", "ASPECT_3_4", "ASPECT_16_9"]).optional(),
  negativePrompt: z.string().max(500).optional(),
  transparentBackground: z.boolean().optional(),
});

// In-memory rate-limiter: records count per key (userId or IP) for the current calendar day
const dailyUsageMap = new Map<string, { count: number; date: string }>();

function checkRateLimit(key: string, limit = 20): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().slice(0, 10);
  const userUsage = dailyUsageMap.get(key);

  if (!userUsage || userUsage.date !== today) {
    dailyUsageMap.set(key, { count: 1, date: today });
    return { allowed: true, remaining: limit - 1 };
  }

  if (userUsage.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  userUsage.count += 1;
  return { allowed: true, remaining: limit - userUsage.count };
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = generateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const ip = req.headers.get("x-forwarded-for") || "anonymous-ip";
    const rateLimitKey = user ? `user:${user.userId}` : `ip:${ip}`;
    const dailyLimit = parseInt(process.env.DAILY_GENERATION_LIMIT || "20", 10);

    const { allowed, remaining } = checkRateLimit(rateLimitKey, dailyLimit);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Daily generation limit of ${dailyLimit} images reached. Please try again tomorrow.`,
        },
        { status: 429 }
      );
    }

    const result = await generateArtwork(parsed.data);

    // Save generation log in database if connected
    if (hasLiveDb && db) {
      try {
        await db.insert(schema.generations).values({
          id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          userId: user?.userId || null,
          prompt: parsed.data.prompt,
          status: "completed",
          imageUrls: result.images.map((img) => img.url),
        });
      } catch (dbErr) {
        console.warn("Could not log generation record to DB:", dbErr);
      }
    }

    return NextResponse.json({
      images: result.images,
      isDemoSample: result.isDemoSample || false,
      remainingGenerations: remaining,
    });
  } catch (error: any) {
    console.error("Generate route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate design artwork" },
      { status: 500 }
    );
  }
}
