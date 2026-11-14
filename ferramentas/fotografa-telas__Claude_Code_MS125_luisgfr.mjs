// Fotografa as telas Hoje e login do CuidaQuemCuida (modo demonstração) num navegador sem janela
// (Edge ou Chrome, pela porta de depuração local) e lista os erros do console.
// Fotos: celular de dia, de noite (fuso trocado), modo escuro, Paulo fora do turno, "Não foi dado",
// "Desfazer", letra a 150%, celular pequeno (360x640) e computador. Com "login", só a tela de entrada.
// Uso: node ferramentas/fotografa-telas__Claude_Code_MS125_luisgfr.mjs <url-base> <pasta-saida> [login]
//   ex.: node ferramentas/fotografa-telas__Claude_Code_MS125_luisgfr.mjs http://127.0.0.1:8000 C:\temp\fotos
// Precisa de Node 22 ou mais novo (WebSocket e fetch nativos). Navegador: variável CQC_NAVEGADOR
// (caminho do .exe); sem ela, usa o Edge no caminho padrão do Windows.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [base, saida] = process.argv.slice(2);
const NAVEGADOR = process.env.CQC_NAVEGADOR || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORTA = 9334;
mkdirSync(saida, { recursive: true });

const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));
const erros = [];

async function abrirNavegador() {
  const navegador = spawn(NAVEGADOR, ['--headless=new', `--remote-debugging-port=${PORTA}`, `--user-data-dir=${join(saida, 'perfil-navegador')}`,
    '--no-first-run', '--disable-extensions', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let alvo;
  for (let i = 0; i < 40 && !alvo; i++) {
    await espera(250);
    alvo = await fetch(`http://127.0.0.1:${PORTA}/json/list`).then((r) => r.json()).then((l) => l.find((t) => t.type === 'page')).catch(() => null);
  }
  if (!alvo) { navegador.kill(); throw new Error('O navegador não respondeu'); }
  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  await new Promise((ok) => ws.addEventListener('open', ok));
  let seq = 0;
  const pendentes = new Map();
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pendentes.has(msg.id)) { pendentes.get(msg.id)(msg); pendentes.delete(msg.id); return; }
    if (msg.method === 'Runtime.exceptionThrown') erros.push('EXCEÇÃO: ' + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
    if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type)) {
      erros.push(`CONSOLE ${msg.params.type}: ` + msg.params.args.map((a) => a.value ?? a.description).join(' '));
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') erros.push('LOG: ' + msg.params.entry.text + ' ' + (msg.params.entry.url || ''));
  });
  const cdp = (method, params = {}) => new Promise((ok) => { const id = ++seq; pendentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
  await cdp('Runtime.enable');
  await cdp('Log.enable');
  await cdp('Page.enable');
  await cdp('Network.enable');
  await cdp('Network.setCacheDisabled', { cacheDisabled: true });   // sempre a versão nova dos arquivos
  return { navegador, ws, cdp };
}

const { navegador, ws, cdp } = await abrirNavegador();
const avaliar = async (expressao) => (await cdp('Runtime.evaluate', { expression: expressao, awaitPromise: true, returnByValue: true })).result?.result?.value;

async function preparar(largura, fuso) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: largura, height: 900, deviceScaleFactor: 1, mobile: largura < 700 });
  await cdp('Emulation.setTimezoneOverride', { timezoneId: fuso || '' });
  // modo claro por padrão (o Windows pode estar em modo escuro); a foto 06 liga o escuro
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
}

async function entrar(email) {
  // o ?n= muda a cada entrada para recarregar a página de verdade (só trocar o # mantinha os dados de demonstração do passo anterior)
  await cdp('Page.navigate', { url: `${base}/?n=${Date.now()}#/login` });
  await espera(1500);
  await avaliar(`sessionStorage.clear(); location.hash = '#/login'`);
  await espera(800);
  await avaliar(`(() => { const f = document.querySelector('form'); f.email.value = '${email}'; f.senha.value = 'demo1234';
    f.dispatchEvent(new Event('submit', { cancelable: true })); })()`);
  await espera(1500);
  await avaliar(`location.hash = '#/hoje'`);
  await espera(3800);   // deixa a animação de entrada terminar
}

