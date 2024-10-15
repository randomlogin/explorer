<script lang="ts">
  import { decodeScriptPubKeyToTaprootAddress, formatDuration } from "$lib/utils.js";
  import dayjs from "dayjs";
  import LocalizedFormat from "dayjs/plugin/localizedFormat";
  import { PUBLIC_BTC_NETWORK } from "$env/static/public";
  import Countdown from "$lib/components/Countdown.svelte";
  import { page } from '$app/stores';
  import TransactionLink from '$lib/components/TransactionLink.svelte';
  import './styles/SpacePage.css';
  dayjs.extend(LocalizedFormat);

  export let data;
  let space = data.space;
  let blockStats = data.blockStats;
  $: {
    if (data) {
      space = data.space;
      blockStats = data.blockStats;
    }
  }

  const numberFormatter = new Intl.NumberFormat();

  // Calculate the highest bid
  $: highestBid = space.reduce((max, event) => {
    const burnIncrement = event.burn_increment ?? 0;
    return Math.max(max, burnIncrement);
  }, 0);

  $: numberOfBids = space.filter(event => event.covenant_action === 'BID').length;
  $: latestEvent = space[0];
  $: outpoint = `${latestEvent?.outpoint_txid}:${latestEvent?.outpoint_index}`;
  $: currentOwner = latestEvent?.script_pubkey ? decodeScriptPubKeyToTaprootAddress(latestEvent.script_pubkey, PUBLIC_BTC_NETWORK) : null;
  $: currentBlockHeight = blockStats.height;
  $: expiryHeight = latestEvent?.expire_height;

  $: auctionHeader = latestEvent?.covenant_action === "BID" 
    ? "In Auction"
    : "Auction ended";

  $: timeline = [
    {
      name: "Open",
      description: "Submit an open transaction to propose the space for auction.",
      done: true,
      current: false
    },
    {
      name: "Pre-auction",
      description: "Top 10 highest-bid spaces advance to auctions daily.",
      done: true,
      current: false
    },
    {
      name: auctionHeader,
      done: latestEvent?.covenant_action !== "BID",
      current: latestEvent?.covenant_action === "BID"
    },
    {
      name: "Awaiting claim",
      description: "You still have time to outbid until winner claims.",
      done: latestEvent?.covenant_action === "CLAIM",
      current: latestEvent?.covenant_action === "CLAIM"
    },
    {
      name: "Registered",
      description: "Space is registered",
      done: latestEvent?.covenant_action === "REGISTER",
      current: latestEvent?.covenant_action === "REGISTER"
    },
  ];
</script>

{#if !space || space.length === 0}
  <h1 class='page-title'>{$page.params.name}</h1>
  <h3 class='page-subtitle'>This name is available. <br> You can open an auction for it, <a class='page-link' href='https://spacesprotocol.org/' target="_blank">learn more here.</a></h3>
{:else}
  <div class="space-header">
    <h1 class="space-title">{space[0].name}</h1>
  </div>
  <div class="space-content">
    <div class="space-layout">
      <div class="sidebar">
        <nav class="bg-[#0b0d10] light:bg-gray-50 p-10 rounded-xl">
          <ol role="list" class="overflow-hidden">
          </ol>
        </nav>
      </div>
      <div class="main-content">
        <div class="w-full">
          <dl class="grid grid-cols-1 gap-x-8 gap-y-5 md:gap-y-16 lg:grid-cols-3">
            <div class="flex max-w-xs flex-col gap-y-2">
              <dt class="text-base leading-7 text-gray-500 light:text-gray-600">Highest bid</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight sm:text-4xl">
                {numberFormatter.format(highestBid)}<span class="text-sm ml-1">sats</span>
              </dd>
            </div>
            <div class="flex max-w-xs flex-col gap-y-2">
              <dt class="text-base leading-7 text-gray-500 light:text-gray-600"># of bids</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight sm:text-4xl">{numberOfBids}</dd>
            </div>
            {#if space.status == 'pre-auction'}
              <div class=" flex max-w-xs flex-col gap-y-2">
                <dt class="text-base leading-7 text-gray-500 light:text-gray-600">Rank</dt>
                <dd class="order-first text-3xl font-semibold tracking-tight sm:text-4xl">
                  {space.rank}
                </dd>
              </div>
            {/if}
            {#if space.status == "auction" && space.claimHeight > currentBlockHeight}
              <div class=" flex max-w-xs flex-col gap-y-2">
                <dt class="text-base leading-7 text-gray-500 light:text-gray-600">Blocks left to bid</dt>
                <dd class="order-first text-3xl font-semibold tracking-tight sm:text-4xl">
                  {space.claimHeight - currentBlockHeight}
                </dd>
              </div>
            {/if}
          </dl>
        </div>

        <div class="w-full mt-7 flex flex-col gap-1 space-y-12">
          <div>
            <ol class="m-0 space-y-2">
              {#if space.rank > 10}
                <li class="mb-10 bg-[#0c0c0c] p-5 rounded-xl text-center w-fit">
                  <span class="text-gray-400">A bid greater than <span class="text-[#ec8e32]">{numberFormatter.format(Number(space.top_10_cutoff_bid))}</span> is needed to move this space into the top 10</span>
                </li>
              {/if}
              <li class="border-b border-b-gray-400 light:border-gray-200 pb-2">
                <span class="text-sm text-gray-500 light:text-gray-600">Current owner:</span> <a target="_blank" href="https://mempool.space/{PUBLIC_BTC_NETWORK=="testnet4"?"testnet4/":""}address/{currentOwner}" class="text-[#ec8e32] hover:text-orange-700 break-words">{currentOwner}</a>
              </li>
              <li class="border-b border-b-gray-400 light:border-gray-200 pb-2">
                <span class="text-sm text-gray-500 light:text-gray-600">Outpoint:</span>
                <TransactionLink txid={outpoint?.split(':')[0]} truncate={false} maxLength={20} />:{outpoint?.split(':')[1]}
              </li>
              {#if expiryHeight}
                <li class="border-b border-b-gray-400 light:border-gray-200 pb-2 flex flex-wrap items-center gap-2">
                  <span class="text-sm text-gray-500 light:text-gray-600">Expiry block height:</span>
                  <span class='text-[#ec8e32] hover:text-orange-700'>{expiryHeight} (in {formatDuration((expiryHeight - currentBlockHeight) * 10 * 60)})</span>
                </li>
              {/if}
              <li>
                <span class="text-sm">Records:</span> <span class="text-sm text-gray-600">None</span>
              </li>
            </ol>
          </div>
          <div>
            <h1 class="text-md border-b border-gray-600 light:border-gray-200 pb-1">Transaction History</h1>

            <table class="min-w-full">
              <thead class="text-gray-900">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Action</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Transaction</th>
                  <th scope="col" class="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Burn Amount</th>
                </tr>
              </thead>
              <tbody>
                {#each space as event}
                  <tr>
                    <td class="px-3 py-5 text-left text-sm text-gray-500">{event.covenant_action}</td>
                    <td class="px-3 py-5 text-left text-gray-500 break-all">
                      <div class="flex flex-col">
                        <TransactionLink txid={event.txid} truncate={false} maxLength={15} />
                        <span class="text-gray-500 text-xs">{dayjs.unix(event.block_time).format("YYYY-MM-DD HH:mm")}</span>
                      </div>
                    </td>
                    <td class="px-3 py-5 text-right text-sm text-gray-500">
                      {#if event.burn_increment}
                        {numberFormatter.format(event.burn_increment)} sats
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
