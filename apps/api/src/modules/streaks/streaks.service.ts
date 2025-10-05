import { and, eq, desc, gte, lte, asc } from "drizzle-orm";
import { db } from "../../db";
import { streaks } from "../../db/schema/streaks";
import { progress } from "../../db/schema/progress";
import { habits } from "../../db/schema/habits";
import { getToday, getDateDifference } from "../../utils/date.utils";
import { logger } from "../../utils/logger";

// Service functions
export async function checkStreak(habitId: string, userId: string) {
  logger.info(`Checking streak for habit ${habitId} and user ${userId}`);
  
  // First, verify the habit belongs to the user
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
  
  if (!habit) {
    logger.warn(`Habit ${habitId} not found for user ${userId}`);
    throw new Error("Habit not found");
  }
  
  // Get the current streak record
  let [streakRecord] = await db
    .select()
    .from(streaks)
    .where(and(eq(streaks.habitId, habitId), eq(streaks.userId, userId)));
  
  // If no streak record exists, create one
  if (!streakRecord) {
    logger.info(`No existing streak record found, creating new one for habit ${habitId}`);
    [streakRecord] = await db
      .insert(streaks)
      .values({
        habitId,
        userId,
        currentStreak: 0,
        longestStreak: 0,
      })
      .returning();
  }
  
  // Check if we already have a record for today
  const today = getToday();
  const [todayProgress] = await db
    .select()
    .from(progress)
    .where(and(
      eq(progress.habitId, habitId), 
      eq(progress.userId, userId), 
      eq(progress.date, today)
    ));
  
  // If no progress record for today, create one
  if (!todayProgress) {
    logger.info(`No progress record found for today, creating one for habit ${habitId}`);
    await db
      .insert(progress)
      .values({
        habitId,
        userId,
        date: today,
        completed: true,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [progress.habitId, progress.userId, progress.date],
        set: { completed: true, updatedAt: new Date() },
      });
  } else if (!todayProgress.completed) {
    // If progress record exists but not completed, update it
    logger.info(`Progress record exists but not completed, updating for habit ${habitId}`);
    await db
      .update(progress)
      .set({ completed: true, updatedAt: new Date() })
      .where(and(
        eq(progress.habitId, habitId), 
        eq(progress.userId, userId), 
        eq(progress.date, today)
      ));
  } else {
    logger.info(`Progress record already completed for today for habit ${habitId}`);
  }
  
  // Get all progress records for this habit, ordered by date
  const progressRecords = await db
    .select()
    .from(progress)
    .where(and(
      eq(progress.habitId, habitId), 
      eq(progress.userId, userId), 
      eq(progress.completed, true)
    ))
    .orderBy(asc(progress.date));
  
  // Calculate streak based on consecutive completed days
  const newStreak = calculateCurrentStreak(progressRecords, today);
  logger.info(`Calculated new streak: ${newStreak} for habit ${habitId}`);
  
  // Update longest streak if needed
  const longestStreak = Math.max(newStreak, streakRecord.longestStreak);
  logger.debug(`Current streak: ${newStreak}, longest streak: ${longestStreak}`);
  
  // Update streak record
  const [updatedStreak] = await db
    .update(streaks)
    .set({
      currentStreak: newStreak,
      longestStreak,
      lastChecked: today,
      updatedAt: new Date(),
    })
    .where(and(eq(streaks.habitId, habitId), eq(streaks.userId, userId)))
    .returning();
  
  logger.info(`Streak updated successfully for habit ${habitId}`);
  
  return updatedStreak;
}

// Helper function to calculate current streak
function calculateCurrentStreak(progressRecords: any[], today: string): number {
  if (progressRecords.length === 0) return 0;
  
  // Sort records by date (ascending)
  const sortedRecords = [...progressRecords].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Start from today and work backwards
  let currentDate = new Date(today);
  let streak = 0;
  let found = true;
  
  // Create a set of completed dates for quick lookup
  const completedDates = new Set(sortedRecords.map(record => record.date));
  
  // Count consecutive days backwards from today
  while (found) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (completedDates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      found = false;
    }
  }
  
  return streak;
}

export async function getStreak(habitId: string, userId: string) {
  logger.info(`Getting streak for habit ${habitId} and user ${userId}`);
  
  const [streak] = await db
    .select()
    .from(streaks)
    .where(and(eq(streaks.habitId, habitId), eq(streaks.userId, userId)));
  
  if (streak) {
    logger.info(`Found streak record for habit ${habitId}: current=${streak.currentStreak}, longest=${streak.longestStreak}`);
  } else {
    logger.info(`No streak record found for habit ${habitId}`);
  }
  
  return streak;
}

export async function resetStreak(habitId: string, userId: string) {
  logger.info(`Resetting streak for habit ${habitId} and user ${userId}`);
  
  const [streak] = await db
    .update(streaks)
    .set({
      currentStreak: 0,
      updatedAt: new Date(),
    })
    .where(and(eq(streaks.habitId, habitId), eq(streaks.userId, userId)))
    .returning();
  
  if (streak) {
    logger.info(`Streak reset successfully for habit ${habitId}`);
  } else {
    logger.warn(`No streak record found to reset for habit ${habitId}`);
  }
  
  return streak;
}

// Get streak history for a habit
export async function getStreakHistory(habitId: string, userId: string, days: number = 30) {
  logger.info(`Getting streak history for habit ${habitId} and user ${userId} for ${days} days`);
  
  // First, verify the habit belongs to the user
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
  
  if (!habit) {
    logger.warn(`Habit ${habitId} not found for user ${userId}`);
    throw new Error("Habit not found");
  }
  
  // Get streak record
  const [streakRecord] = await db
    .select()
    .from(streaks)
    .where(and(eq(streaks.habitId, habitId), eq(streaks.userId, userId)));
  
  if (!streakRecord) {
    logger.info(`No streak record found for habit ${habitId}`);
    return { currentStreak: 0, longestStreak: 0, history: [] };
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
    )
    .orderBy(asc(progress.date));
  
  logger.info(`Found ${progressRecords.length} progress records for history`);
  
  return {
    currentStreak: streakRecord.currentStreak,
    longestStreak: streakRecord.longestStreak,
    history: progressRecords
  };
}