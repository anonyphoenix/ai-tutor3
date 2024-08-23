CREATE TABLE IF NOT EXISTS "credit_purchases" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_address" text,
	"tx_hash" text NOT NULL,
	"eth_paid" numeric NOT NULL,
	"credits_received" numeric NOT NULL,
	"purchased_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "credit_purchases_tx_hash_unique" UNIQUE("tx_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_usage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_address" text,
	"credit_amount" numeric NOT NULL,
	"usage_type" text NOT NULL,
	"used_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_bots" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"creator_address" text,
	"name" text NOT NULL,
	"description" text,
	"prompt" text NOT NULL,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web3_users" (
	"address" text PRIMARY KEY NOT NULL,
	"last_active" timestamp with time zone,
	"total_credits" numeric DEFAULT '0'
);
--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_purchases" ADD CONSTRAINT "credit_purchases_user_address_web3_users_address_fk" FOREIGN KEY ("user_address") REFERENCES "public"."web3_users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_usage" ADD CONSTRAINT "credit_usage_user_address_web3_users_address_fk" FOREIGN KEY ("user_address") REFERENCES "public"."web3_users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "custom_bots" ADD CONSTRAINT "custom_bots_creator_address_web3_users_address_fk" FOREIGN KEY ("creator_address") REFERENCES "public"."web3_users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
