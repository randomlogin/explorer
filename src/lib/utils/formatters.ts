export function formatNumberWithSpaces(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const numberFormatter = {
    format: formatNumberWithSpaces
};


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
    // 0.0001 BTC = 10000 satoshis
    const BTC_THRESHOLD = 10000n;
    if (satoshis === undefined || satoshis === null) {
        return '0 sat';  // or return whatever default value makes sense
    }
    if (satoshis >= BTC_THRESHOLD) {
        const btc = Number(satoshis) / 100000000;
        return btc.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 }) + ' BTC';
        // return btc.toLocaleString('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 }) + ' BTC';
    } else {
        return satoshis.toLocaleString() + ' sat';
    }
}
