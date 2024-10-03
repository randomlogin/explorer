import { type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch, locals, params }) => {
    const block = await fetch(`/api/blocks/${params.height}`).then(x => x.json());
    return block;
};
