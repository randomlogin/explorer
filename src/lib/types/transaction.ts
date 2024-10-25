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

export interface TransactionOutput {
    index: number;
    value: number;
    scriptpubkey: string | null;
    address: string | null;
    spender: {
        txid: string;
        index: number;
    } | null;
}

