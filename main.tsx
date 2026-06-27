@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-display: "Manrope", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  --color-charcoal-950: #121212;
  --color-charcoal-900: #1a1a1a;
  --color-charcoal-800: #2a2a2a;
  --color-warm-50: #fdfcfb;
  --color-warm-100: #fcfbfa;
  --color-warm-200: #e5e5e5;
  
  --color-german-red: #a61d24;
  --color-german-gold: #d4af37;
}

/* Core adjustments */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-warm-50);
  color: var(--color-charcoal-900);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background-color: #a61d24;
  color: white;
}

/* Custom transitions and scroll margins */
section {
  scroll-margin-top: 80px;
}
