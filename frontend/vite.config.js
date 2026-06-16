import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  base: '/Raj-s-Personal-Expense-Tracker/',
  plugins: [react(), viteSingleFile()],
})
