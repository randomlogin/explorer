import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { processTransactions } from '$lib/utils/transaction-processor';

export const GET: RequestHandler = async function ({ params }) {
    const txid = Buffer.from(params.txid, 'hex');

    const startTime = performance.now();
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
        WHERE transactions.txid = ${txid} and blocks.orphan is false
        ORDER by block_height DESC
    ),
      tx_inputs_data AS (
        SELECT
            ti.txid,
            ti.index AS input_index,
            ti.hash_prevout AS input_hash_prevout,
            ti.index_prevout AS input_index_prevout,
            ti.sequence AS input_sequence,
            ti.coinbase AS input_coinbase,
            ti.scriptsig AS input_scriptsig,
            ti.txinwitness AS input_txinwitness,
            prev_out.scriptpubkey AS input_prev_scriptpubkey,
            prev_out.value AS input_prev_value
        FROM tx_inputs ti
        LEFT JOIN tx_outputs prev_out
            ON ti.hash_prevout = prev_out.txid
            AND ti.index_prevout = prev_out.index
        WHERE ti.txid = ${txid}
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
    ),
    tx_vmetaout AS (
        SELECT
            txid,
            value AS vmetaout_value,
            name AS vmetaout_name,
            reason AS vmetaout_reason,
            action AS vmetaout_action,
            burn_increment AS vmetaout_burn_increment,
            total_burned AS vmetaout_total_burned,
            claim_height AS vmetaout_claim_height,
            expire_height AS vmetaout_expire_height,
            script_error AS vmetaout_script_error,
            signature AS vmetaout_signature,
            scriptPubKey AS vmetaout_scriptPubKey
        FROM vmetaouts
        WHERE txid = ${txid} AND name is not null
    )

    SELECT
        transaction_data.*,
        tx_inputs_data.input_index,
        tx_inputs_data.input_hash_prevout,
        tx_inputs_data.input_index_prevout,
        tx_inputs_data.input_sequence,
        tx_inputs_data.input_coinbase,
        tx_inputs_data.input_txinwitness,
        tx_inputs_data.input_scriptsig,
        tx_inputs_data.input_prev_scriptpubkey,
        tx_inputs_data.input_prev_value,
        tx_outputs_data.output_index,
        tx_outputs_data.output_value,
        tx_outputs_data.output_scriptpubkey,
        tx_outputs_data.output_spender_txid,
        tx_outputs_data.output_spender_index,
        tx_vmetaout.vmetaout_value,
        tx_vmetaout.vmetaout_name,
        tx_vmetaout.vmetaout_action,
        tx_vmetaout.vmetaout_burn_increment,
        tx_vmetaout.vmetaout_total_burned,
        tx_vmetaout.vmetaout_claim_height,
        tx_vmetaout.vmetaout_expire_height,
        tx_vmetaout.vmetaout_script_error,
        tx_vmetaout.vmetaout_scriptPubKey,
        tx_vmetaout.vmetaout_signature,
        tx_vmetaout.vmetaout_reason
    FROM transaction_data
    LEFT JOIN tx_inputs_data ON transaction_data.txid = tx_inputs_data.txid
    LEFT JOIN tx_outputs_data ON transaction_data.txid = tx_outputs_data.txid
    LEFT JOIN tx_vmetaout ON transaction_data.txid = tx_vmetaout.txid
    ORDER BY tx_inputs_data.input_index, tx_outputs_data.output_index
    `);

    if (queryResult.rows.length === 0) {
        return error(404, 'Transaction not found');
    }

    const [transaction] = processTransactions(queryResult, true);

    const endTime = performance.now();
    const totalResponseTime = endTime - startTime;
    console.log(`in transaction by txid ${params.txid} Total Response Time: ${totalResponseTime.toFixed(2)} ms`);

    return json(transaction);
}
