import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';
import stylex from '@stylexjs/unplugin';
export default defineConfig({
  plugins: [stylex.vite({ dev: process.env.NODE_ENV === 'development', useCSSLayers: true, runtimeInjection: false }), solid({ ssr: true })],
  optimizeDeps: { exclude: ['@ui-sdk/core'] },
  build: { target: 'es2023', manifest: true },
  server: { host: '0.0.0.0', port: 4179, strictPort: true },
});
