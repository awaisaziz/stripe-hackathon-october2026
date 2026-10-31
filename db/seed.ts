import { db } from "../lib/db";
import { designs, users } from "./schema";
import { INITIAL_SEEDED_DESIGNS } from "../lib/store";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function seed() {
  console.log("🌱 Starting PromptWear database seed...");

  if (!db) {
    console.log("ℹ️ No DATABASE_URL provided. In-memory demo store is active with 8 seeded designs.");
    return;
  }

  try {
    // 1. Seed demo designers
    const demoUsers = [
      { id: "demo-designer-1", email: "kai@promptwear.demo", stripeAccountId: null },
      { id: "demo-designer-2", email: "elena@promptwear.demo", stripeAccountId: null },
      { id: "demo-designer-3", email: "ren@promptwear.demo", stripeAccountId: null },
      { id: "demo-designer-4", email: "maya@promptwear.demo", stripeAccountId: null },
    ];

    for (const u of demoUsers) {
      await db.insert(users).values(u).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${demoUsers.length} demo users`);

    // 2. Seed designs
    let count = 0;
    for (const d of INITIAL_SEEDED_DESIGNS) {
      await db.insert(designs).values(d).onConflictDoNothing();
      count++;
    }

    console.log(`✅ Seeded ${count} published streetwear designs into database!`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
