import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  css: {
    modules: false, // Отключаем CSS-модули, если они не нужны
  },
  build: {
    cssCodeSplit: true, // Разделение CSS на отдельные файлы
  },
});
