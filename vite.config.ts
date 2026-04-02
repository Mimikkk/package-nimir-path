import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: "build",
    lib: {
      entry: "src/dot-path.ts",
      name: "dot-path",
      fileName: (format) => `dot-path.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
  },
  plugins: [
    dts({
      tsconfigPath: "tsconfig.library.json",
    }),
  ],
  test: {
    globalSetup: ["./attest.setup.ts"],
  },
});
