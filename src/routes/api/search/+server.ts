import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler, redirect } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
import { spaces, spacesHistory, blocks, transactions } from '$lib/schema';

export const GET: RequestHandler = async function ({ request, url }) {
    const search = url.searchParams.get('q');
    if (!search)
        return json([]);

    //if 64 hex symbols look for a tx or block:
    let result
    const hashRegexp = /^[a-fA-F0-9]{64}$/;
    if (hashRegexp.test(search)) {

    const txid = Buffer.from(search, 'hex')
    const transaction = await db.query.transactions.findFirst({
        where: sql`${transactions.txid} = ${txid}`,
    })
    console.log("found a transaction", transaction)
        redirect(303, '/tx/{txid}')
    // result = await db.select().from(spaces).where(sql`similarity(${spaces.name}, ${search}) > 0`).orderBy(sql`similarity(${spaces.name}, ${search}) desc`).limit(3);
    }

    // const blockResult 

    // const result = await db.select().from(spaces).where(sql`similarity(${spaces.name}, ${search}) > 0`).orderBy(sql`similarity(${spaces.name}, ${search}) desc`).limit(3);

    return json(result);
}
