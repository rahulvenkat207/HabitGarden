import { sql } from "drizzle-orm";
import { type PgDatabase } from "drizzle-orm/pg-core";

export async function up(db: PgDatabase<any>): Promise<void> {
  console.log("Enabling RLS on all tables...");
  
  // Enable RLS on all tables
  await db.execute(sql`ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`);
  await db.execute(sql`ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;`);
  await db.execute(sql`ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;`);
  await db.execute(sql`ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;`);

  // Create policies for users table
  console.log("Creating policies for users table...");
  await db.execute(sql`
    CREATE POLICY "Users can view own user data" ON public.users
    FOR SELECT USING (auth.uid() = id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can insert own user data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can update own user data" ON public.users
    FOR UPDATE USING (auth.uid() = id);
  `);

  // Create policies for habits table
  console.log("Creating policies for habits table...");
  await db.execute(sql`
    CREATE POLICY "Users can view own habits" ON public.habits
    FOR SELECT USING (auth.uid() = user_id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can insert own habits" ON public.habits
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can update own habits" ON public.habits
    FOR UPDATE USING (auth.uid() = user_id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can delete own habits" ON public.habits
    FOR DELETE USING (auth.uid() = user_id);
  `);

  // Create policies for progress table
  console.log("Creating policies for progress table...");
  await db.execute(sql`
    CREATE POLICY "Users can view own progress" ON public.progress
    FOR SELECT USING (auth.uid() = user_id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can insert own progress" ON public.progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can update own progress" ON public.progress
    FOR UPDATE USING (auth.uid() = user_id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can delete own progress" ON public.progress
    FOR DELETE USING (auth.uid() = user_id);
  `);

  // Create policies for streaks table
  console.log("Creating policies for streaks table...");
  await db.execute(sql`
    CREATE POLICY "Users can view own streaks" ON public.streaks
    FOR SELECT USING (auth.uid() = user_id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can insert own streaks" ON public.streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can update own streaks" ON public.streaks
    FOR UPDATE USING (auth.uid() = user_id);
  `);
  
  await db.execute(sql`
    CREATE POLICY "Users can delete own streaks" ON public.streaks
    FOR DELETE USING (auth.uid() = user_id);
  `);

  // Grant necessary permissions to authenticated users
  console.log("Granting permissions to authenticated users...");
  await db.execute(sql`GRANT ALL ON public.users TO authenticated;`);
  await db.execute(sql`GRANT ALL ON public.habits TO authenticated;`);
  await db.execute(sql`GRANT ALL ON public.progress TO authenticated;`);
  await db.execute(sql`GRANT ALL ON public.streaks TO authenticated;`);

  console.log("RLS enabled and policies created successfully!");
}

export async function down(db: PgDatabase<any>): Promise<void> {
  console.log("Dropping RLS policies...");
  
  // Drop policies
  await db.execute(sql`DROP POLICY IF EXISTS "Users can view own user data" ON public.users;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can insert own user data" ON public.users;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can update own user data" ON public.users;`);
  
  await db.execute(sql`DROP POLICY IF EXISTS "Users can view own habits" ON public.habits;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can insert own habits" ON public.habits;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can update own habits" ON public.habits;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can delete own habits" ON public.habits;`);
  
  await db.execute(sql`DROP POLICY IF EXISTS "Users can view own progress" ON public.progress;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can insert own progress" ON public.progress;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can update own progress" ON public.progress;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can delete own progress" ON public.progress;`);
  
  await db.execute(sql`DROP POLICY IF EXISTS "Users can view own streaks" ON public.streaks;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can insert own streaks" ON public.streaks;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can update own streaks" ON public.streaks;`);
  await db.execute(sql`DROP POLICY IF EXISTS "Users can delete own streaks" ON public.streaks;`);

  // Disable RLS
  console.log("Disabling RLS on all tables...");
  await db.execute(sql`ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;`);
  await db.execute(sql`ALTER TABLE public.habits DISABLE ROW LEVEL SECURITY;`);
  await db.execute(sql`ALTER TABLE public.progress DISABLE ROW LEVEL SECURITY;`);
  await db.execute(sql`ALTER TABLE public.streaks DISABLE ROW LEVEL SECURITY;`);

  // Revoke permissions
  await db.execute(sql`REVOKE ALL ON public.users FROM authenticated;`);
  await db.execute(sql`REVOKE ALL ON public.habits FROM authenticated;`);
  await db.execute(sql`REVOKE ALL ON public.progress FROM authenticated;`);
  await db.execute(sql`REVOKE ALL ON public.streaks FROM authenticated;`);

  console.log("RLS disabled and policies dropped successfully!");
}