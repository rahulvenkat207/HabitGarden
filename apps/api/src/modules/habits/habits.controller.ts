import { Request, Response } from "express";
import { success, error } from "../../utils/response";
import {
  createHabit as createHabitService,
  getHabits as getHabitsService,
  getHabitById as getHabitByIdService,
  updateHabit as updateHabitService,
  deleteHabit as deleteHabitService,
} from "./habits.service";

export async function createHabit(req: Request, res: Response) {
  try {
    console.log('Received habit creation request:', req.body);
    console.log('User ID from token:', (req as any).user.id);
    
    const habit = await createHabitService(req.body, (req as any).user.id);
    console.log('Successfully created habit:', habit);
    
    return res.status(201).json(success(habit, "Habit created successfully"));
  } catch (err: any) {
    console.error('Error creating habit:', err);
    return res.status(400).json(error(err.message));
  }
}

export async function getHabits(req: Request, res: Response) {
  try {
    const habits = await getHabitsService((req as any).user.id);
    return res.json(success(habits));
  } catch (err: any) {
    return res.status(500).json(error(err.message));
  }
}

export async function getHabitById(req: Request, res: Response) {
  try {
    const habit = await getHabitByIdService(req.params.id, (req as any).user.id);
    if (!habit) {
      return res.status(404).json(error("Habit not found"));
    }
    return res.json(success(habit));
  } catch (err: any) {
    return res.status(500).json(error(err.message));
  }
}

export async function updateHabit(req: Request, res: Response) {
  try {
    const habit = await updateHabitService(
      req.params.id,
      req.body,
      (req as any).user.id
    );
    if (!habit) {
      return res.status(404).json(error("Habit not found"));
    }
    return res.json(success(habit, "Habit updated successfully"));
  } catch (err: any) {
    return res.status(400).json(error(err.message));
  }
}

export async function deleteHabit(req: Request, res: Response) {
  try {
    const result = await deleteHabitService(req.params.id, (req as any).user.id);
    if (!result) {
      return res.status(404).json(error("Habit not found"));
    }
    return res.json(success(null, "Habit deleted successfully"));
  } catch (err: any) {
    return res.status(500).json(error(err.message));
  }
}