import { eq, sql, desc } from "drizzle-orm";
import { Hono } from "hono";
import {
  Chain,
  createPublicClient,
  decodeEventLog,
  http,
  parseAbiItem,
} from "viem";
import { db } from "./db";
import { creditPurchases, customBots, web3Users } from "./db/schema";

const app = new Hono();

const openCampusCodex: Chain = {
  id: 656476,
  name: "Open Campus Codex",
  nativeCurrency: {
    decimals: 18,
    name: "EDU",
    symbol: "EDU",
  },
  rpcUrls: {
    public: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
    default: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://opencampus-codex.blockscout.com/",
    },
  },
};

// Create a public client
const client = createPublicClient({
  chain: openCampusCodex,
  transport: http(),
});

app.get("/health", (c) => c.json({ status: "OK" }));

app.get("/", (c) => c.text("Hello Hono!"));

app.get("/users", async (c) => {
  const allUsers = await db.select().from(web3Users);
  return c.json(allUsers);
});

app.get("/user/:address", async (c) => {
  const address = c.req.param("address");

  try {
    const user = await db
      .select()
      .from(web3Users)
      .where(eq(web3Users.address, address))
      .limit(1);

    if (user.length === 0) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

app.post("/users", async (c) => {
  const body = await c.req.json();
  const { address } = body;

  if (!address) {
    return c.json({ error: "Address is required" }, 400);
  }

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(web3Users)
      .where(eq(web3Users.address, address))
      .limit(1);

    if (existingUser.length > 0) {
      // User exists, update lastActive
      await db
        .update(web3Users)
        .set({ lastActive: new Date() })
        .where(eq(web3Users.address, address));

      return c.json({ message: "User updated", user: existingUser[0] });
    } else {
      // User doesn't exist, create new user with 5 credits
      const newUser = await db
        .insert(web3Users)
        .values({
          address,
          totalCredits: "5",
          lastActive: new Date(),
          xp: "0",
        })
        .returning();

      return c.json({ message: "User created", user: newUser[0] }, 201);
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return c.json({ error: "Failed to create/update user" }, 500);
  }
});

app.get("/extract-event/:txHash", async (c) => {
  const txHash = c.req.param("txHash") as `0x${string}`;

  try {
    // Get the transaction receipt
    const receipt = await client.getTransactionReceipt({ hash: txHash });

    if (receipt.logs.length === 0) {
      return c.json({ error: "No logs found in the transaction" }, 404);
    }

    // Define the event ABI
    const eventAbi = parseAbiItem(
      "event CreditsPurchased(address indexed user, uint256 ethPaid, uint256 creditsReceived)"
    );

    // Decode the log
    const decodedLog = decodeEventLog({
      abi: [eventAbi],
      data: receipt.logs[0].data,
      topics: receipt.logs[0].topics,
    });

    // Extract the required information
    const userAddress = decodedLog.args.user;
    const ethPaid = decodedLog.args.ethPaid;
    const creditsReceived = decodedLog.args.creditsReceived;

    // Add the purchase to credit_purchases table
    await db.insert(creditPurchases).values({
      userAddress,
      txHash,
      ethPaid: ethPaid.toString(),
      creditsReceived: creditsReceived.toString(),
    });

    await db
      .update(web3Users)
      .set({
        totalCredits: sql`${web3Users.totalCredits} + ${creditsReceived}`,
        lastActive: new Date(),
      })
      .where(eq(web3Users.address, userAddress));

    return c.json({
      userAddress,
      ethPaidWei: ethPaid.toString(),
      ethPaidEth: Number(ethPaid) / 1e18,
      creditsReceived: creditsReceived.toString(),
      message: "Purchase recorded successfully",
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    return c.json({ error: "Failed to process purchase" }, 500);
  }
});

app.get("/user/:address/credits", async (c) => {
  const address = c.req.param("address");
  const user = await db
    .select({ totalCredits: web3Users.totalCredits })
    .from(web3Users)
    .where(eq(web3Users.address, address))
    .limit(1);

  if (user.length === 0) {
    // If user doesn't exist, create a new user with 5 credits
    const newUser = await db
      .insert(web3Users)
      .values({
        address,
        totalCredits: "5",
        lastActive: new Date(),
        xp: "0",
      })
      .returning();

    return c.json({ credits: newUser[0].totalCredits });
  }

  return c.json({ credits: user[0].totalCredits });
});

// New endpoint to add XP
app.post("/user/:address/xp", async (c) => {
  const address = c.req.param("address");
  const body = await c.req.json();
  const { xp } = body;

  if (!xp) {
    return c.json({ error: "XP is required" }, 400);
  }

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(web3Users)
      .where(eq(web3Users.address, address))
      .limit(1);

    if (existingUser.length > 0) {
      // User exists, update XP
      await db
        .update(web3Users)
        .set({ xp: sql`${web3Users.xp} + ${xp}` })
        .where(eq(web3Users.address, address));

      return c.json({ message: "XP updated" });
    } else {
      return c.json({ error: "User not found" }, 404);
    }
  } catch (error) {
    console.error("Error adding XP:", error);
    return c.json({ error: "Failed to add XP" }, 500);
  }
});

// New endpoint to create a custom bot
app.post("/bots", async (c) => {
  const body = await c.req.json();
  const {
    creatorAddress,
    name,
    description,
    prompt,
    isPublic,
    imageUrl,
    likes,
  } = body;

  try {
    const newBot = await db
      .insert(customBots)
      .values({
        creatorAddress,
        name,
        description,
        prompt,
        isPublic: isPublic || false,
        imageUrl: imageUrl || null,
        likes: likes || 0,
      })
      .returning();

    return c.json(newBot[0], 201);
  } catch (error) {
    console.error("Error creating bot:", error);
    return c.json({ error: "Failed to create bot" }, 500);
  }
});

// New endpoint to get all public bots
app.get("/bots/public", async (c) => {
  const publicBots = await db
    .select()
    .from(customBots)
    .where(eq(customBots.isPublic, true));
  return c.json(publicBots);
});

app.get("/purchases/:address", async (c) => {
  const address = c.req.param("address");

  try {
    const purchases = await db
      .select({
        txHash: creditPurchases.txHash,
        ethPaid: creditPurchases.ethPaid,
        creditsReceived: creditPurchases.creditsReceived,
        purchasedAt: creditPurchases.purchasedAt,
      })
      .from(creditPurchases)
      .where(eq(creditPurchases.userAddress, address))
      .orderBy(desc(creditPurchases.purchasedAt));

    return c.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return c.json({ error: "Failed to fetch purchases" }, 500);
  }
});

export default {
  port: process.env.PORT ?? 3000,
  fetch: app.fetch,
};
