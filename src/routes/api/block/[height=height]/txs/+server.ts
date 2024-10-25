import db from '$lib/db';
import { json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { processTransactions } from '$routes/api/block/txs';

export const GET: RequestHandler = async function ({ url, params }) {
    const startTime = performance.now();
    let limit = parseInt(url.searchParams.get('limit') || '25');
    if (limit > 50) {
        limit = 50
    }
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const input_limit = 10
    const input_offset = 0
    const output_limit = 10
    const output_offset = 0

    const queryResult = await db.execute(sql`
    WITH limited_transactions AS (
    SELECT
        transactions.txid,
        transactions.block_hash,
        transactions.tx_hash,
        transactions.version,
        transactions.size,
        transactions.index,
        transactions.vsize,
        transactions.weight,
        transactions.locktime,
        transactions.fee
    FROM transactions
    WHERE transactions.block_hash = (
        SELECT hash FROM blocks WHERE blocks.height = ${params.height}
    )
    LIMIT ${limit} OFFSET ${offset}),
    limited_tx_inputs AS (
        SELECT
            tx_inputs.txid,
            tx_inputs.index AS input_index,
            tx_inputs.hash_prevout AS input_hash_prevout,
            tx_inputs.index_prevout AS input_index_prevout,
            tx_inputs.sequence AS input_sequence,
            tx_inputs.coinbase AS input_coinbase,
            tx_inputs.txinwitness AS input_txinwitness,
            ROW_NUMBER() OVER (PARTITION BY tx_inputs.txid ORDER BY tx_inputs.index ASC) AS rn
        FROM tx_inputs
        WHERE tx_inputs.txid IN (SELECT txid FROM limited_transactions)
        ORDER BY tx_inputs.index
    ),
    limited_tx_outputs as (
        select
            tx_outputs.txid,
            tx_outputs.index as output_index,
            tx_outputs.value as output_value,
            tx_outputs.scriptpubkey as output_scriptpubkey,
            row_number() over (partition by tx_outputs.txid order by tx_outputs.index asc) as rn
        from tx_outputs
        where tx_outputs.txid in (select txid from limited_transactions)
        order by tx_outputs.index ASC
    ),
    limited_vmetaouts AS (
        SELECT
            vmetaouts.txid,
            vmetaouts.tx_index,
            vmetaouts.outpoint_txid,
            vmetaouts.outpoint_index,
            vmetaouts.name,
            vmetaouts.burn_increment,
            vmetaouts.covenant_action,
            vmetaouts.claim_height,
            vmetaouts.expire_height,
            ROW_NUMBER() OVER (PARTITION BY vmetaouts.txid ORDER BY vmetaouts.tx_index ASC) AS rn
        FROM vmetaouts
        WHERE vmetaouts.txid IN (SELECT txid FROM limited_transactions)
    )
    SELECT
        limited_transactions.txid AS txid,
        limited_transactions.tx_hash AS tx_hash,
        limited_transactions.version AS tx_version,
        limited_transactions.size AS tx_size,
        limited_transactions.index AS tx_index,
        limited_transactions.vsize AS tx_vsize,
        limited_transactions.weight AS tx_weight,
        limited_transactions.locktime AS tx_locktime,
        limited_transactions.fee AS tx_fee,

        limited_tx_inputs.input_index AS input_index,
        limited_tx_inputs.input_hash_prevout AS input_hash_prevout,
        limited_tx_inputs.input_index_prevout AS input_index_prevout,
        limited_tx_inputs.input_sequence AS input_sequence,
        limited_tx_inputs.input_coinbase AS input_coinbase,
        limited_tx_inputs.input_txinwitness AS input_txinwitness,

        limited_tx_outputs.output_index AS output_index,
        limited_tx_outputs.output_value AS output_value,
        limited_tx_outputs.Output_scriptpubkey AS output_scriptpubkey

    FROM limited_transactions
LEFT JOIN limited_tx_inputs ON limited_tx_inputs.txid = limited_transactions.txid AND limited_tx_inputs.rn BETWEEN ${input_offset + 1} AND ${input_offset + input_limit}
LEFT JOIN limited_tx_outputs ON limited_tx_outputs.txid = limited_transactions.txid AND limited_tx_outputs.rn BETWEEN ${output_offset + 1} AND ${output_offset + output_limit}
    LEFT JOIN limited_vmetaouts ON limited_vmetaouts.txid = limited_tx_outputs.txid AND limited_vmetaouts.tx_index = limited_tx_outputs.output_index AND limited_vmetaouts.rn BETWEEN ${output_offset + 1} AND ${output_offset + output_limit}
  
ORDER BY limited_transactions.index;
    `);
    const txs = processTransactions(queryResult);

    const endTime = performance.now();
    const totalResponseTime = endTime - startTime;

    console.log(`GET request for block height ${params.height} with limit ${limit} - Total Response Time: ${totalResponseTime.toFixed(2)} ms`);
    return json(txs);
}
