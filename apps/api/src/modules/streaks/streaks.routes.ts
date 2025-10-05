import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  checkStreak,
  getStreak,
  resetStreak,
  getStreakHistory,
} from "./streaks.controller";

const router = Router();

// All streak routes require authentication
router.use(authMiddleware);

// Routes
router.post("/:habitId/check", checkStreak);
router.get("/:habitId", getStreak);
router.get("/:habitId/history", getStreakHistory);
router.put("/:habitId", resetStreak);

export default router;