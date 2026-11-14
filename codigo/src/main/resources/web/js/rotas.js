// Registro das telas e funções de navegação usadas por todas as telas.
// (Separado de app.js para as telas não importarem o módulo principal.)
import { chamar } from './api.js';
import { estado, escolherPaciente, pacienteAtual } from './estado.js';
import { el, tentar } from './ui.js';
import { icone } from './icones.js';

export const telas = new Map();

/** Registra uma tela. render(conteudo, parametros) monta a tela dentro do <main>. */
export function registrarTela(rota, render) {
  telas.set(rota, render);
}

/** Navega para uma rota (ex.: ir('/hoje')). Na mesma rota, redesenha a tela. */
export function ir(rota) {
  if (location.hash === '#' + rota) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = '#' + rota;
}

function montarSeletor() {
  const rotulo = document.getElementById('seletor-paciente');
  const select = document.getElementById('select-paciente');
  select.replaceChildren(...estado.pacientes.map((p) =>
    el('option', { value: p.id, selected: p.id === pacienteAtual()?.id }, p.nome)));
  rotulo.hidden = estado.pacientes.length < 2;
}

/** Recarrega a lista de pacientes da pessoa logada e o seletor do topo. */
export async function carregarContexto() {
  estado.pacientes = await chamar('GET', '/pacientes');
  if (!estado.pacientes.some((p) => p.id === estado.pacienteId)) {
    escolherPaciente(estado.pacientes[0]?.id ?? null);
  }
  montarSeletor();
}

/** Busca os alertas não lidos do paciente atual e mostra no topo da tela. */
export async function atualizarAlertas() {
  const paciente = pacienteAtual();
  if (!estado.token || !paciente) { mostrarAlertas([]); return; }
  mostrarAlertas(await chamar('GET', `/alertas?pacienteId=${paciente.id}`).catch(() => []));
}

/**
 * Monta até 3 avisos; aoLer() roda depois de marcar um como lido.
 * anunciar=false tira o role="alert" (para o leitor de tela não repetir os avisos a cada atualização).
 */
export function cartoesAlerta(alertas, aoLer, { anunciar = true } = {}) {
  return alertas.slice(0, 3).map((a) => el('div', {
    class: 'alerta' + (a.prioridade < 60 ? ' atencao' : ''), role: anunciar ? 'alert' : null,
  },
  icone('sino'),
  el('span', { class: 'alerta-texto' }, a.mensagem),
  el('button', {
    class: 'pequeno secundario', 'aria-label': `Entendi, marcar como lido: ${a.mensagem}`,
    onclick: async () => { await tentar(() => chamar('PUT', `/alertas/${a.id}/lido`)); aoLer(); },
  }, 'Entendi')));
}

/** Mostra os alertas no topo (a tela Hoje mostra os dela dentro da própria tela). */
export function mostrarAlertas(alertas) {
  document.getElementById('alertas').replaceChildren(...cartoesAlerta(alertas, atualizarAlertas));
}
