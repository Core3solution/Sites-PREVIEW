// Cria um novo cliente a partir do modelo.
// Uso: npm run novo-cliente -- <pasta> "Nome da Empresa"
//   <pasta>: minúsculas, números e hífens (ex.: studio-detail-abc)
import { cp, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, ...nameParts] = process.argv.slice(2);
const name = nameParts.join(' ').trim();
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || !name) {
  console.error('Uso: npm run novo-cliente -- <pasta> "Nome da Empresa"   (pasta: minúsculas, números e hífens)');
  process.exit(1);
}
const exists = async (p) => access(p).then(() => true, () => false);
const codeDir = path.join(root, 'src/clients', slug);
if (await exists(codeDir)) {
  console.error(`Já existe src/clients/${slug}. Escolha outra pasta.`);
  process.exit(1);
}

// 1) Código do cliente (copiado do modelo)
await cp(path.join(root, 'src/clients/_modelo'), codeDir, { recursive: true });
for (const f of ['photos.ts', 'sources.ts']) {
  const p = path.join(codeDir, f);
  await writeFile(p, (await readFile(p, 'utf8')).replaceAll('clientes/_modelo/', `clientes/${slug}/`).replaceAll('clientes/<pasta>/', `clientes/${slug}/`));
}
const idx = path.join(codeDir, 'index.ts');
await writeFile(idx, (await readFile(idx, 'utf8')).replaceAll('[PREENCHER] Nome da Empresa', name).replace("status: { preliminary: true, note: 'Cliente-modelo: dados de exemplo.' }", "status: { preliminary: true, note: 'Versão preliminar: materiais da empresa ainda em verificação.' }"));

// 2) Materiais, documentos e evidências do cliente
const base = path.join(root, 'clientes', slug);
for (const d of ['anexos/imagens', 'docs', 'evidencias']) await mkdir(path.join(base, d), { recursive: true });
await mkdir(path.join(root, 'public/clientes', slug, 'fotos'), { recursive: true });
const fill = (t) => t.replaceAll('{{EMPRESA}}', name).replaceAll('{{PASTA}}', slug);
const modelos = path.join(root, 'docs/modelo');
await writeFile(path.join(base, 'CLAUDE.md'), fill(await readFile(path.join(modelos, 'CLAUDE_CLIENTE_MODELO.md'), 'utf8')));
await writeFile(path.join(base, 'docs/BRIEFING.md'), fill(await readFile(path.join(modelos, 'BRIEFING_CLIENTE_MODELO.md'), 'utf8')));
await writeFile(path.join(base, 'docs/PROMPT_IMAGENS.md'), fill(await readFile(path.join(modelos, 'PROMPT_IMAGENS_MODELO.md'), 'utf8')));
await writeFile(path.join(base, 'docs/RELATORIO_ENTREGA.md'), fill(await readFile(path.join(modelos, 'RELATORIO_ENTREGA_MODELO.md'), 'utf8')));
await writeFile(path.join(base, 'docs/RELATORIO_FONTES.md'), fill(await readFile(path.join(modelos, 'RELATORIO_FONTES_MODELO.md'), 'utf8')));
for (const k of ['.gitkeep']) {
  await writeFile(path.join(base, 'anexos/imagens', k), '');
  await writeFile(path.join(base, 'evidencias', k), '');
  await writeFile(path.join(root, 'public/clientes', slug, 'fotos', k), '');
}

// 3) Teste específico do cliente (trava catálogo e preços quando estiverem verificados)
const testDir = path.join(root, 'tests/clients');
await mkdir(testDir, { recursive: true });
await writeFile(
  path.join(testDir, `${slug}.test.ts`),
  `import site from '../../src/clients/${slug}';
import { formatPrice } from '../../src/core/lib/format';

// Depois de conferir o catálogo com as capturas, troque os it.todo por asserções (veja company-auto-spa.test.ts).
describe('${name}: dados verificados', () => {
  it('tem aviso de demonstração', () => {
    expect(site.meta.demoNotice?.short).toContain('não é o site oficial');
  });
  it.todo('catálogo: quantidade, nomes e valores exatamente como nas capturas');
  it.todo('variantes não mescladas e "a partir de" preservado');
  it.todo('reputação somente com fonte e data');
  void formatPrice;
});
`,
);

console.log(`Cliente "${name}" criado em:
  src/clients/${slug}/        (index.ts, catalog.ts, photos.ts, sources.ts, qa.json)
  clientes/${slug}/           (CLAUDE.md, docs/, anexos/, evidencias/)
  public/clientes/${slug}/fotos/
  tests/clients/${slug}.test.ts

Próximos passos (docs/modelo/PLAYBOOK_PREVIAS_AUTOMOTIVAS.md):
  1. Coloque os materiais em clientes/${slug}/anexos/ e preencha clientes/${slug}/docs/BRIEFING.md
  2. Substitua todo “[PREENCHER]” em src/clients/${slug}/
  3. VITE_CLIENT=${slug} npm run dev`);
