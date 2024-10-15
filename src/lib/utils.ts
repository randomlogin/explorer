import { bech32m } from 'bech32';
import { Buffer } from 'buffer';
import bs58 from 'bs58';
import { PUBLIC_BTC_NETWORK } from "$env/static/public";

export function calculateTimeRemaining(targetHeight: number, currentHeight: number): string {
    const BLOCK_TIME_MINUTES = 10;

    if (targetHeight <= currentHeight) {
        return 0;
    }

    const remainingBlocks = targetHeight - currentHeight;
    const totalMinutesRemaining = remainingBlocks * BLOCK_TIME_MINUTES;

    const days = Math.floor(totalMinutesRemaining / (24 * 60));
    const hours = Math.floor((totalMinutesRemaining % (24 * 60)) / 60);
    const minutes = totalMinutesRemaining % 60;

    return `${days}d ${hours}h ${minutes}m`;
}

export function formatDuration(seconds: number): string {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    let result = '';
    if (days > 0) result = `${days} day${days > 1 ? 's' : ''}`;
    else if (hours > 0) result = `${hours} hour${hours > 1 ? 's' : ''}`;
    else result = `${minutes} minute${minutes > 1 ? 's' : ''} `;

    return result;
}

export function decodeScriptPubKeyToTaprootAddress(scriptPubKey: Buffer, network = 'mainnet') {
    if (scriptPubKey.length !== 34 || scriptPubKey[0] !== 0x51 || scriptPubKey[1] !== 0x20) {
        return null;
    }
    const pubkeyBytes = scriptPubKey.slice(2);
    const hrp = network === 'mainnet' ? 'bc' : 'tb';
    const pubkeyBits = bech32m.toWords(pubkeyBytes);
    return bech32m.encode(hrp, [1].concat(pubkeyBits));
}

export function parseP2PKHScriptPubKey(scriptPubKey: Buffer) {
    if (scriptPubKey.length !== 25 || scriptPubKey[0] !== 0x76 || scriptPubKey[1] !== 0xa9 || scriptPubKey[2] !== 0x14 || scriptPubKey[23] !== 0x88 || scriptPubKey[24] !== 0xac) {
        return null;
    }
    const pubKeyHash = scriptPubKey.slice(3, 23);
    const prefix = PUBLIC_BTC_NETWORK === 'mainnet' ? 0x00 : 0x6f;
    const payload = Buffer.concat([Buffer.from([prefix]), pubKeyHash]);
    return bs58.encode(payload);
}

export function parseP2WPKH(scriptPubKey: Buffer) {
    if (scriptPubKey.length !== 22 || scriptPubKey[0] !== 0x00 || scriptPubKey[1] !== 0x14) {
        return null;
    }
    const pubKeyHash = scriptPubKey.slice(2);
    const words = bech32m.toWords(pubKeyHash);
    const prefix = PUBLIC_BTC_NETWORK === 'mainnet' ? 'bc' : 'tb';
    return bech32m.encode(prefix, [0].concat(words));
}

export function parseP2WSH(scriptPubKey: Buffer) {
    if (scriptPubKey.length !== 34 || scriptPubKey[0] !== 0x00 || scriptPubKey[1] !== 0x20) {
        return null;
    }
    const scriptHash = scriptPubKey.slice(2);
    const words = bech32m.toWords(scriptHash);
    const prefix = PUBLIC_BTC_NETWORK === 'mainnet' ? 'bc' : 'tb';
    return bech32m.encode(prefix, [0].concat(words));
}

// Remove or comment out this function as it's not needed
// function publicKeyHashToAddress(publicKeyHash) {
//     const prefix = 'bc'; // 'bc' for mainnet; use 'tb' for testnet
//     const words = bech32m.toWords(publicKeyHash);
//     return bech32m.encode(prefix, 0x00, words); // 0x00 is the version for P2WPKH
// }