async function foto(nome, largura) {
  const altura = await avaliar('Math.ceil(document.documentElement.scrollHeight)');
  await cdp('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: 1, mobile: largura < 700 });
  await espera(400);
  const { result } = await cdp('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(saida, `${nome}.png`), Buffer.from(result.data, 'base64'));
  if (await avaliar('document.documentElement.scrollWidth > window.innerWidth')) erros.push(`${nome}: conteúdo passa da largura`);
  const lixo = await avaliar(`(document.getElementById('conteudo').innerText.match(/\\b(null|undefined|NaN)\\b/) || [])[0] || ''`);
  if (lixo) erros.push(`${nome}: texto "${lixo}" visível`);
  const fontes = await avaliar(`[...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family).join(',')`);
  const gsap = await avaliar('typeof window.gsap');
  console.log(`foto: ${nome} | fontes: ${fontes || 'nenhuma'} | gsap: ${gsap} | erros até aqui: ${erros.length}`);
  await cdp('Emulation.setDeviceMetricsOverride', { width: largura, height: 900, deviceScaleFactor: 1, mobile: largura < 700 });
}

function terminar() {
  writeFileSync(join(saida, 'erros.txt'), erros.join('\n') || 'nenhum erro');
  console.log('ERROS:', erros.length ? '\n' + erros.join('\n') : 'nenhum');
  ws.close();
  navegador.kill();
}

// Modo "login": só a tela de entrada (dia, noite, computador) e o atalho da família de exemplo.
if (process.argv[4] === 'login') {
  const abrirLogin = async () => {
    await cdp('Page.navigate', { url: base + '/#/login' });
    await espera(1200);
    await avaliar(`sessionStorage.clear(); location.hash = '#/login'`);
    await espera(3200);
  };
  await preparar(390); await abrirLogin(); await foto('10-login-celular', 390);
  await avaliar(`document.querySelector('.mostrar-senha').click()`);
  await avaliar(`[...document.querySelectorAll('.pessoa-demo')][1].click()`);
  await espera(2500);
  const rota = await avaliar('location.hash');
  console.log('depois de tocar em Paulo, a rota é:', rota);
  if (rota !== '#/hoje') erros.push(`atalho da família não entrou (rota ${rota})`);
  await preparar(390, 'Asia/Tokyo'); await abrirLogin(); await foto('11-login-noite', 390);
  await preparar(1280); await abrirLogin(); await foto('12-login-computador', 1280);
  terminar();
  process.exit(0);
}

await preparar(390);
await entrar('marta@demo.cqc');
await foto('01-celular-marta', 390);

// "Não foi dado": no cartão, se o destaque for remédio; senão, no primeiro remédio pendente da lista
await avaliar(`(() => {
  const achar = (raiz) => [...raiz.querySelectorAll('button')].find((b) => b.textContent.includes('Não foi dado'));
  let botao = achar(document.querySelector('.agora'));
  if (!botao) {
    const item = [...document.querySelectorAll('details.caminho-corpo')].find((d) => achar(d));
    if (item) { item.open = true; botao = achar(item); }
  }
  botao?.click();
  return Boolean(botao);
})()`).then((achou) => console.log('formulário "Não foi dado" aberto:', achou));
await espera(900);
await foto('02-celular-nao-dado', 390);

// noite (o fuso de Tóquio adianta o relógio em 12 h): tema noturno, Marta fora do turno
await preparar(390, 'Asia/Tokyo');
await entrar('marta@demo.cqc');
await avaliar(`document.querySelector('.para-tras')?.setAttribute('open', '')`);
await foto('03-celular-noite', 390);

// noite, Paulo no turno: remédio pendente com "Não foi dado" e o motivo "Estava dormindo"
await preparar(390, 'Asia/Tokyo');
await entrar('paulo@demo.cqc');
await avaliar(`(() => {
  const botao = [...document.querySelectorAll('.agora button')].find((b) => b.textContent.includes('Não foi dado'));
  botao?.click();
  const radio = document.querySelector('input[value="Estava dormindo"]');
  if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
  return Boolean(botao);
})()`).then((achou) => console.log('noite, Paulo, "Não foi dado" aberto:', achou));
await espera(900);
await foto('10-noite-paulo-nao-dado', 390);

// celular em modo escuro, de dia
await preparar(390);
await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
await entrar('marta@demo.cqc');
await foto('06-celular-escuro-dia', 390);

// toque em "Dei o remédio"/"Feito": "Desfazer" no próprio item (foto logo depois do toque)
await preparar(390);
await entrar('marta@demo.cqc');
await avaliar(`(() => {
  const textos = ['Dei o remédio', 'Feito', 'Fui eu que dei', 'Fui eu que fiz'];
  const achar = (raiz) => [...raiz.querySelectorAll('.linha-botoes button')].find((b) => textos.includes(b.textContent.trim()));
  let botao = achar(document.querySelector('.agora'));
  if (!botao) {
    const item = [...document.querySelectorAll('details.caminho-corpo')].find((d) => achar(d));
    if (item) { item.open = true; botao = achar(item); }
  }
  botao?.scrollIntoView({ block: 'center' });
  botao?.click();
})()`);
await espera(900);
const { result: desfazer } = await cdp('Page.captureScreenshot', { format: 'png' });
writeFileSync(join(saida, '07-celular-desfazer.png'), Buffer.from(desfazer.data, 'base64'));
console.log('foto: 07-celular-desfazer (tela visível)');
await espera(16000);   // passa o tempo do "Desfazer": o registro é enviado e a tela se atualiza

await preparar(390);
await entrar('paulo@demo.cqc');
await foto('04-celular-paulo', 390);

// letra do navegador em 150% (persona João): o texto do arco não pode encavalar
await preparar(390);
await entrar('marta@demo.cqc');
await avaliar(`document.documentElement.style.fontSize = '168.75%'; window.dispatchEvent(new HashChangeEvent('hashchange'))`);
await espera(3800);
await foto('08-celular-letra-grande', 390);

// celular pequeno (360x640): o botão principal precisa aparecer sem rolar (foto só da primeira tela)
await cdp('Emulation.setDeviceMetricsOverride', { width: 360, height: 640, deviceScaleFactor: 1, mobile: true });
await entrar('marta@demo.cqc');
const { result: pequeno } = await cdp('Page.captureScreenshot', { format: 'png' });
writeFileSync(join(saida, '09-celular-pequeno-primeira-tela.png'), Buffer.from(pequeno.data, 'base64'));
console.log('foto: 09-celular-pequeno-primeira-tela');

await preparar(1280);
await entrar('marta@demo.cqc');
await foto('05-computador', 1280);

terminar();
