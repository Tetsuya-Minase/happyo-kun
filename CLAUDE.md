# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT
PLEASE ANSWER IN JAPANESE.

## Project Overview

**happyo-kun** (発表くん) is an interactive slide application that combines Slidev with Cloudflare's infrastructure. The project creates Markdown-driven presentations with live coding capabilities and API integration.

## Architecture

This is implemented as a **pnpm workspace monorepo** with the following structure:

```
happyo-kun/
├── apps/
│   ├── slide/                    # Slidev application (main app)
│   │   ├── slides/              # Multiple slide presentations (directory-based structure)
│   │   │   ├── intro/           # Introduction slide directory
│   │   │   │   ├── slides.md    # Slide content (accessible at /intro/)
│   │   │   │   └── assets/      # Slide-specific assets (images, CSS, etc.)
│   │   │   └── demo/            # Demo slide directory
│   │   │       ├── slides.md    # Slide content (accessible at /demo/)
│   │   │       └── assets/      # Slide-specific assets
│   │   ├── components/          # Shared Vue components
│   │   │   ├── CssPlayground.vue # Real-time CSS editor
│   │   │   └── ApiDemo.vue      # API demonstration component
│   │   ├── functions/           # Shared Cloudflare Pages Functions
│   │   │   ├── _middleware.ts   # Security middleware
│   │   │   └── api/             # API endpoints
│   │   │       ├── hello.ts     # Simple greeting API
│   │   │       └── css.ts       # CSS snippets API
│   │   ├── dist/                # Built static files (multi-slide structure)
│   │   │   ├── intro/           # Built intro slide
│   │   │   └── demo/            # Built demo slide
│   │   ├── build-slides.ts      # Multi-slide build script
│   │   ├── vite.config.ts       # Vite configuration
│   │   └── package.json
│   ├── start/                   # Landing page application
│   │   ├── index.html           # Main landing page
│   │   └── dist/                # Integrated build output
│   └── shared/                  # Shared code and types
│       ├── types/               # TypeScript type definitions
│       │   └── index.ts
│       └── utils/               # Common utilities
│           └── api.ts
├── .github/workflows/           # GitHub Actions for CI/CD
├── docs/                        # Project documentation
├── scripts/
│   └── build.ts                 # Integrated build script
└── pnpm-workspace.yaml         # pnpm workspace configuration
```

## Technology Stack

- **Frontend**: Slidev (Vue.js-based slide framework)
- **Backend**: Cloudflare Pages Functions (serverless APIs)
- **Infrastructure**: Cloudflare Pages for hosting
- **Language**: TypeScript throughout
- **Package Manager**: pnpm with workspaces
- **Deployment**: GitHub Actions → Cloudflare Pages

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev                    # Runs slide app at localhost:3030 and start app at localhost:3000

# Build for production
pnpm build                  # Builds all slides and integrates them into apps/start/dist

# Preview production build
pnpm preview

# Build individual slide
pnpm --filter slide build   # Builds all presentations in slides/ folder

# Export slides
pnpm --filter slide export
```

## Key Features (Implemented)

1. **Multiple Presentations**: Support for multiple independent slide presentations
   - Each directory in `slides/` with a `slides.md` file becomes a separate slide deck
   - Access via `/【ディレクトリ名】/【ページ数】` (e.g., `/intro/1`, `/demo/2`)
   - Shared components and functions across all presentations
   - Each presentation can have its own `assets/` directory for slide-specific resources
2. **Interactive CSS Playground**: Real-time CSS editing component
3. **API Integration**: Slide components that call backend APIs
4. **Serverless Functions**: Cloudflare Pages Functions for API endpoints
5. **Responsive Design**: Mobile-friendly presentation interface
6. **CI/CD Pipeline**: GitHub Actions for automated deployment

## API Endpoints (Implemented)

- `GET /api/hello?name={name}` - Simple greeting API
- `POST /api/css` - CSS snippets handling API

## Security Features

- Security middleware implementation
- Input sanitization for API endpoints
- Proper error handling with user-friendly messages

## Important Implementation Notes

- All API code is in `/apps/slide/functions/` directory (shared across all presentations)
- Components in `/apps/slide/components/` are shared across all presentations
- Each presentation has its own directory in `/apps/slide/slides/` with a `slides.md` file
- Each presentation can have its own `assets/` directory for slide-specific resources
- Components follow Vue.js/Slidev conventions
- Shared types are available from `/apps/shared/types/`
- Built files are generated in `/apps/slide/dist/【ディレクトリ名】/` for each presentation
- Final integrated build is in `/apps/start/dist/` with all presentations merged

## Testing & Development

- Local development: Use `pnpm dev` to start Slidev dev server
- Build verification: Use `pnpm build` to ensure clean dist/ output
- API testing: Functions are available during development

## How to Add a New Presentation

1. Create a new directory in `/apps/slide/slides/` (e.g., `workshop/`)
2. Create a `slides.md` file in the new directory (`/apps/slide/slides/workshop/slides.md`)
3. Optionally, create an `assets/` directory for slide-specific resources
4. Write your slide content using Slidev markdown syntax
5. Run `pnpm build` to build all presentations
6. The new presentation will be accessible at `/workshop/1`, `/workshop/2`, etc.

## Current Status

The repository contains a fully functional implementation:
- ✅ Multiple presentation support with shared components
- ✅ Slidev-based presentation application
- ✅ Vue.js components (CssPlayground, ApiDemo)
- ✅ Cloudflare Pages Functions for API endpoints
- ✅ Security middleware
- ✅ CI/CD pipeline with GitHub Actions
- ✅ pnpm workspace configuration
- ✅ TypeScript throughout the project