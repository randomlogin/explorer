<script>
  import { footerLinks } from '$lib/links';
  import '$lib/styles/Footer.css';
</script>

<footer class="footer">
  <div class="footer-container">
    <nav class="footer-nav">
      {#each footerLinks as { href, text, image }}
        <a 
          {href} 
          target="_blank" 
          rel="noopener noreferrer" 
          class="footer-link"
        >
          <img src={image} alt={text} class="footer-icon" />
          {text}
        </a>
      {/each}
    </nav>
  </div>
</footer>
