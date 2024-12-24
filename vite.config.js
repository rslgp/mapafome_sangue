import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  base: 'https://raw.githubusercontent.com/rslgp/mapafome_sangue/refs/heads/gh-pages'
})
