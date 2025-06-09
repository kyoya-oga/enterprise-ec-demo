# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run type-check         # Run TypeScript compiler without emitting files

# Testing
npm run test               # Run type-check + unit tests with Vitest
npm run test:coverage      # Run tests with coverage report (80% threshold)
```

## Architecture Overview

This is a **Japanese-focused enterprise e-commerce application** built with Next.js 14 App Router, TypeScript, and Tailwind CSS. The architecture follows a **feature-based modular design** with **internationalization support**.

### Key Technologies
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** with custom design system (Red/Pink gradients + Zinc grayscale)
- **Vitest** for testing with 80% coverage requirements
- **Minimal dependencies** - no external UI libraries or heavy state management

### Project Structure

```
src/
├── app/[locale]/           # Internationalized routing
│   ├── (shop)/            # Customer-facing pages
│   ├── (account)/         # User account management
│   ├── (auth)/            # Authentication flows
│   └── (admin)/           # Admin dashboard
├── components/
│   ├── ui/                # Reusable UI primitives
│   └── layout/            # Layout components
├── features/              # Feature-based modules
│   ├── auth/              # Authentication
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Payment processing
│   └── products/          # Product catalog
└── lib/                   # Utilities
```

## Development Guidelines

### Route Organization
- **Route Groups**: Use `(shop)`, `(auth)`, `(account)`, `(admin)` for organization without affecting URLs
- **Internationalization**: All pages are under `[locale]` for multi-language support
- **Layouts**: Each route group has its own `layout.tsx` for section-specific UI

### Feature Architecture
Each feature module follows this structure:
```
features/[feature]/
├── components/            # Feature-specific components
├── hooks/                 # Custom React hooks
├── store/                 # State management
├── types/                 # TypeScript interfaces
├── utils/                 # Helper functions
└── index.ts               # Public API exports (barrel exports)
```

### Component System
- **UI Components**: Located in `src/components/ui/` with 4 variants (primary, secondary, outline, ghost)
- **Design Tokens**: Red/Pink gradients for primary colors, Zinc for neutrals
- **Export Pattern**: Use barrel exports (`index.ts`) for clean imports
- **Styling**: Tailwind CSS with Inter font family

### State Management
- **No external libraries** - uses React's built-in state and context
- **Feature-isolated state** - each feature manages its own state
- **Type-safe** - comprehensive TypeScript interfaces for all features

### Utilities
Key utilities in `lib/utils.ts`:
- `formatPrice()` - Internationalized currency formatting
- `formatDate()` - Locale-aware date formatting
- `cn()` - Class name concatenation
- `slugify()` - URL-friendly string conversion

### Testing Requirements
- **80% coverage threshold** for all metrics (statements, branches, functions, lines)
- **Vitest + jsdom** testing environment
- **Type checking** integrated into test pipeline
- Place tests in `tests/unit/` following the source structure

### TypeScript Configuration
- **Strict mode enabled** with comprehensive type checking
- **Path aliases**: Use `@/*` for `src/*` imports
- **Interface-driven development** - define types in feature `types/` directories

## Code Style

### File Naming
- Use PascalCase for components (`Button.tsx`, `ProductCard.tsx`)
- Use camelCase for utilities and hooks (`formatPrice.ts`, `useCart.ts`)
- Use kebab-case for pages in app directory (`product-details/page.tsx`)

### Import Organization
- Prefer feature barrel exports: `import { ProductCard } from '@/features/products'`
- Use absolute imports with `@/` alias
- Group imports: external, internal, relative

### Component Patterns
- **Server Components by default** - use `'use client'` only when needed
- **Props interfaces** - define component props with TypeScript interfaces
- **Consistent styling** - follow existing gradient and spacing patterns

## Language Support
- **Primary language**: Japanese (`lang="ja"` in root layout)
- **URL structure**: `/ja/products`, `/en/products`
- **Locale parameter**: Available in all pages as `params.locale`