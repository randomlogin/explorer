import type { PageLoad } from './$types';
import { API_ROUTES } from '$lib/routes';

export const load: PageLoad = async ({ fetch, params }) => {
    const [spaceHistoryResponse, statsResponse] = await Promise.all([
        fetch(API_ROUTES.space.history(params.name)),
        fetch(API_ROUTES.space.stats(params.name))
    ]);

    if (!spaceHistoryResponse.ok) {
        throw new Error(`Failed to fetch space history: ${spaceHistoryResponse.statusText}`);
    }

    if (!statsResponse.ok) {
        throw new Error(`Failed to fetch stats: ${statsResponse.statusText}`);
    }

    const spaceHistory = await spaceHistoryResponse.json();
    const stats = await statsResponse.json();

    return {
        items: spaceHistory.items,
        latest: spaceHistory.latest,
        pagination: spaceHistory.pagination,
        currentHeight: spaceHistory.currentHeight,
        stats
    };
};
