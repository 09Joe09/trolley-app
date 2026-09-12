import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: { allowedHosts: [".loca.lt"] },
  plugins: [react()],
})