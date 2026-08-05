import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

function getGitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'dev' // fuera de un repo git (p.ej. build local sin historial)
  }
}

// Cambia "base" al nombre de tu repositorio si lo publicas en
// https://<usuario>.github.io/<repo>/  (déjalo en '/' si usas un dominio propio
// o publicas en <usuario>.github.io directamente)
export default defineConfig({
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js'
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __GIT_HASH__: JSON.stringify(getGitHash()),
    __BUILD_DATE__: JSON.stringify(
      new Date().toISOString().slice(0, 16).replace('T', ' ')
    )
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,png,jpg,jpeg,webmanifest}']
      },
      manifest: {
        name: 'Elige tu pan · OKIN Quiz',
        short_name: 'OKIN Quiz',
        description: '¿Cuánto conoces el catálogo de panes de OKIN?',
        theme_color: '#2E1D12',
        background_color: '#F3ECDD',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
