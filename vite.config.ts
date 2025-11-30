import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'build',
    lib: {
      entry: 'src/impl.ts',
      name: 'dot-path',
      fileName: format => `dot-path.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
  },
});
