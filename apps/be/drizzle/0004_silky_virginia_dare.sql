CREATE TABLE IF NOT EXISTS "nft_metadata" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL
);
