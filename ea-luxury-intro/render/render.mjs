// Usage:
//   node render/render.mjs stills 30,100,170      -> out/still-<frame>.jpg (no motion blur)
//   node render/render.mjs full                   -> render/frames/s0000.jpg ... (720 samples @60fps)
import { createRequire } from "node:module";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("/home/claude/.npm-global/lib/node_modules/playwright");

const root = path.resolve(import.meta.dirname, "..");
const mime = { ".html": "text/html", ".js": "text/javascript", ".ttf": "font/ttf", ".wav": "audio/wav", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": mime[path.extname(p)] || "application/octet-stream", "access-control-allow-origin": "*" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;

const mode = process.argv[2] || "stills";
const ARGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"];

const settle = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on("pageerror", (e) => console.log("PAGEERR", e.message));
  page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE", m.text()); });
  await page.goto(`http://127.0.0.1:${port}/render/page.html`);
  await page.waitForFunction(() => window.harnessReady);
  await page.evaluate(() => window.renderFrame(0));
  await page.waitForFunction(() => window.__pendingRenders() === 0);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

const browser = await chromium.launch({ args: ARGS });

if (mode === "stills") {
  const frames = (process.argv[3] || "0").split(",").map(Number);
  const page = await openPage(browser);
  for (const f of frames) {
    await page.evaluate((n) => window.renderFrame(n), f);
    await settle(page);
    const t0 = Date.now();
    await page.screenshot({ path: path.join(root, "out", `still-${String(f).padStart(3, "0")}.jpg`), type: "jpeg", quality: 92 });
    console.log("frame", f, Date.now() - t0, "ms");
  }
} else {
  const outDir = path.join(root, "render/frames");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const TOTAL = 720;
  const WORKERS = Number(process.env.WORKERS || 2);
  const sampleFrame = (k) => Math.max(0, Math.min(359.25, Math.floor(k / 2) + (k % 2 ? 0.25 : -0.25)));
  let next = 0, done = 0;
  const t0 = Date.now();
  const worker = async () => {
    const page = await openPage(browser);
    for (;;) {
      const k = next++;
      if (k >= TOTAL) break;
      await page.evaluate((n) => window.renderFrame(n), sampleFrame(k));
      await settle(page);
      await page.screenshot({ path: path.join(outDir, `s${String(k).padStart(4, "0")}.jpg`), type: "jpeg", quality: 95 });
      if (++done % 40 === 0) console.log(`${done}/${TOTAL}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  };
  await Promise.all(Array.from({ length: WORKERS }, worker));
  console.log("samples done");
}
await browser.close();
server.close();
