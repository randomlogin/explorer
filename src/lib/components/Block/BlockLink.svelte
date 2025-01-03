<script lang="ts">
  export let height: number;

  const href = height === -1 ? '/mempool' : `/block/${height}`;
</script>

<a {href} class="block-link">
  <span class="block-text">{height === -1 ? 'Mempool' : `Block #${height}`}</span>
</a>

<style>
.block-link {
    color: var(--color-primary);
    text-decoration: none;
    display: block; /* Ensures the link takes full width */
    overflow: hidden; /* Prevents overflow outside the container */
    text-overflow: ellipsis; /* Adds ellipsis for long text */
    white-space: normal; /* Allows wrapping for multi-line text */
    word-wrap: break-word; /* Breaks long words to fit within container */
    max-width: 100%; /* Prevents the link from exceeding its parent's width */
}

.block-link:hover {
    text-decoration: underline;
}

.block-text {
    display: block; /* Ensures the text behaves like a block element */
    white-space: normal; /* Enables text wrapping */
    line-height: 1.2; /* Adjust line spacing for multi-line text */
    word-wrap: break-word; /* Breaks long words to fit within width */
    max-width: 100%; /* Prevents text from exceeding its container width */
}
</style>

