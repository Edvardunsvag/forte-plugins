---
description: Generate a Forte-branded HTML slide deck presentation
argument-hint: <topic or title>
allowed-tools: [Read, Write, Bash, Glob]
---

# Generate Forte Presentation

The user wants to create an HTML slide deck presentation on: **$ARGUMENTS**

## Instructions

1. Read the design system references to get the exact CSS and HTML patterns:
   - Read `skills/forte-design/references/design-tokens.md` for colors and typography
   - Read `skills/forte-design/references/components.md` for CSS component classes
   - Read `skills/forte-design/references/slide-deck.md` for the slide deck HTML boilerplate

2. Plan the presentation structure:
   - Title slide with the topic as h1
   - 6-10 content slides covering the topic
   - Use a variety of components: grids, cards, flow diagrams, tables, badges, checklists
   - End with a summary slide

3. Generate the complete self-contained HTML file:
   - Include ALL CSS from the design tokens and components in the `<style>` tag
   - Use the slide deck boilerplate (progress bar, navigation JS, swipe support)
   - Write all text in Norwegian (bokmål) unless the user specified English
   - Use Forte brand colors only — burgundy for primary, green for positive, plum for secondary

4. Save the file:
   - Filename: `docs/<topic-slug>.html` (lowercase, hyphens, no special chars)
   - If `docs/` doesn't exist, create it

5. Open in browser:
   ```bash
   open docs/<topic-slug>.html
   ```

## Quality Checklist

- [ ] All CSS is inline in `<style>` (no external files)
- [ ] Uses only Forte design tokens (no hardcoded colors outside the palette)
- [ ] Slide navigation works (keyboard arrows, Home/End, swipe)
- [ ] Progress bar and counter are present
- [ ] Title slide has section-label, h1, subtitle, and badges
- [ ] Content slides use section-label → h2 → description pattern
- [ ] Norwegian text by default
- [ ] File opens correctly in browser
