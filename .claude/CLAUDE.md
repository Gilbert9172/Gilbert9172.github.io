# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based blog site using the **Hydejack** theme. The site is hosted on GitHub Pages at `https://gilbert9172.github.io`. The project combines:
- **Jekyll** (Ruby): Static site generation with Markdown posts in `_posts/`
- **JavaScript**: Custom theme enhancements bundled via Browserify with Babel transpilation
- **SCSS**: Styling for the blog

## Building and Development

### Install Dependencies

```bash
# Ruby gems (Jekyll and plugins)
bundle install

# Node.js dependencies (for JavaScript assets)
npm install
```

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Watch and rebuild JavaScript with hot reload (runs watchify) |
| `npm run build` | Build and minify JavaScript assets for production |
| `npm run lint` | Check JavaScript code style with ESLint |
| `npm run clean` | Remove compiled JavaScript assets |
| `bundle exec jekyll serve` | Serve site locally at `http://localhost:4000` |
| `bundle exec jekyll build` | Build site for production |

### Typical Workflow

1. Start Jekyll development server: `bundle exec jekyll serve`
2. In another terminal, watch JavaScript: `npm run dev`
3. Create/edit posts in `_posts/` (Jekyll auto-rebuilds)
4. Edit JavaScript in `_js/src/` (watchify auto-rebuilds)
5. Before committing: `npm run lint` to check code style

## Code Architecture

### Jekyll Structure

```
├── _posts/              # Markdown blog posts (main content)
├── _layouts/            # Page templates (base, post, page, etc.)
├── _includes/           # Reusable HTML components
├── _featured_categories/# Blog category definitions
├── _featured_tags/      # Blog tag definitions
├── _data/               # YAML data files (authors, resume, etc.)
├── assets/              # Static assets (CSS, images, compiled JS)
└── _config.yml          # Jekyll site configuration
```

### JavaScript Architecture

The JavaScript is bundled into a single file using Browserify with Babel transpilation:

```
_js/
├── src/
│   ├── index.js           # Entry point; imports all modules
│   ├── push-state.js      # History/navigation without page reload
│   ├── drawer.js          # Mobile drawer menu
│   ├── katex.js           # Math rendering
│   ├── cross-fader.js     # Theme transition animations
│   ├── common.js          # Utility functions
│   └── flip/
│       ├── flip.js        # Page flip/transition effects
│       └── title.js       # Title animation effects
└── lib/
    ├── version.js         # Version info
    └── modernizr.js       # Feature detection
```

**Build output:** `assets/js/hydejack.js` (and minified version)

### Key JavaScript Modules

- **push-state**: Enables smooth client-side navigation between posts without full page reloads
- **drawer**: Responsive mobile navigation drawer
- **katex**: LaTeX math rendering for mathematical notation in posts
- **cross-fader**: Visual theme transitions (light/dark modes)
- **flip**: Page transition animations
- **common**: Shared utilities like DOM selectors and event handling

### Styling

```
_sass/
└── hydejack/            # Main Hydejack theme styles
```

Compiled into `assets/css/` by Jekyll during build. Uses SCSS variables and mixins for maintainability.

## Configuration

### `_config.yml` Key Settings

- **url**: `https://gilbert9172.github.io` - Site base URL
- **author**: Blog author info
- **disqus_shortname**: `gilbert9172` - Comment system
- **plugins**: jekyll-feed, jekyll-sitemap, jekyll-paginate, jekyll-redirect-from
- **kramdown**: Math engine set to MathJax for LaTeX rendering

### Jekyll Collections

- **featured_categories**: Categories in `_featured_categories/`
- **featured_tags**: Tags in `_featured_tags/`
- **projects**: Projects in `_featured_projects/` (if needed)

Each collection has custom permalink and output settings.

## ESLint Configuration

ESLint is configured in `.eslintrc` with:
- Parser: `babel-eslint` (handles ES2015+ syntax)
- Base config: `eslint-config-airbnb`
- Environment: Browser (no Node globals)
- Global variables: `loadCSS`, `loadJSDeferred`

## Important Notes

- **Node/Ruby versions**: Check `package.json` and `Gemfile` for compatible versions
- **Assets bundling**: The `prepare` npm script runs lint, test, clean, and build in sequence before deployment
- **Posts format**: Use YAML front matter with layout, categories, tags, etc. (see existing posts for examples)
- **Math in posts**: Wrap LaTeX in `$...$` (inline) or `$$...$$` (display) - KaTeX processes these
- **GitHub Pages**: Built automatically; ensure `_config.yml` baseurl is correct for deployment