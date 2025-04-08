import db from '$lib/db';
import { json } from '@sveltejs/kit';
import { type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

export const GET: RequestHandler = async function () {
    try {
        const queryResult = await db.execute(sql`
            SELECT 
                root_anchor,
                hash,
                height
            FROM blocks
            WHERE root_anchor IS NOT NULL
            ORDER BY height DESC LIMIT 120;
        `);
        
        if (!queryResult.rows || queryResult.rows.length === 0) {
            return json([]);
        }

        // Transform the data to the required format
        const formattedAnchors = queryResult.rows.map(row => ({
            root: row.root_anchor.toString('hex'),
            block: {
                hash: row.hash.toString('hex'),
                height: row.height
            }
        }));
        
        return json(formattedAnchors);
    } catch (error) {
        console.error('Error fetching root anchors:', error);
        return json({ error: 'Failed to fetch root anchors' }, { status: 500 });
    }
};
