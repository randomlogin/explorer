<script>
  import { footerLinks } from '$lib/links';
</script>

<footer class="bg-gray-100 py-4 mt-8">
  <div class="container mx-auto px-4">
    <nav class="flex justify-center space-x-6">
      {#each footerLinks as { href, text, image }}
        <a {href} target="_blank" rel="noopener noreferrer" class="flex items-center text-blue-600 hover:text-blue-800">
          <img src={image} alt={text} class="w-6 h-6 mr-2" />
          {text}
        </a>
      {/each}
    </nav>
    
  </div>
</footer>

<style>
  footer {
    border-top: 1px solid #e2e8f0;
  }
</style>

