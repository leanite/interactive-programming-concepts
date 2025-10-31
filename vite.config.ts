import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'

const rootDir = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@types': resolve(rootDir, 'src/types/index.ts'),
      '@operations': resolve(rootDir, 'src/types/operations.ts'),
      '@languages': resolve(rootDir, 'src/types/languages.ts'),
      '@algorithms': resolve(rootDir, 'src/types/algorithms.ts'),
      '@structures': resolve(rootDir, 'src/types/structures.ts'),
      '@engines': resolve(rootDir, 'src/engine/index.ts'),
      '@factories': resolve(rootDir, 'src/factories/index.ts'),
      '@registries': resolve(rootDir, 'src/registries/index.ts'),
      '@renderers': resolve(rootDir, 'src/renderers/index.ts'),
      '@tracers': resolve(rootDir, 'src/tracers/index.ts'),
      '@snippets': resolve(rootDir, 'src/snippets/'),
    },
  },
})
