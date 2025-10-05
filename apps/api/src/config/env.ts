import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("8080"), // Changed to 8080 as requested
  SUPABASE_URL: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  DATABASE_URL: z.string(),
});

const env = envSchema.parse(process.env);

export default {
  ...env,
  PORT: parseInt(env.PORT, 10),
};