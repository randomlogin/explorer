import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import db from '$lib/db';
import { sql } from 'drizzle-orm';
import { addressToScriptPubKey } from '$lib/utils/address-parsers';
import { processTransactions } from '$lib/utils/transaction-processor';
import { addMockSpaceActionsToTransaction } from '$lib/utils/mockSpaceActions';

export async function GET({ params, url }) {
    const startTime = performance.now();
    try {
        const limit = Number(url.searchParams.get('limit')) || 25;
        const outputsLimit = 10
        const cursor = url.searchParams.get('cursor');

        const scriptPubKeyHex = addressToScriptPubKey(params.address);
        const scriptPubKey = Buffer.from(scriptPubKeyHex, 'hex');

        // First get the stats
        const statsResult = await db.execute(sql`
        WITH stats AS (
            SELECT
                COUNT(DISTINCT o.txid) as received_count,
                COALESCE(SUM(o.value), 0) as total_received
            FROM tx_outputs o
            JOIN blocks b ON o.block_hash = b.hash
            WHERE o.scriptPubKey = ${scriptPubKey}
            AND b.orphan = false
        ),
        spent_stats AS (
            SELECT
                COUNT(DISTINCT i.txid) as spent_count,
                COALESCE(SUM(o.value), 0) as total_spent
            FROM tx_outputs o
            JOIN tx_inputs i ON o.txid = i.hash_prevout AND o.index = i.index_prevout
            JOIN blocks b ON i.block_hash = b.hash
            WHERE o.scriptPubKey = ${scriptPubKey}
        )
        SELECT
            stats.received_count,
            stats.total_received,
            COALESCE(spent_stats.spent_count, 0) as spent_count,
            COALESCE(spent_stats.total_spent, 0) as total_spent,
            stats.total_received - COALESCE(spent_stats.total_spent, 0) as balance
        FROM stats
        LEFT JOIN spent_stats ON true
        `);

        const stats = statsResult.rows[0];

        // Then get paginated transactions
        let cursorCondition = sql``;
        if (cursor) {
            const [height, txIndex] = Buffer.from(cursor, 'base64')
                .toString()
                .split('-')
                .map(Number);
            cursorCondition = sql`AND (b.height < ${height} OR (b.height = ${height} AND t.index < ${txIndex}))`;
        }

        const queryResult = await db.execute(sql`
WITH address_transactions AS (
    SELECT DISTINCT 
        t.txid,
        t.block_hash,
        t.index as tx_index,
        b.height as block_height,
        b.time as block_time
    FROM (
        -- Receiving transactions
        SELECT o.block_hash, o.txid
        FROM tx_outputs o
        JOIN blocks b ON o.block_hash = b.hash
        WHERE o.scriptPubKey = ${scriptPubKey}
        AND b.orphan = false

        UNION

        -- Spending transactions
        SELECT i.block_hash, i.txid
        FROM tx_outputs o
        JOIN tx_inputs i ON o.txid = i.hash_prevout AND o.index = i.index_prevout
        JOIN blocks b ON i.block_hash = b.hash
        WHERE o.scriptPubKey = ${scriptPubKey}
        AND b.orphan = false
    ) AS addr_txs
    JOIN transactions t ON addr_txs.block_hash = t.block_hash AND addr_txs.txid = t.txid
    JOIN blocks b ON t.block_hash = b.hash
    WHERE TRUE ${cursorCondition}
    ORDER BY b.height DESC, t.index DESC
    LIMIT ${limit + 1}
),
transaction_data AS (
    SELECT
        t.txid,
        t.tx_hash,
        t.version AS tx_version,
        t.index AS tx_index,
        t.size AS tx_size,
        t.vsize AS tx_vsize,
        t.weight AS tx_weight,
        t.locktime AS tx_locktime,
        t.fee AS tx_fee,
        b.time AS block_time,
        b.height AS block_height,
        b.hash AS block_hash,
        (SELECT COALESCE(MAX(height), -1) FROM blocks)::integer AS max_height
    FROM address_transactions at
    JOIN transactions t ON at.txid = t.txid
    JOIN blocks b ON t.block_hash = b.hash
),
tx_inputs_data AS (
    SELECT DISTINCT ON (ranked_inputs.txid, input_index)
        ranked_inputs.txid,
        ranked_inputs.index AS input_index,
        ranked_inputs.hash_prevout AS input_hash_prevout,
        ranked_inputs.index_prevout AS input_index_prevout,
        ranked_inputs.sequence AS input_sequence,
        ranked_inputs.coinbase AS input_coinbase,
        ranked_inputs.txinwitness AS input_txinwitness,
        prev_out.scriptpubkey AS input_prev_scriptpubkey,
        prev_out.value AS input_prev_value
    FROM (
        SELECT *,
            ROW_NUMBER() OVER (PARTITION BY txid ORDER BY index) as rn
        FROM tx_inputs
        WHERE txid IN (SELECT txid FROM address_transactions)
    ) ranked_inputs
    LEFT JOIN tx_outputs prev_out
        ON ranked_inputs.hash_prevout = prev_out.txid
        AND ranked_inputs.index_prevout = prev_out.index
    WHERE rn <= ${outputsLimit}
),
tx_outputs_data AS (
    SELECT DISTINCT ON (txid, output_index)
        txid,
        index AS output_index,
        value AS output_value,
        scriptpubkey AS output_scriptpubkey,
        spender_txid AS output_spender_txid,
        spender_index AS output_spender_index
    FROM (
        SELECT *,
            ROW_NUMBER() OVER (PARTITION BY txid ORDER BY index) as rn
        FROM tx_outputs
        WHERE txid IN (SELECT txid FROM address_transactions)
    ) ranked_outputs
    WHERE rn <= ${outputsLimit}
)
SELECT
    transaction_data.*,
    tx_inputs_data.input_index,
    tx_inputs_data.input_hash_prevout,
    tx_inputs_data.input_index_prevout,
    tx_inputs_data.input_sequence,
    tx_inputs_data.input_coinbase,
    tx_inputs_data.input_txinwitness,
    tx_inputs_data.input_prev_value,
    tx_outputs_data.output_index,
    tx_outputs_data.output_value,
    tx_outputs_data.output_scriptpubkey,
    tx_outputs_data.output_spender_txid,
    tx_outputs_data.output_spender_index
FROM transaction_data
LEFT JOIN tx_inputs_data ON transaction_data.txid = tx_inputs_data.txid
LEFT JOIN tx_outputs_data ON transaction_data.txid = tx_outputs_data.txid
ORDER BY transaction_data.block_height DESC, transaction_data.tx_index DESC,
        tx_inputs_data.input_index, tx_outputs_data.output_index
        `);

        if (queryResult.rows.length === 0) {
            return json({
                stats: {
                    txCount: stats.received_count + stats.spent_count,
                    receivedCount: stats.received_count,
                    spentCount: stats.spent_count,
                    totalReceived: stats.total_received,
                    totalSpent: stats.total_spent,
                    balance: stats.balance
                },
                transactions: [],
                hasMore: false
            });
        }
        const hasMore = queryResult.rows.length > limit;
        const rows = hasMore ? queryResult.rows.slice(0, -1) : queryResult.rows;

        let nextCursor: string | undefined;
        if (hasMore) {
            const lastTx = rows[rows.length - 1];
            nextCursor = Buffer.from(`${lastTx.block_height}-${lastTx.tx_index}`).toString('base64');
        }

        const transactions = processTransactions(queryResult, true);
        const enrichedTransactions = transactions.map(addMockSpaceActionsToTransaction);
        const endTime = performance.now();
        const totalResponseTime = endTime - startTime;
        console.log(`in address Total Response Time: ${totalResponseTime.toFixed(2)} ms`);
        return json({
            address: params.address,
            stats: {
                txCount: Number(stats.received_count) + Number(stats.spent_count),
                receivedCount: Number(stats.received_count),
                spentCount: Number(stats.spent_count),
                totalReceived: stats.total_received,
                totalSpent: stats.total_spent,
                balance: stats.balance
            },
            transactions: enrichedTransactions,
            hasMore,
            nextCursor
        });

    } catch (err) {
        console.error('Error processing address transactions:', err);
        return error(500, 'Internal server error');
    }

}
