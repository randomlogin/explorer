import { pgTable, pgEnum, serial, bigint, boolean, timestamp, unique, integer, doublePrecision, uniqueIndex, primaryKey, index, text, customType} from "drizzle-orm/pg-core"

import  db  from "$lib/db";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm/relations";


export const covenant_action = pgEnum("covenant_action", ['RESERVE', 'BID', 'TRANSFER'])

const bytea = customType({
  dataType() { return "bytea" },
  fromDriver(value: unknown): string {
		//Why it doesn't work without this? sometimes hexstring, sometimes buffer
    if (typeof value === 'string' && value.startsWith('\\x')) {
        return value.slice(2)
    }
		return value.toString('hex')
    // return value as Buffer;
  },
  toDriver(value: Buffer): Buffer {
		return Buffer.from(value, 'hex')
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
	hash: bytea("hash").primaryKey().notNull(),
	size: bigint("size", { mode: "number" }).notNull(),
	stripped_size: bigint("stripped_size", { mode: "number" }).notNull(),
	weight: integer("weight").notNull(),
	height: integer("height").notNull(),
	version: integer("version").notNull(),
	hash_merkle_root: bytea("hash_merkle_root").notNull(),
	time: integer("time").notNull(),
	median_time: integer("median_time").notNull(),
	nonce: bigint("nonce", { mode: "number" }).notNull(),
	bits: bytea("bits").notNull(),
	difficulty: doublePrecision("difficulty").notNull(),
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
	index: bigint("index", { mode: "number" }).notNull(),
	hash_prevout: bytea("hash_prevout"),
	index_prevout: bigint("index_prevout", { mode: "number" }).notNull(),
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
	tx_index: bigint("tx_index", { mode: "number" }).notNull(),
	outpoint_txid: bytea("outpoint_txid").notNull().references(() => transactions.txid),
	outpoint_index: bigint("outpoint_index", { mode: "number" }).notNull(),
	name: text("name").notNull(),
	burn_increment: bigint("burn_increment", { mode: "number" }),
	covenant_action: covenant_action("covenant_action").notNull(),
	claim_height: bigint("claim_height", { mode: "number" }),
	expire_height: bigint("expire_height", { mode: "number" }),
},
(table) => {
	return {
		vmetaouts_pkey: primaryKey({ columns: [table.block_hash, table.txid, table.tx_index], name: "vmetaouts_pkey"}),
	}
});

export const transactionsRelations = relations(transactions, ({one, many}) => ({
	block: one(blocks, {
		fields: [transactions.block_hash],
		references: [blocks.hash]
	}),
	tx_outputs: many(tx_outputs),
	tx_inputs: many(tx_inputs),
	vmetaouts_txid: many(vmetaouts, {
		relationName: "vmetaouts_txid_transactions_txid"
	}),
	vmetaouts_outpoint_txid: many(vmetaouts, {
		relationName: "vmetaouts_outpoint_txid_transactions_txid"
	}),
}));

export const blocksRelations = relations(blocks, ({many}) => ({
	transactions: many(transactions),
	tx_outputs: many(tx_outputs),
	tx_inputs: many(tx_inputs),
	vmetaouts: many(vmetaouts),
}));

export const tx_outputsRelations = relations(tx_outputs, ({one}) => ({
	block: one(blocks, {
		fields: [tx_outputs.block_hash],
		references: [blocks.hash]
	}),
	transaction: one(transactions, {
		fields: [tx_outputs.txid],
		references: [transactions.txid]
	}),
}));

export const tx_inputsRelations = relations(tx_inputs, ({one}) => ({
	block: one(blocks, {
		fields: [tx_inputs.block_hash],
		references: [blocks.hash]
	}),
	transaction: one(transactions, {
		fields: [tx_inputs.txid],
		references: [transactions.txid]
	}),
}));

export const vmetaoutsRelations = relations(vmetaouts, ({one}) => ({
	block: one(blocks, {
		fields: [vmetaouts.block_hash],
		references: [blocks.hash]
	}),
	transaction_txid: one(transactions, {
		fields: [vmetaouts.txid],
		references: [transactions.txid],
		relationName: "vmetaouts_txid_transactions_txid"
	}),
	transaction_outpoint_txid: one(transactions, {
		fields: [vmetaouts.outpoint_txid],
		references: [transactions.txid],
		relationName: "vmetaouts_outpoint_txid_transactions_txid"
	}),
}));

export async function getMaxBlockHeight() {
	const result = await db.execute(sql`
	SELECT COALESCE(MAX(height), -1)::integer AS max_height
	FROM blocks
	`);

	return result.rows[0].max_height;


}
