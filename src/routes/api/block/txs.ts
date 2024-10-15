import { PUBLIC_BTC_NETWORK } from "$env/static/public";
import { decodeScriptPubKeyToTaprootAddress, parseP2PKHScriptPubKey, parseP2WPKH, parseP2WSH } from '$lib/utils';

/**
 * Transforms raw transaction query results into structured transaction objects.
 * 
 * @param queryResult - Raw query result with transaction data
 * @param parseAddresses - Whether to parse and include addresses (default: true)
 * @returns Array of processed transaction objects with inputs and outputs
 */
export function processTransactions(queryResult, parseAddresses = true) {
    const txs = [];
    const transactionMap = new Map();
    const inputMap = new Map();
    const outputMap = new Map();

    for (const row of queryResult.rows) {
        const txid = row.txid.toString('hex');

        let transaction = transactionMap.get(txid);
        if (!transaction) {
            transaction = {
                txid: txid,
                tx_hash: row.tx_hash.toString('hex'),
                version: row.tx_version,
                size: row.tx_size,
                vsize: row.tx_vsize,
                weight: row.tx_weight,
                locktime: row.tx_locktime,
                fee: row.tx_fee,
                block: {
                    height: row.block_height,
                    time: row.block_time,
                    hash: row.block_hash ? row.block_hash.toString('hex') : null
                },
                confirmations: row.max_height - row.block_height + 1,
                inputs: [],
                outputs: []
            };
            transactionMap.set(txid, transaction);
            txs.push(transaction);
        }

        const inputKey = `${txid}_${row.input_index}`;
        const outputKey = `${txid}_${row.output_index}`;

        if (row.input_index !== null && !inputMap.has(inputKey)) {
            const input = {
                index: row.input_index,
                hash_prevout: row.input_hash_prevout ? row.input_hash_prevout.toString('hex') : null,
                index_prevout: row.input_index_prevout,
                sequence: row.input_sequence,
                coinbase: row.input_coinbase ? row.input_coinbase.toString('hex') : null,
                txinwitness: row.input_txinwitness
            };
            transaction.inputs.push(input);
            inputMap.set(inputKey, true);
        }

        if (row.output_index !== null && !outputMap.has(outputKey)) {
            const scriptPubKey: Buffer = row.output_scriptpubkey;

            let address = null;
            if (parseAddresses) {
                address = parseP2PKHScriptPubKey(scriptPubKey) ||
                          parseP2WPKH(scriptPubKey) ||
                          parseP2WSH(scriptPubKey) ||
                          decodeScriptPubKeyToTaprootAddress(scriptPubKey, PUBLIC_BTC_NETWORK);
            }

            const output = {
                index: row.output_index,
                value: row.output_value,
                scriptpubkey: scriptPubKey ? scriptPubKey.toString('hex') : null,
                address: address,
                spender: row.output_spender_txid ? {
                    txid: row.output_spender_txid.toString('hex'),
                    index: row.output_spender_index
                } : null
            };
            transaction.outputs.push(output);
            outputMap.set(outputKey, true);
        }
    }

    return txs;
}
