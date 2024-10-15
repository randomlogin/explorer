import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { tx_inputs } from '$lib/schema';

export const GET: RequestHandler = async function ({ url }) {
    console.log("url in txind api", url)
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
        error(404, { error: "No txid provided" });
    }

    const ins = await db.query.tx_inputs.findMany({
        limit: limit,
        offset: offset,
        where: sql`${tx_inputs.txid} = ${txid}`,
        });

    if (!ins)
        return error(404, 'Txinputs not found');

    return json(ins);
}
