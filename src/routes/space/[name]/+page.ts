import { error, type Actions, type ServerLoad } from '@sveltejs/kit';
export const load = async ({ fetch, params }) => {
    const page = 1; // Initial page
    const response = await fetch(`/api/spaces/${params.name}?page=${page}`);
    if (response.ok) {
        const data = await response.json();
        return {
            vmetaouts: data.items,
            pagination: data.pagination,
            currentHeight: data.items[0]?.current_height
        };
    }
    throw error(404, 'Space not found');
};
