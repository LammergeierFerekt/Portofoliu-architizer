import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/Portofoliu-architizer/',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/*', // Copy all PDFs
          dest: './'
        },
        {
          src: 'src/CASA_BACAU.gltf',
          dest: './'
        }
      ],
      flatten: false // Preserve directory structure
    })
  ],
  build: {
    rollupOptions: {
      external: ['fsevents'],
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    assetsInlineLimit: 0,
    emptyOutDir: true
  }
});