// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'To! Gather',
        short_name: 'Togather',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/Togather.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/Togather.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/ocr/receipt': {
        target: 'https://6z6ojlb4ab.apigw.ntruss.com/custom/v1/33255/abfa332191b2a5beddd3e52a02738361b81c71214c0ff13d894c8042d6229297/document/receipt',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ocr\/receipt/, ''),
      },
      '/ocr/general': {
        target: 'https://xtpepgtvpf.apigw.ntruss.com/custom/v1/33324/4f03eeb32bf0afec48dd9309b68fe051d05d77432c6a97c2b8261675b9b8df9b/general',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ocr\/general/, ''),
      }
    },
  },
  //웹소켓 설정이래..
  define: {
    global: 'window',
  }
});
