import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/Portofoliu-architizer/',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/*',  // Copy all static assets
          dest: './'
        },
        {
          src: 'src/CASA_BACAU.gltf',  // Your 3D model
          dest: './'
        },
        {
          src: 'node_modules/three/examples/jsm/controls/OrbitControls.js',
          dest: './assets/three'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      external: ['fsevents'],
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name].js'
      }
    }
  },
  optimizeDeps: {
    include: [
      'three',
      'three/examples/jsm/controls/OrbitControls',
      'three/examples/jsm/loaders/GLTFLoader'
    ],
    exclude: ['fsevents']
  },
  server: {
    fs: {
      strict: false  // Allows serving files outside root
    }
  }
});