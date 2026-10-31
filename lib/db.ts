import * as schema from "../db/schema";

const connectionString = process.env.DATABASE_URL;

function createDbClient() {
  if (!connectionString || !connectionString.startsWith("postgres")) {
    return null;
  }

  // If using Neon serverless endpoint
  if (connectionString.includes("neon.tech")) {
    const { drizzle } = require("drizzle-orm/neon-http");
    const { neon } = require("@neondatabase/serverless");
    return drizzle(neon(connectionString), { schema });
  }

  // Standard Postgres (Docker Supabase, local Postgres, or hosted Supabase/Postgres)
  const { drizzle } = require("drizzle-orm/postgres-js");
  const postgres = require("postgres");
  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return drizzle(client, { schema });
}

export const db = createDbClient();
export const hasLiveDb = !!db;

export { schema };
