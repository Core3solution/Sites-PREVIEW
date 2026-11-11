// Gera os estudos visuais procedurais (WebGL2 em Chromium headless) e exporta WebP.
// Uso: npm run visuals [-- --preview] [-- --only=hero]
import { createRequire } from 'node:module';
import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { scenes } from './visuals/scenes.mjs';

// Playwright pré-instalado no ambiente (ou instalado localmente): resolvido via require/NODE_PATH.
const { chromium } = createRequire(import.meta.url)('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/media/visuals');
const args = process.argv.slice(2);
const preview = args.includes('--preview');
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1]?.split(',');
const SS = preview ? 1 : 2; // supersampling
const override = JSON.parse(args.find((a) => a.startsWith('--set='))?.slice(6) ?? '{}');
const suffix = args.find((a) => a.startsWith('--suffix='))?.slice(9) ?? '';

const frag = await readFile(path.join(root, 'scripts/visuals/shader.frag'), 'utf8');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
await page.setContent('<canvas id="c"></canvas>');

const manifest = {};
for (const s of scenes) {
  if (only && !only.includes(s.id)) continue;
  const scale = preview ? 0.4 : 1;
  const W = Math.round(s.w * scale * SS), H = Math.round(s.h * scale * SS);
  const t0 = Date.now();
  const dataUrl = await page.evaluate(({ frag, W, H, p }) => {
    const c = document.getElementById('c'); c.width = W; c.height = H;
    const gl = c.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
    const vs = `#version 300 es\nin vec2 a;void main(){gl_Position=vec4(a,0,1);}`;
    const mk = (t, src) => { const sh = gl.createShader(t); gl.shaderSource(sh, src); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; };
    const pr = gl.createProgram(); gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(gl.getUniformLocation(pr, 'uRes'), W, H);
    for (const [k, v] of Object.entries(p)) {
      const u = gl.getUniformLocation(pr, k); if (!u) continue;
      if (Array.isArray(v)) gl.uniform3f(u, ...v); else if (k === 'uShape') gl.uniform1i(u, v); else gl.uniform1f(u, v);
    }
    // renderiza em faixas para não estourar o watchdog do SwiftShader
    gl.viewport(0, 0, W, H); gl.enable(gl.SCISSOR_TEST);
    const band = 128;
    for (let y = 0; y < H; y += band) { gl.scissor(0, y, W, band); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.finish(); }
    return c.toDataURL('image/png');
  }, { frag, W, H, p: { ...s.p, ...override } });
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  const outW = Math.round(s.w * scale);
  const variants = preview ? [outW] : [outW, Math.round(outW / 2)];
  const files = [];
  for (const vw of variants) {
    const name = `${s.id}${suffix}-${vw}.webp`;
    await sharp(png).resize(vw).webp({ quality: 84, effort: 5 }).toFile(path.join(outDir, name));
    files.push({ src: `/media/visuals/${name}`, width: vw });
  }
  const lqip = await sharp(png).resize(24).webp({ quality: 40 }).toBuffer();
  manifest[s.id] = { alt: s.alt, width: outW, height: Math.round(s.h * scale), files, placeholder: `data:image/webp;base64,${lqip.toString('base64')}` };
  console.log(`${s.id}: ${W}x${H} em ${Date.now() - t0}ms`);
}
await browser.close();
if (!preview) {
  const mpath = path.join(root, 'src/core/generated/visuals.manifest.json');
  await mkdir(path.dirname(mpath), { recursive: true });
  let prev = {};
  try { prev = JSON.parse(await readFile(mpath, 'utf8')); } catch {}
  await writeFile(mpath, JSON.stringify({ ...prev, ...manifest }, null, 2));
}
