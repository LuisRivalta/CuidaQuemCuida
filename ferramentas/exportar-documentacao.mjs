// Converte a nota de compilação do Obsidian em PDF e exporta os diagramas.
// Uso: node ferramentas/exportar-documentacao.mjs <node_modules do runtime> <mermaid.min.js>
import { readdir, readFile, mkdir, writeFile, mkdtemp } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const [modulos, mermaid] = process.argv.slice(2);
const require = createRequire(join(resolve(modulos), 'cqc-export.cjs'));
const { marked } = require('marked');
const { chromium } = require('playwright');
const navegador = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const raiz = resolve('documentacao');
const indice = join(raiz, 'Documentação Completa.md');
const arquivos = await readdir(raiz, { recursive: true, withFileTypes: true });
const notas = new Map(arquivos.filter((a) => a.name.endsWith('.md')).map((a) => [
  basename(a.name, '.md'), join(a.parentPath, a.name),
]));
const caminhosImagem = new Map(arquivos.filter((a) => /.(png|jpe?g|svg)$/i.test(a.name)).map((a) => [
  a.name, join(a.parentPath, a.name),
]));
const doc = await readFile(indice, 'utf8');
const seções = [...doc.matchAll(/^!\[\[([^\]]+)\]\]$/gm)].map((m) => m[1]);
const slug = (rotulo) => rotulo.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const escapar = (texto) => texto.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function renderizar(texto, arquivo, titulo) {
  let contador = 0;
  return marked.parse(texto
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replaceAll(/^```mermaid\r?\n([\s\S]*?)^```\s*$/gm, (_, bloco) =>
      `\n<pre class="mermaid" data-nome="${slug(titulo)}-${++contador}">${escapar(bloco.trim())}</pre>\n\n`)
    .replaceAll(/!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, (_, nome) => {
      const caminho = nome.includes('/') ? resolve(dirname(arquivo), nome) : caminhosImagem.get(nome);
      if (!caminho) throw new Error(`Imagem sem caminho: ${nome}`);
      return `<img src="${pathToFileURL(caminho).href}" alt="${escapar(basename(nome))}">`;
    })
    .replaceAll(/\[\[([^\]#|]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, nota, textoLink) =>
      seções.includes(nota) ? `[${textoLink ?? nota}](#${slug(nota)})` : (textoLink ?? nota)));
}

const capa = doc.split(/^!\[\[/m)[0];
const capítulos = await Promise.all(seções.map(async (titulo) => {
  const arquivo = notas.get(titulo);
  if (!arquivo) throw new Error(`Nota não encontrada: ${titulo}`);
  return `<section class="capitulo" id="${slug(titulo)}">${renderizar(await readFile(arquivo, 'utf8'), arquivo, titulo)}</section>`;
}));
const temporario = await mkdtemp(join(tmpdir(), 'cqc-doc-'));
const html = join(temporario, 'documentacao.html');
await writeFile(html, `<!doctype html><html lang="pt-BR"><meta charset="UTF-8"><title>CuidaQuemCuida</title>
<style>
* { box-sizing: border-box; }
body { margin: 0 auto; max-width: 850px; font: 11pt/1.48 "Segoe UI", Arial, sans-serif; color: #1e2a47; }
h1, h2, h3 { font-family: Georgia, serif; line-height: 1.2; break-after: avoid; }
h1 { font-size: 24pt; margin: 0 0 12pt; } h2 { font-size: 15pt; margin-top: 1.4em; } h3 { font-size: 12pt; }
.capa { padding: 65pt 28pt 50pt; background: #fff4ec; border-top: 8pt solid #ef8a62; break-after: page; }
.capa h1 { font-size: 35pt; } .capitulo + .capitulo { padding-top: 22pt; margin-top: 22pt; border-top: 1px solid #ddd8cf; }
p, li { widows: 2; orphans: 2; } a { color: #2f6b4f; text-decoration-thickness: 1px; }
table { width: 100%; font-size: 9pt; border-collapse: collapse; margin: 12pt 0; }
thead { display: table-header-group; } th, td { text-align: left; padding: 4pt 6pt; border: 1px solid #ddd8cf; overflow-wrap: anywhere; vertical-align: top; }
th { background: #e3efe5; } tr { break-inside: avoid; }
pre { background: #f4ece1; padding: 9pt; border-radius: 5pt; font-size: 8.5pt; white-space: pre-wrap; overflow-wrap: anywhere; }
pre.mermaid { background: white; text-align: center; break-inside: avoid; }
pre.mermaid svg { display: block; margin: auto; max-width: 100%; max-height: 190mm; }
img { display: block; max-width: 100%; max-height: 154mm; object-fit: contain; }
table img { width: 100%; max-height: 92mm; object-fit: cover; object-position: top; }
blockquote { margin-left: 0; padding-left: 12pt; border-left: 2px solid #7aa98a; }
</style><body><section class="capa">${renderizar(capa, indice, 'CuidaQuemCuida')}</section>${capítulos.join('\n')}</body></html>`);

const browser = await chromium.launch({ executablePath: navegador, headless: true,
  args: ['--allow-file-access-from-files'] });
try {
  const esbocos = await browser.newPage({ viewport: { width: 1370, height: 900 }, deviceScaleFactor: 2 });
  const pastaWireframes = join(raiz, '02-wireframes');
  await esbocos.goto(pathToFileURL(join(pastaWireframes, 'wireframes.html')).href);
  await esbocos.screenshot({ path: join(pastaWireframes, 'imagens', 'wireframes.png'), fullPage: true });
  await esbocos.close();
  const pagina = await browser.newPage({ viewport: { width: 1080, height: 900 }, deviceScaleFactor: 2 });
  await pagina.goto(pathToFileURL(html).href);
  await pagina.addScriptTag({ path: mermaid });
  const contagem = await pagina.evaluate(async () => {
    window.mermaid.initialize({ startOnLoad: false, theme: 'neutral', sequence: { useMaxWidth: true } });
    await window.mermaid.run({ querySelector: '.mermaid' });
    const diagramas = [...document.querySelectorAll('.mermaid')];
    if (diagramas.some((diagrama) => !diagrama.querySelector('svg'))) throw new Error('Diagrama sem SVG');
    const imagens = [...document.images];
    await Promise.all(imagens.map((img) => img.decode()));
    return diagramas.length;
  });
  const pastaDiagramas = join(raiz, '01-diagramas', 'imagens');
  await mkdir(pastaDiagramas, { recursive: true });
  for (const locator of await pagina.locator('.mermaid').all()) {
    const nome = await locator.getAttribute('data-nome');
    await locator.screenshot({ path: join(pastaDiagramas, nome + '.png') });
  }
  await pagina.pdf({
    path: resolve('Documentacao-CuidaQuemCuida.pdf'),
    format: 'A4', printBackground: true, displayHeaderFooter: true,
    margin: { top: '17mm', bottom: '16mm', left: '16mm', right: '16mm' },
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;text-align:right;margin:0 16mm;font:9px Segoe UI;color:#586179">CuidaQuemCuida · <span class="pageNumber"></span></div>',
    tagged: true, outline: true,
  });
  console.log(`${seções.length} capítulos e ${contagem} diagramas renderizados.`);
} finally {
  await browser.close();
}
