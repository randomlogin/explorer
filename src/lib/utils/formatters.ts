export function formatNumberWithSpaces(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const numberFormatter = {
    format: formatNumberWithSpaces
};

export function getActionColor(action: string): string {
    switch (action) {
        case 'RESERVE': return 'text-blue-500';
        case 'BID': return 'text-green-500';
        case 'TRANSFER': return 'text-purple-500';
        case 'ROLLOUT': return 'text-yellow-500';
        case 'REVOKE': return 'text-red-500';
        default: return 'text-gray-500';
    }
}

export function getHighestBid(vmetaouts): number {
    // Find the last rollout
    const lastRollout = vmetaouts
    .filter(v => v.action === 'ROLLOUT')
    .sort((a, b) => b.block_height - a.block_height)[0];

    // If no rollout, get highest bid from all bids
    if (!lastRollout) {
        return Math.max(0, ...vmetaouts .filter(v => v.action === 'BID') .map(v => Number(v.total_burned ?? 0)));
    }

    // Get the last bid before rollout and all bids after
    const relevantBids = vmetaouts
    .filter(v => v.action === 'BID' && (v.block_height > lastRollout.block_height ||
                                        v === vmetaouts .filter(bid => bid.action === 'BID' && bid.block_height < lastRollout.block_height)
    .sort((a, b) => b.block_height - a.block_height)[0]));

    return Math.max(0, ...relevantBids.map(v => Number(v.total_burned ?? 0)));
}



export function calculateTimeRemaining(targetHeight: number, currentHeight: number): string {
    const BLOCK_TIME_MINUTES = 10;

    if (targetHeight <= currentHeight) {
        return "Recently";
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

export function formatBTC(satoshis: bigint | undefined): string {
    if (satoshis === undefined || satoshis === null) {
        return '0 sat';
    }

    const BTC_THRESHOLD = 10000n;

    if (satoshis >= BTC_THRESHOLD) {
        const btc = Number(satoshis) / 100000000;
        const btcString = btc.toString();
        const [whole, decimal] = btcString.split('.');
        if (!decimal) {
            return `${whole} BTC`;
        }

        // Find last non-zero digit
        const lastSignificantIndex = decimal.split('').reverse() .findIndex(char => char !== '0');

        if (lastSignificantIndex === -1) {
            // No significant digits after decimal
            return `${whole} BTC`;
        }

        // Calculate required decimal places (minimum 3, maximum 8)
        const significantDecimals = Math.max( 3, Math.min(8, decimal.length - lastSignificantIndex));

        return btc.toLocaleString('en-US', { minimumFractionDigits: significantDecimals, maximumFractionDigits: significantDecimals }) + ' BTC';
    }

    return satoshis.toLocaleString() + ' sat';
}
