import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import decodeScriptPubKeyToTaprootAddress from '$lib/utils';

export const GET: RequestHandler = async function ({ params }) {
    const queryResult = await db.execute(sql`
        SELECT 
            blocks.hash AS block_hash,
            blocks.size AS block_size,
            blocks.stripped_size AS block_stripped_size,
            blocks.weight AS block_weight,
            blocks.height AS block_height,
            blocks.version AS block_version,
            blocks.hash_merkle_root AS block_hash_merkle_root,
            blocks.time AS block_time,
            blocks.median_time AS block_median_time,
            blocks.nonce AS block_nonce,
            blocks.bits AS block_bits,
            blocks.difficulty AS block_difficulty,
            blocks.chainwork AS block_chainwork,
            blocks.orphan AS block_orphan,

            transactions.txid AS txid,
            transactions.tx_hash AS tx_hash,
            transactions.version AS tx_version,
            transactions.size AS tx_size,
            transactions.vsize AS tx_vsize,
            transactions.weight AS tx_weight,
            transactions.locktime AS tx_locktime,
            transactions.fee AS tx_fee,

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
            blocks.height = ${params.height};
    `);

    if (!queryResult.rows || queryResult.rows.length === 0) {
        return error(404, 'Block not found');
    }

    // Build the block object
    const block = {
        hash: queryResult.rows[0].block_hash.toString('hex'),
        size: queryResult.rows[0].block_size,
        stripped_size: queryResult.rows[0].block_stripped_size,
        weight: queryResult.rows[0].block_weight,
        height: queryResult.rows[0].block_height,
        version: queryResult.rows[0].block_version,
        hash_merkle_root: queryResult.rows[0].block_hash_merkle_root.toString('hex'),
        time: queryResult.rows[0].block_time,
        median_time: queryResult.rows[0].block_median_time,
        nonce: queryResult.rows[0].block_nonce,
        bits: queryResult.rows[0].block_bits.toString('hex'),
        difficulty: queryResult.rows[0].block_difficulty,
        chainwork: queryResult.rows[0].block_chainwork.toString('hex'),
        orphan: queryResult.rows[0].block_orphan,
        transactions: []  // To hold the unique transactions
    };

    // Maps to track unique inputs and outputs using composite keys (txid + index)
    const transactionMap = new Map();
    const inputMap = new Map(); // Composite key: `${txid}_${input_index}`
    const outputMap = new Map(); // Composite key: `${txid}_${output_index}`


    for (const row of queryResult.rows) {
        const txid = row.txid.toString('hex'); // Ensure txid is a hex string

        // If the transaction is new, add it
        let transaction = transactionMap.get(txid);
        if (!transaction) {
            transaction = {
                txid: txid,
                tx_hash: row.tx_hash.toString('hex'),
                version: row.tx_version,
                size: row.tx_size,
                vsize: row.tx_vsize,
                weight: row.tx_weight,
                locktime: row.tx_locktime,
                fee: row.tx_fee,
                inputs: [],
                outputs: []
            };
            transactionMap.set(txid, transaction);
            block.transactions.push(transaction); // Add the new transaction to the block
        }

        // Create a composite key for the input and output
        const inputKey = `${txid}_${row.input_index}`;
        const outputKey = `${txid}_${row.output_index}`;

        // Add input if it's unique for this txid + input_index
        if (row.input_index !== null && !inputMap.has(inputKey)) {
            const input = {
                index: row.input_index,
                hash_prevout: row.input_hash_prevout ? row.input_hash_prevout.toString('hex') : null,
                index_prevout: row.input_index_prevout,
                sequence: row.input_sequence,
                coinbase: row.input_coinbase ? row.input_coinbase.toString('hex') : null,
                txinwitness: row.input_txinwitness
            };
            transaction.inputs.push(input);
            inputMap.set(inputKey, true); // Mark this input as processed
        }

        // Add output if it's unique for this txid + output_index
        if (row.output_index !== null && !outputMap.has(outputKey)) {
            const addr = decodeScriptPubKeyToTaprootAddress(row.output_scriptpubkey)
            const output = {
                index: row.output_index,
                value: row.output_value,
                scriptpubkey: row.output_scriptpubkey ? row.output_scriptpubkey : null,
                addr: addr,
            };
            transaction.outputs.push(output);
            outputMap.set(outputKey, true); // Mark this output as processed
        }
    }

    return json(block);  // Return the structured block data
};
