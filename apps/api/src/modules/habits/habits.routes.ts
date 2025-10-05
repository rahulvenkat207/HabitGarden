import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validation.middleware";
import { createHabitSchema, updateHabitSchema } from "./habits.validation";
import {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
} from "./habits.controller";

const router = Router();

// All habit routes require authentication
router.use(authMiddleware);

// Routes
router.post("/", validateRequest(createHabitSchema), createHabit);
router.get("/", getHabits);
router.get("/:id", getHabitById);
router.put("/:id", validateRequest(updateHabitSchema), updateHabit);
router.delete("/:id", deleteHabit);

export default router;