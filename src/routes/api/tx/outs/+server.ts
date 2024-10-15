import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { tx_outputs } from '$lib/schema';

export const GET: RequestHandler = async function ({ url }) {
    let limit = parseInt(url.searchParams.get('limit') || '25');
    if (limit > 50) {
        limit = 50
    }
    const offset = parseInt(url.searchParams.get('offset') || '0');


    const txIdString = url.searchParams.get('txid')
    const hexRegex = /^[0-9a-fA-F]{64}$/;
    let txid;
    if (txIdString && hexRegex.test(txIdString)) {
        txid = Buffer.from(txIdString, 'hex')
    }

    if (!txid) {
        return error(404, "No txid provided" );
    }

    const outs = await db.query.tx_outputs.findMany({
        limit: limit,
        offset: offset,
        where: sql`${tx_outputs.txid} = ${txid}`,
        });

    if (!outs)
        return error(404, 'Txoutputs not found');

    return json(outs);
}
