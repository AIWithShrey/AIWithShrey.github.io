# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Shreyas Mocherla built with Jekyll and GitHub Pages. Features a cyberpunk-themed design with an interactive terminal (K.E.R.N.E.L.) powered by a Cloudflare Worker + Groq API chatbot.

## Development Commands

```bash
# Install dependencies
bundle install

# Local development server (http://localhost:4000)
bundle exec jekyll serve

# Build for production
bundle exec jekyll build
```

## Architecture

### Jekyll Structure

- **`_config.yml`** - Site configuration using `remote_theme: abhinavs/moonwalk` with custom overrides
- **`_layouts/`** - Layout hierarchy: `default.html` → `home.html` → `page.html`/`post.html`/`article.html`
- **`_includes/`** - Reusable components: `terminal.html` (interactive AI chatbot), `hero.html`, `hud-overlay.html`
- **`_data/`** - YAML data files for content:
  - `home.yml` - navbar and footer entries
  - `projects.yml` - featured and all projects
  - `certifications.yml`, `publications.yml`
- **`_posts/`** - Blog posts (standard Jekyll)
- **`_articles/`** - Custom collection for longer-form articles

### Styling

SCSS architecture in `_sass/`:
- `_design-system.scss` - CSS variables and design tokens
- `moonwalk.scss` - Base theme from remote theme
- `_components.scss` - Custom component styles
- `_layouts.scss` - Layout-specific styles

Entry point: `assets/css/main.scss`

### JavaScript

- **`assets/js/canvas-bg.js`** - Neural network animation with tech logo particles
- **`assets/js/view-transitions.js`** - Page transition effects
- **`_includes/terminal.html`** - K.E.R.N.E.L. interactive terminal with:
  - ASCII globe animation
  - Command system (help, projects, articles, ask, etc.)
  - AI chat integration via Cloudflare Worker

### AI Chatbot (K.E.R.N.E.L.)

Backend in `cloudflare-worker/`:
- `worker.js` - Cloudflare Worker proxying requests to Groq API
- `SYSTEM_PROMPT.txt` - AI personality and context (gitignored)
- `wrangler.jsonc` - Worker configuration

Deployment:
```bash
cd cloudflare-worker
wrangler deploy
wrangler secret put GROQ_API_KEY
wrangler secret put SYSTEM_PROMPT
```

The terminal in `_includes/terminal.html` calls `AI_API_URL` (line ~109) to communicate with the worker.

## Key Patterns

- Content is data-driven: projects, certifications, publications managed via `_data/*.yml`
- Dark theme only (`appearance: "dark"` in config, toggle disabled)
- Custom includes replace theme defaults: `featured_projects.html`, `blog_list.html`, `certification_list.html`
- Terminal injects Jekyll data into JavaScript using Liquid: `{% for project in site.data.projects.featured %}`

## Deployment

Automated via `.github/workflows/deploy.yml`:
- Triggers on push to `main` or `website-revamp-2024`
- Uses Ruby 3.1, builds with Jekyll, deploys to GitHub Pages
- Only deploys from `main` branch
