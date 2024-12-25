import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/mapafome_sangue/',
  server: {
    port: 8080
  }
})
