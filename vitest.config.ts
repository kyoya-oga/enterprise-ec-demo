import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['tests/e2e/**', 'node_modules/**'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: [
        // Config files
        '*.config.js',
        '*.config.ts',
        // Build artifacts
        '.next/**/*',
        'dist/**/*',
        'build/**/*',
        // Type definitions
        'src/types/**/*',
        'src/features/**/types/**/*',
        // Index files (re-exports)
        '**/index.ts',
        // Test files
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/__tests__/**/*',
        // Node modules
        'node_modules/**/*',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
