import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import vitePluginImp from 'vite-plugin-imp';
import svgrPlugin from 'vite-plugin-svgr';

import removeConsole from 'vite-plugin-remove-console';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        // Your specific library configuration
      ],
    }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
     // Remove console logs in production builds
    //  removeConsole({
    //   exclude: ['error', 'warn'], // Optional: specify which types of console logs to keep
    // }),
    removeConsole({ custom: ["console.log()", "console.warn()" ] })
  ],
  build: {
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  define: {
    'import.meta.env': JSON.stringify(import.meta.env),
  },
}));