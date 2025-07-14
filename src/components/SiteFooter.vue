<template>
  <footer class="footer footer-center p-4 bg-base-200 text-base-content/70 text-xs sm:text-sm">
    <div class="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
      <span>© 2025 mnemo-nback</span>
      <span class="hidden sm:inline">·</span>
      <span 
        class="cursor-help" 
        title="MIT License - This project is open source"
      >
        MIT License
      </span>
      <span class="hidden sm:inline">·</span>
      <a 
        href="https://github.com/senzi/mnemo-nback" 
        target="_blank" 
        rel="noopener noreferrer"
        class="link link-hover"
      >
        GitHub
      </a>
      <span class="hidden sm:inline">·</span>
      <span 
        class="cursor-help" 
        title="Vibecoding: A minimalist coding state of flow"
      >
        Built with 💡 VibeCoding
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No props or logic needed for this simple footer component
</script>

<style scoped>
.footer {
  margin-top: auto;
}

/* Ensure links are accessible */
.link:focus {
  outline: 2px solid hsl(var(--p));
  outline-offset: 2px;
  border-radius: 2px;
}

/* Mobile-friendly spacing */
@media (max-width: 640px) {
  .footer {
    padding: 0.75rem 1rem;
  }
  
  /* Stack items vertically on very small screens */
  @media (max-width: 480px) {
    .footer > div {
      flex-direction: column;
      gap: 0.25rem;
    }
  }
}
</style>
