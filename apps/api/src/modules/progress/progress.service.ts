import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db";
import { progress } from "../../db/schema/progress";
import { habits } from "../../db/schema/habits";
import { getToday } from "../../utils/date.utils";
import { logger } from "../../utils/logger";

// Service functions
export async function getProgress(habitId: string, userId: string, days: number = 365) {
  logger.info(`Getting progress for habit ${habitId} and user ${userId}`);
  
  // First, verify the habit belongs to the user
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
  
  if (!habit) {
    logger.warn(`Habit ${habitId} not found for user ${userId}`);
    throw new Error("Habit not found");
  }
  
  // Get progress records for the specified number of days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  logger.debug(`Fetching progress records from ${startDate.toISOString().split("T")[0]} onwards`);
  
  const progressRecords = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.habitId, habitId),
        eq(progress.userId, userId),
        gte(progress.date, startDate.toISOString().split("T")[0])
      )
    );
  
  logger.info(`Found ${progressRecords.length} progress records`);
  
  // Convert to heatmap format
  const heatmap: Record<string, boolean> = {};
  progressRecords.forEach((record) => {
    heatmap[record.date] = record.completed;
  });
  
  return heatmap;
}

export async function markProgress(
  habitId: string,
  date: string,
  userId: string
) {
  logger.info(`Marking progress for habit ${habitId}, date ${date}, user ${userId}`);
  
  // First, verify the habit belongs to the user
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
  
  if (!habit) {
    logger.warn(`Habit ${habitId} not found for user ${userId}`);
    throw new Error("Habit not found or does not belong to user");
  }
  
  // Validate and normalize date format
  let normalizedDate = date;
  try {
    // Try to parse the date and normalize it to YYYY-MM-DD format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }
    normalizedDate = dateObj.toISOString().split("T")[0];
  } catch (err) {
    logger.warn(`Invalid date format: ${date}`);
    throw new Error("Invalid date format. Expected a valid date string.");
  }
  
  // Mark progress
  logger.debug(`Creating/updating progress record for habit ${habitId}, date ${normalizedDate}`);
  
  const [progressRecord] = await db
    .insert(progress)
    .values({
      habitId,
      userId,
      date: normalizedDate,
      completed: true,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [progress.habitId, progress.userId, progress.date],
      set: { completed: true, updatedAt: new Date() },
    })
    .returning();
  
  logger.info(`Progress marked successfully for habit ${habitId}, date ${normalizedDate}`);
  
  return progressRecord;
}

export async function unmarkProgress(
  habitId: string,
  date: string,
  userId: string
) {
  logger.info(`Unmarking progress for habit ${habitId}, date ${date}, user ${userId}`);
  
  // First, verify the habit belongs to the user
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
  
  if (!habit) {
    logger.warn(`Habit ${habitId} not found for user ${userId}`);
    throw new Error("Habit not found");
  }
  
  // Validate and normalize date format
  let normalizedDate = date;
  try {
    // Try to parse the date and normalize it to YYYY-MM-DD format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }
    normalizedDate = dateObj.toISOString().split("T")[0];
  } catch (err) {
    logger.warn(`Invalid date format: ${date}`);
    throw new Error("Invalid date format. Expected a valid date string.");
  }
  
  // Unmark progress
  logger.debug(`Updating progress record for habit ${habitId}, date ${normalizedDate}`);
  
  const [progressRecord] = await db
    .update(progress)
    .set({ completed: false, updatedAt: new Date() })
    .where(
      and(
        eq(progress.habitId, habitId),
        eq(progress.userId, userId),
        eq(progress.date, normalizedDate)
      )
    )
    .returning();
  
  logger.info(`Progress unmarked successfully for habit ${habitId}, date ${normalizedDate}`);
  
  return progressRecord;
}

// Get progress for a specific date range
export async function getProgressByDateRange(
  habitId: string,
  userId: string,
  startDate: string,
  endDate: string
) {
  logger.info(`Getting progress by date range for habit ${habitId}, user ${userId}, from ${startDate} to ${endDate}`);
  
  // First, verify the habit belongs to the user
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
  
  if (!habit) {
    logger.warn(`Habit ${habitId} not found for user ${userId}`);
    throw new Error("Habit not found");
  }
  
  // Validate and normalize date formats
  let normalizedStartDate = startDate;
  let normalizedEndDate = endDate;
  
  try {
    // Try to parse the start date and normalize it to YYYY-MM-DD format
    const startDateObj = new Date(startDate);
    if (isNaN(startDateObj.getTime())) {
      throw new Error("Invalid start date");
    }
    normalizedStartDate = startDateObj.toISOString().split("T")[0];
    
    // Try to parse the end date and normalize it to YYYY-MM-DD format
    const endDateObj = new Date(endDate);
    if (isNaN(endDateObj.getTime())) {
      throw new Error("Invalid end date");
    }
    normalizedEndDate = endDateObj.toISOString().split("T")[0];
  } catch (err) {
    logger.warn(`Invalid date format: start=${startDate}, end=${endDate}`);
    throw new Error("Invalid date format. Expected valid date strings.");
  }
  
  // Get progress records for the date range
  logger.debug(`Fetching progress records from ${normalizedStartDate} to ${normalizedEndDate}`);
  
  const progressRecords = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.habitId, habitId),
        eq(progress.userId, userId),
        gte(progress.date, normalizedStartDate),
        lte(progress.date, normalizedEndDate)
      )
    );
  
  logger.info(`Found ${progressRecords.length} progress records in date range`);
  
  return progressRecords;
}