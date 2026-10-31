import { pgTable, text, timestamp, integer, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";

// 1. USERS
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // clerk user ID or demo user ID
    email: text("email").notNull(),
    stripeAccountId: text("stripe_account_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// 2. DESIGNS
export const designs = pgTable(
  "designs",
  {
    id: text("id").primaryKey(), // uuid
    ownerId: text("owner_id").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    prompt: text("prompt").notNull(),
    imageUrl: text("image_url").notNull(),
    garment: text("garment").notNull(), // tshirt, hoodie, longsleeve, tank, crewneck, tote
    color: text("color").notNull(),
    placement: jsonb("placement").notNull().$type<{
      x: number;
      y: number;
      scale: number;
      rotation: number;
      side: "front" | "back";
    }>(),
    status: text("status").notNull().default("draft"), // draft | published
    markupCents: integer("markup_cents").notNull().default(0),
    tags: jsonb("tags").$type<string[]>().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("designs_slug_idx").on(table.slug),
    index("designs_owner_id_idx").on(table.ownerId),
    index("designs_status_idx").on(table.status),
    index("designs_garment_idx").on(table.garment),
  ]
);

export type Design = typeof designs.$inferSelect;
export type NewDesign = typeof designs.$inferInsert;

// 3. GENERATIONS
export const generations = pgTable(
  "generations",
  {
    id: text("id").primaryKey(),
    userId: text("user_id"), // null if anonymous
    prompt: text("prompt").notNull(),
    status: text("status").notNull().default("completed"), // pending | completed | failed
    imageUrls: jsonb("image_urls").$type<string[]>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("generations_user_id_idx").on(table.userId),
  ]
);

export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;

// 4. CARTS & CART ITEMS (MVP support)
export const carts = pgTable(
  "carts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("carts_user_id_idx").on(table.userId),
  ]
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    cartId: text("cart_id").notNull().references(() => carts.id),
    designId: text("design_id").notNull().references(() => designs.id),
    garment: text("garment").notNull(),
    color: text("color").notNull(),
    measurements: jsonb("measurements").notNull().$type<{
      unit: "in" | "cm";
      chestWidth: number;
      bodyLength: number;
    }>(),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("cart_items_cart_id_idx").on(table.cartId),
  ]
);

// 5. ORDERS
export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(), // order-uuid
    buyerId: text("buyer_id"), // null if guest
    designId: text("design_id").notNull().references(() => designs.id),
    stripeSessionId: text("stripe_session_id").notNull(),
    amountCents: integer("amount_cents").notNull(),
    status: text("status").notNull().default("paid"), // paid | in_production | shipped
    measurements: jsonb("measurements").notNull().$type<{
      unit: "in" | "cm";
      chestWidth: number;
      bodyLength: number;
    }>(),
    shippingAddress: jsonb("shipping_address").$type<{
      name?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("orders_stripe_session_idx").on(table.stripeSessionId),
    index("orders_buyer_id_idx").on(table.buyerId),
    index("orders_design_id_idx").on(table.designId),
  ]
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

// 6. EARNINGS (Simulated designer payouts)
export const earnings = pgTable(
  "earnings",
  {
    id: text("id").primaryKey(),
    designerId: text("designer_id").notNull(),
    orderId: text("order_id").notNull().references(() => orders.id),
    amountCents: integer("amount_cents").notNull(),
    status: text("status").notNull().default("simulated"), // simulated | pending | paid
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("earnings_designer_id_idx").on(table.designerId),
    index("earnings_order_id_idx").on(table.orderId),
  ]
);

export type Earning = typeof earnings.$inferSelect;
export type NewEarning = typeof earnings.$inferInsert;

// 7. STRIPE EVENTS (Idempotency deduplication)
export const stripeEvents = pgTable("stripe_events", {
  id: text("id").primaryKey(), // event.id e.g. evt_...
  processedAt: timestamp("processed_at").defaultNow().notNull(),
});

export type StripeEventRecord = typeof stripeEvents.$inferSelect;
