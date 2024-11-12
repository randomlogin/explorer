<script lang="ts">
  import { formatDuration } from "$lib/utils/formatters";
    import { decodeScriptPubKeyToTaprootAddress } from "$lib/utils/address-parsers";
    import dayjs from "dayjs";
    import LocalizedFormat from "dayjs/plugin/localizedFormat";
    import { PUBLIC_BTC_NETWORK } from "$env/static/public";
    import { page } from '$app/stores';
    import TransactionLink from '$lib/components/TransactionLink.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    import { formatBTC } from '$lib/utils/formatters';
    dayjs.extend(LocalizedFormat);

    export let data;
    let vmetaouts;
    let pagination;
    let currentPage = 1;

    $: {
        if (data) {
            vmetaouts = data.vmetaouts;
            pagination = data.pagination;
        }
    }

    // Get only BID actions for calculations
    $: bidActions = vmetaouts?.filter(event => event.action === 'BID') ?? [];

    $: highestBid = bidActions.reduce((max, event) => {
        const totalBurned = event.total_burned ?? 0;
        return Math.max(max, Number(totalBurned));
    }, 0);

    $: numberOfBids = bidActions.length;
    $: latestVmetaout = vmetaouts?.[0];
    $: spaceName = latestVmetaout?.name;
    $: currentBlockHeight = data.currentHeight;
    $: expiryHeight = latestVmetaout?.expire_height;
    $: status = getSpaceStatus(latestVmetaout?.action);

    function getSpaceStatus(action: string | undefined) {
        switch (action) {
            case 'RESERVE': return 'Reserved';
            case 'BID': return 'In Auction';
            case 'TRANSFER': return 'Transferred';
            case 'ROLLOUT': return 'Rolled Out';
            case 'REVOKE': return 'Revoked';
            default: return 'Unknown';
        }
    }

    function getActionColor(action: string | undefined) {
        switch (action) {
            case 'RESERVE': return 'text-blue-500';
            case 'BID': return 'text-green-500';
            case 'TRANSFER': return 'text-purple-500';
            case 'ROLLOUT': return 'text-yellow-500';
            case 'REVOKE': return 'text-red-500';
            default: return 'text-gray-500';
        }
    }

    async function handlePageChange(event: CustomEvent<number>) {
        const page = event.detail;
        const response = await fetch(`/api/spaces/${spaceName}?page=${page}`);
        if (response.ok) {
            const newData = await response.json();
            vmetaouts = newData.items;
            pagination = newData.pagination;
            currentPage = page;
            document.querySelector('.history-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    }
</script>

{#if !vmetaouts?.length}
  <h1 class="page-title">{$page.params.name}</h1>
  <div class="page-subtitle">
    <p>This name is available.</p>
    <p>You can open an auction for it, <a class="page-link" href="https://spacesprotocol.org/" target="_blank">learn more here.</a></p>
  </div>
{:else}
  <div class="space-header">
    <h1 class="space-title">{spaceName}</h1>
    <div class="status-badge {getActionColor(latestVmetaout?.action)}">{status}</div>
  </div>

  <div class="space-content">
    <div class="space-layout">
      <div class="main-content">
        <div class="stats-grid">
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
              <dd class="stat-value">{pagination?.total || 0}</dd>
            </div>
            {#if expiryHeight}
              <div class="stat-item">
                <dt class="stat-label">Expires At</dt>
                <dd class="stat-value">
                {expiryHeight}
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
        <div class="details-section">
          <div class="space-details">
            <ol class="details-list">
              {#if latestVmetaout?.claim_height}
                <li class="details-item">
                  <span class="details-label">Claim height:</span>
                  <span class="details-value">{latestVmetaout.claim_height}</span>
                </li>
              {/if}
            </ol>
          </div>

          <div class="history-section">
            <h2 class="history-title">Transaction History</h2>

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
                        <div class={getActionColor(vmetaout.action)}>{vmetaout.action}</div>
                        {#if vmetaout.reason}
                          <div class="revoke-reason">Reason: {vmetaout.reason}</div>
                        {/if}
                      </div>
                    </td>
                    <td class="table-cell">
                      <div class="transaction-cell">
                        <TransactionLink txid={vmetaout.txid} truncate={false} maxLength={15} />
                        <div class="tx-details">
                          <a href={`/block/${vmetaout.block_height}`} class="block-detail">
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
  </div>
{/if}
<style>
  .page-title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .page-link {
    color: var(--color-primary);
    text-decoration: none;
  }

  .page-link:hover {
    text-decoration: underline;
  }

  .space-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .space-title {
    font-size: 2rem;
    font-weight: 600;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: var(--bg-surface);
  }

  .stats-grid {
    margin-bottom: 2rem;
  }

  .stats-group {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
  }

  .stat-item {
    background: var(--bg-surface);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }

  .details-section {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .details-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .details-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--bg-surface);
    border-radius: var(--radius-md);
  }

  .details-label {
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  .details-value {
    font-weight: 500;
  }

  .details-duration {
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .history-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  .history-table {
    width: 100%;
    border-collapse: collapse;
  }

  .table-header {
    padding: 1rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border-color);
  }

  .table-row {
    border-bottom: 1px solid var(--border-color);
  }

  .table-row:hover {
    background: var(--bg-surface-hover);
  }

  .table-cell {
    padding: 1rem;
    font-size: 0.875rem;
  }

  .action-cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .revoke-reason {
    font-size: 0.75rem;
    color: var(--color-error);
  }

  .transaction-cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .tx-details {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .block-detail {
    color: var(--color-primary);
    text-decoration: none;
  }

  .block-detail:hover {
    text-decoration: underline;
  }

  .time-detail {
    color: var(--text-muted);
  }

  .error-row {
    background-color: var(--color-error-50);
  }

  .error-cell {
    padding: 0.75rem 1rem;
    color: var(--color-error);
    font-size: 0.875rem;
  }

  .text-right {
    text-align: right;
  }

  @media (max-width: 768px) {
    .stats-group {
      grid-template-columns: 1fr;
    }

    .space-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .table-cell {
      padding: 0.75rem 0.5rem;
    }
  }

  .stats-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .stat-item {
    background: var(--bg-surface);
    padding: 1.25rem;
    border-radius: var(--radius-lg);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }

  .stat-subtitle {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: normal;
    margin-top: 0.25rem;
  }

  /* Ensure stats are in a single row on wider screens */
  @media (min-width: 1024px) {
    .stats-group {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Adjust for smaller screens */
  @media (max-width: 1023px) {
    .stats-group {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .stats-group {
      grid-template-columns: 1fr;
    }
  }
</style>
