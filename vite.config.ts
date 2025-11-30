import { defineConfig } from 'rolldown-vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'build',
    lib: {
      entry: 'src/dot-path.ts',
      name: 'dot-path',
      fileName: format => `dot-path.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
  },
  plugins: [
    dts({
      tsconfigPath: 'tsconfig.library.json',
    }),
  ],
});
