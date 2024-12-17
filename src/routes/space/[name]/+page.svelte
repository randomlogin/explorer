<script lang="ts">
    import { formatDuration, formatBTC } from "$lib/utils/formatters";
    import dayjs from "dayjs";
    import LocalizedFormat from "dayjs/plugin/localizedFormat";
    import { page } from '$app/stores';
    import TransactionLink from '$lib/components/Transaction/TransactionLink.svelte';
    import SpaceTimeline from '$lib/components/Spaces/SpaceTimeline.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import type { SpaceData, Vmetaout } from '$lib/types/space';
    import { API_ROUTES } from '$lib/routes';
    
    dayjs.extend(LocalizedFormat);

    export let data: SpaceData;
    
    let vmetaouts: Vmetaout[] = [];
    let latestVmetaout: Vmetaout | null = null;
    let pagination;
    let currentPage = 1;
    let spaceName: string;
    let currentBlockHeight: number;
    let expiryHeight: number | undefined;
    let status: string;
    let numberOfBids: number;
    let highestBid: number;

    $: console.log(data)

    $: {
        if (data) {
            vmetaouts = data.items;
            latestVmetaout = data.latest;
            pagination = data.pagination;
            spaceName = latestVmetaout?.name;
            currentBlockHeight = data.currentHeight;
            expiryHeight = latestVmetaout?.expire_height;
            numberOfBids = data.stats.total_bids;
            status = computeSpaceStatus(latestVmetaout, currentBlockHeight);

            highestBid = data.stats.highest_bid
            }
    }

    function computeSpaceStatus(vmetaout: Vmetaout | null, currentHeight: number): string {
        if (!vmetaout) return 'Open';
        
        const status = vmetaout.action;
        const claimHeight = vmetaout.claim_height;

        if (status === 'REVOKE') return 'Open';
        if (status === 'RESERVE' || (status === 'BID' && !claimHeight)) return 'Pre-auction';
        if ((status === 'BID' || status === 'ROLLOUT') && claimHeight) {
            if (currentHeight < claimHeight) return 'In Auction';
            return 'Awaiting Claim';
        }
        if (status === 'TRANSFER') return 'Registered';
        if (status === 'REJECT') return 'Not opened';
        return 'Unknown';
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case 'Open': return 'text-blue-500';
            case 'Pre-auction': return 'text-yellow-500';
            case 'In Auction': return 'text-green-500';
            case 'Awaiting Claim': return 'text-orange-500';
            case 'Registered': return 'text-purple-500';
            default: return 'text-gray-500';
        }
    }

    function getActionColor(action: string | undefined): string {
        switch (action) {
            case 'RESERVE': return 'text-blue-500';
            case 'BID': return 'text-green-500';
            case 'TRANSFER': return 'text-purple-500';
            case 'ROLLOUT': return 'text-yellow-500';
            case 'REVOKE': return 'text-red-500';
            case 'REJECT': return 'text-red-500';
            default: return 'text-gray-500';
        }
    }
    async function handlePageChange(event: CustomEvent<number>) {
    const page = event.detail;
    const response = await fetch(API_ROUTES.space.history(spaceName, page));

    if (response.ok) {
        const historyData = await response.json();

        // Update only the paginated data, keep stats the same
        data = {
            ...data,
            items: historyData.items,
            pagination: historyData.pagination
        };

        currentPage = page;
        document.querySelector('.history-section')?.scrollIntoView({ behavior: 'smooth' });
    }
}

</script>

