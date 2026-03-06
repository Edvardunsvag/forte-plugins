# Forte Plugins — Claude Code Plugin Marketplace

A multi-plugin Claude Code marketplace by Forte Digital. Provides design system tools for branded HTML documents and Flowcase integration for looking up consultant CVs and skills.

## Installation

1. Add the marketplace:
   ```
   /plugin marketplace add Edvardunsvag/forte-plugins
   ```

2. Install desired plugins:
   ```
   /plugin install forte-design@forte-plugins
   /plugin install forte-flowcase@forte-plugins
   ```

## Plugins

### forte-design

Forte Digital brand design system for HTML presentations, reports, and documents.

- **Skill: `forte-design`** — Auto-activates when creating HTML documents
- **Command: `/forte-presentation <topic>`** — Generates a Forte-branded slide deck

See [plugins/forte-design/README.md](plugins/forte-design/README.md) for full documentation.

### forte-flowcase

Flowcase CV data integration — look up consultants, CVs, projects, and skills via MCP tools.

After installing, configure the Flowcase credentials in your Claude Code MCP settings:

- `FLOWCASE_ENDPOINT`: Your Flowcase API base URL
- `FLOWCASE_TOKEN`: Your Flowcase API Bearer token

#### Available Tools

- `flowcase_list_consultants` — List all consultants with name, office, and CV ID
- `flowcase_get_cv` — Get a consultant's full CV (title, qualifications, skills, projects)
- `flowcase_get_projects` — Get only project experiences for a consultant
- `flowcase_search_by_skill` — Find consultants who have a specific skill

See [plugins/forte-flowcase/README.md](plugins/forte-flowcase/README.md) for full documentation.
