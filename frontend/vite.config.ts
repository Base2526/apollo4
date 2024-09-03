import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  switch(mode){
    case 'production':{
      return {
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
      }
    }

    default:{
      return  {
        resolve: {
          alias: {
            '@': path.join(__dirname, 'src'),
          },
        },
        server: {
          // host: '127.0.0.1',
          host: '0.0.0.0', // Listen on all interfaces
          port: 5173,
          proxy: {
            '/api': {
              target: `http://localhost:${process.env.PORT}/api`,
              // changeOrigin: true,
              rewrite: path => path.replace(/^\/api/, ''),
            },
          },
          // watch: {
          //   usePolling: true, // Use polling to avoid refresh issues
          // }
        },
        plugins: [
          react(  ),
          vitePluginImp({
            libList: [
              // {
              //   libName: 'antd',
              //   style: name => `antd/es/${name}/style/index.css`,
              // },
              // {
              //   libName: 'lodash',
              //   libDirectory: '',
              //   camel2DashComponentName: false,
              //   style: () => {
              //     return false;
              //   },
              // },
            ],
          }),
          svgrPlugin({
            svgrOptions: {
              icon: true,
              // ...svgr options (https://react-svgr.com/docs/options/)
            },
          }),
        ],
        build: {
          sourcemap: true, // Enable source maps for easier debugging
        },
      }
    }
  }

 
})

/*
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  server: {
    // host: '127.0.0.1',
    host: '0.0.0.0', // Listen on all interfaces
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT}/api`,
        // changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
    // watch: {
    //   usePolling: true, // Use polling to avoid refresh issues
    // }
  },
  plugins: [
    react(  ),
    vitePluginImp({
      libList: [
        // {
        //   libName: 'antd',
        //   style: name => `antd/es/${name}/style/index.css`,
        // },
        // {
        //   libName: 'lodash',
        //   libDirectory: '',
        //   camel2DashComponentName: false,
        //   style: () => {
        //     return false;
        //   },
        // },
      ],
    }),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],
  build: {
    sourcemap: true, // Enable source maps for easier debugging
  },
});
*/