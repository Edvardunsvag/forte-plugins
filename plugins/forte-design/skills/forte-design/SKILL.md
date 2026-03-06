---
name: forte-design
description: Use when the user asks to create HTML presentations, slide decks, reports, one-pagers, or any HTML document with Forte Digital branding. Triggers on "presentasjon", "slide deck", "rapport", "one-pager", "Forte design", "Forte presentasjon", "HTML presentasjon", "lage presentasjon", "lag en presentasjon", "create presentation", or when generating HTML documents in the Forte Kompetanse project context.
---

# Forte Design System

You are generating HTML documents using the Forte Digital brand design system. All output must follow these rules strictly.

## Rules

1. **Self-contained HTML** — Every file must be a single `.html` file with all CSS inline in a `<style>` tag. No external dependencies.
2. **Norwegian by default** — Use Norwegian (bokmål) for all text unless the user explicitly requests English.
3. **Forte brand colors only** — Use the design tokens defined in `references/design-tokens.md`. Never use colors outside the palette.
4. **Open in browser** — After generating the file, run `open <filepath>` to open it in the user's default browser.
5. **Save location** — Save to `docs/` in the current project directory unless the user specifies otherwise.

## How to Build a Document

1. Read `references/design-tokens.md` for the CSS custom properties and color palette
2. Read `references/components.md` for all available CSS component classes
3. For slide decks: Read `references/slide-deck.md` for the HTML boilerplate and navigation JS
4. Compose the document using ONLY the design tokens and components from the references
5. Include ALL necessary CSS in the `<style>` tag — copy from the references, don't reference them

## Document Types

### Slide Deck (Presentation)
- Use the full boilerplate from `references/slide-deck.md`
- Include progress bar, keyboard nav, swipe support
- Title slide: centered, burgundy h1, subtitle, badge tags
- Content slides: section label + h2 + content using grids/cards/flows
- 6-12 slides for a typical presentation

### Report / One-Pager
- Single scrollable page (no slide navigation)
- Use `body { overflow-y: auto; }` instead of `overflow: hidden`
- Remove `.deck`/`.slide` structure; use sections with max-width container
- Keep all other design tokens and components

### Technical Documentation
- Scrollable, with table of contents
- Heavy use of tables, code blocks, flow diagrams
- Section labels for navigation

## Design Principles

- **Warm and muted** — cream backgrounds, no pure white (#fff) or black (#000)
- **Burgundy (#511E29) is the hero color** — use for headings, primary highlights, section labels
- **Green (#2d8a62) for positive** — success, completed, good outcomes
- **Plum (#39344B) for secondary** — alternative cards, code, technical detail
- **Generous spacing** — 1.5rem+ padding on cards, 3-4rem padding on slides
- **Subtle colored borders** — use rgba() with 0.2-0.4 alpha, never solid bold borders
- **No box-shadows** — use border + subtle background tints instead
- **Typography hierarchy** — always use section-label → h2 → description pattern on slides
