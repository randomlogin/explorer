import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const MARKETPLACE_URI = env.MARKETPLACE_URI || 'https://spaces.market/';

export const GET: RequestHandler = async function ({ params }) {
    const spaceName = params.name;

    if (!spaceName) {
        throw error(400, 'Space name is required');
    }

    let isListedInMarketplace = false;
    try {
        const response = await fetch(`${MARKETPLACE_URI}/api/space/${spaceName}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(2500)
        });
        isListedInMarketplace = response.ok;
    } catch {
        isListedInMarketplace = false;
    }

    return json({ is_listed_in_marketplace: isListedInMarketplace });
};
