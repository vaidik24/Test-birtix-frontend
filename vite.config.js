import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['f96254440c6f.ngrok-free.app'],
    fs: {
      strict: false,
    },
    historyApiFallback: true, // 👈 add this line
  },
})
