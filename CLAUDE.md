# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**happyo-kun** (発表くん) is an interactive slide application that combines Slidev with Cloudflare's infrastructure. The project aims to create Markdown-driven presentations with live coding capabilities and API integration.

## Architecture

This is designed as a **pnpm workspace monorepo** with the following planned structure:

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
│   │   └── package.json
│   └── shared/                  # Shared code and types
│       ├── types/               # TypeScript type definitions
│       └── utils/               # Common utilities
```

## Technology Stack

- **Frontend**: Slidev (Vue.js-based slide framework)
- **Backend**: Cloudflare Pages Functions (serverless APIs)
- **Infrastructure**: Cloudflare Pages for hosting
- **Language**: TypeScript throughout
- **Package Manager**: pnpm with workspaces
- **Deployment**: GitHub Actions → Cloudflare Pages

## Development Commands

**Note**: The project is currently in planning/specification phase. No actual implementation exists yet.

Based on the specification, the planned commands will be:

```bash
# Install dependencies (when implemented)
pnpm install

# Start development server
pnpm dev                    # Runs slide app at localhost:3030

# Build for production
pnpm build                  # Builds static site to apps/slide/dist

# Preview production build
pnpm preview

# Local API development (separate terminal)
npx wrangler pages dev dist --compatibility-date=2024-01-01
```

## Key Features to Implement

1. **Interactive CSS Playground**: Real-time CSS editing with iframe preview
2. **API Integration**: Slide components that call backend APIs
3. **Security**: CSP headers, rate limiting, input sanitization
4. **Responsive Design**: Mobile-friendly presentation interface

## API Endpoints (Planned)

- `GET /api/hello?name={name}` - Simple greeting API
- `POST /api/css` - Save CSS snippets with sanitization

## Security Requirements

- Content Security Policy (CSP) enforcement
- Rate limiting (100 requests/minute per IP)
- Input sanitization for CSS code (max 100KB, filter dangerous content)
- XSS protection through proper escaping

## Important Implementation Notes

- Use Cloudflare Pages Functions (not Workers) for API endpoints
- All API code should be in `/apps/slide/functions/` directory
- Implement proper error handling with user-friendly messages
- Follow Vue.js/Slidev conventions for component development
- Use shared types from `/apps/shared/types/` for consistency

## Testing Strategy

- Local development: Slidev dev server + Wrangler for API functions
- Component testing: CSS playground real-time updates, API demo error handling
- Build verification: Ensure clean dist/ output
- API testing: cURL commands for endpoint validation

## Current Status

The repository currently contains only:
- Project specification document (`docs/AGENT_PROMPT.md`)
- License files
- Git configuration

**No actual implementation exists yet** - this is a greenfield project ready for development based on the comprehensive specification in `docs/AGENT_PROMPT.md`.