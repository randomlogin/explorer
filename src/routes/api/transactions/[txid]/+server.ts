import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { processTransactions } from '$lib/utils/transaction-processor';

export const GET: RequestHandler = async function ({ params }) {
    const txid = Buffer.from(params.txid, 'hex');

    // Get transaction with aggregate data and Spaces protocol metadata
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
            transactions.input_count,
            transactions.output_count,
            transactions.total_output_value,
            blocks.time AS block_time,
            blocks.height AS block_height,
            blocks.hash AS block_hash,
            blocks.orphan AS block_orphan,
            (SELECT COALESCE(MAX(height), -1) FROM blocks)::integer AS max_height
        FROM transactions
        JOIN blocks ON transactions.block_hash = blocks.hash
        WHERE transactions.txid = ${txid}
        ORDER by block_height DESC
        LIMIT 1
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
    LEFT JOIN tx_vmetaout ON transaction_data.txid = tx_vmetaout.txid
    `);

    if (queryResult.rows.length === 0) {
        return error(404, 'Transaction not found');
    }

    const [transaction] = processTransactions(queryResult);

    return json(transaction);
}
