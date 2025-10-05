import { db } from "../../src/db";
import { users } from "../../src/db/schema/users";
import { habits } from "../../src/db/schema/habits";

async function seed() {
  console.log("🌱 Starting seed...");
  
  // Insert sample users
  const sampleUsers = [
    {
      email: "user1@example.com",
      username: "Gardener1",
    },
    {
      email: "user2@example.com",
      username: "HabitMaster",
    },
  ];
  
  console.log("👤 Inserting sample users...");
  const insertedUsers = await Promise.all(
    sampleUsers.map(user => 
      db.insert(users).values(user).returning()
    )
  );
  
  console.log(`✅ Inserted ${insertedUsers.length} users`);
  
  // Insert sample habits
  const sampleHabits = [
    {
      userId: insertedUsers[0][0].id,
      title: "Morning Meditation",
      description: "10 minutes of mindfulness meditation",
      category: "Mindfulness",
      color: "#FF6B6B",
    },
    {
      userId: insertedUsers[0][0].id,
      title: "Drink Water",
      description: "Drink 8 glasses of water",
      category: "Health",
      color: "#4ECDC4",
    },
    {
      userId: insertedUsers[1][0].id,
      title: "Exercise",
      description: "30 minutes of physical activity",
      category: "Fitness",
      color: "#45B7D1",
    },
  ];
  
  console.log("🎯 Inserting sample habits...");
  const insertedHabits = await Promise.all(
    sampleHabits.map(habit => 
      db.insert(habits).values(habit).returning()
    )
  );
  
  console.log(`✅ Inserted ${insertedHabits.length} habits`);
  console.log("🌱 Seed completed!");
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed().catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
}

export default seed;