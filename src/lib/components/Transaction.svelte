<script lang="ts">
    import dayjs from 'dayjs';
    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    import TransactionDetails from './TransactionDetails.svelte';
    import { numberFormatter } from '$lib/utils/formatters';
    dayjs.extend(LocalizedFormat);

    export let data;

    import '$lib/styles/Transaction.css';
</script>

<div class="transaction-container">
    <div class="transaction-header">
        <h1 class="transaction-title">Transaction</h1> 
        <span class="transaction-id">{data.txid}</span>
    </div>
    <div class="transaction-details">
        <a href={`/block/${data.block.height}`} class="block-link">
            <div class="detail-item">
                <span class="detail-value">{data.block.height}</span>
                <span class="detail-label">Block</span>
            </div>
        </a>
        <div class="detail-item">
            <span class="detail-value">{dayjs.unix(data.block.time).format('MMM DD, HH:MM')}</span>
            <span class="detail-label">Time</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.version}</span>
            <span class="detail-label">Version</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.index}</span>
            <span class="detail-label">Index in the block</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.locktime}</span>
            <span class="detail-label">Lock Time</span>
        </div>
        <div class="detail-item">
            <span class="detail-value">{data.confirmations}</span>
            <span class="detail-label">Confirmations</span>
        </div>
    </div>
    <TransactionDetails transaction={data} showAllInputsOutputs={true} />
</div>
