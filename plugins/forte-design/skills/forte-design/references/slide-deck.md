# Forte Slide Deck Template

## Complete HTML Boilerplate

Use this as the skeleton for every slide presentation. Replace the `<title>`, slide content, and add/remove slides as needed.

```html
<!DOCTYPE html>
<html lang="nb">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TITLE HERE</title>
<style>
  /* PASTE ALL CSS FROM design-tokens.md AND components.md HERE */

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Volk Sans', 'Aptos', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    height: 100vh;
  }

  .deck { position: relative; width: 100vw; height: 100vh; }

  .slide {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem 4rem;
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
    overflow-y: auto;
  }
  .slide.active { opacity: 1; pointer-events: auto; }
  .slide.prev { opacity: 0; }

  .slide-inner { max-width: 1080px; width: 100%; }

  /* Progress bar */
  .progress {
    position: fixed; top: 0; left: 0;
    height: 3px; background: var(--burgundy);
    transition: width 0.4s ease; z-index: 200;
  }

  /* Slide counter */
  .counter {
    position: fixed; bottom: 1.5rem; right: 2rem;
    font-size: 0.8rem; color: var(--text-muted);
    font-variant-numeric: tabular-nums; z-index: 200;
  }

  /* Navigation hint */
  .nav-hint {
    position: fixed; bottom: 1.5rem; left: 2rem;
    font-size: 0.72rem; color: var(--text-muted);
    opacity: 0.4; z-index: 200;
  }
</style>
</head>
<body>

<div class="progress" id="progress"></div>
<div class="counter" id="counter"></div>
<div class="nav-hint">Piltaster eller swipe for å navigere</div>

<div class="deck">

<!-- SLIDE 1: Title -->
<div class="slide">
  <div class="slide-inner" style="text-align: center;">
    <div class="section-label text-red" style="margin-bottom: 1rem;">Forte Kompetanse</div>
    <h1 style="color: var(--burgundy);">TITLE</h1>
    <p class="subtitle" style="margin: 1.5rem auto 2rem;">SUBTITLE</p>
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <span class="badge badge-red">TAG 1</span>
      <span class="badge badge-blue">TAG 2</span>
      <span class="badge badge-green">TAG 3</span>
    </div>
  </div>
</div>

<!-- SLIDE 2+ : Content slides -->
<div class="slide">
  <div class="slide-inner">
    <div class="section-label text-red">SECTION</div>
    <h2 style="color: var(--burgundy);">HEADING</h2>
    <p class="muted mb-1">DESCRIPTION</p>
    <!-- Content here using components from components.md -->
  </div>
</div>

</div><!-- /deck -->

<script>
(function() {
  const slides = document.querySelectorAll('.slide');
  const progress = document.getElementById('progress');
  const counter = document.getElementById('counter');
  let current = 0;

  function show(index) {
    if (index < 0 || index >= slides.length) return;
    const prev = current;
    current = index;
    slides.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i === current) s.classList.add('active');
      else if (i === prev && prev < current) s.classList.add('prev');
    });
    progress.style.width = ((current + 1) / slides.length * 100) + '%';
    counter.textContent = (current + 1) + ' / ' + slides.length;
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault(); show(current + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); show(current - 1);
    } else if (e.key === 'Home') {
      e.preventDefault(); show(0);
    } else if (e.key === 'End') {
      e.preventDefault(); show(slides.length - 1);
    }
  });

  let touchStartX = 0;
  document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  document.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? show(current + 1) : show(current - 1); }
  });

  show(0);
})();
</script>

</body>
</html>
```

## Slide Patterns

### Title Slide
Center-aligned with section label, large h1 in burgundy, subtitle, and badge tags.

### Content Slide (Standard)
Left-aligned with section label, h2 in burgundy, description paragraph, then content using grid/card/flow components.

### Two-Column Comparison
Use `.grid-2` with contrasting cards (e.g., `.card-red` vs `.card-green` for problem/solution).

### Three-Column Feature Grid
Use `.grid-3` with `.scenario` cards for feature highlights.

### Data/Architecture Slide
Use `.flow` for horizontal pipelines or `.vflow` for vertical processing steps.

### Summary Slide
Use `.grid-2` with `.card-red` (technology) and `.card-green` (value), followed by centered closing statement.

## Slide Count Guidelines

- **Feature deep-dive**: 8-12 slides
- **Quick overview**: 4-6 slides
- **Technical walkthrough**: 10-15 slides
- **Status update**: 3-5 slides
