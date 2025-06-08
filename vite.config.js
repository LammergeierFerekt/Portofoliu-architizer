import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/Portofoliu-architizer/',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/*', // Ensure this matches your PDF folder
          dest: '', // Destination folder in the build output
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      external: ['fsevents'],
    },
    assetsInlineLimit: 0,
    emptyOutDir: true, // Automatically clears the dist folder before building
  },
});
