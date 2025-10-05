import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import env from "../config/env";

// Create PostgreSQL client
const client = postgres(env.DATABASE_URL);

// Create Drizzle ORM instance
export const db = drizzle(client);

export default db;