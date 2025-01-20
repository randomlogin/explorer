<script lang="ts">
    import TransactionLink from '$lib/components/Transaction/TransactionLink.svelte';
    import TransactionSpaces from '$lib/components/Transaction/TransactionSpaces.svelte';
    import TruncatableText from '$lib/components/TruncatableText.svelte';
    import AddressLink from '$lib/components/AddressLink.svelte';
    import CopyButton from '$lib/components/CopyButton.svelte';
    import { formatBTC } from '$lib/utils/formatters';
    import '$lib/styles/link.css';
    
    export let transaction;
    export let showAllInputsOutputs = false;
    export let maxInputsOutputs = showAllInputsOutputs ? Infinity : 5;
</script>

{#if transaction.vmetaouts?.length > 0}
    <TransactionSpaces vmetaouts={transaction.vmetaouts} />
{/if}

<div class="transaction-io">
    <div class="io-section inputs">
        <h2 class="section-title">Inputs</h2>
        <div class="section-content">
            {#each transaction.inputs.slice(0, maxInputsOutputs) as input, index}
                <div class="item-wrapper">
                    <div class="item">
                        {#if input.coinbase}
                            <span class="coinbase-input">Coinbase input</span>
                        {:else}
                            <div class="input-details">
                                <div class="input-left">
                                    {#if input.sender_address}
                                        <div class="address">
                                            <span class="text">Address</span>
                                            <div class="truncate-wrapper">
                                                <div class="content-wrapper">
                                                    <AddressLink address={input.sender_address} truncate={true} minLength={8} />
                                                </div>
                                                <CopyButton value={input.sender_address} size={14} />
                                            </div>
                                        </div>
                                    {/if}
                                    <div class="transaction-status">
                                        <span class="label">Created in:</span>
                                        <div class="truncate-wrapper">
                                            <div class="content-wrapper">
                                                <TransactionLink txid={input.hash_prevout} truncate={true} minLength={8}/>
                                            </div>
                                        </div>
                                    </div>
                                    {#if Array.isArray(input.txinwitness) && input.txinwitness.length > 0}
                                        <details class="witness-details">
                                            <summary class="witness-summary">Witness</summary>
                                            <div class="witness-content">
                                                {#each input.txinwitness as witness, i}
                                                    <div class="witness-item">
                                                        <span class="witness-index">#{i}</span>
                                                        <span class="witness-data">{witness}</span>
                                                    </div>
                                                {/each}
                                            </div>
                                        </details>
                                    {/if}
                                </div>
                                <div class="input-right">
                                    <span class="value">{formatBTC(input.prev_value)}</span>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
                {#if index < transaction.inputs.slice(0, maxInputsOutputs).length - 1}
                    <div class="separator"></div>
                {/if}
            {/each}
            {#if transaction.inputs.length > maxInputsOutputs}
                <div class="more-items">... other inputs omitted</div>
            {/if}
        </div>
    </div>

    <div class="io-section outputs">
        <h2 class="section-title">Outputs</h2>
        <div class="section-content">
            {#each transaction.outputs.slice(0, maxInputsOutputs) as output, index}
                <div class="item-wrapper">
                    <div class="output-item">
                        <div class="output-details">
                            <div class="output-left">
                                <div class="address">
                                    <span class="text">
                                        {output.address ? 'Address' : 'Scriptpubkey'}
                                    </span>
                                    <div class="truncate-wrapper">
                                        <div class="content-wrapper">
                                            {#if output.address}
                                                <AddressLink address={output.address} truncate={true} minLength={8}/>
                                            {:else}
                                                <TruncatableText text={output.scriptpubkey} />
                                            {/if}
                                        </div>
                                        <CopyButton value={output.address || output.scriptpubkey} size={14} />
                                    </div>
                                </div>
                                <div class="transaction-status">
                                    <span class="label">
                                        {#if output.spender}
                                            
                                        <span class="label">Spent in:</span>
                                         <div class="truncate-wrapper">
                                            <div class="content-wrapper">
                                                <TransactionLink txid={output.spender.txid} truncate={true} minLength={8} />
                                            </div>
                                        </div>
                                        {:else}
                                            Unspent
                                        {/if}
                                    </span>
                                </div>
                            </div>
                            <div class="output-right">
                                <span class="value">{formatBTC(output.value)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {#if index < transaction.outputs.slice(0, maxInputsOutputs).length - 1}
                    <div class="separator"></div>
                {/if}
            {/each}
            {#if transaction.outputs.length > maxInputsOutputs}
                <div class="more-items">... other outputs omitted</div>
            {/if}
        </div>
    </div>
</div>

<style>
    .transaction-io {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--space-6);
        margin-top: var(--space-2);
        width: 100%;
    }

    .io-section {
        min-width: 0;
    }

    .section-title {
        font-size: var(--text-xl);
        margin-bottom: var(--space-2);
        padding-bottom: var(--space-2);
        border-bottom: var(--border-width-1) solid var(--text-muted);
    }

    .section-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }

    .item-wrapper {
        margin-bottom: 0;
    }

    .item,
    .output-item {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .input-details,
    .output-details {
        display: flex;
        justify-content: space-between;
        gap: var(--space-2);
        width: 100%;
        min-width: 0;
        align-items: baseline;
    }

    .input-left,
    .output-left {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
        flex: 1;
    }

    .input-right,
    .output-right {
        flex-shrink: 0;
    }

    .address,
    .transaction-status {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--space-2);
        align-items: baseline;
        min-width: 0;
    }

    .label {
        white-space: nowrap;
        color: var(--text-muted);
        font-size: var(--text-base);
    }

    .truncate-wrapper {
        display: inline-flex;
        align-items: center;
        min-width: 0;
        max-width: 100%;
    }

    .content-wrapper {
        min-width: 0;
        margin-right: var(--space-2);
    }

    .content-wrapper :global(.link-container) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
        font-size: var(--text-base);
    }

    .value {
        color: var(--color-primary);
        font-weight: 600;
        white-space: nowrap;
    }

    .separator {
        height: 1px;
        background-color: var(--border-color);
        margin: var(--space-2) 0;
    }

    .more-items {
        color: var(--text-muted);
        font-style: italic;
    }

    .witness-details {
        margin-top: var(--space-2);
        font-size: var(--text-sm);
    }

    .witness-summary {
        cursor: pointer;
        padding: var(--space-2);
        color: var(--text-muted);
        background: var(--bg-primary);
        border-radius: var(--border-radius);
    }

    .witness-content {
        margin-top: var(--space-2);
        padding: var(--space-2);
        background: var(--bg-primary);
        border-radius: var(--border-radius);
        overflow-x: auto;
    }

    .witness-item {
        display: flex;
        gap: var(--space-2);
        padding: var(--space-2) 0;
    }

    .witness-index {
        color: var(--text-muted);
        flex-shrink: 0;
    }

    .witness-data {
        font-family: var(--font-mono);
        word-break: break-all;
        font-size: var(--text-sm);
    }

    @media (max-width: 768px) {
        .transaction-io {
            grid-template-columns: 1fr;
            gap: var(--space-2);
        }

        .input-details,
        .output-details {
            flex-direction: column;
            gap: var(--space-2);
        }

        .value {
            margin-top: var(--space-2);
        }

        .witness-content {
            max-width: 100%;
        }
    }
</style>
