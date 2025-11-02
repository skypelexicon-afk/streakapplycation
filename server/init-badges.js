import { db } from "./db/client.js";
import { badges } from "./schema/schema.js";

const defaultBadges = [
  { name: "First Step", description: "Started your learning journey!", milestone_days: 1, icon_emoji: "🔥", color: "#FF6B6B" },
  { name: "Week Warrior", description: "7 days of consistent learning", milestone_days: 7, icon_emoji: "⭐", color: "#4ECDC4" },
  { name: "Consistency Champion", description: "14 days streak achieved", milestone_days: 14, icon_emoji: "💎", color: "#45B7D1" },
  { name: "Habit Former", description: "21 days of dedication", milestone_days: 21, icon_emoji: "🏆", color: "#FFA07A" },
  { name: "Monthly Master", description: "30 days of continuous learning", milestone_days: 30, icon_emoji: "🚀", color: "#98D8C8" },
  { name: "Learning Legend", description: "60 days of unwavering commitment", milestone_days: 60, icon_emoji: "🌟", color: "#FFD700" },
  { name: "Dedication King", description: "90 days of excellence", milestone_days: 90, icon_emoji: "👑", color: "#9B59B6" },
  { name: "Century Club", description: "100 days of mastery", milestone_days: 100, icon_emoji: "💯", color: "#E74C3C" },
  { name: "Half Year Hero", description: "180 days of perseverance", milestone_days: 180, icon_emoji: "🦸", color: "#3498DB" },
  { name: "Annual Achiever", description: "365 days of dedication!", milestone_days: 365, icon_emoji: "🎓", color: "#F39C12" },
];

async function initializeBadges() {
  try {
    console.log("Initializing badges...");
    
    // Check if badges already exist
    const existingBadges = await db.select().from(badges);
    
    if (existingBadges.length === 0) {
      await db.insert(badges).values(defaultBadges);
      console.log(`✓ Successfully initialized ${defaultBadges.length} badges`);
    } else {
      console.log(`✓ Badges already initialized (${existingBadges.length} badges found)`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Error initializing badges:", err);
    process.exit(1);
  }
}

initializeBadges();
