import { eq } from "drizzle-orm";
import { users } from "../../db/schema/users";
import { db } from "../../db/index";

// Service functions
export async function createUser(data: { id: string; email: string; username: string; avatarUrl?: string }) {
  try {
    const [user] = await db
      .insert(users)
      .values({
        id: data.id,
        email: data.email,
        username: data.username,
        avatarUrl: data.avatarUrl,
      })
      .onConflictDoNothing()
      .returning();
    
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}