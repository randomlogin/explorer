import db from '$lib/db';
import { error, json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { blocks } from '$lib/schema';

export const GET: RequestHandler = async function ({ request, url, params }) {
    const stats = await db.query.blocks.findFirst()
    // const stats = await db.query.blockStats.findFirst();

    return json(stats ?? {});
};
