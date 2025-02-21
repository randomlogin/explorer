<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/layout/Header.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
  import '$lib/styles/variables.css';
</script>

<Header />
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
  <slot />
</main>
<Footer />
