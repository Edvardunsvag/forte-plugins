# Forte Design Plugin

A Claude Code plugin that provides the Forte Digital brand design system for generating HTML presentations, reports, and other documents.

## Features

- **Skill: `forte-design`** — Automatically activates when creating HTML documents, providing Forte brand colors, typography, and component library
- **Command: `/forte-presentation <topic>`** — Generates a complete HTML slide deck with Forte branding

## Installation

```
/plugins install edvardunsvag/forte-design
```

## Design System

The plugin includes:
- **Design tokens** — Forte brand colors (burgundy, plum, cream, etc.), typography, spacing
- **CSS components** — Cards, badges, grids, flow diagrams, tables, charts, mockups, and more
- **Slide deck template** — Full-screen presentation with keyboard/swipe navigation and progress bar

## Usage

### Automatic (skill)
The `forte-design` skill activates automatically when you ask Claude to create HTML presentations, reports, or documents. It ensures all output follows the Forte brand guidelines.

### Explicit (command)
```
/forte-presentation AI-drevet matching av konsulenter
```
Generates a slide deck on the given topic and opens it in your browser.

## Document Types

- **Slide decks** — Full-screen presentations with navigation
- **Reports** — Single-page HTML documents with Forte styling
- **One-pagers** — Condensed overview documents
- **Technical deep-dives** — Feature documentation with diagrams
