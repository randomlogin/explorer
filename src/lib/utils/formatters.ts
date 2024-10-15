export function formatNumberWithSpaces(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const numberFormatter = {
    format: formatNumberWithSpaces
};

