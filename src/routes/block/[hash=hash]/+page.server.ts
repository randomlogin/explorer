import { fail, type Actions, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch, locals, params }) => {
    console.log("in block hash page server ts")
    const block = await fetch(`/api/blocks/${params.hash}`).then(x => x.json());
    return block;
};
