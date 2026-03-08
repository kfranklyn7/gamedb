import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const serveLogosPlugin = () => ({
  name: 'serve-logos',
  configureServer(server) {
    server.middlewares.use('/logos', (req, res, next) => {
      // req.url might have query params like ?v=123
      const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.resolve('../logos', cleanUrl.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(fs.readFileSync(filePath));
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveLogosPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
})
