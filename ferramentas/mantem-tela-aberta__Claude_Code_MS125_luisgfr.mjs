// Abre um navegador sem janela com a porta de depuração local, entra no modo demonstração como Marta,
// vai para uma rota e fica aberto, para o detector da Impeccable ler a tela já desenhada:
//   impeccable detect --cdp <porta> --target <parte da rota> --json
// Uso: node ferramentas/mantem-tela-aberta__Claude_Code_MS125_luisgfr.mjs <url-base> <porta> <largura> <altura> <rota> <pasta-perfil> [light|dark]
//   ex.: node ferramentas/mantem-tela-aberta__Claude_Code_MS125_luisgfr.mjs http://127.0.0.1:8000 9335 390 844 /hoje C:\temp\perfil light
// Para fechar: encerrar este processo (o navegador fecha junto). Precisa de Node 22 ou mais novo.
// Navegador: variável CQC_NAVEGADOR (caminho do .exe); sem ela, usa o Edge no caminho padrão do Windows.
import { spawn } from 'node:child_process';

const [base, porta, largura, altura, rota, perfil, esquema = 'light'] = process.argv.slice(2);
const NAVEGADOR = process.env.CQC_NAVEGADOR || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));

const navegador = spawn(NAVEGADOR, ['--headless=new', `--remote-debugging-port=${porta}`, '--remote-debugging-address=127.0.0.1',
  `--user-data-dir=${perfil}`, `--window-size=${largura},${altura}`, '--no-first-run', '--disable-extensions',
  '--disk-cache-size=1', 'about:blank'], { stdio: 'ignore' });
const fechar = () => { navegador.kill(); process.exit(0); };
process.on('SIGINT', fechar);
process.on('SIGTERM', fechar);

let alvo;
for (let i = 0; i < 40 && !alvo; i++) {
  await espera(250);
  alvo = await fetch(`http://127.0.0.1:${porta}/json/list`).then((r) => r.json()).then((l) => l.find((t) => t.type === 'page')).catch(() => null);
}
if (!alvo) { navegador.kill(); throw new Error('O navegador não respondeu'); }

const ws = new WebSocket(alvo.webSocketDebuggerUrl);
await new Promise((ok) => ws.addEventListener('open', ok));
let seq = 0;
const pendentes = new Map();
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pendentes.has(msg.id)) { pendentes.get(msg.id)(msg); pendentes.delete(msg.id); }
});
const cdp = (method, params = {}) => new Promise((ok) => { const id = ++seq; pendentes.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
const avaliar = (expressao) => cdp('Runtime.evaluate', { expression: expressao, awaitPromise: true, returnByValue: true });

await cdp('Network.enable');
await cdp('Network.setCacheDisabled', { cacheDisabled: true });
await cdp('Emulation.setDeviceMetricsOverride', { width: Number(largura), height: Number(altura), deviceScaleFactor: 1, mobile: Number(largura) < 700 });
await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: esquema }] });
await cdp('Page.navigate', { url: base + '/#/login' });
await espera(2500);
await avaliar(`(() => { const f = document.querySelector('form'); f.email.value = 'marta@demo.cqc'; f.senha.value = 'demo1234'; f.requestSubmit(); })()`);
await espera(2000);
await avaliar(`location.hash = '#${rota}'`);
await espera(4000);
ws.close();   // solta a conexão para o detector poder usar a porta; o navegador continua aberto
console.log(`pronto: ${base}/#${rota} aberto em ${largura}x${altura} na porta ${porta}`);
setInterval(() => {}, 60000);   // fica vivo até ser encerrado
