<script lang="ts">
    import dayjs from 'dayjs';

    import LocalizedFormat from 'dayjs/plugin/localizedFormat';
    dayjs.extend(LocalizedFormat);

    const numberFormatter = new Intl.NumberFormat();

    export let blockHeader;
</script>

<div class="flex flex-col grow p-5 px-10 pt-0 md:pt-5 md:px-16 gap-5">
    <div class="flex flex-wrap gap-2 items-center mb-7">
        <h1 class="font-bold text-3xl">Block</h1> 
        <span class="top-1 break-all relative text-gray-500">{blockHeader.hash}</span>
    </div>
    <div class="flex flex-wrap gap-10 mb-10">
        <div class="flex flex-col grow">
            <span class='text-xl text-[#ec8e32] font-semibold'>{blockHeader.height}</span>
            <span class="text-gray-500">Height</span>
        </div>
        <div class="flex flex-col grow">
            <span class='text-xl text-[#ec8e32] font-semibold'>{blockHeader.confirmations}</span>
            <span class="text-gray-500">Confirmations</span>
        </div>
        <div class="flex flex-col grow">
            <span class='text-xl text-[#ec8e32] font-semibold'>{dayjs.unix(blockHeader.time).format('MMM D, YYYY HH:mm ')}</span>
            <span class="text-gray-500">Time</span>
        </div>
        <div class="flex flex-col grow">
            <span class='text-xl text-[#ec8e32] font-semibold'>{blockHeader.difficulty}</span>
            <span class="text-gray-500">Difficulty</span>
        </div>
        <div class="flex flex-col grow">
            <span class='text-xl text-[#ec8e32] font-semibold'>{blockHeader.bits}</span>
            <span class="text-gray-500">Bits</span>
        </div>
        <div class="flex flex-col grow">
            <span class='text-xl text-[#ec8e32] font-semibold'>{blockHeader.nonce}</span>
            <span class="text-gray-500">Nonce</span>
        </div>
        <div class="flex flex-col grow">
            <span class='text-xl break-all text-[#ec8e32] font-semibold'>{blockHeader.hash_merkle_root}</span>
            <span class="text-gray-500">Merkle Root</span>
        </div>
        <div class="flex flex-col grow">
            <span class='text-xl break-all text-[#ec8e32] font-semibold'>{blockHeader.tx_count}</span>
            <span class="text-gray-500">Transactions</span>
        </div>
        <div class="flex flex-col grow">
            <span class='text-xl break-all text-[#ec8e32] font-semibold'>PLACEHOLDER</span>
            <span class="text-gray-500">Spaces actions</span>
        </div>
    </div>
</div>

