import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';
import stylex from '@stylexjs/unplugin';
export default defineConfig({
  plugins: [stylex.vite({ dev: false, runtimeInjection: false }), solid({ ssr: true, dev: false, refresh: false, solid: { hydratable: true } })],
  optimizeDeps: { exclude: ['@ui-sdk/core'] },
  resolve: { conditions: ['browser', 'development'] },
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'], include: ['tests/**/*.test.{ts,tsx}'], restoreMocks: true },
});
