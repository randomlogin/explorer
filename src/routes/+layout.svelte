<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/layout/Header.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
  /* import { blockStore } from '$lib/stores/blockStore'; */
  import '$lib/styles/variables.css';

  // Subscribe to blockStore changes
  /* $: currentBlock = $blockStore.blockHeader; */
</script>

<Header />

<div class="container mx-auto pb-10">
  <slot />
</div>

<Footer />
