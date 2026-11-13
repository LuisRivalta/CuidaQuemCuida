// Tela "Hoje": o que fazer agora no turno, com um botão por tarefa.
import { chamar } from '../api.js';
import { estado, pacienteAtual } from '../estado.js';
import { registrarTela, ir } from '../rotas.js';
import {
  el, preencher, campo, tentar, mostrarAviso, formatarHora, formatarIntervalo, formatarDiaSemana, paraData, isoData,
} from '../ui.js';

const NOMES_SINAL = {
  PRESSAO: 'Pressão', GLICEMIA: 'Glicemia', TEMPERATURA: 'Temperatura', SATURACAO: 'Saturação', FREQUENCIA_CARDIACA: 'Batimentos',
};

function cartaoTurno(dados) {
  if (dados.turnoAtual) {
    return el('div', { class: 'cartao' },
      el('h2', {}, `Seu turno: ${formatarIntervalo(dados.turnoAtual.inicio, dados.turnoAtual.fim)}`),
      el('p', { class: 'subtitulo' }, `Cuidando de ${dados.paciente.nome}`));
  }
  if (dados.proximoTurno) {
    return el('div', { class: 'cartao' },
      el('h2', {}, 'Seu próximo turno'),
      el('p', {}, `${formatarDiaSemana(dados.proximoTurno.inicio)}, ${formatarIntervalo(dados.proximoTurno.inicio, dados.proximoTurno.fim)}`),
      el('p', { class: 'subtitulo' }, 'Abaixo, o que ainda falta fazer hoje.'));
  }
  return el('div', { class: 'cartao' },
    el('h2', {}, 'Você não tem turnos marcados'),
    el('p', {}, 'Veja na escala se há algum horário em que você possa ajudar.'),
    el('a', { class: 'botao secundario', href: '#/escala' }, 'Ver a escala'));
}

async function cartaoVago(pacienteId) {
  const hoje = new Date();
  const fim = new Date(hoje); fim.setDate(fim.getDate() + 7);
  const analise = await chamar('GET', `/pacientes/${pacienteId}/escala/analise?de=${isoData(hoje)}&ate=${isoData(fim)}`).catch(() => null);
  const vago = analise?.vagos?.find((v) => paraData(v.fim) > hoje);
  if (!vago) return null;
  return el('div', { class: 'alerta', role: 'alert' },
    el('span', {}, `⚠ Turno sem ninguém: ${formatarDiaSemana(vago.inicio)}, ${formatarIntervalo(vago.inicio, vago.fim)}`),
    el('button', {
      class: 'pequeno',
      onclick: async () => {
        const ok = await tentar(() => chamar('POST', `/pacientes/${pacienteId}/turnos`,
          { pessoaId: estado.pessoa.id, inicio: vago.inicio, fim: vago.fim }));
        if (ok) { mostrarAviso('Obrigado! O turno agora é seu.'); ir('/hoje'); }
      },
    }, 'Posso cobrir'));
}

function formularioSinal(item, pacienteId, aoTerminar) {
  const pressao = item.tipoSinal === 'PRESSAO';
  const form = el('form', { class: 'cartao', novalidate: true },
    el('h3', {}, `Registrar ${NOMES_SINAL[item.tipoSinal].toLowerCase()}`),
    campo(pressao ? 'Máxima (o número maior)' : 'Valor', el('input', { name: 'valor', type: 'number', inputmode: 'decimal', step: 'any', required: true })),
    pressao ? campo('Mínima (o número menor)', el('input', { name: 'valor2', type: 'number', inputmode: 'decimal', step: 'any' })) : null,
    el('div', { class: 'linha-botoes' },
      el('button', { type: 'submit' }, 'Salvar'),
      el('button', { type: 'button', class: 'secundario', onclick: () => form.remove() }, 'Cancelar')));
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const valor = Number(form.valor.value);
    if (!(valor > 0)) return tentar(() => { throw new Error('Digite um valor maior que zero.'); });
    const sinal = await tentar(() => chamar('POST', `/pacientes/${pacienteId}/sinais`, {
      tipo: item.tipoSinal, valor, valor2: pressao && form.valor2.value ? Number(form.valor2.value) : null,
    }));
    if (!sinal) return;
    await tentar(() => chamar('PUT', `/execucoes/${item.id}/feita`));
    if (sinal.alerta === 'FORA_DA_FAIXA') mostrarAviso('Atenção: valor fora da faixa combinada. A rede foi avisada.');
    else if (sinal.alerta === 'FORA_DA_CURVA') mostrarAviso('Atenção: valor bem diferente do normal desta pessoa. A rede foi avisada.');
    else mostrarAviso('Medição registrada.');
    aoTerminar();
  });
  return form;
}

