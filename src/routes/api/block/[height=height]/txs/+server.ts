import db from '$lib/db';
import { json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { processTransactions } from '$lib/utils/transaction-processor';
import { getBlockTransactions } from '$lib/utils/query';

import { addMockSpaceActions } from '$lib/utils/mockSpaceActions';


export const GET: RequestHandler = async function ({ url, params }) {
    const startTime = performance.now();
    let limit = parseInt(url.searchParams.get('limit') || '25');
    if (limit > 50) {
        limit = 50
    }
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const queryResult = await getBlockTransactions({
        db,
        blockIdentifier: { type: 'height', value: params.height },
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


    const txs = processTransactions(queryResult);

    const endTime = performance.now();
    const totalResponseTime = endTime - startTime;

    console.log(`GET request for block height ${params.height} with limit ${limit} - Total Response Time: ${totalResponseTime.toFixed(2)} ms`);
    // const enrichedTransactions = addMockSpaceActions(txs);
    return json(txs)
    // return json(enrichedTransactions);
}
