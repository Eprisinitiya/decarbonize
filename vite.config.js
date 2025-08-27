import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Ensure this starts and ends with a slash!
  // It should be /repository-name/
  base: '/decarbonize/', 
  plugins: [react()],
})