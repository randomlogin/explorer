export interface Transaction {
    txid: string;
    tx_hash: string;
    version: number;
    size: number;
    vsize: number;
    weight: number;
    index: number;
    locktime: number;
    fee: number;
    block: {
        height: number;
        time: number;
        hash?: string;
    };
    confirmations: number;
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
}

export interface TransactionInput {
    index: number;
    hash_prevout: string | null;
    index_prevout: number;
    sequence: number;
    coinbase: string | null;
    txinwitness: any; // Define more specific type if possible
}

// export interface TransactionOutput {
//     index: number;
//     value: number;
//     scriptpubkey: string | null;
//     address: string | null;
//     spender: {
//         txid: string;
//         index: number;
//     } | null;
// }

export type SpaceAction = {
    type: 'bid' | 'register' | 'transfer' | 'reserve';
    value?: number;  // for bids
    address?: string; // for transfers
    name: string;  // Name involved in the action
};

// Update TransactionOutput type to include optional space_action
export interface TransactionOutput {
    index: number;
    value: number;
    scriptpubkey: string | null;
    address: string | null;
    spender: {
        txid: string;
        index: number;
    } | null;
    space_action?: SpaceAction;
}
