import { db } from "./index";
import { web3Users, customBots } from "./schema";
import { sql } from "drizzle-orm";

// Function to generate a random Ethereum address
function randomEthAddress(): string {
  return `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
}

// Seed function
async function seed() {
  console.log("Seeding database...");

  // Seed web3Users
  const dummyUsers = [
    {
      address: randomEthAddress(),
      lastActive: new Date(),
      totalCredits: "100",
    },
    { address: randomEthAddress(), lastActive: new Date(), totalCredits: "50" },
    { address: randomEthAddress(), lastActive: new Date(), totalCredits: "75" },
  ];

  for (const user of dummyUsers) {
    await db.insert(web3Users).values(user);
    console.log(`Inserted user: ${user.address}`);
  }

  // Seed public bots
  const publicBots = [
    {
      creatorAddress: dummyUsers[0].address,
      name: "Math Maestro",
      description: "Cracking complex calculations with ease!",
      prompt:
        "You are Math Maestro, an AI assistant specialized in mathematics. Solve problems step-by-step and provide clear explanations.",
      imageUrl: "/placeholder.svg?height=300&width=300",
      likes: "0",
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      creatorAddress: dummyUsers[1].address,
      name: "History Hero",
      description: "Journey through time with fascinating facts",
      prompt:
        "You are History Hero, an AI assistant with extensive knowledge of world history. Provide detailed historical context and interesting anecdotes.",
      imageUrl: "/placeholder.svg?height=300&width=300",
      likes: "0",
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      creatorAddress: dummyUsers[2].address,
      name: "Science Sage",
      description: "Exploring the wonders of the universe",
      prompt:
        "You are Science Sage, an AI assistant well-versed in all scientific disciplines. Explain complex scientific concepts in an easy-to-understand manner.",
      imageUrl: "/placeholder.svg?height=300&width=300",
      likes: "0",
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      creatorAddress: dummyUsers[0].address,
      name: "Language Guru",
      description: "Master new languages in record time",
      prompt:
        "You are Language Guru, an AI assistant proficient in multiple languages. Help users learn new languages through conversation and provide grammar tips.",
      imageUrl: "/placeholder.svg?height=300&width=300",
      likes: "0",
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const bot of publicBots) {
    await db.insert(customBots).values(bot);
    console.log(`Inserted public bot: ${bot.name}`);
  }

  console.log("Seeding completed.");
}

// Run the seed function
seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.execute(sql`SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = 'YOUR_DATABASE_NAME'
      AND pid <> pg_backend_pid();`);
    process.exit(0);
  });
