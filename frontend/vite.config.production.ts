import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import vitePluginImp from 'vite-plugin-imp';
import svgrPlugin from 'vite-plugin-svgr';
import removeConsole from 'vite-plugin-remove-console';
import dynamicImport from 'rollup-plugin-dynamic-import-variables';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    dynamicImport({
      include: ['src/**/*.ts', 'src/**/*.tsx'], // Limit the plugin to only process TypeScript files
      exclude: ['index.html'], // Exclude HTML files from the plugin's scope
    }),
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
    removeConsole({ custom: ["console.log()", "console.warn()", "console.error()" ] })
  ],
  build: {
    sourcemap: mode !== 'production', // Disable source maps in production
    minify: 'terser', // Use terser to minify the bundle
    terserOptions: {
      compress: {
        drop_console: true, // Drop console statements
        drop_debugger: true, // Drop debugger statements
      },
      format: {
        comments: false, // Removes comments
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js', // Include a hash in file names for caching
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  define: {
    // 'import.meta.env': JSON.stringify(import.meta.env),
    // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // 'process.env': {},
  },
}));