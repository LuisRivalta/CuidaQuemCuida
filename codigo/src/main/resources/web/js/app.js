// Aplicação: decide qual tela mostrar pelo endereço (#/hoje, #/escala...),
// controla o topo, os alertas e o menu inferior.
import { MODO } from './api.js';
import { estado, escolherPaciente } from './estado.js';
import { el, tentar } from './ui.js';
import { telas, carregarContexto, atualizarAlertas } from './rotas.js';

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

  const conteudo = document.getElementById('conteudo');
  const comMenu = !ROTAS_SEM_MENU.has(rota);
  document.getElementById('menu').hidden = !comMenu;
  document.getElementById('topo').hidden = !estado.token;
  document.body.style.paddingBottom = comMenu ? '' : '0';

  const aba = rota.split('/')[1];
  for (const link of document.querySelectorAll('.menu a')) {
    if (link.dataset.aba === aba) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }

  if (estado.token && comMenu && estado.pacientes.length === 0) {
    await tentar(carregarContexto);
    if (!estado.token) return;
    if (estado.pacientes.length === 0) { location.hash = '#/inicio-rede'; return; }
  }

  const render = telas.get(rota) || telas.get('/hoje');
  conteudo.replaceChildren(el('p', { class: 'subtitulo' }, 'Carregando...'));
  try {
    await render(conteudo, parametros);
  } catch (erro) {
    conteudo.replaceChildren(el('div', { class: 'cartao' },
      el('h2', {}, 'Não foi possível abrir esta tela'),
      el('p', {}, erro.message || 'Tente de novo em instantes.'),
      el('button', { onclick: mostrarRota }, 'Tentar de novo')));
  }
  if (comMenu) atualizarAlertas();
  else document.getElementById('alertas').replaceChildren();
  conteudo.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

document.getElementById('faixa-demo').hidden = MODO !== 'demo';
document.getElementById('select-paciente').addEventListener('change', (evento) => {
  escolherPaciente(Number(evento.target.value));
  mostrarRota();
});
window.addEventListener('hashchange', mostrarRota);
mostrarRota();
