<script lang="ts">
    import CopyButton from '$lib/components/CopyButton.svelte';
    import type { AddressStats } from '$lib/types/address';
    import { formatBTC } from '$lib/utils/formatters';
    import '$lib/styles/BlockHeader.css';

    export let address: string;
    export let stats: AddressStats;

</script>

<div class="block-container">
    <div class="block-header">
        <h1 class="block-title">Address</h1> 
        <div class="flex items-center gap-2">
            <span class="block-hash">{address}</span>
            <CopyButton value={address} />
        </div>
    </div>
    <div class="block-details">
        <div class="detail-item">
            <span class="detail-value">{formatBTC(stats.balance)}</span>
            <span class="detail-label">Final Balance</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{formatBTC(stats.totalReceived)}</span>
            <span class="detail-label">Total Received</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{formatBTC(stats.totalSpent)}</span>
            <span class="detail-label">Total Sent</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{stats.txCount.toLocaleString()}</span>
            <span class="detail-label">Total Transactions</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{stats.receivedCount.toLocaleString()}</span>
            <span class="detail-label">Receiving Transactions</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{stats.spentCount.toLocaleString()}</span>
            <span class="detail-label">Spending Transactions</span>
        </div>
    </div>
</div>
