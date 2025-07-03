# Gemini Coder Pro-specific Project Instructions

This document provides Gemini Coder Pro with specific instructions and context for working on this project.

## Project Overview

This is an enterprise-grade e-commerce demo application built with Next.js and TypeScript. It features a robust architecture, including internationalization (i18n), feature-based code organization, and a comprehensive testing strategy.

## Key Technologies

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Radix UI for headless components.
- **Unit/Integration Testing**: Vitest
- **E2E Testing**: Playwright
- **Linting**: ESLint
- **Type Checking**: TypeScript Compiler (tsc)

## Development Workflow

### Running the Application

- **Development Server**: `npm run dev`
- **Production Build**: `npm run build`
- **Start Production Server**: `npm run start`

### Code Quality and Verification

Before committing any changes, please run the following commands to ensure code quality and prevent regressions.

1.  **Type Checking**: `npm run type-check`
    - Ensures there are no TypeScript errors.
2.  **Linting**: `npm run lint`
    - Checks for code style and quality issues according to the project's ESLint configuration.
3.  **All Tests**: `npm run test`
    - Runs both the type checker and all Vitest unit/integration tests.
4.  **E2E Tests**: `npm run test:e2e`
    - Runs the Playwright end-to-end tests. This is crucial for verifying critical user flows.

## Coding Conventions

- **Architecture**: The project follows a feature-based architecture. New features should be organized within the `src/features` directory. Core UI components are in `src/components/ui`, and shared logic is in `src/lib`.
- **State Management**: Zustand is used for client-side state management.
- **Styling**: Use Tailwind CSS for styling. Create new components using `clsx` and `tailwind-merge` for conditional and clean class names.
- **API Routes**: Server-side API logic is located in `src/app/api/`.
- **Server Actions**: Use Next.js Server Actions for mutations and data fetching where appropriate. Place them in `src/lib/actions/`.
- **Authentication**: Authentication is handled via JWTs stored in cookies. See `src/lib/auth/` for implementation details.

## Testing Guidelines

- **Unit/Integration Tests**: Write Vitest tests for new components, utility functions, and server-side logic. Test files should be co-located with the source code (e.g., `*.test.ts` or within a `__tests__` directory).
- **E2E Tests**: Write Playwright tests for major user journeys (e.g., login, registration, adding to cart, checkout). E2E tests are located in the `tests/e2e` directory.
- **Test Coverage**: Aim to maintain or increase test coverage. You can check the current coverage by running `npm run test:coverage`.

## Implementation Approach

- **Plan First**: Before any implementation, create a clear and concise plan.
- **Refine the Plan**: Discuss and refine the plan to ensure it is robust and considers all edge cases.
- **Implement Carefully**: Implement the plan cautiously, prioritizing the stability of the application. Avoid rushing, which could lead to breaking changes.

## Git and Commits

- **Branching**: Please work on feature branches checked out from `main`.
- **Commits**: Follow the Conventional Commits specification for commit messages. This helps in maintaining a clear and automated version history.
  - Example: `feat(auth): add password reset functionality`
  - Example: `fix(cart): correct calculation for item subtotals`
- **Pull Requests**: Before submitting a pull request, ensure all checks (linting, type-checking, testing) are passing.
