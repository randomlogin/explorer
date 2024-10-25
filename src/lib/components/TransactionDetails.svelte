<script lang="ts">
    import TransactionLink from './TransactionLink.svelte';
    export let transaction;
    export let showAllInputsOutputs = false;
    export let maxInputsOutputs = showAllInputsOutputs ? Infinity : 5;
    import { numberFormatter } from '$lib/utils/formatters';
    import '$lib/styles/TransactionDetails.css';

</script>

<div class="transaction-io">
    <div class="io-section inputs">
        <h2 class="section-title">Inputs</h2>
        <div class="section-content">
            {#each transaction.inputs.slice(0, maxInputsOutputs) as input, index}
                <div class="item-wrapper">
                    <div class="item">
                        {#if input.coinbase}
                            <span class="text-gray-500">Coinbase input</span>
                        {:else}
                            <TransactionLink txid={input.hash_prevout} truncate={false} maxLength={30} />
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
                            <span class="output-address" title={output.address || output.scriptpubkey}>
                                {#if output.address}
                                    {output.address}
                                {:else}
                                    Scriptpubkey: {output.scriptpubkey.slice(0, 20)}...
                                {/if}
                            </span>
                            <div class="output-value-container">
                                <span class="output-value">{numberFormatter.format(output.value)} satoshi</span>
                            </div>
                        </div>
                        {#if output.spender}
                            <div class="spender-info mt-2"> <!-- Ensure this is on a new line -->
                                Spent in: <TransactionLink txid={output.spender.txid} outputIndex={output.spender.index} />
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
            {#if transaction.outputs.length > maxInputsOutputs}
                <div class="more-items">... other outputs omitted</div>
            {/if}
        </div>
    </div>
</div>
