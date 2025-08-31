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
│   │   ├── slides.md            # Main slide content
│   │   ├── components/          # Vue components
│   │   │   ├── CssPlayground.vue # Real-time CSS editor
│   │   │   └── ApiDemo.vue      # API demonstration component
│   │   ├── functions/           # Cloudflare Pages Functions
│   │   │   ├── _middleware.ts   # Security middleware
│   │   │   └── api/             # API endpoints
│   │   │       ├── hello.ts     # Simple greeting API
│   │   │       └── css.ts       # CSS snippets API
│   │   ├── dist/                # Built static files
│   │   ├── vite.config.ts       # Vite configuration
│   │   └── package.json
│   └── shared/                  # Shared code and types
│       ├── types/               # TypeScript type definitions
│       │   └── index.ts
│       └── utils/               # Common utilities
│           └── api.ts
├── .github/workflows/           # GitHub Actions for CI/CD
├── docs/                        # Project documentation
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
pnpm dev                    # Runs slide app at localhost:3030

# Build for production
pnpm build                  # Builds static site to apps/slide/dist

# Preview production build
pnpm preview

# Export slides
pnpm --filter slide export
```

## Key Features (Implemented)

1. **Interactive CSS Playground**: Real-time CSS editing component
2. **API Integration**: Slide components that call backend APIs
3. **Serverless Functions**: Cloudflare Pages Functions for API endpoints
4. **Responsive Design**: Mobile-friendly presentation interface
5. **CI/CD Pipeline**: GitHub Actions for automated deployment

## API Endpoints (Implemented)

- `GET /api/hello?name={name}` - Simple greeting API
- `POST /api/css` - CSS snippets handling API

## Security Features

- Security middleware implementation
- Input sanitization for API endpoints
- Proper error handling with user-friendly messages

## Important Implementation Notes

- All API code is in `/apps/slide/functions/` directory
- Components follow Vue.js/Slidev conventions
- Shared types are available from `/apps/shared/types/`
- Built files are generated in `/apps/slide/dist/`

## Testing & Development

- Local development: Use `pnpm dev` to start Slidev dev server
- Build verification: Use `pnpm build` to ensure clean dist/ output
- API testing: Functions are available during development

## Current Status

The repository contains a fully functional implementation:
- ✅ Slidev-based presentation application
- ✅ Vue.js components (CssPlayground, ApiDemo)
- ✅ Cloudflare Pages Functions for API endpoints
- ✅ Security middleware
- ✅ CI/CD pipeline with GitHub Actions
- ✅ pnpm workspace configuration
- ✅ TypeScript throughout the project