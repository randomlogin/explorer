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
    const onlyWithSpaces = url.searchParams.get('onlyWithSpaces') === 'true';

    const { queryResult, totalCount } = await getBlockTransactions({
        db,
        blockIdentifier: { type: 'height', value: params.height },
        pagination: {
            limit,
            offset,
            spaces_limit: 10,
            spaces_offset: 0
        },
        onlyWithSpaces
    });

    if (!queryResult.rows || queryResult.rows.length === 0) {
        return error(404, 'Block not found');
    }

    const txs = processTransactions(queryResult);

    return json({ transactions: txs, totalCount })
}
