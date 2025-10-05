import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function applyRLS() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    console.log('Enabling RLS on all tables...');
    
    // Enable RLS on all tables
    await client.query('ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;');
    console.log('✓ Enabled RLS on users table');
    
    await client.query('ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;');
    console.log('✓ Enabled RLS on habits table');
    
    await client.query('ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;');
    console.log('✓ Enabled RLS on progress table');
    
    await client.query('ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;');
    console.log('✓ Enabled RLS on streaks table');

    // Create policies for users table
    console.log('Creating policies for users table...');
    
    await client.query(`
      CREATE POLICY "Users can view own user data" ON public.users
      FOR SELECT USING (auth.uid() = id);
    `);
    console.log('✓ Created SELECT policy for users table');
    
    await client.query(`
      CREATE POLICY "Users can insert own user data" ON public.users
      FOR INSERT WITH CHECK (auth.uid() = id);
    `);
    console.log('✓ Created INSERT policy for users table');
    
    await client.query(`
      CREATE POLICY "Users can update own user data" ON public.users
      FOR UPDATE USING (auth.uid() = id);
    `);
    console.log('✓ Created UPDATE policy for users table');

    // Create policies for habits table
    console.log('Creating policies for habits table...');
    
    await client.query(`
      CREATE POLICY "Users can view own habits" ON public.habits
      FOR SELECT USING (auth.uid() = user_id);
    `);
    console.log('✓ Created SELECT policy for habits table');
    
    await client.query(`
      CREATE POLICY "Users can insert own habits" ON public.habits
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    `);
    console.log('✓ Created INSERT policy for habits table');
    
    await client.query(`
      CREATE POLICY "Users can update own habits" ON public.habits
      FOR UPDATE USING (auth.uid() = user_id);
    `);
    console.log('✓ Created UPDATE policy for habits table');
    
    await client.query(`
      CREATE POLICY "Users can delete own habits" ON public.habits
      FOR DELETE USING (auth.uid() = user_id);
    `);
    console.log('✓ Created DELETE policy for habits table');

    // Create policies for progress table
    console.log('Creating policies for progress table...');
    
    await client.query(`
      CREATE POLICY "Users can view own progress" ON public.progress
      FOR SELECT USING (auth.uid() = user_id);
    `);
    console.log('✓ Created SELECT policy for progress table');
    
    await client.query(`
      CREATE POLICY "Users can insert own progress" ON public.progress
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    `);
    console.log('✓ Created INSERT policy for progress table');
    
    await client.query(`
      CREATE POLICY "Users can update own progress" ON public.progress
      FOR UPDATE USING (auth.uid() = user_id);
    `);
    console.log('✓ Created UPDATE policy for progress table');
    
    await client.query(`
      CREATE POLICY "Users can delete own progress" ON public.progress
      FOR DELETE USING (auth.uid() = user_id);
    `);
    console.log('✓ Created DELETE policy for progress table');

    // Create policies for streaks table
    console.log('Creating policies for streaks table...');
    
    await client.query(`
      CREATE POLICY "Users can view own streaks" ON public.streaks
      FOR SELECT USING (auth.uid() = user_id);
    `);
    console.log('✓ Created SELECT policy for streaks table');
    
    await client.query(`
      CREATE POLICY "Users can insert own streaks" ON public.streaks
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    `);
    console.log('✓ Created INSERT policy for streaks table');
    
    await client.query(`
      CREATE POLICY "Users can update own streaks" ON public.streaks
      FOR UPDATE USING (auth.uid() = user_id);
    `);
    console.log('✓ Created UPDATE policy for streaks table');
    
    await client.query(`
      CREATE POLICY "Users can delete own streaks" ON public.streaks
      FOR DELETE USING (auth.uid() = user_id);
    `);
    console.log('✓ Created DELETE policy for streaks table');

    // Grant necessary permissions to authenticated users
    console.log('Granting permissions to authenticated users...');
    
    await client.query('GRANT ALL ON public.users TO authenticated;');
    console.log('✓ Granted permissions on users table');
    
    await client.query('GRANT ALL ON public.habits TO authenticated;');
    console.log('✓ Granted permissions on habits table');
    
    await client.query('GRANT ALL ON public.progress TO authenticated;');
    console.log('✓ Granted permissions on progress table');
    
    await client.query('GRANT ALL ON public.streaks TO authenticated;');
    console.log('✓ Granted permissions on streaks table');

    console.log('\n✅ All RLS policies applied successfully!');
    
  } catch (err) {
    console.error('Error applying RLS:', err);
  } finally {
    await client.end();
  }
}

// Run the script if executed directly
if (require.main === module) {
  applyRLS();
}

export default applyRLS;