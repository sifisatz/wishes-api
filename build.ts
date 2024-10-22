import type { BuildOptions } from "esbuild";

import { build } from "esbuild";

const options = {
  bundle: true,
  entryPoints: ["./src/index.ts"],
  banner: {
    js: "#!/usr/bin/env node",
  },
  platform: "node",
  outfile: "./dist/index.js",
  minify: true,
  format: "esm",
  logLevel: "info",
} satisfies BuildOptions;

async function buildApp() {
  try {
    await build(options);
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  }
}

buildApp();
