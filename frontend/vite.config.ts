import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import vitePluginImp from 'vite-plugin-imp';
import svgrPlugin from 'vite-plugin-svgr';


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT}/api`,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react({
      // Optional configuration for react plugin
    }),
    // dynamicImportVariables(),
    vitePluginImp({
      libList: [
        // Configuration for vite-plugin-imp
      ],
    }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  build: {
    sourcemap: true, // Enable source maps for easier debugging
    rollupOptions: {
      output: {
        // Configuration for Rollup output
      },
    },
  },
  define: {
    'import.meta.env': JSON.stringify(import.meta.env),
  },
});
