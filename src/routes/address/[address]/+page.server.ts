import { error } from '@sveltejs/kit';
import {  type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch, params }) => {
    const transaction = await fetch(`/api/address/${params.address}`);
    if (transaction.status != 200)
        error(transaction.status, { message: 'Transaction not found'});
    
    const data = await transaction.json();

    return data;
};
