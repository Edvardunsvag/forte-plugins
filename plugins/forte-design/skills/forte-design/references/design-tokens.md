# Forte Design Tokens

## CSS Custom Properties

```css
:root {
  /* Backgrounds */
  --bg: #F2F0E7;           /* Page background — warm cream */
  --surface: #FAFAF6;      /* Card/panel background — near-white */
  --surface2: #EDE6C3;     /* Secondary surface — cookie dough */

  /* Borders */
  --border: #D6DDDC;       /* Default border — ash grey */
  --harbour-mist: #BBC6C5; /* Subtle border alternative */
  --ash-grey: #D6DDDC;     /* Same as --border */

  /* Text */
  --text: #39344B;         /* Primary text — dark plum */
  --text-muted: #7a7490;   /* Secondary text — muted plum */

  /* Brand colors */
  --burgundy: #511E29;     /* Primary accent — used for headings, borders, highlights */
  --dark-burgundy: #3D0E18;/* Darker variant for hover/emphasis */
  --plum: #39344B;         /* Secondary accent — used for code, alternative cards */
  --dark-plum: #221C38;    /* Darker plum variant */

  /* Functional colors */
  --green: #2d8a62;        /* Success, positive states */
  --cyan: #5a7a78;         /* Info, neutral accent */
  --blue: #4a6080;         /* Links, secondary info */
  --orange: #FF6A3D;       /* Warning, attention (use sparingly) */
  --orange-dim: #d4522a;   /* Dimmed orange */
  --highlight: #FF6A3D;    /* Same as orange — highlight accent */

  /* Semantic aliases */
  --white: #FAFAF6;        /* Alias for surface */
  --cream: #F2F0E7;        /* Alias for bg */
  --cookie-dough: #EDE6C3; /* Alias for surface2 */
  --red: #511E29;          /* Alias for burgundy */
  --red-dim: #3D0E18;      /* Alias for dark-burgundy */
  --purple: #39344B;       /* Alias for plum */
}
```

## Typography

```css
/* Font stack */
font-family: 'Volk Sans', 'Aptos', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Code font */
font-family: 'JetBrains Mono', 'Fira Code', monospace;

/* Base */
line-height: 1.6;
-webkit-font-smoothing: antialiased;

/* Headings */
h1: 3.2rem, weight 800, letter-spacing -0.04em, line-height 1.15
h2: 2rem, weight 700, letter-spacing -0.02em
h3: 1.1rem, weight 600

/* Text sizes */
.subtitle: 1.25rem (used for lead paragraphs)
.small: 0.88rem
.xs: 0.8rem

/* Special text */
.section-label: 0.7rem, uppercase, letter-spacing 0.12em, weight 700
.big-number: 4rem, weight 800, letter-spacing -0.04em
.big-label: 0.85rem, uppercase, letter-spacing 0.06em, weight 600
```

## Spacing Scale

```css
.mb-0: margin-bottom 0
.mb-1: margin-bottom 1rem
.mt-1: margin-top 1rem
.mt-2: margin-top 1.5rem
```

## Color Usage Guidelines

| Element | Color | Example |
|---------|-------|---------|
| Page background | `--bg` (#F2F0E7) | Body background |
| Cards/panels | `--surface` (#FAFAF6) | Card backgrounds |
| Primary headings | `--burgundy` (#511E29) | h1, h2 with `color: var(--burgundy)` |
| Section labels | `--burgundy` via `.text-red` | Small uppercase labels above headings |
| Positive/success | `--green` (#2d8a62) | Green cards, checkmarks, badges |
| Secondary accent | `--plum` (#39344B) | Alternative cards, code elements |
| Muted text | `--text-muted` (#7a7490) | Descriptions, captions |
| Borders | `--border` (#D6DDDC) | Card borders, table lines |

## Design Principles

1. **Warm and muted** — cream backgrounds, no pure white or black
2. **Burgundy as primary accent** — headings, highlights, primary actions
3. **Green for positive** — success states, completed items, good outcomes
4. **Plum for secondary** — alternative highlights, code, technical elements
5. **Generous whitespace** — paddings of 1.5rem+ on cards, 3-4rem on slides
6. **Subtle borders** — use rgba() with low alpha (0.2-0.4) for colored borders
7. **No pure shadows** — use border + background color instead of box-shadow
