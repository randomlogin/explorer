-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "public"."covenant_action" AS ENUM('RESERVE', 'BID', 'TRANSFER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goose_db_version" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_id" bigint NOT NULL,
	"is_applied" boolean NOT NULL,
	"tstamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blocks" (
	"hash" "bytea" PRIMARY KEY NOT NULL,
	"size" bigint NOT NULL,
	"stripped_size" bigint NOT NULL,
	"weight" integer NOT NULL,
	"height" integer NOT NULL,
	"version" integer NOT NULL,
	"hash_merkle_root" "bytea" NOT NULL,
	"time" integer NOT NULL,
	"median_time" integer NOT NULL,
	"nonce" bigint NOT NULL,
	"bits" "bytea" NOT NULL,
	"difficulty" double precision NOT NULL,
	"chainwork" "bytea" NOT NULL,
	"orphan" boolean DEFAULT false NOT NULL,
	CONSTRAINT "blocks_height_key" UNIQUE("height")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"txid" "bytea" PRIMARY KEY NOT NULL,
	"tx_hash" "bytea",
	"version" integer NOT NULL,
	"size" bigint NOT NULL,
	"vsize" bigint NOT NULL,
	"weight" bigint NOT NULL,
	"locktime" integer NOT NULL,
	"fee" bigint NOT NULL,
	"block_hash" "bytea",
	"index" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tx_outputs" (
	"block_hash" "bytea" NOT NULL,
	"txid" "bytea" NOT NULL,
	"index" integer NOT NULL,
	"value" bigint NOT NULL,
	"scriptpubkey" "bytea",
	CONSTRAINT "tx_outputs_pkey" PRIMARY KEY("block_hash","txid","index")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tx_inputs" (
	"block_hash" "bytea" NOT NULL,
	"txid" "bytea" NOT NULL,
	"index" bigint NOT NULL,
	"hash_prevout" "bytea",
	"index_prevout" bigint NOT NULL,
	"sequence" bigint NOT NULL,
	"coinbase" "bytea",
	"txinwitness" bytea[],
	CONSTRAINT "tx_inputs_pkey" PRIMARY KEY("block_hash","txid","index")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vmetaouts" (
	"block_hash" "bytea" NOT NULL,
	"txid" "bytea" NOT NULL,
	"tx_index" bigint NOT NULL,
	"outpoint_txid" "bytea" NOT NULL,
	"outpoint_index" bigint NOT NULL,
	"name" text NOT NULL,
	"burn_increment" bigint,
	"covenant_action" "covenant_action" NOT NULL,
	"claim_height" bigint,
	"expire_height" bigint,
	CONSTRAINT "vmetaouts_pkey" PRIMARY KEY("block_hash","txid","tx_index")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_block_hash_fkey" FOREIGN KEY ("block_hash") REFERENCES "public"."blocks"("hash") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tx_outputs" ADD CONSTRAINT "tx_outputs_block_hash_fkey" FOREIGN KEY ("block_hash") REFERENCES "public"."blocks"("hash") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tx_outputs" ADD CONSTRAINT "tx_outputs_txid_fkey" FOREIGN KEY ("txid") REFERENCES "public"."transactions"("txid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tx_inputs" ADD CONSTRAINT "tx_inputs_block_hash_fkey" FOREIGN KEY ("block_hash") REFERENCES "public"."blocks"("hash") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tx_inputs" ADD CONSTRAINT "tx_inputs_txid_fkey" FOREIGN KEY ("txid") REFERENCES "public"."transactions"("txid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vmetaouts" ADD CONSTRAINT "vmetaouts_block_hash_fkey" FOREIGN KEY ("block_hash") REFERENCES "public"."blocks"("hash") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vmetaouts" ADD CONSTRAINT "vmetaouts_txid_fkey" FOREIGN KEY ("txid") REFERENCES "public"."transactions"("txid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vmetaouts" ADD CONSTRAINT "vmetaouts_outpoint_txid_fkey" FOREIGN KEY ("outpoint_txid") REFERENCES "public"."transactions"("txid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "transactions_block_hash_index" ON "transactions" USING btree ("block_hash" int4_ops,"index" int4_ops) WHERE (block_hash IS NOT NULL);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tx_inputs_hash_prevout_index" ON "tx_inputs" USING btree ("hash_prevout" int8_ops,"index_prevout" int8_ops) WHERE (hash_prevout IS NOT NULL);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tx_inputs_txid_index" ON "tx_inputs" USING btree ("txid" bytea_ops);
*/