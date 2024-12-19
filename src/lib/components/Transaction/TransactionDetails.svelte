<script lang="ts">
    import TransactionLink from '$lib/components/Transaction/TransactionLink.svelte';
    import TransactionSpaces from '$lib/components/Transaction/TransactionSpaces.svelte';
    import AddressLink from '$lib/components/AddressLink.svelte';
    import { formatBTC } from '$lib/utils/formatters';
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
                                            Address <AddressLink address={input.sender_address} truncate={true}  />
                                        </div>
                                    {/if}
                                    <div class="transaction">
                                        Created in: <TransactionLink txid={input.hash_prevout} truncate={true} />
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
                    {#if index < transaction.inputs.slice(0, maxInputsOutputs).length - 1}
                        <div class="separator"></div>
                    {/if}
                </div>
            {/each}
            {#if transaction.inputs.length > maxInputsOutputs}
                <div class="more-items">... other inputs omitted </div>
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
                                    {#if output.address}
                                        Address <AddressLink address={output.address} truncate={true}  />
                                    {:else}
                                        <span class="font-mono">Scriptpubkey: {output.scriptpubkey.slice(0, 20)}...</span>
                                    {/if}
                                </div>
                                <div class="transaction">
                                    {#if output.spender}
                                        Spent in: <TransactionLink txid={output.spender.txid} truncate={false} maxLength={30} />
                                    {:else}
                                        Unspent
                                    {/if}
                                </div>
                            </div>
                            <div class="output-right">
                                <span class="value">{formatBTC(output.value)}</span>
                            </div>
                        </div>
                    </div>
                    {#if index < transaction.outputs.slice(0, maxInputsOutputs).length - 1}
                        <div class="separator"></div>
                    {/if}
                </div>
            {/each}
            {#if transaction.outputs.length > maxInputsOutputs}
                <div class="more-items">... other outputs omitted</div>
            {/if}
        </div>
    </div>
</div>
<style>
    @import '$lib/styles/variables.css';


    .section-title {
        font-size: var(--text-xl);
        margin-bottom: var(--space-4);
        padding-bottom: var(--space-2);
        border-bottom: var(--border-width-1) solid var(--text-muted);
    }

    .section-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .item, .output-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .output-item {
        display: flex;
        flex-direction: column;
    }

    .output-details {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
    }

    .input-details, .output-details {
        display: flex;
        width: 100%;
        gap: var(--space-4);
    }

    .separator {
        display: none;
    }

    .transaction-io {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-6);
        margin-top: var(--space-10);
    }

    .io-section {
        flex: 1;
    }


    .more-items {
        color: var(--text-muted);
        margin-top: var(--space-2);
    }

    .item-wrapper {
        margin-bottom: var(--space-4);
    }

    .item-wrapper:last-child {
        margin-bottom: 0;
    }

    @media (max-width: 768px) {
        .transaction-io {
            grid-template-columns: 1fr;
        }
    }

    .input-left,
    .output-left {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        flex: 1;
        min-width: 0;
        overflow: hidden;
    }
    .address,
    .transaction {
        display: flex;
        gap: var(--space-2);
        align-items: center;
        min-width: 0;
        width: 100%; /* Take full width */
        white-space: nowrap;
        overflow: hidden;
    }



    .address {
        font-size: var(--text-base);
    }

    .transaction {
        font-size: var(--text-sm);
        color: var(--text-muted);
    }

    /* Add these new styles to handle the link text overflow */
    :global(.address a),
    :global(.transaction a) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0; /* Enable truncation */
    }


    .output-details {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: var(--space-4);
        align-items: flex-start; /* Align items to top */
    }

    /* Label text (Address:, Tx:, etc) */
    .address > :first-child {
        flex-shrink: 0; /* Don't shrink the label */
    }


    .value {
        color: var(--color-primary);
        font-weight: 600;
        white-space: nowrap;
        text-align: right; /* Ensure right alignment */
    }

    .witness-details {
        margin-top: var(--space-2);
        font-size: var(--text-sm);
    }

    .witness-summary {
        cursor: pointer;
        padding: var(--space-2);
        color: var(--text-muted);
        border: var(--border-width-1) solid var(--border-color);
        border-radius: var(--border-radius);
    }

    .witness-summary:hover {
        background-color: var(--bg-hover);
    }

    .witness-content {
        margin-top: var(--space-2);
        padding: var(--space-3);
        background-color: var(--bg-subtle);
        border-radius: var(--border-radius);
    }

    .witness-item {
        display: flex;
        gap: var(--space-2);
        padding: var(--space-1) 0;
        overflow-x: auto;
    }

    .witness-index {
        color: var(--text-muted);
        flex-shrink: 0;
    }

    .witness-data {
        font-family: var(--font-mono);
        word-break: break-all;
    }

        .witness-empty {
        color: var(--text-muted);
        font-style: italic;
    }

</style>
