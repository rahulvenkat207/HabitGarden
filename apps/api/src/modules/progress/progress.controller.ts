import { Request, Response } from "express";
import { success, error } from "../../utils/response";
import {
  getProgress as getProgressService,
  markProgress as markProgressService,
  unmarkProgress as unmarkProgressService,
  getProgressByDateRange as getProgressByDateRangeService,
} from "./progress.service";
import { logger } from "../../utils/logger";

export async function getProgress(req: Request, res: Response) {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 365;
    logger.info(`GET /progress/${req.params.habitId} called with days=${days}`);
    
    const progressData = await getProgressService(
      req.params.habitId,
      (req as any).user.id,
      days
    );
    
    logger.info(`Successfully retrieved progress data for habit ${req.params.habitId}`);
    return res.json(success(progressData));
  } catch (err: any) {
    logger.error(`Error in getProgress: ${err.message}`);
    return res.status(500).json(error(err.message));
  }
}

export async function markProgress(req: Request, res: Response) {
  try {
    const date = req.body.date || new Date().toISOString().split("T")[0];
    logger.info(`POST /progress/${req.params.habitId} called with date=${date}`);
    
    const progress = await markProgressService(
      req.params.habitId,
      date,
      (req as any).user.id
    );
    
    logger.info(`Successfully marked progress for habit ${req.params.habitId}`);
    return res.json(success(progress, "Progress marked successfully"));
  } catch (err: any) {
    logger.error(`Error in markProgress: ${err.message}`);
    return res.status(400).json(error(err.message));
  }
}

export async function unmarkProgress(req: Request, res: Response) {
  try {
    logger.info(`DELETE /progress/${req.params.habitId}/${req.params.date} called`);
    
    const result = await unmarkProgressService(
      req.params.habitId,
      req.params.date,
      (req as any).user.id
    );
    
    logger.info(`Successfully unmarked progress for habit ${req.params.habitId}`);
    return res.json(success(result, "Progress unmarked successfully"));
  } catch (err: any) {
    logger.error(`Error in unmarkProgress: ${err.message}`);
    return res.status(400).json(error(err.message));
  }
}

export async function getProgressByDateRange(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      logger.warn("Missing startDate or endDate in getProgressByDateRange");
      return res.status(400).json(error("startDate and endDate are required"));
    }
    
    logger.info(`GET /progress/${req.params.habitId}/range called with startDate=${startDate}, endDate=${endDate}`);
    
    const progressData = await getProgressByDateRangeService(
      req.params.habitId,
      (req as any).user.id,
      startDate as string,
      endDate as string
    );
    
    logger.info(`Successfully retrieved progress data by date range for habit ${req.params.habitId}`);
    return res.json(success(progressData));
  } catch (err: any) {
    logger.error(`Error in getProgressByDateRange: ${err.message}`);
    return res.status(400).json(error(err.message));
  }
}