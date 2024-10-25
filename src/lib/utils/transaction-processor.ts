import type { Transaction, TransactionInput, TransactionOutput } from '$lib/types/transaction';
import { parseAddress } from '$lib/utils/address-parsers';

export function createTransaction(row: any): Transaction {
    return {
        txid: row.txid.toString('hex'),
        tx_hash: row.tx_hash.toString('hex'),
        version: row.tx_version,
        size: row.tx_size,
        vsize: row.tx_vsize,
        weight: row.tx_weight,
        index: row.tx_index,
        locktime: row.tx_locktime,
        fee: row.tx_fee,
        block: {
            height: row.block_height,
            time: row.block_time,
            hash: row.block_hash ? row.block_hash.toString('hex') : undefined
        },
        confirmations: row.max_height - row.block_height + 1,
        inputs: [],
        outputs: []
    };
}

export function createTransactionInput(row: any): TransactionInput {
    return {
        index: row.input_index,
        hash_prevout: row.input_hash_prevout ? row.input_hash_prevout.toString('hex') : null,
        index_prevout: row.input_index_prevout,
        sequence: row.input_sequence,
        coinbase: row.input_coinbase ? row.input_coinbase.toString('hex') : null,
        txinwitness: row.input_txinwitness
    };
}

export function createTransactionOutput(row: any, parseAddresses: boolean): TransactionOutput {
    const scriptPubKey: Buffer = row.output_scriptpubkey;
    return {
        index: row.output_index,
        value: row.output_value,
        scriptpubkey: scriptPubKey ? scriptPubKey.toString('hex') : null,
        address: parseAddresses ? parseAddress(scriptPubKey) : null,
        spender: row.output_spender_txid ? {
            txid: row.output_spender_txid.toString('hex'),
            index: row.output_spender_index
        } : null
    };
}

export function processTransactions(queryResult: any, parseAddresses = true): Transaction[] {
    const txs: Transaction[] = [];
    const transactionMap = new Map<string, Transaction>();
    const inputMap = new Map<string, boolean>();
    const outputMap = new Map<string, boolean>();

    for (const row of queryResult.rows) {
        const txid = row.txid.toString('hex');
        let transaction = transactionMap.get(txid);
        
        if (!transaction) {
            transaction = createTransaction(row);
            transactionMap.set(txid, transaction);
            txs.push(transaction);
        }

        const inputKey = `${txid}_${row.input_index}`;
        const outputKey = `${txid}_${row.output_index}`;

        if (row.input_index !== null && !inputMap.has(inputKey)) {
            const input = createTransactionInput(row);
            transaction.inputs.push(input);
            inputMap.set(inputKey, true);
        }

        if (row.output_index !== null && !outputMap.has(outputKey)) {
            const output = createTransactionOutput(row, parseAddresses);
            transaction.outputs.push(output);
            outputMap.set(outputKey, true);
        }
    }

    return txs;
}