import {
  pgTable,
  text,
  numeric,
  timestamp,
  bigserial,
  boolean,
} from "drizzle-orm/pg-core";

export const web3Users = pgTable("web3_users", {
  address: text("address").primaryKey(),
  lastActive: timestamp("last_active", { withTimezone: true }),
  totalCredits: numeric("total_credits").default("0"),
});

export const creditPurchases = pgTable("credit_purchases", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userAddress: text("user_address").references(() => web3Users.address),
  txHash: text("tx_hash").notNull().unique(),
  ethPaid: numeric("eth_paid").notNull(),
  creditsReceived: numeric("credits_received").notNull(),
  purchasedAt: timestamp("purchased_at", { withTimezone: true }).defaultNow(),
});

export const creditUsage = pgTable("credit_usage", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userAddress: text("user_address").references(() => web3Users.address),
  creditAmount: numeric("credit_amount").notNull(),
  usageType: text("usage_type").notNull(), // e.g., "chat", "image_generation", etc.
  usedAt: timestamp("used_at", { withTimezone: true }).defaultNow(),
});

export const customBots = pgTable("custom_bots", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  creatorAddress: text("creator_address").references(() => web3Users.address),
  name: text("name").notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url"),
  likes: numeric("likes").default("0"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
