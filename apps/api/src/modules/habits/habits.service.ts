import { and, eq } from "drizzle-orm";
import { habits } from "../../db/schema/habits";
import { db } from "../../db/index";
import { getUserById } from "../users/users.service";

// Service functions
export async function createHabit(data: any, userId: string) {
  console.log('Creating habit with data:', data);
  console.log('User ID:', userId);
  
  try {
    // Handle the data mapping from frontend to backend
    const habitData = {
      userId,
      title: data.title,
      description: data.description || '',
      category: data.category || 'general',
      color: data.color || '#16a34a',
      frequency: data.frequency || {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      isActive: true,
    };
    
    console.log('Final habit data to insert:', habitData);
    
    const [habit] = await db
      .insert(habits)
      .values(habitData)
      .returning();
    
    console.log('Created habit:', habit);
    return habit;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
}

export async function getHabits(userId: string) {
  return await db
    .select()
    .from(habits)
    .where(eq(habits.userId, userId));
}

export async function getHabitById(id: string, userId: string) {
  const [habit] = await db
    .select()
    .from(habits)
    .where(and(eq(habits.id, id), eq(habits.userId, userId)));
  
  return habit;
}

export async function updateHabit(id: string, data: any, userId: string) {
  const updateData: any = {
    updatedAt: new Date(),
  };
  
  // Map fields from frontend to backend
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.frequency !== undefined) updateData.frequency = data.frequency;
  
  const [habit] = await db
    .update(habits)
    .set(updateData)
    .where(and(eq(habits.id, id), eq(habits.userId, userId)))
    .returning();
  
  return habit;
}

export async function deleteHabit(id: string, userId: string) {
  const [habit] = await db
    .delete(habits)
    .where(and(eq(habits.id, id), eq(habits.userId, userId)))
    .returning();
  
  return habit;
}