<script lang="ts">
    import TransactionLink from './TransactionLink.svelte';
    import { numberFormatter } from '$lib/utils/formatters';

    export let transaction;
    export let showAllInputsOutputs = false;

    const maxInputsOutputs = showAllInputsOutputs ? Infinity : 10;

    import './TransactionDetails.css';
</script>

<div class="transaction-details">
    <h2 class="transaction-id">
        <span class="transaction-id-link">
            <TransactionLink txid={transaction.txid} />
        </span>
    </h2>
    <div class="io-container">
        <div class="section">
            <h2 class="section-title">Inputs</h2>
            <div class="section-content input-content">
                {#each transaction.inputs.slice(0, maxInputsOutputs) as input}
                    <div class="item">
                        {#if input.coinbase}
                            <span class="text-gray-500">Coinbase input</span>
                        {:else}
                            <TransactionLink txid={input.hash_prevout} truncate={false} maxLength={30} />
                        {/if}
                    </div>
                {/each}
                {#if transaction.inputs.length > maxInputsOutputs}
                    <div class="more-items">... and {transaction.inputs.length - maxInputsOutputs} more</div>
                {/if}
            </div>
        </div>
        <svg class="arrow-icon" fill="#ec8e32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
        </svg>
        <div class="section">
            <h2 class="section-title">Outputs</h2>
            <div class="section-content">
                {#each transaction.outputs.slice(0, maxInputsOutputs) as output}
                    <div class="output-item">
                        <span class="output-address" title={output.address || output.scriptpubkey}>
                            {#if output.address}
                                {output.address}
                            {:else}
                                Scriptpubkey: {output.scriptpubkey.slice(0, 20)}...
                            {/if}
                        </span>
                        <span class="output-value">{numberFormatter.format(output.value)} satoshi</span>
                    </div>
                    {#if output.spender}
                        <div class="spender-info">
                            Spent in: <TransactionLink txid={output.spender.txid} outputIndex={output.spender.input_index} />
                        </div>
                    {/if}
                {/each}
                {#if transaction.outputs.length > maxInputsOutputs}
                    <div class="more-items">... and {transaction.outputs.length - maxInputsOutputs} more</div>
                {/if}
            </div>
        </div>
    </div>
</div>
