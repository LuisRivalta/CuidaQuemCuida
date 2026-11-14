// Registro das telas e funções de navegação usadas por todas as telas.
// (Separado de app.js para as telas não importarem o módulo principal.)
import { chamar } from './api.js';
import { estado, escolherPaciente, pacienteAtual } from './estado.js';
import { el, tentar } from './ui.js';

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

/** Mostra até 3 alertas no topo (a tela Hoje usa os que já vieram no /hoje, sem pedir de novo). */
export function mostrarAlertas(alertas) {
  const caixa = document.getElementById('alertas');
  caixa.replaceChildren(...alertas.slice(0, 3).map((a) => el('div', {
    class: 'alerta' + (a.prioridade < 60 ? ' atencao' : ''), role: 'alert',
  },
  el('span', {}, '⚠ ', a.mensagem),
  el('button', {
    class: 'pequeno secundario', 'aria-label': 'Marcar alerta como lido',
    onclick: async () => { await tentar(() => chamar('PUT', `/alertas/${a.id}/lido`)); atualizarAlertas(); },
  }, 'Ok'))));
}
