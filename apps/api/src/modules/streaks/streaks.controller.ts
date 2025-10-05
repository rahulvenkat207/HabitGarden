import { Request, Response } from "express";
import { success, error } from "../../utils/response";
import {
  checkStreak as checkStreakService,
  getStreak as getStreakService,
  resetStreak as resetStreakService,
  getStreakHistory as getStreakHistoryService,
} from "./streaks.service";
import { logger } from "../../utils/logger";

export async function checkStreak(req: Request, res: Response) {
  try {
    logger.info(`POST /streaks/${req.params.habitId}/check called`);
    
    const result = await checkStreakService(
      req.params.habitId,
      (req as any).user.id
    );
    
    logger.info(`Successfully checked streak for habit ${req.params.habitId}`);
    return res.json(success(result, "Streak updated successfully"));
  } catch (err: any) {
    logger.error(`Error in checkStreak: ${err.message}`);
    return res.status(400).json(error(err.message));
  }
}

export async function getStreak(req: Request, res: Response) {
  try {
    logger.info(`GET /streaks/${req.params.habitId} called`);
    
    const streak = await getStreakService(
      req.params.habitId,
      (req as any).user.id
    );
    
    if (!streak) {
      logger.warn(`Streak not found for habit ${req.params.habitId}`);
      return res.status(404).json(error("Streak not found"));
    }
    
    logger.info(`Successfully retrieved streak for habit ${req.params.habitId}`);
    return res.json(success(streak));
  } catch (err: any) {
    logger.error(`Error in getStreak: ${err.message}`);
    return res.status(500).json(error(err.message));
  }
}

export async function resetStreak(req: Request, res: Response) {
  try {
    logger.info(`PUT /streaks/${req.params.habitId} called`);
    
    const streak = await resetStreakService(
      req.params.habitId,
      (req as any).user.id
    );
    
    if (!streak) {
      logger.warn(`Streak not found for habit ${req.params.habitId}`);
      return res.status(404).json(error("Streak not found"));
    }
    
    logger.info(`Successfully reset streak for habit ${req.params.habitId}`);
    return res.json(success(streak, "Streak reset successfully"));
  } catch (err: any) {
    logger.error(`Error in resetStreak: ${err.message}`);
    return res.status(400).json(error(err.message));
  }
}

export async function getStreakHistory(req: Request, res: Response) {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    logger.info(`GET /streaks/${req.params.habitId}/history called with days=${days}`);
    
    const history = await getStreakHistoryService(
      req.params.habitId,
      (req as any).user.id,
      days
    );
    
    logger.info(`Successfully retrieved streak history for habit ${req.params.habitId}`);
    return res.json(success(history));
  } catch (err: any) {
    logger.error(`Error in getStreakHistory: ${err.message}`);
    return res.status(500).json(error(err.message));
  }
}