import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Cambia "base" al nombre de tu repositorio si lo publicas en
// https://<usuario>.github.io/<repo>/  (déjalo en '/' si usas un dominio propio
// o publicas en <usuario>.github.io directamente)
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Elige tu pan · OKIN Quiz',
        short_name: 'OKIN Quiz',
        description: '¿Cuánto conoces el catálogo de panes de OKIN?',
        theme_color: '#2E1D12',
        background_color: '#F3ECDD',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
