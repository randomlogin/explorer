import db from '$lib/db';
import decodeScriptPubKeyToTaprootAddress from '$lib/utils';

import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { blocks } from '$lib/schema';

export const GET: RequestHandler = async function ({ params }) {
    const bufHash = Buffer.from(params.hash, 'hex');
    const queryResult = await db.execute(
        sql`
        SELECT 
        blocks.*, 
        transactions.*, 
        tx_inputs.txid AS input_txid, 
        tx_inputs.index AS input_index, 
        tx_inputs.hash_prevout AS input_hash_prevout, 
        tx_inputs.index_prevout AS input_index_prevout, 
        tx_inputs.sequence AS input_sequence, 
        tx_inputs.coinbase AS input_coinbase, 
        tx_inputs.txinwitness AS input_txinwitness, 
        tx_outputs.index AS output_index, 
        tx_outputs.value AS output_value, 
        tx_outputs.scriptpubkey AS output_scriptpubkey
        FROM 
        blocks
        LEFT JOIN 
        transactions ON transactions.block_hash = blocks.hash
        LEFT JOIN 
        tx_inputs ON tx_inputs.txid = transactions.txid  
        LEFT JOIN 
        tx_outputs ON tx_outputs.txid = transactions.txid  
        WHERE 
        blocks.hash = ${bufHash};
        `);

        if (!queryResult.rows || queryResult.rows.length === 0) {
            return error(404, 'Block not found');
        }

        const block = {
            hash: queryResult.rows[0].hash.toString('hex'),
            size: queryResult.rows[0].size,
            stripped_size: queryResult.rows[0].stripped_size,
            weight: queryResult.rows[0].weight,
            height: queryResult.rows[0].height,
            version: queryResult.rows[0].version,
            hash_merkle_root: queryResult.rows[0].hash_merkle_root.toString('hex'),
            time: queryResult.rows[0].time,
            median_time: queryResult.rows[0].median_time,
            nonce: queryResult.rows[0].nonce,
            bits: queryResult.rows[0].bits.toString('hex'),
            difficulty: queryResult.rows[0].difficulty,
            chainwork: queryResult.rows[0].chainwork.toString('hex'),
            orphan: queryResult.rows[0].orphan,
            transactions: [] 
        };

        const transactionMap = new Map();
        console.log(queryResult.rows[0])
    for (const row of queryResult.rows) {
        const txid = row.txid.toString('hex'); // Convert txid to hex string

        // Check if the transaction is already in the map
        if (!transactionMap.has(txid)) {
            const transaction = {
                txid: txid, // Unique transaction ID
                tx_hash: row.tx_hash.toString('hex'),
                version: row.version,
                size: row.size,
                vsize: row.vsize,
                weight: row.weight,
                locktime: row.locktime,
                fee: row.fee,
                index: row.index,
                inputs: [],
                outputs: []
            };

            if (row.input_index) {
                const input = {
                    index: row.input_index,
                    hash_prevout: (row.input_hash_prevout ? row.input_hash_prevout.toString('hex') : null),
                    index_prevout: row.input_index_prevout,
                    sequence: row.input_sequence,
                    coinbase: (row.input_coinbase ? row.input_coinbase.toString('hex') : null),
                    txinwitness: row.input_txinwitness
                };
                transaction.inputs.push(input);
            }

            if (row.output_index) {
                const output = {
                    index: row.output_index,
                    value: row.output_value,
                    scriptpubkey: (row.output_scriptpubkey ? row.output_scriptpubkey.toString('hex') : null),
                };
                transaction.outputs.push(output);
            }

            block.transactions.push(transaction);
            transactionMap.set(txid, transaction); // Store the transaction in the map
        } else {
            const existingTransaction = transactionMap.get(txid);

            if (row.input_txid) {
                const input = {
                    txid: row.input_txid.toString('hex'),
                    index: row.input_index,
                    hash_prevout: (row.input_hash_prevout ? row.input_hash_prevout.toString('hex') : null),
                    index_prevout: row.input_index_prevout,
                    sequence: row.input_sequence,
                    coinbase: (row.input_coinbase ? row.input_coinbase.toString('hex') : null),
                    txinwitness: row.input_txinwitness
                };
                existingTransaction.inputs.push(input);
            }

            if (row.output_txid) {
                const output = {
                    txid: row.output_txid.toString('hex'),
                    index: row.output_index,
                    value: row.output_value,
                    scriptpubkey: (row.output_scriptpubkey ? row.output_scriptpubkey.toString('hex') : null),
                };
                existingTransaction.outputs.push(output);
            }
        }
    }


    return json(block);
};