function etiquetaStatus(item) {
  const mapa = {
    DADA: ['ok', 'Dado ✓'], ATRASADA: ['meio', 'Dado com atraso'], NAO_DADA: ['ruim', 'Não dado'], FEITA: ['ok', 'Feito ✓'],
  };
  const [classe, texto] = mapa[item.status] || [];
  return texto ? el('span', { class: `etiqueta ${classe}` }, texto) : null;
}

function linhaItem(item, pacienteId, recarregar) {
  const pendente = item.status === 'PENDENTE';
  const atrasado = pendente && Date.now() > paraData(item.horario).getTime() + 30 * 60 * 1000;
  const li = el('li', { class: pendente ? (atrasado ? 'atrasado' : '') : 'feito' });
  const acoes = el('div', { class: 'linha-botoes' });

  if (pendente && item.tipo === 'DOSE') {
    acoes.append(
      el('button', {
        onclick: async () => {
          const dose = await tentar(() => chamar('PUT', `/doses/${item.id}/dar`, {}));
          if (dose) { mostrarAviso(dose.status === 'ATRASADA' ? 'Registrado (com atraso).' : 'Registrado. Obrigado!'); recarregar(); }
        },
      }, 'Dei o remédio'),
      el('button', {
        class: 'secundario',
        onclick: async () => {
          const motivo = window.prompt('Por que o remédio não foi dado? (ex.: recusou, vomitou, acabou)');
          if (!motivo) return;
          const dose = await tentar(() => chamar('PUT', `/doses/${item.id}/nao-dar`, { motivo }));
          if (dose) recarregar();
        },
      }, 'Não foi dado'));
  } else if (pendente && item.tipoSinal) {
    acoes.append(el('button', { onclick: () => li.append(formularioSinal(item, pacienteId, recarregar)) }, 'Registrar'));
  } else if (pendente) {
    acoes.append(el('button', {
      onclick: async () => {
        const feita = await tentar(() => chamar('PUT', `/execucoes/${item.id}/feita`));
        if (feita) recarregar();
      },
    }, 'Feito'));
  }

  preencher(li,
    el('div', {}, el('span', { class: 'hora' }, formatarHora(item.horario)), el('strong', {}, item.titulo), ' ', etiquetaStatus(item),
      atrasado ? el('span', { class: 'etiqueta ruim' }, 'Atrasado') : null),
    item.tipo === 'TAREFA' && item.detalhe
      ? el('details', {}, el('summary', {}, 'Como fazer'), el('p', { class: 'detalhe' }, item.detalhe))
      : (item.detalhe ? el('div', { class: 'detalhe' }, item.detalhe) : null),
    acoes.childElementCount ? acoes : null);
  return li;
}

registrarTela('/hoje', async (conteudo) => {
  const paciente = pacienteAtual();
  const dados = await chamar('GET', `/hoje?pacienteId=${paciente.id}`);
  const recarregar = () => ir('/hoje');
  const primeiroNome = (estado.pessoa?.nome || '').split(' ')[0];

  const itens = dados.itens.length
    ? el('ol', { class: 'linha-tempo' }, dados.itens.map((item) => linhaItem(item, paciente.id, recarregar)))
    : el('p', {}, dados.turnoAtual ? 'Nada pendente no seu turno. 💚' : 'Nada pendente para hoje. 💚');

  preencher(conteudo,
    el('h1', {}, `Olá, ${primeiroNome}`),
    el('p', { class: 'subtitulo' }, `Hoje, ${formatarDiaSemana(isoData(new Date()))}`),
    await cartaoVago(paciente.id) || '',
    cartaoTurno(dados),
    el('section', { class: 'cartao', 'aria-labelledby': 't-itens' },
      el('h2', { id: 't-itens' }, dados.turnoAtual ? 'No seu turno' : 'Pendências de hoje'),
      itens));
});
