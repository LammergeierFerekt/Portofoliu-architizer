import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Portofoliu-architizer/',
  build: {
    rollupOptions: {
      external: ['fsevents'],
      output: {
        assetFileNames: 'assets/[name].[ext]' // remove hash if you don't need it
      }
    },
    assetsInlineLimit: 0,
    emptyOutDir: true
  }
});
