import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { processTransactions } from '$lib/utils/transaction-processor';
import { getBlockTransactions } from '$lib/utils/query';

export const GET: RequestHandler = async function ({ url, params }) {
    let limit = parseInt(url.searchParams.get('limit') || '25');
    if (limit > 50) {
        limit = 50
    }
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const block_hash = Buffer.from(params.hash, 'hex');

    if (!block_hash) {
        error(404, "No hash provided");
    }
    const queryResult = await getBlockTransactions({
        db,
        blockIdentifier: { type: 'hash', value: block_hash },
        pagination: {
            limit,
            offset,
            input_limit: 10,
            input_offset: 0,
            output_limit: 10,
            output_offset: 0,
            spaces_limit: 10,
            spaces_offset: 0
        }
    });

    if (!queryResult.rows) {
        return error(404, 'Block not found');
    }


    const txs = processTransactions(queryResult, true);

    return json(txs);
}
