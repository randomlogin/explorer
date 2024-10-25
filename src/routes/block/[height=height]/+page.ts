import type { PageLoad } from './$types';
import { blockStore } from '$lib/stores/blockStore';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, url, fetch }) => {
    const page = parseInt(url.searchParams.get('page') || '1');
    
    try {
        await blockStore.fetchBlockData(params.height, page, fetch);
        return {
            height: params.height,
            page
        };
    } catch (err) {
        throw error(404, {
            message: err.message
        });
    }
};
