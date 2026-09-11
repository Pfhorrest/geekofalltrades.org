import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['__scripts/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
