import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
const esbuild = require("/opt/npm-tools/node_modules/esbuild");

const root = path.resolve(import.meta.dirname, "..");
await esbuild.build({
  entryPoints: [path.join(root, "render/entry.tsx")],
  outfile: path.join(root, "render/bundle.js"),
  bundle: true,
  format: "iife",
  jsx: "automatic",
  target: "chrome120",
  nodePaths: ["/opt/npm-tools/node_modules"],
  alias: { remotion: path.join(root, "render/remotion-shim.tsx") },
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
});
