import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['test-birtix-backend.onrender.com'],
    fs: {
      strict: false,
    },
    historyApiFallback: true, // 👈 add this line
  },
})
