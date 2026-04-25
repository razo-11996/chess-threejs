import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Root URL for built assets. Use `/your-repo-name/` for GitHub Project Pages; `/` for Netlify, Vercel, Cloudflare Pages.
 * Example: `VITE_BASE_URL=/chess-r3f-advanced/ npm run build`
 */
const base = process.env.VITE_BASE_URL ?? '/'

export default defineConfig({
  plugins: [react()],
  base,
})
