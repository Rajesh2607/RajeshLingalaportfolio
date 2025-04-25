import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Ensures proper routing when deployed
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
