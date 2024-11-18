import { sql } from 'drizzle-orm';

interface BlockTxsQueryParams {
    db: DB;
    blockIdentifier: {
        type: 'hash' | 'height';
        value: string | number | Buffer;
    };
    pagination: {
        limit: number;
        offset: number;
        input_limit: number;
        input_offset: number;
        output_limit: number;
        output_offset: number;
        spaces_limit: number;
        spaces_offset: number;
    };
}


export async function getBlockTransactions({ db, blockIdentifier, pagination }: BlockTxsQueryParams) {
    const blockCondition = blockIdentifier.type === 'hash' ? sql`blocks.hash = ${blockIdentifier.value}` : sql`blocks.height = ${blockIdentifier.value}`;

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
        SELECT hash FROM blocks WHERE ${blockCondition}
    )
    LIMIT ${pagination.limit} OFFSET ${pagination.offset}),
    limited_tx_inputs AS (
        SELECT
            tx_inputs.txid,
            tx_inputs.index AS input_index,
            tx_inputs.hash_prevout AS input_hash_prevout,
            tx_inputs.index_prevout AS input_index_prevout,
            tx_inputs.sequence AS input_sequence,
            tx_inputs.coinbase AS input_coinbase,
            tx_inputs.txinwitness AS input_txinwitness,
            prev_out.scriptpubkey AS input_prev_scriptpubkey,
            prev_out.value AS input_prev_value,
            ROW_NUMBER() OVER (PARTITION BY tx_inputs.txid ORDER BY tx_inputs.index ASC) AS rn
        FROM tx_inputs 
        LEFT JOIN tx_outputs prev_out
            ON tx_inputs.hash_prevout = prev_out.txid
            AND tx_inputs.index_prevout = prev_out.index
        WHERE tx_inputs.txid IN (SELECT txid FROM limited_transactions)
        ORDER BY tx_inputs.index ASC
    ),
    limited_tx_outputs as (
        select
            tx_outputs.txid,
            tx_outputs.index as output_index,
            tx_outputs.value as output_value,
            tx_outputs.scriptpubkey as output_scriptpubkey,
            tx_outputs.spender_txid AS output_spender_txid,
            tx_outputs.spender_index AS output_spender_index,
            row_number() over (partition by tx_outputs.txid order by tx_outputs.index asc) as rn
        from tx_outputs
        where tx_outputs.txid in (select txid from limited_transactions)
        order by tx_outputs.index ASC
    ),
    limited_vmetaouts AS (
        select
            vmetaouts.txid as vmetaout_txid,
            vmetaouts.value as vmetaout_value,
            vmetaouts.name as vmetaout_name,
            vmetaouts.action as vmetaout_action,
            vmetaouts.burn_increment as vmetaout_burn_increment,
            vmetaouts.total_burned as vmetaout_total_burned,
            vmetaouts.claim_height as vmetaout_claim_height,
            vmetaouts.expire_height as vmetaout_expire_height,
            vmetaouts.script_error as vmetaout_script_error,
            ROW_NUMBER() OVER (PARTITION BY vmetaouts.txid ORDER BY vmetaouts.name ASC) AS rn
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
        limited_tx_inputs.input_prev_scriptpubkey,
        limited_tx_inputs.input_prev_value,

        limited_tx_outputs.output_index AS output_index,
        limited_tx_outputs.output_value AS output_value,
        limited_tx_outputs.output_scriptpubkey AS output_scriptpubkey,
        limited_tx_outputs.output_spender_txid,
        limited_tx_outputs.output_spender_index,

        limited_vmetaouts.vmetaout_value,
        limited_vmetaouts.vmetaout_name,
        limited_vmetaouts.vmetaout_action,
        limited_vmetaouts.vmetaout_burn_increment,
        limited_vmetaouts.vmetaout_total_burned,
        limited_vmetaouts.vmetaout_claim_height,
        limited_vmetaouts.vmetaout_expire_height,
        limited_vmetaouts.vmetaout_script_error

    FROM limited_transactions
    LEFT JOIN limited_tx_inputs ON limited_tx_inputs.txid = limited_transactions.txid AND limited_tx_inputs.rn BETWEEN ${pagination.input_offset + 1} AND ${pagination.input_offset + pagination.input_limit}
    LEFT JOIN limited_tx_outputs ON limited_tx_outputs.txid = limited_transactions.txid AND limited_tx_outputs.rn BETWEEN ${pagination.output_offset + 1} AND ${pagination.output_offset + pagination.output_limit}
    LEFT JOIN limited_vmetaouts ON limited_vmetaouts.vmetaout_txid = limited_transactions.txid AND limited_vmetaouts.rn BETWEEN ${pagination.spaces_offset} AND ${pagination.spaces_offset+pagination.spaces_limit}
    ORDER BY limited_transactions.index;
    `);
    return queryResult
}

export async function getAuctions_old({ 
    db, 
    ended = false, 
    limit = 20, 
    offset = 0,
    sortBy = 'height',
    sortDirection = 'desc'
}: AuctionQueryParams): Promise<PaginationResult> {
    // Construct the ORDER BY clause based on sortBy
    const orderByClause = {
        height: sql`height ${sql.raw(sortDirection)}, name ASC`,
        name: sql`name ${sql.raw(sortDirection)}`,
        total_burned: sql`total_burned ${sql.raw(sortDirection)}, height DESC`,
        value: sql`total_burned ${sql.raw(sortDirection)}, height DESC`,
        bid_count: sql`bid_count ${sql.raw(sortDirection)}, height DESC`
    }[sortBy];

    const queryResult = await db.execute(sql`
                                         WITH latest_rollouts AS (
    SELECT DISTINCT ON (vmetaouts.name)
        vmetaouts.*,
        blocks.height as rollout_height
    FROM vmetaouts
    JOIN blocks ON vmetaouts.block_hash = blocks.hash
    WHERE vmetaouts.action = 'ROLLOUT'
    ORDER BY vmetaouts.name, blocks.height DESC
),
non_ended_with_bids AS (
    SELECT
        lr.*,
        COALESCE(latest_bid.total_burned, lr.total_burned) as max_total_burned,
        COUNT(*) OVER() as total_count
    FROM latest_rollouts lr
    LEFT JOIN LATERAL (
        SELECT vmetaouts.total_burned
        FROM vmetaouts
        JOIN blocks ON vmetaouts.block_hash = blocks.hash
        WHERE vmetaouts.name = lr.name
        AND vmetaouts.action = 'BID'
        AND blocks.height >= lr.rollout_height
        ORDER BY blocks.height DESC
        LIMIT 1
    ) latest_bid ON true
    WHERE NOT EXISTS (
        SELECT 1
        FROM vmetaouts
        JOIN blocks ON vmetaouts.block_hash = blocks.hash
        WHERE vmetaouts.name = lr.name
        AND (vmetaouts.action = 'TRANSFER' or vmetaouts.action = 'REVOKE')
        AND blocks.height > lr.rollout_height
    )
    ORDER BY ${
        sortBy === 'total_burned' ? sql`COALESCE(latest_bid.total_burned, lr.total_burned) ${sql.raw(sortDirection)}, lr.rollout_height DESC` :
        sortBy === 'height' ? sql`lr.rollout_height ${sql.raw(sortDirection)}, lr.name ASC` :
        sql`lr.rollout_height DESC, lr.name ASC`
    }
    LIMIT ${limit}
    OFFSET ${offset}
),
latest_actions AS (
    SELECT DISTINCT ON (vmetaouts.name)
        vmetaouts.*,
        blocks.height,
        blocks.time,
        non_ended_with_bids.total_count,
        COUNT(*) OVER (PARTITION BY vmetaouts.name) as bid_count
    FROM vmetaouts
    JOIN blocks ON vmetaouts.block_hash = blocks.hash
    JOIN non_ended_with_bids ON vmetaouts.name = non_ended_with_bids.name
    WHERE (vmetaouts.action = 'BID' or vmetaouts.action = 'ROLLOUT')
    AND blocks.height >= non_ended_with_bids.rollout_height
    ORDER BY vmetaouts.name, blocks.height DESC
)
SELECT * FROM latest_actions
ORDER BY ${orderByClause}
`);

    // Rest of the processing remains the same
    const totalCount = queryResult.rows[0]?.total_count || 0;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalCount / limit);

    const processedResult = queryResult.rows.map(row => ({
        ...row,
        block_hash: row.block_hash.toString('hex'),
        txid: row.txid.toString('hex'),
    }));

    return {
        items: processedResult,
        pagination: {
            page,
            limit,
            total_items: totalCount,
            total_pages: totalPages,
            has_next: page < totalPages,
            has_prev: page > 1
        }
    };
}

export async function getAuctions({ 
    db, 
    ended = false, 
    limit = 20, 
    offset = 0,
    sortBy = 'height',
    sortDirection = 'desc'
}: AuctionQueryParams): Promise<PaginationResult> {
    // Construct the ORDER BY clause based on sortBy
    const orderByClause = {
        height: sql`height ${sql.raw(sortDirection)}, name ASC`,
        name: sql`name ${sql.raw(sortDirection)}`,
        total_burned: sql`total_burned ${sql.raw(sortDirection)}, height DESC`,
        value: sql`total_burned ${sql.raw(sortDirection)}, height DESC`,
        bid_count: sql`bid_count ${sql.raw(sortDirection)}, height DESC`
    }[sortBy];

    const queryResult = await db.execute(sql`
WITH latest_rollouts AS (
    SELECT DISTINCT ON (vmetaouts.name)
        vmetaouts.*,
        blocks.height as rollout_height FROM vmetaouts
    JOIN blocks ON vmetaouts.block_hash = blocks.hash
    WHERE vmetaouts.action = 'ROLLOUT'
    ORDER BY vmetaouts.name, blocks.height DESC
),
non_ended_with_stats AS (
    SELECT
        lr.*,
        COALESCE(bid_stats.bid_count, 0) as bid_count,
        COALESCE(bid_stats.max_total_burned, lr.total_burned) as max_total_burned,
        COUNT(*) OVER() as total_count
    FROM latest_rollouts lr
    LEFT JOIN (
        SELECT
            vmetaouts.name,
            COUNT(*) as bid_count,
            MAX(vmetaouts.total_burned) as max_total_burned
        FROM vmetaouts
        JOIN blocks ON vmetaouts.block_hash = blocks.hash
        WHERE vmetaouts.action = 'BID'
        GROUP BY vmetaouts.name
    ) bid_stats ON bid_stats.name = lr.name
    WHERE NOT EXISTS (
        SELECT 1
        FROM vmetaouts
        JOIN blocks ON vmetaouts.block_hash = blocks.hash
        WHERE vmetaouts.name = lr.name
        AND (vmetaouts.action = 'TRANSFER' or vmetaouts.action = 'REVOKE')
        AND blocks.height > lr.rollout_height
    )
    ORDER BY ${
        sortBy === 'total_burned' ? sql`max_total_burned ${sql.raw(sortDirection)}, rollout_height DESC` :
        sortBy === 'bid_count' ? sql`bid_count ${sql.raw(sortDirection)}, rollout_height DESC` :
        sql`rollout_height ${sql.raw(sortDirection)}, name ASC`
    }
    LIMIT ${limit}
    OFFSET ${offset}
),
latest_actions AS (
    SELECT DISTINCT ON (vmetaouts.name)
        vmetaouts.*,
        blocks.height,
        blocks.time,
        non_ended_with_stats.total_count,
        non_ended_with_stats.bid_count
    FROM vmetaouts
    JOIN blocks ON vmetaouts.block_hash = blocks.hash
    JOIN non_ended_with_stats ON vmetaouts.name = non_ended_with_stats.name
    WHERE (vmetaouts.action = 'BID' or vmetaouts.action = 'ROLLOUT')
    AND blocks.height >= non_ended_with_stats.rollout_height
    ORDER BY vmetaouts.name, blocks.height DESC
)
SELECT * FROM latest_actions
ORDER BY ${orderByClause}
`);

    // Rest of the processing remains the same
    const totalCount = queryResult.rows[0]?.total_count || 0;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalCount / limit);

    const processedResult = queryResult.rows.map(row => ({
        ...row,
        block_hash: row.block_hash.toString('hex'),
        txid: row.txid.toString('hex'),
    }));

    return {
        items: processedResult,
        pagination: {
            page,
            limit,
            total_items: totalCount,
            total_pages: totalPages,
            has_next: page < totalPages,
            has_prev: page > 1
        }
    };
}

export async function getEndedAuctions({ 
    db, 
    ended = false, 
    limit = 20, 
    offset = 0,
    sortBy = 'height',
    sortDirection = 'desc'
}: AuctionQueryParams): Promise<PaginationResult> {
    // Construct the ORDER BY clause based on sortBy
    const orderByClause = {
        height: sql`height ${sql.raw(sortDirection)}, name ASC`,
        name: sql`name ${sql.raw(sortDirection)}`,
        total_burned: sql`total_burned ${sql.raw(sortDirection)}, height DESC`,
        value: sql`total_burned ${sql.raw(sortDirection)}, height DESC`,
        bid_count: sql`bid_count ${sql.raw(sortDirection)}, height DESC`
    }[sortBy];

    const queryResult = await db.execute(sql`
WITH latest_rollouts AS (
    SELECT DISTINCT ON (vmetaouts.name)
        vmetaouts.*,
        blocks.height as rollout_height FROM vmetaouts
    JOIN blocks ON vmetaouts.block_hash = blocks.hash
    WHERE vmetaouts.action = 'ROLLOUT'
    ORDER BY vmetaouts.name, blocks.height DESC
),
non_ended_with_stats AS (
    SELECT
        lr.*,
        COALESCE(bid_stats.bid_count, 0) as bid_count,
        COALESCE(bid_stats.max_total_burned, lr.total_burned) as max_total_burned,
        COUNT(*) OVER() as total_count
    FROM latest_rollouts lr
    LEFT JOIN (
        SELECT
            vmetaouts.name,
            COUNT(*) as bid_count,
            MAX(vmetaouts.total_burned) as max_total_burned
        FROM vmetaouts
        JOIN blocks ON vmetaouts.block_hash = blocks.hash
        WHERE vmetaouts.action = 'BID'
        GROUP BY vmetaouts.name
    ) bid_stats ON bid_stats.name = lr.name
    WHERE EXISTS (
        SELECT 1
        FROM vmetaouts
        JOIN blocks ON vmetaouts.block_hash = blocks.hash
        WHERE vmetaouts.name = lr.name
        AND (vmetaouts.action = 'TRANSFER' or vmetaouts.action = 'REVOKE')
        AND blocks.height > lr.rollout_height
    )
    ORDER BY ${
        sortBy === 'total_burned' ? sql`max_total_burned ${sql.raw(sortDirection)}, rollout_height DESC` :
        sortBy === 'bid_count' ? sql`bid_count ${sql.raw(sortDirection)}, rollout_height DESC` :
        sql`rollout_height ${sql.raw(sortDirection)}, name ASC`
    }
    LIMIT ${limit}
    OFFSET ${offset}
),
latest_actions AS (
    SELECT DISTINCT ON (vmetaouts.name)
        vmetaouts.*,
        blocks.height,
        blocks.time,
        non_ended_with_stats.total_count,
        non_ended_with_stats.bid_count
    FROM vmetaouts
    JOIN blocks ON vmetaouts.block_hash = blocks.hash
    JOIN non_ended_with_stats ON vmetaouts.name = non_ended_with_stats.name
    WHERE (vmetaouts.action = 'BID' or vmetaouts.action = 'ROLLOUT')
    AND blocks.height >= non_ended_with_stats.rollout_height
    ORDER BY vmetaouts.name, blocks.height DESC
)
SELECT * FROM latest_actions
ORDER BY ${orderByClause}
`);

    // Rest of the processing remains the same
    const totalCount = queryResult.rows[0]?.total_count || 0;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(totalCount / limit);

    const processedResult = queryResult.rows.map(row => ({
        ...row,
        block_hash: row.block_hash.toString('hex'),
        txid: row.txid.toString('hex'),
    }));

    return {
        items: processedResult,
        pagination: {
            page,
            limit,
            total_items: totalCount,
            total_pages: totalPages,
            has_next: page < totalPages,
            has_prev: page > 1
        }
    };
}
