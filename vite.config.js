import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/Social-React-App/',
  plugins: [
    react(),
    replace({
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(
        process.env.VITE_GOOGLE_CLIENT_ID
      ),
      preventAssignment: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  },
});
