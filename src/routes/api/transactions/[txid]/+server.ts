import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { processTransactions } from '$routes/api/block/txs';

export const GET: RequestHandler = async function ({ params }) {
    const txid = Buffer.from(params.txid, 'hex');

    console.log(txid)
    const queryResult = await db.execute(sql`
    WITH transaction_data AS (
        SELECT
            transactions.txid,
            transactions.tx_hash,
            transactions.version AS tx_version,
            transactions.index AS tx_index,
            transactions.size AS tx_size,
            transactions.vsize AS tx_vsize,
            transactions.weight AS tx_weight,
            transactions.locktime AS tx_locktime,
            transactions.fee AS tx_fee,
            blocks.time AS block_time,
            blocks.height AS block_height,
            blocks.hash AS block_hash,
            (SELECT COALESCE(MAX(height), -1) FROM blocks)::integer AS max_height
        FROM transactions
        JOIN blocks ON transactions.block_hash = blocks.hash
        WHERE transactions.txid = ${txid}
    ),
    tx_inputs_data AS (
        SELECT
            txid,
            index AS input_index,
            hash_prevout AS input_hash_prevout,
            index_prevout AS input_index_prevout,
            sequence AS input_sequence,
            coinbase AS input_coinbase,
            txinwitness AS input_txinwitness
        FROM tx_inputs
        WHERE txid = ${txid}
    ),
    tx_outputs_data AS (
        SELECT
            txid,
            index AS output_index,
            value AS output_value,
            scriptpubkey AS output_scriptpubkey,
            spender_txid AS output_spender_txid,
            spender_index AS output_spender_index
        FROM tx_outputs
        WHERE txid = ${txid}
    )
    SELECT
        transaction_data.*,
        tx_inputs_data.input_index,
        tx_inputs_data.input_hash_prevout,
        tx_inputs_data.input_index_prevout,
        tx_inputs_data.input_sequence,
        tx_inputs_data.input_coinbase,
        tx_inputs_data.input_txinwitness,
        tx_outputs_data.output_index,
        tx_outputs_data.output_value,
        tx_outputs_data.output_scriptpubkey,
        tx_outputs_data.output_spender_txid,
        tx_outputs_data.output_spender_index
    FROM transaction_data
    LEFT JOIN tx_inputs_data ON transaction_data.txid = tx_inputs_data.txid
    LEFT JOIN tx_outputs_data ON transaction_data.txid = tx_outputs_data.txid
    ORDER BY tx_inputs_data.input_index, tx_outputs_data.output_index
    `);


    if (queryResult.rows.length === 0) {
        return error(404, 'Transaction not found');
    }

    const [transaction] = processTransactions(queryResult, true);

    // transaction.confirmations = transaction.max_height - transaction.block.height;
    // console.log(json(transaction))

    return json(transaction);
}
