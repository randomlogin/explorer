import { relations } from "drizzle-orm/relations";
import { blocks, transactions, tx_outputs, tx_inputs, vmetaouts } from "./schema";

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