<script lang="ts">
    import dayjs from 'dayjs';
    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    dayjs.extend(LocalizedFormat);

    const numberFormatter = new Intl.NumberFormat();
    export let data;
</script>



<div class="flex flex-col grow p-5 px-10 pt-0 md:pt-5 md:px-16 gap-5">
    <div class="flex flex-wrap gap-2 items-center mb-7">
        <h1 class="font-bold text-3xl">Transaction</h1> 
        <span class="top-1 relative break-all text-zinc-500">#{data.txid}</span>
    </div>
    <div class="flex flex-wrap gap-10">
        <a href="/block/{data.block.height}">
            <div class="flex flex-col grow hover:opacity-90 gap-1">
                <span class='text-xl text-[#ec8e32] font-semibold'>{data.block.height}</span>
                <span class="text-gray-500">Block</span>
            </div>
        </a>
        <div class="flex flex-col grow gap-1">
            <span class='text-xl text-[#ec8e32] font-semibold'>{dayjs.unix(data.block.time).format('lll')}</span>
            <span class="text-gray-500">Time</span>
        </div>
        <div class="flex flex-col grow gap-1">
            <span class='text-xl text-[#ec8e32] font-semibold'>{data.version}</span>
            <span class="text-gray-500">Version</span>
        </div>
        <div class="flex flex-col grow gap-1">
            <span class='text-xl text-[#ec8e32] font-semibold'>{data.locktime}</span>
            <span class="text-gray-500">Lock Time</span>
        </div>
        <div class="flex flex-col grow gap-1">
            <span class='text-xl text-[#ec8e32] font-semibold'>{data.confirmations}</span>
            <span class="text-gray-500">Confirmations</span>
        </div>
    </div>
    <div class="flex flex-wrap gap-5 mt-10">
        <div class="flex flex-col basis-full lg:basis-[45%] grow">
            <h2 class="text-xl mb-1 pb-2 border-b border-b-gray-500">Inputs</h2>
            <div class="flex flex-col gap-4 p-5 pl-1">
                {#each data.tx_inputs ?? [] as tx_input}
                    <div class="flex items-center">
                        <svg class="w-[16px] h-[16px] mr-4" fill="#ec8e32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
                        {#if tx_input && tx_input.coinbase.length > 0}
                            <span class="text-gray-500">Coinbase</span>
                        {:else}
                            <a href="/tx/{tx_input.hash_prevout}" class="text-gray-500 hover:text-[#ec8e32]">{tx_input.hash_prevout}</a>
                        {/if}
                    </div>
                {/each}
            </div>

        </div>
        <div class="flex flex-col basis-full lg:basis-[45%] grow">
            <h2 class="text-xl mb-1 pb-2 border-b border-b-gray-500">Outputs</h2>
            <div class="flex flex-col gap-4 p-5">
                {#each data.tx_outputs as tx_output}
                    <div class="flex items-center">
                        <svg class="w-[16px] h-[16px] mr-4" fill="#ec8e32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
                        {#if tx_output.spender }
                            <span class="grow text-right">
                                <a href="/tx/{tx_output.spender}" class="text-gray-500 hover:text-[#ec8e32]">{tx_output.spender} {tx_output.value} satoshi</a>
                            </span>
                        {:else}
                            <span class="grow text-right">Unspent {tx_output.value} satoshi </span>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
