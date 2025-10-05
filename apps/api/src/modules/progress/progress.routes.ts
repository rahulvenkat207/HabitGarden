import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getProgress,
  markProgress,
  unmarkProgress,
  getProgressByDateRange,
} from "./progress.controller";

const router = Router();

// All progress routes require authentication
router.use(authMiddleware);

// Routes
router.get("/:habitId", getProgress);
router.get("/:habitId/range", getProgressByDateRange);
router.post("/:habitId", markProgress);
router.delete("/:habitId/:date", unmarkProgress);

export default router;