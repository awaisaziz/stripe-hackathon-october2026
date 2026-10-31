import { garmentArt } from "./seedArt";
import { db, schema, hasLiveDb } from "./db";
import { eq, desc } from "drizzle-orm";
import type { Design, Order, Earning, NewDesign, NewOrder, NewEarning } from "@/db/schema";

export const INITIAL_SEEDED_DESIGNS: Design[] = [
  // 1. T-SHIRTS
  {
    id: "seed-design-1",
    ownerId: "kai.studio",
    title: "Cyber Ronin 2099",
    slug: "cyber-ronin-2099",
    prompt: "Mecha samurai warrior silhouette with glowing turquoise neon katana, kanji calligraphy, brutalist streetwear emblem",
    imageUrl: garmentArt("tshirt", "#121212", "#00ff88", "RONIN"),
    garment: "tshirt",
    color: "Vintage Black",
    placement: { x: 50, y: 46, scale: 0.85, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1500, // $15 markup -> Total $39
    tags: ["cyberpunk", "anime", "streetwear", "men", "women"],
    createdAt: new Date("2026-10-25T12:00:00Z"),
  },
  {
    id: "seed-design-2",
    ownerId: "elena.vault",
    title: "Ethereal Botanica",
    slug: "ethereal-botanica",
    prompt: "Victorian botanical specimen illustration of nightshade and wild ferns, muted gold accents on distressed parchment background",
    imageUrl: garmentArt("tshirt", "#f3f0e6", "#8a5a44", "BOTANICA"),
    garment: "tshirt",
    color: "Bone White",
    placement: { x: 50, y: 45, scale: 0.8, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1000, // $10 markup -> Total $34
    tags: ["vintage", "floral", "botanical", "women"],
    createdAt: new Date("2026-10-26T14:30:00Z"),
  },
  {
    id: "seed-design-4",
    ownerId: "acid.archive",
    title: "Acid Horizon 1994",
    slug: "acid-horizon",
    prompt: "Psychedelic liquid chrome melting smiley face dripping onto retro sunset gradient lines, 90s rave flyers style",
    imageUrl: garmentArt("tshirt", "#3f4651", "#ffe14d", "HORIZON"),
    garment: "tshirt",
    color: "Washed Slate",
    placement: { x: 50, y: 46, scale: 0.85, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1400, // $14 markup -> Total $38
    tags: ["streetwear", "psychedelic", "rave", "men", "women"],
    createdAt: new Date("2026-10-27T16:45:00Z"),
  },
  {
    id: "seed-design-8",
    ownerId: "retro.voyager",
    title: "Cosmic Voyager",
    slug: "cosmic-voyager-tee",
    prompt: "Retro 70s sci-fi rover exploring alien dunes under double moon eclipse, vintage linocut graphic style",
    imageUrl: garmentArt("tshirt", "#2d3a29", "#7048e8", "VOYAGER"),
    garment: "tshirt",
    color: "Forest Moss",
    placement: { x: 50, y: 50, scale: 0.8, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1100, // $11 markup -> Total $35
    tags: ["retro", "vintage", "space", "kids", "men"],
    createdAt: new Date("2026-10-29T15:30:00Z"),
  },

  // 2. HOODIES
  {
    id: "seed-design-5",
    ownerId: "maya.nomad",
    title: "Astral Nomad",
    slug: "astral-nomad",
    prompt: "Astronaut floating through deep nebula holding a blooming crystalline lotus, sacred geometry ring border",
    imageUrl: garmentArt("hoodie", "#c9cbcf", "#3b5bdb", "NOMAD"),
    garment: "hoodie",
    color: "Heather Ash",
    placement: { x: 50, y: 46, scale: 0.82, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1800, // $18 markup -> Total $71
    tags: ["space", "surreal", "minimal", "men", "women"],
    createdAt: new Date("2026-10-28T11:20:00Z"),
  },
  {
    id: "seed-design-7",
    ownerId: "gothic.samurai",
    title: "Dark Fantasy Sakura",
    slug: "dark-fantasy-sakura",
    prompt: "Gothic dragon wrapped around weeping cherry blossom branches, dark fantasy woodblock print, monochrome with blood red petals",
    imageUrl: garmentArt("hoodie", "#0f0f10", "#ffa8c5", "SAKURA"),
    garment: "hoodie",
    color: "Onyx Black",
    placement: { x: 50, y: 47, scale: 0.85, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1600, // $16 markup -> Total $69
    tags: ["dark", "anime", "grunge", "men", "women"],
    createdAt: new Date("2026-10-29T10:10:00Z"),
  },

  // 3. SOCKS (Streetwear Ribbed Crew Socks)
  {
    id: "seed-design-9",
    ownerId: "tokyo.protocol",
    title: "Cyber Kanji Ribbed Socks",
    slug: "cyber-kanji-socks",
    prompt: "High-contrast Japanese cyberpunk kanji typography with dual barcode stripes on ribbed athletic cotton",
    imageUrl: garmentArt("socks", "#f5f5f0", "#ff3d81", "KANJI"),
    garment: "socks",
    color: "Vintage White",
    placement: { x: 50, y: 35, scale: 0.8, rotation: 0, side: "front" },
    status: "published",
    markupCents: 600, // $6 markup -> Total $25
    tags: ["streetwear", "anime", "socks", "men", "women"],
    createdAt: new Date("2026-10-29T18:00:00Z"),
  },
  {
    id: "seed-design-10",
    ownerId: "bauhaus.grid",
    title: "Solar Bauhaus Crew Socks",
    slug: "solar-bauhaus-socks",
    prompt: "Brutalist Swiss geometric circles and minimalist architectural lines on deep black athletic ribbing",
    imageUrl: garmentArt("socks", "#121214", "#e8590c", "SOLAR"),
    garment: "socks",
    color: "Onyx Black",
    placement: { x: 50, y: 35, scale: 0.8, rotation: 0, side: "front" },
    status: "published",
    markupCents: 500, // $5 markup -> Total $24
    tags: ["minimal", "socks", "geometric", "men", "women"],
    createdAt: new Date("2026-10-29T20:00:00Z"),
  },
  {
    id: "seed-design-11",
    ownerId: "acid.archive",
    title: "Acid 94 Retro Ribbed Socks",
    slug: "acid-94-retro-socks",
    prompt: "Melting chrome smiley badge on heather grey sports crew socks with dual neon stripes",
    imageUrl: garmentArt("socks", "#8e9196", "#ffe14d", "CHROME"),
    garment: "socks",
    color: "Heather Grey",
    placement: { x: 50, y: 35, scale: 0.8, rotation: 0, side: "front" },
    status: "published",
    markupCents: 600, // $6 markup -> Total $25
    tags: ["retro", "socks", "rave", "kids", "women"],
    createdAt: new Date("2026-10-29T21:30:00Z"),
  },

  // 4. SHOES (Streetwear Canvas Low-Tops / Skate Sneakers)
  {
    id: "seed-design-12",
    ownerId: "tokyo.protocol",
    title: "Neo-Tokyo Glitch Low-Tops",
    slug: "neo-tokyo-glitch-shoes",
    prompt: "Distorted duotone glitch typography printed on off-white canvas quarter panel with vulcanized foxing",
    imageUrl: garmentArt("shoes", "#eeeae2", "#ff3d81", "NEO TOKYO"),
    garment: "shoes",
    color: "Chalk & Off-White",
    placement: { x: 50, y: 55, scale: 0.85, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1600, // $16 markup -> Total $89
    tags: ["streetwear", "shoes", "sneakers", "glitch", "men", "women"],
    createdAt: new Date("2026-10-29T22:00:00Z"),
  },
  {
    id: "seed-design-13",
    ownerId: "kai.studio",
    title: "Cyber Ronin Skate Low-Tops",
    slug: "cyber-ronin-skate-shoes",
    prompt: "Neon turquoise samurai blade emblem on monochrome black 16oz duck canvas upper with rubber toe cap",
    imageUrl: garmentArt("shoes", "#141416", "#00ff88", "RONIN"),
    garment: "shoes",
    color: "Pitch Black",
    placement: { x: 50, y: 55, scale: 0.85, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1800, // $18 markup -> Total $91
    tags: ["cyberpunk", "shoes", "sneakers", "anime", "men"],
    createdAt: new Date("2026-10-29T22:30:00Z"),
  },
  {
    id: "seed-design-14",
    ownerId: "maya.nomad",
    title: "Astral Nomad Sail Low-Tops",
    slug: "astral-nomad-sail-shoes",
    prompt: "Minimalist cosmic lotus geometry on vintage sail cloth canvas sneakers with gum sole",
    imageUrl: garmentArt("shoes", "#d8cfbc", "#3b5bdb", "NOMAD"),
    garment: "shoes",
    color: "Raw Sail",
    placement: { x: 50, y: 55, scale: 0.85, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1700, // $17 markup -> Total $90
    tags: ["space", "shoes", "sneakers", "minimal", "women"],
    createdAt: new Date("2026-10-29T23:00:00Z"),
  },

  // 5. LONG SLEEVES, CREWNECKS, TANKS, TOTES
  {
    id: "seed-design-3",
    ownerId: "tokyo.protocol",
    title: "Neo-Tokyo Glitch Long Sleeve",
    slug: "neo-tokyo-glitch",
    prompt: "Vaporwave distorted skyline with fractured typography reading PROTOCOL, high contrast duotone halftone dots",
    imageUrl: garmentArt("longsleeve", "#111111", "#ff3d81", "NEO TOKYO"),
    garment: "longsleeve",
    color: "Pitch Black",
    placement: { x: 50, y: 46, scale: 0.88, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1200, // $12 markup -> Total $49
    tags: ["glitch", "typography", "cyberpunk", "men", "women"],
    createdAt: new Date("2026-10-27T09:15:00Z"),
  },
  {
    id: "seed-design-6",
    ownerId: "bauhaus.grid",
    title: "Solar Bauhaus Raw Tank",
    slug: "solar-bauhaus-form",
    prompt: "Minimalist brutalist Bauhaus poster with bold overlapping circles, arches, and Swiss typography reading SPHERE 01",
    imageUrl: garmentArt("tank", "#0a0a0a", "#e8590c", "SOLAR"),
    garment: "tank",
    color: "Jet Black",
    placement: { x: 50, y: 44, scale: 0.75, rotation: 0, side: "front" },
    status: "published",
    markupCents: 800, // $8 markup -> Total $35
    tags: ["minimal", "typography", "geometric", "men"],
    createdAt: new Date("2026-10-28T18:00:00Z"),
  },
  {
    id: "seed-design-15",
    ownerId: "gothic.samurai",
    title: "Dark Fantasy Sakura Crewneck",
    slug: "dark-fantasy-sakura-crewneck",
    prompt: "Gothic dragon wrapped around weeping cherry blossom branches, dark fantasy woodblock print on vintage washed fleece",
    imageUrl: garmentArt("crewneck", "#1c1c1f", "#ffa8c5", "SAKURA"),
    garment: "crewneck",
    color: "Washed Black",
    placement: { x: 50, y: 47, scale: 0.85, rotation: 0, side: "front" },
    status: "published",
    markupCents: 1400, // $14 markup -> Total $61
    tags: ["dark", "anime", "grunge", "men", "women"],
    createdAt: new Date("2026-10-29T23:30:00Z"),
  },
  {
    id: "seed-design-16",
    ownerId: "elena.vault",
    title: "Ethereal Botanica Duck Tote",
    slug: "ethereal-botanica-tote",
    prompt: "Victorian botanical specimen illustration of nightshade on 16oz heavyweight ecru canvas duck tote bag",
    imageUrl: garmentArt("tote", "#eee8d5", "#8a5a44", "BOTANICA"),
    garment: "tote",
    color: "Natural Ecru",
    placement: { x: 50, y: 55, scale: 0.85, rotation: 0, side: "front" },
    status: "published",
    markupCents: 900, // $9 markup -> Total $32
    tags: ["vintage", "floral", "botanical", "women"],
    createdAt: new Date("2026-10-30T00:00:00Z"),
  },
];

// In-memory fallback stores for demo resilience
const memoryDesigns = new Map<string, Design>(
  INITIAL_SEEDED_DESIGNS.map((d) => [d.id, d])
);
const memoryOrders = new Map<string, Order>();
const memoryEarnings = new Map<string, Earning>();
const memoryProcessedEvents = new Set<string>();

export async function getPublishedDesigns(): Promise<Design[]> {
  if (hasLiveDb && db) {
    try {
      const results = await db
        .select()
        .from(schema.designs)
        .where(eq(schema.designs.status, "published"))
        .orderBy(desc(schema.designs.createdAt));
      if (results.length > 0) return results;
    } catch (e) {
      console.warn("DB query failed, falling back to memory:", e);
    }
  }
  return Array.from(memoryDesigns.values())
    .filter((d) => d.status === "published")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getDesignBySlug(slug: string): Promise<Design | null> {
  if (hasLiveDb && db) {
    try {
      const results = await db
        .select()
        .from(schema.designs)
        .where(eq(schema.designs.slug, slug))
        .limit(1);
      if (results.length > 0) return results[0];
    } catch (e) {
      console.warn("DB getDesignBySlug failed, checking memory:", e);
    }
  }
  return Array.from(memoryDesigns.values()).find((d) => d.slug === slug) || null;
}

export async function getDesignById(id: string): Promise<Design | null> {
  if (hasLiveDb && db) {
    try {
      const results = await db
        .select()
        .from(schema.designs)
        .where(eq(schema.designs.id, id))
        .limit(1);
      if (results.length > 0) return results[0];
    } catch (e) {
      console.warn("DB getDesignById failed, checking memory:", e);
    }
  }
  return memoryDesigns.get(id) || null;
}

export async function createDesign(newDesign: NewDesign): Promise<Design> {
  const fullDesign: Design = {
    ...newDesign,
    status: newDesign.status || "draft",
    markupCents: newDesign.markupCents ?? 0,
    tags: newDesign.tags || [],
    createdAt: newDesign.createdAt || new Date(),
  };

  if (hasLiveDb && db) {
    try {
      const inserted = await db.insert(schema.designs).values(fullDesign).returning();
      if (inserted.length > 0) {
        memoryDesigns.set(inserted[0].id, inserted[0]);
        return inserted[0];
      }
    } catch (e) {
      console.warn("DB insert failed, writing to memory:", e);
    }
  }

  memoryDesigns.set(fullDesign.id, fullDesign);
  return fullDesign;
}

export async function updateDesignStatus(id: string, status: "draft" | "published", markupCents?: number): Promise<Design | null> {
  if (hasLiveDb && db) {
    try {
      const updated = await db
        .update(schema.designs)
        .set({
          status,
          ...(markupCents !== undefined ? { markupCents } : {}),
        })
        .where(eq(schema.designs.id, id))
        .returning();
      if (updated.length > 0) {
        memoryDesigns.set(id, updated[0]);
        return updated[0];
      }
    } catch (e) {
      console.warn("DB updateDesignStatus failed, writing to memory:", e);
    }
  }

  const existing = memoryDesigns.get(id);
  if (!existing) return null;
  const updated: Design = {
    ...existing,
    status,
    ...(markupCents !== undefined ? { markupCents } : {}),
  };
  memoryDesigns.set(id, updated);
  return updated;
}

export async function isEventProcessed(eventId: string): Promise<boolean> {
  if (hasLiveDb && db) {
    try {
      const results = await db
        .select()
        .from(schema.stripeEvents)
        .where(eq(schema.stripeEvents.id, eventId))
        .limit(1);
      return results.length > 0;
    } catch (e) {
      console.warn("DB check event failed:", e);
    }
  }
  return memoryProcessedEvents.has(eventId);
}

export async function recordProcessedEvent(eventId: string, eventType: string): Promise<void> {
  memoryProcessedEvents.add(eventId);
  if (hasLiveDb && db) {
    try {
      await db.insert(schema.stripeEvents).values({
        id: eventId,
        type: eventType,
      });
    } catch (e) {
      console.warn("DB record event failed:", e);
    }
  }
}

export async function createOrder(order: NewOrder): Promise<Order> {
  const fullOrder: Order = {
    ...order,
    status: order.status || "paid",
    shippingAddress: order.shippingAddress || null,
    stripeChargeId: order.stripeChargeId || null,
    createdAt: order.createdAt || new Date(),
  };

  if (hasLiveDb && db) {
    try {
      const inserted = await db.insert(schema.orders).values(fullOrder).returning();
      if (inserted.length > 0) {
        memoryOrders.set(inserted[0].id, inserted[0]);
        return inserted[0];
      }
    } catch (e) {
      console.warn("DB createOrder failed, using memory:", e);
    }
  }

  memoryOrders.set(fullOrder.id, fullOrder);
  return fullOrder;
}

export async function createEarning(earning: NewEarning): Promise<Earning> {
  const fullEarning: Earning = {
    ...earning,
    status: earning.status || "simulated_paid",
    createdAt: earning.createdAt || new Date(),
  };

  if (hasLiveDb && db) {
    try {
      const inserted = await db.insert(schema.earnings).values(fullEarning).returning();
      if (inserted.length > 0) {
        memoryEarnings.set(inserted[0].id, inserted[0]);
        return inserted[0];
      }
    } catch (e) {
      console.warn("DB createEarning failed, using memory:", e);
    }
  }

  memoryEarnings.set(fullEarning.id, fullEarning);
  return fullEarning;
}

export async function getAllOrders(): Promise<Order[]> {
  if (hasLiveDb && db) {
    try {
      return await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
    } catch (e) {
      console.warn("DB getAllOrders failed, using memory:", e);
    }
  }
  return Array.from(memoryOrders.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export async function getAllEarnings(): Promise<Earning[]> {
  if (hasLiveDb && db) {
    try {
      return await db.select().from(schema.earnings).orderBy(desc(schema.earnings.createdAt));
    } catch (e) {
      console.warn("DB getAllEarnings failed, using memory:", e);
    }
  }
  return Array.from(memoryEarnings.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export async function getEarningsByDesigner(designerId: string): Promise<Earning[]> {
  if (hasLiveDb && db) {
    try {
      return await db
        .select()
        .from(schema.earnings)
        .where(eq(schema.earnings.designerId, designerId))
        .orderBy(desc(schema.earnings.createdAt));
    } catch (e) {
      console.warn("DB getEarningsByDesigner failed, using memory:", e);
    }
  }
  return Array.from(memoryEarnings.values())
    .filter((e) => e.designerId === designerId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  if (hasLiveDb && db) {
    try {
      return await db
        .select()
        .from(schema.orders)
        .where(eq(schema.orders.buyerId, userId))
        .orderBy(desc(schema.orders.createdAt));
    } catch (e) {
      console.warn("DB getUserOrders failed, using memory:", e);
    }
  }
  return Array.from(memoryOrders.values())
    .filter((o) => o.buyerId === userId || (o as any).userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function updateOrderStatus(orderId: string, status: "pending" | "paid" | "failed" | "refunded"): Promise<Order | null> {
  if (hasLiveDb && db) {
    try {
      const updated = await db
        .update(schema.orders)
        .set({ status })
        .where(eq(schema.orders.id, orderId))
        .returning();
      if (updated.length > 0) {
        memoryOrders.set(orderId, updated[0]);
        return updated[0];
      }
    } catch (e) {
      console.warn("DB updateOrderStatus failed, using memory:", e);
    }
  }
  const existing = memoryOrders.get(orderId);
  if (!existing) return null;
  const updated: Order = { ...existing, status };
  memoryOrders.set(orderId, updated);
  return updated;
}

// Aliases for compatibility
export const hasProcessedStripeEvent = isEventProcessed;
export const recordStripeEvent = recordProcessedEvent;
export const saveOrder = createOrder;
export const saveEarning = createEarning;
export const saveDesign = createDesign;
export const getDesignerEarnings = getEarningsByDesigner;

