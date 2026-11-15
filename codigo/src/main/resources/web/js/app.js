// Aplicação: decide qual tela mostrar pelo endereço (#/hoje, #/escala...),
// controla o topo, os alertas e o menu inferior.
import { MODO } from './api.js';
import { estado, escolherPaciente } from './estado.js';
import { el, tentar } from './ui.js';
import { telas, carregarContexto, atualizarAlertas } from './rotas.js';
import { periodoDoDia, ehNoite } from './ceu.js';

const modoEscuro = matchMedia('(prefers-color-scheme: dark)');

/** Tema noturno de noite e de madrugada, ou quando o celular está em modo escuro. */
function aplicarTema() {
  const periodo = periodoDoDia();
  document.body.dataset.periodo = periodo;
  document.body.dataset.tema = ehNoite(periodo) || modoEscuro.matches ? 'noite' : 'dia';
  document.querySelector('meta[name="theme-color"]')
    .setAttribute('content', getComputedStyle(document.body).getPropertyValue('--fundo').trim());
}
modoEscuro.addEventListener('change', aplicarTema);

// Cada tela se registra ao ser importada.
import './telas/login.js';
import './telas/cadastros.js';
import './telas/hoje.js';
import './telas/escala.js';
import './telas/bem-estar.js';
import './telas/mais.js';
import './telas/painel.js';

const ROTAS_PUBLICAS = new Set(['/login', '/cadastro']);
const ROTAS_SEM_MENU = new Set(['/login', '/cadastro', '/inicio-rede', '/novo-paciente', '/entrar-rede']);

function lerRota() {
  const bruto = location.hash.replace(/^#/, '') || '/hoje';
  const [rota, consulta = ''] = bruto.split('?');
  return { rota, parametros: Object.fromEntries(new URLSearchParams(consulta)) };
}

async function mostrarRota() {
  const { rota, parametros } = lerRota();

  if (!estado.token && !ROTAS_PUBLICAS.has(rota)) { location.hash = '#/login'; return; }

  // Cada navegação tem seu próprio elemento. Uma resposta anterior pode terminar
  // depois da mudança de rota e só escreverá no elemento que já saiu da página.
  const anterior = document.getElementById('conteudo');
  const conteudo = anterior.cloneNode(false);
  conteudo.inert = false;
  conteudo.removeAttribute('aria-busy');
  anterior.replaceWith(conteudo);
  document.getElementById('alertas').replaceChildren();
  const comMenu = !ROTAS_SEM_MENU.has(rota);
  document.getElementById('menu').hidden = !comMenu;
  document.getElementById('topo').hidden = !estado.token || ROTAS_PUBLICAS.has(rota);
  document.body.classList.toggle('sem-menu', !comMenu);
  document.body.classList.toggle('em-avaliacao', rota === '/bem-estar/responder');

  const aba = rota.split('/')[1];
  document.body.dataset.tela = aba;
  aplicarTema();
  for (const link of document.querySelectorAll('.menu a')) {
    if (link.dataset.aba === aba) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }

  if (estado.token && comMenu && estado.pacientes.length === 0) {
    await tentar(carregarContexto);
    if (!estado.token || !conteudo.isConnected) return;
    if (estado.pacientes.length === 0) { location.hash = '#/inicio-rede'; return; }
  }

  const render = telas.get(rota) || telas.get('/hoje');
  conteudo.replaceChildren(el('p', { class: 'subtitulo' }, 'Carregando...'));
  try {
    await render(conteudo, parametros);
  } catch (erro) {
    if (!conteudo.isConnected) return;
    conteudo.replaceChildren(el('div', { class: 'cartao' },
      el('h2', {}, 'Não foi possível abrir esta tela'),
      el('p', {}, erro.message || 'Tente de novo em instantes.'),
      el('button', { onclick: mostrarRota }, 'Tentar de novo')));
  }
  if (!conteudo.isConnected) return;
  if (comMenu && rota !== '/hoje') atualizarAlertas();   // a tela Hoje já recebe os alertas no /hoje
  conteudo.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

document.getElementById('faixa-demo').hidden = MODO !== 'demo';
// no modo demonstração os dados nascem de novo a cada carga da página: registros guardados de antes
// (fila sem internet da tela Hoje) apontariam para itens que não existem mais
if (MODO === 'demo') {
  try {
    for (const chave of Object.keys(localStorage)) if (chave.startsWith('cqc.registros-pendentes')) localStorage.removeItem(chave);
  } catch { /* sem armazenamento: nada a limpar */ }
}
document.getElementById('select-paciente').addEventListener('change', (evento) => {
  escolherPaciente(Number(evento.target.value));
  mostrarRota();
});
window.addEventListener('hashchange', mostrarRota);
mostrarRota();