{#if !data.stats.total_actions || data.stats.total_actions == 0}
    <h1 class="page-title">{$page.params.name}</h1>
    <div class="page-subtitle">
        <p>This name is available.</p>
        <p>You can open an auction for it, <a class="page-link" href="https://spacesprotocol.org/" target="_blank">learn more here.</a></p>
    </div>
{:else}
    <div class="space-header">
        <h1 class="space-title">{spaceName}</h1>
        <div class="status-badge {getStatusColor(status)}">
            <span class="status-indicator"></span>
            <span class="status-text">{status}</span>
        </div>
    </div>

    <div class="space-content">
        <div class="stats-section">
            <dl class="stats-group">
                {#if numberOfBids > 0}
                    <div class="stat-item">
                        <dt class="stat-label">Highest bid</dt>
                        <dd class="stat-value">{formatBTC(highestBid)}</dd>
                    </div>
                    <div class="stat-item">
                        <dt class="stat-label">Number of bids</dt>
                        <dd class="stat-value">{numberOfBids}</dd>
                    </div>
                {/if}
                <div class="stat-item">
                    <dt class="stat-label">Total actions</dt>
                    <dd class="stat-value">{data.stats.total_actions}</dd>
                </div>
                {#if expiryHeight}
                    <div class="stat-item">
                        <dt class="stat-label">Expires At</dt>
                        <dd class="stat-value">
                        {#if expiryHeight <= currentBlockHeight }
                            <a href="/block/{expiryHeight}" class="block-link"> Block {expiryHeight} </a>
                        {:else }
                            Block {expiryHeight}
                        {/if}
                        {#if currentBlockHeight}
                            <div class="stat-subtitle">
                                in {formatDuration((expiryHeight - currentBlockHeight) * 10 * 60)}
                            </div>
                        {/if}
                        </dd>
                    </div>
                {/if}
            </dl>
        </div>

        {#if data.stats.claim_height}
            <div class="claim-height-section">
                <div class="claim-height-item">
                    <span class="claim-height-label">Claim height:</span>
                    <span class="claim-height-value">
                        {#if data.stats.claim_height <= currentBlockHeight }
                            <a href="/block/{data.stats.claim_height}" class="block-link"> Block {data.stats.claim_height} </a>
                        {:else }
                            Block {data.stats.claim_height}
                        {/if}
                    </span>
                </div>
            </div>
        {/if}

        <div class="main-content-layout">
            <div class="timeline-section">
                <SpaceTimeline 
                    vmetaout={latestVmetaout} 
                    currentBlockHeight={currentBlockHeight} 
                />
            </div>

            <div class="history-section">
                <h2 class="section-title">Transaction History</h2>
                <div class="history-container">
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th class="table-header">Action</th>
                                <th class="table-header">Transaction</th>
                                {#if numberOfBids > 0}
                                    <th class="table-header text-right">Bid Amount</th>
                                {/if}
                            </tr>
                        </thead>
                        <tbody>
                            {#each vmetaouts as vmetaout}
                                <tr class="table-row">
                                    <td class="table-cell">
                                        <div class="action-cell">
                                            <div class={getActionColor(vmetaout.action)}>
                                                {vmetaout.action}
                                            </div>
                                            {#if vmetaout.reason}
                                                <div class="revoke-reason">
                                                    Reason: {vmetaout.reason}
                                                </div>
                                            {/if}
                                        </div>
                                    </td>
                                    <td class="table-cell">
                                        <div class="transaction-cell">
                                            Transaction <TransactionLink 
                                                txid={vmetaout.txid} 
                                                truncate={true} 
                                                maxLength={35} 
                                            />
                                            <div class="tx-details">
                                                <a href={`/block/${vmetaout.block_height}`} class="block-link">
                                                    Block {vmetaout.block_height}
                                                </a>
                                                <div class="time-detail">
                                                    {dayjs.unix(vmetaout.block_time).format('MMM DD HH:mm')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {#if numberOfBids > 0}
                                        <td class="table-cell text-right">
                                            {#if vmetaout.action === 'BID'}
                                                {formatBTC(vmetaout.total_burned)} 
                                            {/if}
                                        </td>
                                    {/if}
                                </tr>
                                {#if vmetaout.script_error}
                                    <tr class="error-row">
                                        <td colspan="4" class="error-cell">
                                            Error: {vmetaout.script_error}
                                        </td>
                                    </tr>
                                {/if}
                            {/each}
                        </tbody>
                    </table>

                    {#if pagination && pagination.totalPages > 1}
                        <div class="pagination-container">
                            <Pagination 
                                currentPage={currentPage} 
                                totalPages={pagination.totalPages} 
                                on:pageChange={handlePageChange} 
                            />
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}
<style>
  .page-title {
    font-size: var(--text-3xl);
    font-weight: 600;
    margin-bottom: var(--space-4);
  }

  .page-subtitle {
    font-size: var(--text-lg);
    color: var(--text-muted);
    line-height: 1.5;
  }

  .page-link {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition-colors);
  }

  .page-link:hover {
    text-decoration: underline;
  }

  .space-header {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .space-title {
    font-size: var(--text-3xl);
    font-weight: 600;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--border-radius-3xl);
    font-size: var(--text-sm);
    font-weight: 500;
    background-color: var(--bg-secondary);
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: currentColor;
  }

  .status-text {
    color: currentColor;
  }

  .stats-section {
    margin-bottom: var(--space-8);
  }

  .stats-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-4);
  }

  .stat-item {
    background: var(--bg-secondary);
    padding: var(--space-6);
    border-radius: var(--border-radius-lg);
    border: var(--border-width-1) solid var(--border-color);
  }

  .stat-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .stat-value {
    font-size: var(--text-2xl);
    font-weight: 600;
    margin-top: var(--space-2);
  }

  .stat-subtitle {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin-top: var(--space-2);
  }

  .claim-height-section {
    margin-bottom: var(--space-8);
  }

  .claim-height-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    background: var(--bg-secondary);
    border-radius: var(--border-radius-lg);
    border: var(--border-width-1) solid var(--border-color);
  }

  .claim-height-label {
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  .claim-height-value {
    font-weight: 500;
  }

  .main-content-layout {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--space-8);
    align-items: start;
  }

  .timeline-section {
    position: sticky;
    top: var(--space-8);
  }

  .section-title {
    font-size: var(--text-xl);
    font-weight: 600;
    margin-bottom: var(--space-6);
  }

  .history-container {
    background: var(--bg-secondary);
    padding: var(--space-6);
    border-radius: var(--border-radius-lg);
    border: var(--border-width-1) solid var(--border-color);
  }

  .history-table {
    width: 100%;
    border-collapse: collapse;
  }

  .table-header {
    padding: var(--space-4);
    text-align: left;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-muted);
    border-bottom: var(--border-width-1) solid var(--border-color);
  }

  .table-row {
    border-bottom: var(--border-width-1) solid var(--border-color);
    transition: var(--transition-colors);
  }

  .table-row:hover {
    background: var(--bg-hover);
  }

  .table-cell {
    padding: var(--space-4);
    font-size: var(--text-sm);
  }

  .action-cell {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .revoke-reason {
    font-size: var(--text-sm);
    color: var(--color-error);
  }

  .transaction-cell {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .tx-details {
    display: flex;
    gap: var(--space-4);
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .block-link {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition-colors);
  }

  .block-link:hover {
    text-decoration: underline;
  }

  .time-detail {
    color: var(--text-muted);
  }

  .error-row {
    background-color: var(--color-error-50);
  }

  .error-cell {
    padding: var(--space-4);
    color: var(--color-error);
    font-size: var(--text-sm);
  }

  .text-right {
    text-align: right;
  }

  .pagination-container {
    margin-top: var(--space-6);
  }

  @media (max-width: 1023px) {
    .main-content-layout {
      grid-template-columns: 1fr;
    }

    .timeline-section {
      position: static;
      margin-bottom: var(--space-8);
    }
  }

  @media (max-width: 768px) {
    .space-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .stats-group {
      grid-template-columns: 1fr;
    }

    .table-cell {
      padding: var(--space-2);
    }
  }
</style>
