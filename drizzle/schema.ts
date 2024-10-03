import { pgTable, pgEnum, serial, bigint, boolean, timestamp, unique, integer, doublePrecision, uniqueIndex, foreignKey, primaryKey, index, text, customType } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"


export const covenant_action = pgEnum("covenant_action", ['RESERVE', 'BID', 'TRANSFER'])

const bytea = customType({
  dataType: 'bytea',
  fromDriver(value: unknown): Buffer {
    return value as Buffer;
  },
  toDriver(value: Buffer): Buffer {
    return value;
  },
});

export const goose_db_version = pgTable("goose_db_version", {
	id: serial("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	version_id: bigint("version_id", { mode: "number" }).notNull(),
	is_applied: boolean("is_applied").notNull(),
	tstamp: timestamp("tstamp", { mode: 'string' }).defaultNow(),
});

export const blocks = pgTable("blocks", {
	// TODO: failed to parse database type 'bytea'
	hash: bytea("hash").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	size: bigint("size", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	stripped_size: bigint("stripped_size", { mode: "number" }).notNull(),
	weight: integer("weight").notNull(),
	height: integer("height").notNull(),
	version: integer("version").notNull(),
	// TODO: failed to parse database type 'bytea'
	hash_merkle_root: bytea("hash_merkle_root").notNull(),
	time: integer("time").notNull(),
	median_time: integer("median_time").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	nonce: bigint("nonce", { mode: "number" }).notNull(),
	// TODO: failed to parse database type 'bytea'
	bits: bytea("bits").notNull(),
	difficulty: doublePrecision("difficulty").notNull(),
	// TODO: failed to parse database type 'bytea'
	chainwork: bytea("chainwork").notNull(),
	orphan: boolean("orphan").default(false).notNull(),
},
(table) => {
	return {
		blocks_height_key: unique("blocks_height_key").on(table.height),
	}
});

export const transactions = pgTable("transactions", {
	txid: bytea("txid").primaryKey().notNull(),
	tx_hash: bytea("tx_hash"),
	version: integer("version").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	size: bigint("size", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	vsize: bigint("vsize", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	weight: bigint("weight", { mode: "number" }).notNull(),
	locktime: integer("locktime").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fee: bigint("fee", { mode: "number" }).notNull(),
	block_hash: bytea("block_hash").references(() => blocks.hash, { onDelete: "cascade" } ),
	index: integer("index"),
},
(table) => {
	return {
		block_hash_idx: uniqueIndex("transactions_block_hash_index").using("btree", table.block_hash, table.index).where(sql`(block_hash IS NOT NULL)`),
	}
});

export const tx_outputs = pgTable("tx_outputs", {
	block_hash: bytea("block_hash").notNull().references(() => blocks.hash, { onDelete: "cascade" } ),
	txid: bytea("txid").notNull().references(() => transactions.txid, { onDelete: "cascade" } ),
	index: integer("index").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	value: bigint("value", { mode: "number" }).notNull(),
	scriptpubkey: bytea("scriptpubkey"),
},
(table) => {
	return {
		tx_outputs_pkey: primaryKey({ columns: [table.block_hash, table.txid, table.index], name: "tx_outputs_pkey"}),
	}
});

export const tx_inputs = pgTable("tx_inputs", {
	block_hash: bytea("block_hash").notNull().references(() => blocks.hash, { onDelete: "cascade" } ),
	txid: bytea("txid").notNull().references(() => transactions.txid, { onDelete: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	index: bigint("index", { mode: "number" }).notNull(),
	hash_prevout: bytea("hash_prevout"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	index_prevout: bigint("index_prevout", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sequence: bigint("sequence", { mode: "number" }).notNull(),
	coinbase: bytea("coinbase"),
	txinwitness: bytea("txinwitness").array(),
},
(table) => {
	return {
		hash_prevout_idx: index("tx_inputs_hash_prevout_index").using("btree", table.hash_prevout, table.index_prevout).where(sql`(hash_prevout IS NOT NULL)`),
		txid_idx: index().using("btree", table.txid),
		tx_inputs_pkey: primaryKey({ columns: [table.block_hash, table.txid, table.index], name: "tx_inputs_pkey"}),
	}
});

export const vmetaouts = pgTable("vmetaouts", {
	block_hash: bytea("block_hash").notNull().references(() => blocks.hash, { onDelete: "cascade" } ),
	txid: bytea("txid").notNull().references(() => transactions.txid, { onDelete: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	tx_index: bigint("tx_index", { mode: "number" }).notNull(),
	outpoint_txid: bytea("outpoint_txid").notNull().references(() => transactions.txid),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	outpoint_index: bigint("outpoint_index", { mode: "number" }).notNull(),
	name: text("name").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	burn_increment: bigint("burn_increment", { mode: "number" }),
	covenant_action: covenant_action("covenant_action").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	claim_height: bigint("claim_height", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expire_height: bigint("expire_height", { mode: "number" }),
},
(table) => {
	return {
		vmetaouts_pkey: primaryKey({ columns: [table.block_hash, table.txid, table.tx_index], name: "vmetaouts_pkey"}),
	}
});
