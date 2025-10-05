import { z } from "zod";

// Validation schemas
export const createHabitSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  frequency: z.object({
    days: z.array(z.string()).optional(),
  }).optional(),
});

export const updateHabitSchema = createHabitSchema.partial();