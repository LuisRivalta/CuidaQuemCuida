// Tela "Hoje": o céu da hora com o arco do turno, a próxima coisa a fazer
// em destaque e, abaixo, o caminho do dia com um botão por tarefa.
import { chamar } from '../api.js';
import { estado, pacienteAtual } from '../estado.js';
import { registrarTela, cartoesAlerta } from '../rotas.js';
import {
  el, preencher, campo, tentar, mostrarAviso, mostrarErro, formatarHora, formatarDiaSemana, paraData, isoData, isoLocal, deHtml,
} from '../ui.js';
import { icone } from '../icones.js';
import { periodoDoDia as periodo, ehNoite, semMovimento, estrelas, morros } from '../ceu.js';

const NOMES_SINAL = {
  PRESSAO: 'Pressão', GLICEMIA: 'Glicemia', TEMPERATURA: 'Temperatura', SATURACAO: 'Saturação', FREQUENCIA_CARDIACA: 'Batimentos',
};
const UNIDADES = { PRESSAO: 'mmHg', GLICEMIA: 'mg/dL', TEMPERATURA: '°C', SATURACAO: '%', FREQUENCIA_CARDIACA: 'bpm' };
const EXEMPLOS = { PRESSAO: '120', GLICEMIA: '110', TEMPERATURA: '36,5', SATURACAO: '97', FREQUENCIA_CARDIACA: '72' };
/** Valores possíveis de medir; fora disso, quase sempre é erro de digitação (ex.: 365 no lugar de 36,5). */
const POSSIVEL = {
  TEMPERATURA: [30, 45], SATURACAO: [50, 100], PRESSAO: [50, 260], PRESSAO_MINIMA: [30, 160], GLICEMIA: [20, 600], FREQUENCIA_CARDIACA: [20, 250],
};
const MOTIVOS = ['Recusou', 'Vomitou', 'Acabou o remédio', 'Estava dormindo', 'Outro motivo'];
const SAUDACAO = { madrugada: 'Boa noite', manha: 'Bom dia', tarde: 'Boa tarde', noite: 'Boa noite' };
const ALERTAS_DA_LISTA = ['DOSE_ATRASADA', 'DOSE_PROXIMA', 'TAREFA_ATRASADA'];   // já aparecem no caminho do dia
const ARCO = 'M24 150 A136 120 0 0 1 296 150';
const MINUTO = 60 * 1000;
const MEIA_HORA = 30 * MINUTO;
const JANELA_DOSE = 120 * MINUTO;   // depois disso a dose fica sem registro (regra do produto)
const PARADA = 4 * 60 * MINUTO;     // tarefa ou medição esquecida há mais que isso vai para "Ficou para trás"
const ESPERA_DESFAZER = 8000;
const ESPERA_DESFAZER_DOSE = 15000;   // remédio: mais tempo para quem confere duas vezes
const CHAVE_FILA = 'cqc.registros-pendentes';

let tela = null;                    // { conteudo, pacienteId } da tela aberta
let vigia = null;                   // atualização a cada minuto
const aguardando = new Map();       // registros esperando o tempo do "Desfazer"

// ------------------------------------------------------------------ utilidades

const ms = (iso) => paraData(iso).getTime();
const pendente = (item) => item.status === 'PENDENTE';
const feito = (item) => ['DADA', 'ATRASADA', 'FEITA'].includes(item.status);
const chave = (item) => `${item.tipo}:${item.id}`;
const primeiroNome = (nome) => (nome || '').split(' ')[0];
const iconeDoItem = (item) => (item.tipo === 'DOSE' ? 'pilula' : item.tipoSinal ? 'pulso' : 'coracao');
const atrasado = (item) => pendente(item) && Date.now() > ms(item.horario) + MEIA_HORA;
/** Vermelho só para remédio ainda dentro do prazo; tarefa atrasada fica em cor de atenção. */
const urgente = (item) => atrasado(item) && item.tipo === 'DOSE' && Date.now() <= ms(item.horario) + JANELA_DOSE;
const peso = (item) => (item.tipo === 'DOSE' ? 0 : item.tipoSinal ? 1 : 2);   // desempate no mesmo horário
const horaDe = (instante) => formatarHora(isoLocal(new Date(instante)));
const intervalo = (inicio, fim) => `${formatarHora(inicio)}–${formatarHora(fim)}`;

/** 230 min -> "3 h 50 min"; 25 min -> "25 min"; 120 min -> "2 h" */
function duracao(tempo) {
  const minutos = Math.max(0, Math.round(tempo / MINUTO));
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

// ------------------------------------------------------------------ fila de registros (sobrevive a falta de internet)

// uma fila por pessoa: num aparelho da família, o registro de um nunca sai com o login de outro
const chaveFila = () => `${CHAVE_FILA}.${estado.pessoa?.id}`;
function lerFila() {
  try { return JSON.parse(localStorage.getItem(chaveFila())) || []; } catch { return []; }
}
function gravarFila(fila) {
  try { localStorage.setItem(chaveFila(), JSON.stringify(fila)); } catch { /* sem armazenamento: segue só em memória */ }
}
const naFila = (item) => lerFila().some((r) => r.chave === chave(item));
const tirarDaFila = (id) => gravarFila(lerFila().filter((r) => r.chave !== id));

/** Envia um registro. Sem conexão (status 0), ele fica guardado para tentar de novo. */
async function enviar(registro) {
  try {
    const resposta = await chamar(registro.metodo, registro.caminho, registro.corpo);
    tirarDaFila(registro.chave);
    return { ok: true, resposta };
  } catch (erro) {
    // o erro diz de qual item é: pode aparecer minutos depois, enviado em segundo plano
    const item = registro.titulo ? `"${registro.titulo} · ${registro.hora}"` : 'o registro';
    if (erro.status === 0) {
      mostrarErro(`Sem conexão. ${item} ficou guardado e vai ser enviado quando a internet voltar.`);
      return { ok: false };
    }
    tirarDaFila(registro.chave);
    mostrarErro(`Não deu para salvar ${item}: ${erro.message}. Confira na lista.`);
    return { ok: false };
  }
}

/** Tenta de novo o que ficou guardado sem conexão. */
async function reenviarFila() {
  const pendentes = lerFila().filter((r) => !aguardando.has(r.chave));
  for (const registro of pendentes) await enviar(registro);
  return pendentes.length;
}

// ------------------------------------------------------------------ classificar

/**
 * Escolhe o item em destaque e separa o que "ficou para trás":
 * tarefa pendente que já tem uma vez mais nova, ou tarefa/medição esquecida há mais de 4 h.
 */
function classificar(itens, agora) {
  const superada = (item) => item.tipo === 'TAREFA' && pendente(item) && (ms(item.horario) < agora - PARADA
    || itens.some((outro) => outro !== item && outro.tipo === 'TAREFA' && outro.titulo === item.titulo
      && ms(outro.horario) > ms(item.horario) && ms(outro.horario) <= agora));
  const paraTras = new Set(itens.filter(superada));
  const vivos = itens.filter((i) => pendente(i) && !paraTras.has(i) && !naFila(i));
  const cedo = (lista) => lista.sort((a, b) => ms(a.horario) - ms(b.horario) || peso(a) - peso(b))[0];
  const destaque = cedo(vivos.filter((i) => i.tipo === 'DOSE' && ms(i.horario) >= agora - JANELA_DOSE && ms(i.horario) <= agora + MEIA_HORA))
    || cedo(vivos.filter((i) => Math.abs(ms(i.horario) - agora) <= MEIA_HORA))
    || vivos.filter((i) => ms(i.horario) < agora).sort((a, b) => ms(b.horario) - ms(a.horario) || peso(a) - peso(b))[0]
    || cedo(vivos.filter((i) => ms(i.horario) > agora))
    || null;
  return { destaque, paraTras };
}

/** Texto de quando, a palavra do estado e o nível de cor ('ruim', 'meio' ou nenhum). */
function quandoDoItem(item, noTurno) {
  const horario = ms(item.horario);
  const diferenca = horario - Date.now();
  if (atrasado(item)) {
    if (!noTurno) return { palavra: 'Pendente', texto: `Previsto para ${formatarHora(item.horario)} · passou há ${duracao(-diferenca)}` };
    return { palavra: 'Atrasado', texto: `Atrasado há ${duracao(-diferenca)}`, nivel: urgente(item) ? 'ruim' : 'meio' };
  }
  if (diferenca > 60 * MINUTO) return { palavra: 'Próximo', texto: `Às ${formatarHora(item.horario)}` };
  if (diferenca > 0) return { palavra: 'Próximo', texto: `Daqui a ${duracao(diferenca)} · ${formatarHora(item.horario)}` };
  return { palavra: 'Agora', texto: `Agora · ${formatarHora(item.horario)}` };
}

// ------------------------------------------------------------------ céu

/** Com a letra do celular muito grande, o texto não cabe dentro do arco: o arco vira uma linha só. */
function ajustarArco(arco) {
  arco.classList.remove('apertado');
  // o texto mora entre o topo da curva e a base do arco: uns 3/4 da altura do desenho
  const livre = arco.querySelector('svg').getBoundingClientRect().height * 0.78;
  arco.classList.toggle('apertado', arco.querySelector('.arco-centro').offsetHeight > livre);
}

function desenharArco(arco, fracao) {
  const trilha = arco.querySelector('.arco-trilha');
  const ponto = trilha.getPointAtLength(trilha.getTotalLength() * fracao);
  arco.querySelector('.arco-feito').setAttribute('stroke-dashoffset', String(100 - fracao * 100));
  arco.querySelector('.astro').setAttribute('transform', `translate(${ponto.x.toFixed(1)} ${ponto.y.toFixed(1)})`);
}

function arcoDoTurno(turno, noite) {
  const inicio = ms(turno.inicio);
  const fim = ms(turno.fim);
  // de dia o astro é o sol; de noite, uma lua crescente (círculo recortado por máscara)
  const lua = noite
    ? '<defs><mask id="lua-mascara"><rect x="-30" y="-30" width="60" height="60" fill="#fff"/><circle r="10" cx="5" cy="-4" fill="#000"/></mask></defs>'
    : '';
  const arco = deHtml(`
    <div class="arco">
      <svg viewBox="0 0 320 160" aria-hidden="true">${lua}
        <path class="arco-trilha" d="${ARCO}" pathLength="100"/>
        <path class="arco-feito" d="${ARCO}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
        <g class="astro"><circle class="astro-brilho" r="22"/><circle class="astro-corpo" r="12"${noite ? ' mask="url(#lua-mascara)"' : ''}/></g>
      </svg>
      <div class="arco-centro"><span class="arco-faltam">Faltam</span><span class="arco-numero"></span><span class="arco-legenda">para o fim do seu turno</span><span class="arco-ate" aria-hidden="true"></span></div>
      <span class="arco-hora ini" aria-hidden="true"></span><span class="arco-hora fim" aria-hidden="true"></span>
      <span class="visualmente-oculto"></span>
    </div>`);
  arco.querySelector('.arco-numero').textContent = duracao(fim - Date.now());
  arco.querySelector('.arco-hora.ini').textContent = formatarHora(turno.inicio);
  arco.querySelector('.arco-hora.fim').textContent = formatarHora(turno.fim);
  arco.querySelector('.arco-ate').textContent = `Seu turno ${intervalo(turno.inicio, turno.fim)} · faltam ${duracao(fim - Date.now())}`;
  arco.querySelector('.visualmente-oculto').textContent = `Seu turno vai de ${formatarHora(turno.inicio)} a ${formatarHora(turno.fim)}.`;
  arco.dataset.fracao = String(Math.min(1, Math.max(0, (Date.now() - inicio) / (fim - inicio))));
  return arco;
}

function ceu(dados, quando) {
  const per = periodo(quando);
  const nome = primeiroNome(estado.pessoa?.nome);
  const dia = formatarDiaSemana(isoData(quando));

  let turno;
  if (dados.turnoAtual) {
    turno = arcoDoTurno(dados.turnoAtual, ehNoite(per));
  } else if (dados.proximoTurno) {
    const { inicio, fim } = dados.proximoTurno;
    const amanha = new Date(quando); amanha.setDate(amanha.getDate() + 1);
    const diaTurno = inicio.startsWith(isoData(quando)) ? 'Hoje'
      : inicio.startsWith(isoData(amanha)) ? 'Amanhã' : formatarDiaSemana(inicio);
    turno = el('div', { class: 'ceu-proximo' },
      el('span', {}, 'Seu próximo turno'),
      el('strong', {}, `${diaTurno}, ${intervalo(inicio, fim)}`));
  } else {
    turno = el('div', { class: 'ceu-proximo' },
      el('strong', {}, 'Sem turnos marcados'),
      el('a', { href: '#/escala' }, 'Ver onde dá para ajudar'));
  }

  return el('section', { class: 'ceu', 'data-periodo': per, 'aria-labelledby': 'saudacao' },
    ehNoite(per) ? estrelas() : null,
    el('div', { class: 'ceu-texto' },
      el('h1', { id: 'saudacao' }, nome ? `${SAUDACAO[per]}, ${nome}` : SAUDACAO[per]),
      el('p', {}, `${dia.charAt(0).toUpperCase()}${dia.slice(1)} · cuidando de ${primeiroNome(dados.paciente.nome)}`)),
    turno,
    morros());
}

// ------------------------------------------------------------------ registrar (com "Desfazer")

/** Botão vira um check desenhado, o cartão fica verde-sálvia e o "atrasado" vira "registrado às". */
function marcarConfirmado(alvo, botao, hora) {
  botao.classList.add('confirmado');
  botao.replaceChildren(icone('check', 'traco-check'), 'Registrado');
  alvo.classList.add('confirmado');
  for (const outro of alvo.querySelectorAll(':scope > .linha-botoes button')) outro.disabled = true;
  const quando = alvo.querySelector('.agora-quando');
  if (quando) { quando.textContent = `Registrado às ${hora}`; quando.className = 'agora-quando'; }
  for (const etiqueta of alvo.querySelectorAll('.etiqueta')) etiqueta.remove();   // tira o "Atrasado" do item já registrado
  if (semMovimento()) return;
  const { gsap } = window;
  gsap.fromTo(botao.querySelector('path'), { strokeDashoffset: 24 }, { strokeDashoffset: 0, duration: 0.7, ease: 'expo.out', delay: 0.05 });
  gsap.fromTo(botao, { scale: 0.92 }, { scale: 1, duration: 0.7, ease: 'back.out(2.5)' });
}

/**
 * Mostra como registrado na hora, mas só envia depois de 15 s (remédio) ou 8 s (o resto):
 * até lá dá para desfazer, ali mesmo no cartão, com o tempo que falta à vista.
 * O registro fica guardado no navegador até o servidor confirmar (sem internet, tenta de novo depois).
 */
function registrarComDesfazer(item, alvo, botao, pedido, avisoDepois) {
  const id = chave(item);
  if (aguardando.has(id)) return;
  const hora = horaDe(Date.now());
  const registro = { chave: id, titulo: item.titulo, hora: formatarHora(item.horario), ...pedido };
  gravarFila([...lerFila().filter((r) => r.chave !== id), registro]);
  marcarConfirmado(alvo, botao, hora);

  let restante = Math.round((item.tipo === 'DOSE' ? ESPERA_DESFAZER_DOSE : ESPERA_DESFAZER) / 1000);
  const parar = () => { clearTimeout(timer); clearInterval(contagem); };
  const executar = async () => {
    parar();
    if (!aguardando.has(id)) return;
    aguardando.delete(id);
    const { ok, resposta } = await enviar(registro);
    const aviso = ok && avisoDepois?.(resposta);
    if (aviso) mostrarAviso(`${aviso} Registrou errado? Avise quem coordena a rede.`);
    if (!aguardando.size) atualizar({ forcar: true, focar: true });
  };
  const timer = setTimeout(executar, restante * 1000);
  aguardando.set(id, { executar });

  const botaoDesfazer = el('button', {
    type: 'button', class: 'pequeno secundario',
    onclick: () => {
      parar();
      aguardando.delete(id);
      tirarDaFila(id);
      mostrarAviso('Desfeito. Nada foi registrado.');
      if (!aguardando.size) atualizar({ forcar: true, focar: true });
    },
  }, `Desfazer (${restante} s)`);
  const contagem = setInterval(() => { restante = Math.max(0, restante - 1); botaoDesfazer.textContent = `Desfazer (${restante} s)`; }, 1000);
  // no cartão em destaque o "Registrado às" já aparece no lugar do horário; na lista, aparece aqui
  const desfazer = el('div', { class: 'desfazer', role: 'status' },
    alvo.querySelector('.agora-quando') ? null : el('span', {}, `Registrado às ${hora}.`), botaoDesfazer);
  alvo.querySelector(':scope > .linha-botoes')?.after(desfazer);
  botaoDesfazer.focus({ preventScroll: true });
}

/** Envia na hora tudo o que está esperando o "Desfazer" (ao sair da tela ou do app). */
function descarregar() {
  for (const registro of [...aguardando.values()]) registro.executar();
}

// ------------------------------------------------------------------ formulários

/** Mostra o erro embaixo do campo (e não só no aviso do rodapé). */
function erroNoCampo(form, alvo, texto) {
  form.querySelector('.erro-campo')?.remove();
  for (const c of form.querySelectorAll('[aria-invalid]')) c.removeAttribute('aria-invalid');
  const id = 'erro-' + Math.random().toString(36).slice(2, 8);
  alvo.after(el('p', { class: 'erro-campo', id, role: 'alert' }, texto));
  const controle = alvo.matches('input, select, textarea') ? alvo : alvo.querySelector('input');
  if (controle) {
    controle.setAttribute('aria-invalid', 'true');
    controle.setAttribute('aria-describedby', id);
    controle.focus();
  }
}

/** Esconde os botões do item enquanto o formulário está aberto; Cancelar devolve. */
function abrirFormulario(alvo, criar) {
  if (alvo.querySelector(':scope > .form-inline')) return;
  const botoes = alvo.querySelector(':scope > .linha-botoes');
  const fechar = () => { form.remove(); if (botoes) botoes.hidden = false; };
  const form = criar(fechar);
  if (botoes) botoes.hidden = true;
  alvo.append(form);
  form.querySelector('input')?.focus();
  form.scrollIntoView({ block: 'nearest', behavior: semMovimento() ? 'auto' : 'smooth' });
}

const lerNumero = (texto) => Number(String(texto).trim().replace(',', '.'));
const foraDoPossivel = (tipo, valor) => valor < POSSIVEL[tipo][0] || valor > POSSIVEL[tipo][1];

function formularioSinal(item, fechar) {
  const pressao = item.tipoSinal === 'PRESSAO';
  const unidade = UNIDADES[item.tipoSinal];
  const entrada = (nome, exemplo) => el('input', {
    name: nome, type: 'text', inputmode: 'decimal', autocomplete: 'off', required: true, placeholder: `Ex.: ${exemplo}`,
  });
  const form = el('form', { class: 'form-inline', novalidate: true },
    el('h3', {}, `Registrar ${NOMES_SINAL[item.tipoSinal].toLowerCase()}`),
    pressao ? campo(`Máxima, o número maior (${unidade})`, entrada('valor', '120'))
      : campo(`Valor (${unidade})`, entrada('valor', EXEMPLOS[item.tipoSinal])),
    pressao ? campo(`Mínima, o número menor (${unidade})`, entrada('valor2', '80')) : null,
    el('div', { class: 'linha-botoes' },
      el('button', { type: 'submit' }, 'Salvar'),
      el('button', { type: 'button', class: 'secundario', onclick: fechar }, 'Cancelar')));
  form.addEventListener('input', () => { delete form.dataset.conferido; });
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const valor = lerNumero(form.valor.value);
    const valor2 = pressao ? lerNumero(form.valor2.value) : null;
    if (!(valor > 0)) return erroNoCampo(form, form.valor, 'Digite um número maior que zero. Pode usar vírgula, como 36,5.');
    if (pressao && !(valor2 > 0)) return erroNoCampo(form, form.valor2, 'Digite a mínima também, o número menor da pressão.');
    // valor impossível: pede para conferir antes de avisar a rede (Salvar de novo confirma)
    const estranho = foraDoPossivel(item.tipoSinal, valor) ? form.valor
      : pressao && foraDoPossivel('PRESSAO_MINIMA', valor2) ? form.valor2 : null;
    if (estranho && !form.dataset.conferido) {
      form.dataset.conferido = 'sim';
      return erroNoCampo(form, estranho, `${estranho.value} ${unidade} parece fora do possível. Confira se faltou a vírgula. Se estiver certo, toque em Salvar de novo.`);
    }
    const salvar = form.querySelector('button[type="submit"]');
    salvar.disabled = true;
    salvar.textContent = 'Salvando...';
    const sinal = await tentar(() => chamar('POST', `/pacientes/${tela.pacienteId}/sinais`, { tipo: item.tipoSinal, valor, valor2 }));
    if (!sinal) { salvar.disabled = false; salvar.textContent = 'Salvar'; return; }
    // a medição já foi salva; se marcar a tarefa falhar, avisa (registrar de novo duplicaria a medição)
    const marcada = await chamar('PUT', `/execucoes/${item.id}/feita`).then(() => true, () => false);
    if (!marcada) mostrarErro('A medição foi salva, mas não deu para marcar a tarefa como feita. Não registre de novo; avise quem coordena a rede.');
    if (sinal.alerta === 'FORA_DA_FAIXA' || sinal.alerta === 'FORA_DA_CURVA') {
      // momento grave: o aviso fica no cartão até a pessoa tocar em "Entendi"
      form.replaceWith(el('div', { class: 'aviso-sinal', role: 'alert' },
        icone('pulso'),
        el('div', {},
          el('strong', {}, sinal.alerta === 'FORA_DA_FAIXA' ? 'Valor fora da faixa combinada.' : 'Valor bem diferente do normal desta pessoa.'),
          el('p', {}, 'A rede vai ver este aviso quando abrir o app. Se a pessoa estiver passando mal, ligue para o SAMU.'),
          el('div', { class: 'linha-botoes' },
            el('a', { class: 'botao perigo pequeno', href: 'tel:192' }, 'Ligar para o SAMU (192)'),
            el('button', { type: 'button', class: 'pequeno secundario', onclick: () => atualizar({ forcar: true, focar: true }) }, 'Entendi')))));
      return;
    }
    if (marcada) mostrarAviso('Medição registrada.');
    atualizar({ forcar: true, focar: true });
  });
  return form;
}

/** Escolhe o motivo; o registro passa pelo mesmo "Desfazer" do "Dei o remédio". */
function formularioNaoDado(item, fechar, alvo, botaoNao) {
  const rotuloObs = el('label', {}, 'Quer contar mais? (opcional)');
  const obs = el('input', { name: 'obs', maxlength: 150, autocomplete: 'off', id: 'obs-' + item.id });
  rotuloObs.setAttribute('for', obs.id);
  const opcoes = el('fieldset', { class: 'opcoes-motivo' },
    el('legend', {}, 'Por que o remédio não foi dado?'),
    MOTIVOS.map((motivo) => el('label', {}, el('input', { type: 'radio', name: 'motivo', value: motivo }), el('span', {}, motivo))));
  const confirmar = el('button', { type: 'submit' }, 'Confirmar');
  const cancelar = el('button', { type: 'button', class: 'secundario', onclick: fechar }, 'Cancelar');
  // "Estava dormindo" quase sempre quer dizer "vou dar quando acordar": aí o caminho principal é NÃO registrar
  const depois = el('button', { type: 'button', hidden: true, onclick: () => { fechar(); mostrarAviso('Combinado. Quando der o remédio, toque em "Dei o remédio".'); } },
    'Vou dar quando acordar');
  const form = el('form', { class: 'form-inline', novalidate: true },
    opcoes,
    el('div', { class: 'campo' }, rotuloObs, obs),
    el('div', { class: 'linha-botoes' }, depois, confirmar, cancelar));
  const avisoDormindo = el('p', { class: 'orientacao', hidden: true },
    `Vai dar quando acordar? Então não registre agora: quando der, toque em "Dei o remédio" (até ${horaDe(ms(item.horario) + JANELA_DOSE)}).`);
  opcoes.after(avisoDormindo);
  form.addEventListener('change', () => {
    const dormindo = form.motivo.value === 'Estava dormindo';
    rotuloObs.textContent = form.motivo.value === 'Outro motivo' ? 'Qual foi o motivo?' : 'Quer contar mais? (opcional)';
    avisoDormindo.hidden = !dormindo;
    depois.hidden = !dormindo;
    cancelar.hidden = dormindo;
    confirmar.textContent = dormindo ? 'Registrar como não dado mesmo assim' : 'Confirmar';
    confirmar.classList.toggle('secundario', dormindo);
  });
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const motivo = form.motivo.value;
    const texto = obs.value.trim();
    if (!motivo) return erroNoCampo(form, opcoes, 'Escolha um dos motivos acima.');
    if (motivo === 'Outro motivo' && !texto) return erroNoCampo(form, obs, 'Escreva qual foi o motivo.');
    fechar();
    registrarComDesfazer(item, alvo, botaoNao, {
      metodo: 'PUT', caminho: `/doses/${item.id}/nao-dar`,
      corpo: { motivo: motivo === 'Outro motivo' ? texto : (texto ? `${motivo}: ${texto}` : motivo) },
    }, () => 'Registrado. A rede vai ver o motivo.');
  });
  return form;
}

const pedidoDar = (item) => ({ metodo: 'PUT', caminho: `/doses/${item.id}/dar`, corpo: {} });
const pedidoFeita = (item) => ({ metodo: 'PUT', caminho: `/execucoes/${item.id}/feita` });
const avisoDose = (dose) => (dose?.status === 'ATRASADA' ? 'Remédio registrado, com atraso.' : 'Remédio registrado.');

/** Botões de um item pendente para quem está no turno. alvo = onde abre o formulário e aparece a confirmação. */
function acoes(item, alvo, pequeno) {
  const classe = (extra = '') => `${pequeno ? 'pequeno ' : ''}${extra}`.trim() || null;
  if (item.tipo === 'DOSE') {
    const botaoNao = el('button', {
      class: classe('secundario'),
      onclick: () => abrirFormulario(alvo, (fechar) => formularioNaoDado(item, fechar, alvo, botaoNao)),
    }, 'Não foi dado');
    return el('div', { class: 'linha-botoes' },
      el('button', {
        class: classe(),
        onclick: (evento) => registrarComDesfazer(item, alvo, evento.currentTarget, pedidoDar(item), avisoDose),
      }, 'Dei o remédio'),
      botaoNao);
  }
  if (item.tipoSinal) {
    return el('div', { class: 'linha-botoes' },
      el('button', { class: classe(), onclick: () => abrirFormulario(alvo, (fechar) => formularioSinal(item, fechar)) }, 'Registrar medição'));
  }
  return el('div', { class: 'linha-botoes' },
    el('button', {
      class: classe(),
      onclick: (evento) => registrarComDesfazer(item, alvo, evento.currentTarget, pedidoFeita(item), () => 'Tarefa registrada.'),
    }, 'Feito'));
}

/** Fora do turno: só uma ação secundária, para quem fez e não marcou (evita dose em dobro). */
function acoesFora(item, alvo) {
  if (item.tipo === 'DOSE') {
    return el('div', { class: 'linha-botoes' },
      el('button', {
        class: 'secundario',
        onclick: (evento) => registrarComDesfazer(item, alvo, evento.currentTarget, pedidoDar(item), avisoDose),
      }, 'Fui eu que dei'));
  }
  if (item.tipoSinal) {
    return el('div', { class: 'linha-botoes' },
      el('button', { class: 'secundario', onclick: () => abrirFormulario(alvo, (fechar) => formularioSinal(item, fechar)) }, 'Registrar medição'));
  }
  return el('div', { class: 'linha-botoes' },
    el('button', {
      class: 'secundario',
      onclick: (evento) => registrarComDesfazer(item, alvo, evento.currentTarget, pedidoFeita(item), () => 'Tarefa registrada.'),
    }, 'Fui eu que fiz'));
}

function detalheDoItem(item) {
  if (!item.detalhe) return null;
  return item.tipo === 'TAREFA'
    ? el('details', { 'data-chave': `como:${chave(item)}` }, el('summary', {}, 'Como fazer'), el('p', { class: 'detalhe' }, item.detalhe))
    : el('p', { class: 'detalhe' }, item.detalhe);
}

// ------------------------------------------------------------------ agora

function linhaQuemCuida(quemCuida, paciente) {
  const texto = quemCuida
    ? `Com ${paciente} agora: ${quemCuida.nome}, até ${formatarHora(quemCuida.fim)}`
    : `Ninguém está no turno com ${paciente} agora`;
  return el('p', { class: 'agora-quem' + (quemCuida ? '' : ' vago') }, icone(quemCuida ? 'coracao' : 'calendario'), texto);
}

/**
 * Fora do turno, sem remédio atrasado para conferir: um cartão calmo dizendo quem está cuidando,
 * em vez de dar a quem está de fora uma tarefa do turno de outra pessoa.
 */
function cartaoFora(ctx, pendenciasDoTurno) {
  const quem = ctx.quemCuida
    ? `${ctx.quemCuida.nome} está com ${ctx.paciente} até ${formatarHora(ctx.quemCuida.fim)}.`
    : `Ninguém está no turno com ${ctx.paciente} agora.`;
  const resto = pendenciasDoTurno
    ? ` O turno ${ctx.quemCuida ? `de ${ctx.quemCuida.nome}` : 'de agora'} tem ${pendenciasDoTurno} ${pendenciasDoTurno > 1 ? 'pendências' : 'pendência'}.`
    : '';
  return el('article', { class: 'agora calmo', 'aria-labelledby': 'agora-titulo' },
    linhaQuemCuida(ctx.quemCuida, ctx.paciente),
    el('div', { class: 'agora-topo' },
      el('span', { class: 'agora-icone' }, icone('folha')),
      el('span', { class: 'agora-rotulo' }, 'Agora')),
    el('h2', { id: 'agora-titulo', tabindex: '-1' }, 'Nada para você agora'),
    el('p', { class: 'detalhe' }, quem + resto));
}

function cartaoAgora(item, ctx) {
  if (!item) {
    return el('article', { class: 'agora calmo', 'aria-labelledby': 'agora-titulo' },
      ctx.noTurno ? null : linhaQuemCuida(ctx.quemCuida, ctx.paciente),
      el('div', { class: 'agora-topo' },
        el('span', { class: 'agora-icone' }, icone('folha')),
        el('span', { class: 'agora-rotulo' }, 'Agora')),
      el('h2', { id: 'agora-titulo', tabindex: '-1' }, 'Tudo em dia por aqui'),
      el('p', { class: 'detalhe' }, 'Nada pendente agora. Aproveite para respirar um pouco.'));
  }
  const quando = quandoDoItem(item, ctx.noTurno);
  const tipo = item.tipo === 'DOSE' ? 'Remédio' : item.tipoSinal ? 'Medição' : 'Tarefa';
  const notas = [];
  if (item.tipo === 'DOSE' && atrasado(item) && !ctx.noTurno) {
    // "ninguém registrou" não quer dizer "ninguém deu": fora do turno, confirmar antes de dar (evita dose em dobro)
    notas.push(ctx.quemCuida
      ? `Ainda sem registro no app (conferido às ${horaDe(Date.now())}). Quem está com ${ctx.paciente} é ${ctx.quemCuida.nome}: antes de dar, confirme com ${ctx.quemCuida.nome}, que pode ter dado sem marcar.`
      : `Ainda sem registro no app (conferido às ${horaDe(Date.now())}). Antes de dar, confirme com quem cuidou por último, que pode ter dado sem marcar.`);
  } else if (item.tipo === 'DOSE') {
    notas.push(`Ninguém registrou ainda (conferido às ${horaDe(Date.now())}).`);
    if (atrasado(item) && ctx.noTurno) notas.push(`Registre até ${horaDe(ms(item.horario) + JANELA_DOSE)}; depois disso, o app não aceita mais o registro.`);
  }
  const cartao = el('article', { class: 'agora' + (ctx.noTurno ? '' : ' fora'), 'aria-labelledby': 'agora-titulo', 'data-chave': `agora:${chave(item)}` });
  preencher(cartao,
    ctx.noTurno ? null : linhaQuemCuida(ctx.quemCuida, ctx.paciente),
    el('div', { class: 'agora-topo' },
      el('span', { class: 'agora-icone' }, icone(iconeDoItem(item))),
      el('div', {},
        el('span', { class: 'agora-rotulo' }, tipo),
        el('span', { class: 'agora-quando' + (quando.nivel ? ` ${quando.nivel}` : '') }, quando.texto))),
    el('h2', { id: 'agora-titulo', tabindex: '-1' }, item.titulo),
    detalheDoItem(item),
    notas.length ? el('p', { class: 'agora-nota' }, notas.join(' ')) : null,
    ctx.noTurno ? acoes(item, cartao, false) : acoesFora(item, cartao));
  return cartao;
}

// ------------------------------------------------------------------ avisos

/** Sobrecarga de quem está vendo: fala com a pessoa e fica acima dos outros avisos. */
function avisoVoce(alerta, noTurno) {
  const [, semana, seguidas] = alerta.mensagem.match(/(\d+) h nos últimos 7 dias, (\d+) h seguidas/) || [];
  // no turno, fala no presente; de folga, fala do que passou e incentiva o descanso
  const titulo = !seguidas ? 'Você está carregando muito'
    : noTurno ? `Você está há ${seguidas} h sem folga` : `Você ficou ${seguidas} h seguidas sem folga`;
  const texto = !semana ? alerta.mensagem
    : noTurno ? `São ${semana} h nos últimos 7 dias. Seu descanso também faz parte do cuidado.`
      : `São ${semana} h nos últimos 7 dias. Aproveite a folga para descansar.`;
  return el('section', { class: 'aviso-voce', 'aria-labelledby': 't-voce' },
    el('span', { class: 'aviso-voce-icone' }, icone('folha')),
    el('div', {},
      el('h2', { id: 't-voce' }, titulo),
      el('p', {}, texto),
      el('div', { class: 'linha-botoes' },
        el('a', { class: 'botao pequeno secundario', href: '#/escala' }, 'Ver quem pode cobrir'),
        el('button', {
          type: 'button', class: 'pequeno secundario', 'aria-label': `Entendi, marcar como lido: ${alerta.mensagem}`,
          onclick: async () => { await tentar(() => chamar('PUT', `/alertas/${alerta.id}/lido`)); atualizar({ forcar: true }); },
        }, 'Entendi'))));
}

async function avisoVago(pacienteId, podeCobrir) {
  const hoje = new Date();
  const fim = new Date(hoje); fim.setDate(fim.getDate() + 7);
  const analise = await chamar('GET', `/pacientes/${pacienteId}/escala/analise?de=${isoData(hoje)}&ate=${isoData(fim)}`).catch(() => null);
  const vago = analise?.vagos?.find((v) => paraData(v.fim) > hoje);
  if (!vago) return null;
  const quando = `${formatarDiaSemana(vago.inicio)}, ${intervalo(vago.inicio, vago.fim)}`;
  const aviso = el('div', { class: 'alerta atencao' },
    icone('calendario'),
    el('span', { class: 'alerta-texto' }, `Ninguém cobre ${quando}`));
  if (!podeCobrir) {
    aviso.append(el('a', { class: 'botao pequeno secundario', href: '#/escala' }, 'Ver na escala'));
    return aviso;
  }
  // assumir um turno de 8 h pede confirmação
  const confirmar = el('div', { class: 'linha-botoes confirmar-cobrir', hidden: true },
    el('span', { class: 'detalhe' }, `Você fica com ${quando}?`),
    el('button', {
      class: 'pequeno',
      onclick: async (evento) => {
        evento.currentTarget.disabled = true;
        const ok = await tentar(() => chamar('POST', `/pacientes/${pacienteId}/turnos`,
          { pessoaId: estado.pessoa.id, inicio: vago.inicio, fim: vago.fim }));
        if (ok) mostrarAviso('Obrigado! O turno agora é seu.');
        atualizar({ forcar: true });
      },
    }, 'Sim, eu cubro'),
    el('button', { class: 'pequeno secundario', onclick: () => { confirmar.hidden = true; abrir.hidden = false; abrir.focus(); } }, 'Agora não'));
  const abrir = el('button', {
    class: 'pequeno secundario',
    onclick: () => { abrir.hidden = true; confirmar.hidden = false; confirmar.querySelector('button').focus(); },
  }, 'Posso cobrir');
  aviso.append(abrir, confirmar);
  return aviso;
}

// ------------------------------------------------------------------ caminho do dia

const semRegistro = (item, doses) => item.status === 'NAO_DADA' && !doses.get(item.id)?.observacao;

function etiquetaStatus(item, ctx, palavraDestaque) {
  const { doses } = ctx;
  if (naFila(item)) return el('span', { class: 'etiqueta meio' }, 'Aguardando envio');
  if (pendente(item)) {
    // "Atrasado" tem sempre a mesma cor, no cartão e na lista
    if (palavraDestaque === 'Atrasado') return el('span', { class: `etiqueta ${urgente(item) ? 'ruim' : 'meio'}` }, palavraDestaque);
    if (palavraDestaque) return el('span', { class: 'etiqueta foco' }, palavraDestaque);
    // fora do turno, nada de "Atrasado": quem está vendo não é quem deve fazer
    return atrasado(item) && ctx.noTurno ? el('span', { class: `etiqueta ${urgente(item) ? 'ruim' : 'meio'}` }, 'Atrasado') : null;
  }
  if (item.status === 'ATRASADA') return el('span', { class: 'etiqueta meio' }, 'Dado com atraso');
  if (item.status === 'NAO_DADA') {
    return semRegistro(item, doses) ? el('span', { class: 'etiqueta meio' }, 'Sem registro') : el('span', { class: 'etiqueta ruim' }, 'Não dado');
  }
  return null;   // dado ou feito: o check e o "por quem" já dizem
}

/** "Por Marta às 08:05", o motivo de não ter sido dado, ou até quando ficou sem registro. */
function quemRegistrou(item, doses) {
  const dose = item.tipo === 'DOSE' && doses.get(item.id);
  if (!dose || pendente(item)) return null;
  if (semRegistro(item, doses)) return el('p', { class: 'detalhe' }, `Ninguém registrou até ${horaDe(ms(item.horario) + JANELA_DOSE)}`);
  if (item.status === 'NAO_DADA') {
    return el('p', { class: 'detalhe' }, `${dose.observacao}${dose.dadaPorNome ? ` · por ${primeiroNome(dose.dadaPorNome)}` : ''}`);
  }
  return dose.dadaPorNome && dose.dadaEm
    ? el('p', { class: 'detalhe' }, `Por ${primeiroNome(dose.dadaPorNome)} às ${formatarHora(dose.dadaEm)}`)
    : null;
}

/** atras = item do grupo "Ficou para trás": sem cor de cobrança. */
function linhaCaminho(item, ctx, destaque, palavraDestaque, atras = false) {
  const ehDestaque = item === destaque;
  const esperando = naFila(item);
  let classes = '';
  if (pendente(item) && !esperando) {
    classes = ehDestaque ? 'em-foco' : atras || !ctx.noTurno || !atrasado(item) ? '' : urgente(item) ? 'atrasado' : 'atencao';
  }
  else if (!pendente(item)) classes = item.status === 'NAO_DADA' ? (semRegistro(item, ctx.doses) ? 'feito sem-registro' : 'feito pulado') : 'feito';
  const li = el('li', { class: classes || null });
  const marca = pendente(item) ? iconeDoItem(item) : item.status === 'NAO_DADA' ? 'menos' : 'check';
  const titulo = [el('strong', {}, item.titulo), atras ? null : etiquetaStatus(item, ctx, ehDestaque ? palavraDestaque : null)];

  // Pendentes (menos o que já está em destaque) abrem com um toque: a lista fica curta e calma.
  let corpo;
  if (pendente(item) && !ehDestaque && !esperando) {
    corpo = el('details', { class: 'caminho-corpo', 'data-chave': chave(item) },
      el('summary', {},
        el('span', { class: 'resumo' }, el('span', { class: 'visualmente-oculto' }, `${formatarHora(item.horario)}, `), ...titulo),
        icone('seta', 'seta')),
      item.detalhe ? el('p', { class: 'detalhe' }, item.detalhe) : null);
    corpo.append(ctx.noTurno ? acoes(item, corpo, true) : acoesFora(item, corpo));
  } else {
    corpo = el('div', { class: 'caminho-corpo' }, ...titulo, quemRegistrou(item, ctx.doses));
  }
  preencher(li,
    el('span', { class: 'caminho-hora' }, formatarHora(item.horario)),
    el('span', { class: 'caminho-marco' }, el('span', { class: 'marco' }, icone(marca))),
    corpo);
  return li;
}

/** A resposta para "já deram o remédio?": o último registrado hoje, sempre à vista. */
function ultimoRemedio(doses) {
  const ultimo = [...doses.values()].filter((d) => (d.status === 'DADA' || d.status === 'ATRASADA') && d.dadaEm)
    .sort((a, b) => ms(b.dadaEm) - ms(a.dadaEm))[0];
  if (!ultimo) return null;
  const quem = ultimo.dadaPorNome === estado.pessoa?.nome ? 'você' : primeiroNome(ultimo.dadaPorNome);
  const hora = formatarHora(ultimo.dadaEm);
  // remédios dados juntos (mesma pessoa, mesmo minuto) aparecem juntos
  const juntos = [...doses.values()].filter((d) => d.dadaEm && formatarHora(d.dadaEm) === hora && d.dadaPorNome === ultimo.dadaPorNome
    && d.dadaEm.slice(0, 10) === ultimo.dadaEm.slice(0, 10) && (d.status === 'DADA' || d.status === 'ATRASADA'))
    .map((d) => `${d.medicamentoNome} ${d.dosagem || ''}`.trim());
  const nomes = juntos.length > 1 ? `${juntos.slice(0, -1).join(', ')} e ${juntos.at(-1)}` : juntos[0];
  return el('p', { class: 'ultimo-remedio' }, icone('pilula'),
    `${juntos.length > 1 ? 'Últimos remédios dados' : 'Último remédio dado'}: ${nomes}, por ${quem} às ${hora}`);
}

/** Fora do turno, separa as pendências: do turno de agora (de outra pessoa), do seu turno e o resto do dia. */
function agruparFora(abertos, ctx) {
  const agora = Date.now();
  const turnoDe = (item) => ctx.turnos.find((t) => ms(t.inicio) <= ms(item.horario) && ms(item.horario) < ms(t.fim));
  const grupos = { agora: [], seu: [], resto: [] };
  for (const item of abertos) {
    const turno = turnoDe(item);
    if (turno && ms(turno.inicio) <= agora && ms(turno.fim) > agora) grupos.agora.push(item);
    else if (turno && turno.pessoaId === estado.pessoa?.id) grupos.seu.push(item);
    else grupos.resto.push(item);
  }
  return grupos;
}

/** O seu turno vem primeiro e aberto; o turno de quem cuida agora e o resto do dia ficam recolhidos. */
function pendentesFora(abertos, ctx, linhas) {
  const grupos = agruparFora(abertos, ctx);
  const quem = ctx.quemCuida ? `Agora, com ${ctx.quemCuida.nome} até ${formatarHora(ctx.quemCuida.fim)}` : 'Agora, sem ninguém no turno';
  const seu = ctx.proximoTurno ? `Seu turno, ${intervalo(ctx.proximoTurno.inicio, ctx.proximoTurno.fim)}` : 'Seu turno';
  return [
    grupos.seu.length ? [el('h3', { class: 'grupo-titulo seu' }, seu), linhas(grupos.seu)] : null,
    grupos.agora.length
      ? el('details', { class: 'grupo-caminho', 'data-chave': 'agora' },
        el('summary', {}, `${quem} (${grupos.agora.length})`), linhas(grupos.agora))
      : null,
    grupos.resto.length
      ? el('details', { class: 'grupo-caminho', 'data-chave': 'resto' },
        el('summary', {}, `Outros horários de hoje (${grupos.resto.length})`), linhas(grupos.resto))
      : null,
  ].flat();
}

function caminhoDoDia(dados, ctx, destaque, paraTras, atualizadoEm) {
  const fora = dados.itens.filter((i) => !paraTras.has(i));
  const registrados = fora.filter((i) => !pendente(i));
  const abertos = fora.filter(pendente);
  const palavra = destaque ? quandoDoItem(destaque, ctx.noTurno).palavra : null;
  const feitos = dados.itens.filter(feito).length;
  const contagem = ctx.noTurno && dados.itens.length
    ? `${feitos} de ${dados.itens.length} feitos · atualizado às ${atualizadoEm}`
    : `Atualizado às ${atualizadoEm}`;
  const linhas = (lista, atras = false) => el('ol', { class: 'caminho' }, lista.map((item) => linhaCaminho(item, ctx, destaque, palavra, atras)));
  let pendentes;
  if (!abertos.length) pendentes = el('p', { class: 'caminho-vazio' }, icone('folha'), ctx.noTurno ? 'Nada pendente no seu turno.' : 'Nada pendente para hoje.');
  else pendentes = ctx.noTurno ? linhas(abertos) : pendentesFora(abertos, ctx, linhas);

  return el('section', { class: 'caminho-secao', 'aria-labelledby': 't-caminho' },
    el('div', { class: 'caminho-cabeca' },
      el('h2', { id: 't-caminho' }, ctx.noTurno ? 'No seu turno' : 'Pendências de hoje'),
      el('span', { class: 'caminho-contagem' }, contagem),
      ultimoRemedio(ctx.doses)),
    // o que já passou fica recolhido; o que falta fazer vem primeiro
    registrados.length
      ? el('details', { class: 'grupo-caminho', 'data-chave': 'registrados' },
        el('summary', {}, `Já registrados (${registrados.length})`), linhas(registrados))
      : null,
    pendentes,
    paraTras.size
      ? el('details', { class: 'grupo-caminho para-tras', 'data-chave': 'para-tras' },
        el('summary', {}, `Ficou para trás (${paraTras.size})`),
        el('p', { class: 'detalhe' }, 'Tarefas que passaram do horário: já têm uma vez mais nova ou ficaram esquecidas. Marque se foram feitas; se não, pode deixar.'),
        linhas([...paraTras], true))
      : null,
    dados.itens.some((i) => semRegistro(i, ctx.doses))
      ? el('p', { class: 'orientacao' }, 'Algum remédio ficou sem registro? Se você não sabe se já deram, não dê de novo: pergunte a quem estava no turno.')
      : null);
}

/** Fora do turno a lista mostra só pendências; aqui ficam os remédios já registrados hoje. */
function jaRegistrados(doses) {
  const registradas = [...doses.values()].filter((d) => d.status !== 'PENDENTE')
    .sort((a, b) => ms(a.previstoPara) - ms(b.previstoPara));
  if (!registradas.length) return null;
  const texto = (d) => {
    if (d.status === 'NAO_DADA') return d.observacao ? `Não dado: ${d.observacao}` : 'Sem registro';
    return `Dado${d.dadaPorNome ? ` por ${primeiroNome(d.dadaPorNome)}` : ''}${d.dadaEm ? ` às ${formatarHora(d.dadaEm)}` : ''}`;
  };
  // recolhido: quem está fora do turno (o vizinho, por exemplo) só vê os remédios se precisar
  return el('details', { class: 'grupo-caminho ja-registrados', 'data-chave': 'ja-registrados' },
    el('summary', {}, `Remédios já registrados hoje (${registradas.length})`),
    el('ul', { class: 'lista' }, registradas.map((d) => el('li', {},
      el('span', { class: 'ja-nome' }, el('span', { class: 'hora' }, formatarHora(d.previstoPara)), `${d.medicamentoNome} ${d.dosagem || ''}`.trim()),
      el('span', { class: 'detalhe' }, texto(d))))));
}

// ------------------------------------------------------------------ movimento

function animarEntrada(raiz) {
  const arco = raiz.querySelector('.arco');
  const fracao = arco ? Number(arco.dataset.fracao) : 0;
  if (semMovimento()) { if (arco) desenharArco(arco, fracao); return; }

  const { gsap } = window;
  const linha = gsap.timeline({ defaults: { ease: 'expo.out' } });
  linha.from(raiz.querySelectorAll('.ceu-texto > *'), { y: 18, opacity: 0, duration: 1, stagger: 0.08 })
    .from(raiz.querySelectorAll('.morros path'), { y: 46, duration: 1.5, stagger: 0.12 }, 0)
    .from(raiz.querySelector('.agora'), { y: 44, opacity: 0, duration: 1.1 }, 0.3)
    .from(raiz.querySelectorAll('.aviso-voce, .avisos > *, .caminho-cabeca, .caminho-secao > *:not(.caminho-cabeca)'),
      { y: 14, opacity: 0, duration: 0.8, stagger: 0.05 }, 0.55);
  if (arco) {
    // o astro sai do começo do turno e caminha até a hora de agora
    const progresso = { f: 0 };
    desenharArco(arco, 0);
    linha.from(arco.querySelectorAll('.arco-centro, .arco-hora'), { y: 8, opacity: 0, duration: 0.9, stagger: 0.06 }, 0.2)
      .to(progresso, { f: fracao, duration: 2, ease: 'power3.inOut', onUpdate: () => desenharArco(arco, progresso.f) }, 0.3);
  }
}

// ------------------------------------------------------------------ montar e atualizar

/** Monta a tela. Devolve false se desistiu (a pessoa começou um registro ou um formulário enquanto os dados chegavam). */
async function montar({ animar, forcar = true }) {
  const { conteudo, pacienteId } = tela;
  const ontem = new Date(); ontem.setDate(ontem.getDate() - 1);
  const [dados, listaDoses, turnos] = await Promise.all([
    chamar('GET', `/hoje?pacienteId=${pacienteId}`),
    chamar('GET', `/pacientes/${pacienteId}/doses?data=${isoData(new Date())}`).catch(() => []),
    chamar('GET', `/pacientes/${pacienteId}/turnos?de=${isoData(ontem)}&ate=${isoData(new Date())}`).catch(() => []),
  ]);
  // não apaga um "Desfazer" nem um formulário que a pessoa abriu durante a espera
  if (!animar && (aguardando.size || (!forcar && conteudo.querySelector('.form-inline, .aviso-sinal, .confirmar-cobrir:not([hidden])')))) return false;
  const agora = Date.now();
  const quando = new Date(agora);
  const turnoDeAgora = turnos.find((t) => t.pessoaId && ms(t.inicio) <= agora && ms(t.fim) > agora);
  const ctx = {
    noTurno: Boolean(dados.turnoAtual),
    doses: new Map(listaDoses.map((d) => [d.id, d])),
    paciente: primeiroNome(dados.paciente.nome),
    quemCuida: turnoDeAgora ? { nome: primeiroNome(turnoDeAgora.pessoaNome), fim: turnoDeAgora.fim } : null,
    turnos,
    proximoTurno: dados.proximoTurno,
  };
  const classificado = classificar(dados.itens, agora);
  const { paraTras } = classificado;
  // fora do turno, só um remédio atrasado vira destaque (é onde mora o risco de dose em dobro);
  // tarefa ou medição do turno de outra pessoa fica na lista, e o cartão só diz quem está cuidando
  const destaque = ctx.noTurno || (classificado.destaque?.tipo === 'DOSE' && atrasado(classificado.destaque))
    ? classificado.destaque : null;
  const pendenciasDoTurno = ctx.noTurno ? 0
    : agruparFora(dados.itens.filter((i) => pendente(i) && !paraTras.has(i)), ctx).agora.length;

  const minhaSobrecarga = dados.alertas.find((a) => a.tipo === 'SOBRECARGA' && a.mensagem.startsWith(`${estado.pessoa?.nome}:`));
  const vago = await avisoVago(pacienteId, !minhaSobrecarga);
  const outros = dados.alertas.filter((a) => a !== minhaSobrecarga && !ALERTAS_DA_LISTA.includes(a.tipo)
    && !(vago && a.tipo === 'TURNO_VAGO'));
  const avisos = [vago, ...cartoesAlerta(outros, () => atualizar({ forcar: true }), { anunciar: animar })].filter(Boolean);
  const naoEnviados = lerFila().filter((r) => !aguardando.has(r.chave)).length;

  preencher(conteudo,
    ceu(dados, quando),
    !ctx.noTurno && !destaque ? cartaoFora(ctx, pendenciasDoTurno) : cartaoAgora(destaque, ctx),
    naoEnviados
      ? el('div', { class: 'alerta atencao aviso-fila', role: 'status' },
        icone('sino'),
        el('span', { class: 'alerta-texto' }, `${naoEnviados} ${naoEnviados > 1 ? 'registros ainda não foram enviados' : 'registro ainda não foi enviado'} por falta de conexão. Vamos tentar de novo sozinhos.`),
        el('button', { class: 'pequeno secundario', onclick: async () => { await reenviarFila(); atualizar({ forcar: true }); } }, 'Tentar agora'))
      : null,
    minhaSobrecarga ? avisoVoce(minhaSobrecarga, ctx.noTurno) : null,
    avisos.length ? el('div', { class: 'avisos' }, avisos) : null,
    caminhoDoDia(dados, ctx, destaque, paraTras, formatarHora(isoLocal(quando))),
    ctx.noTurno ? null : jaRegistrados(ctx.doses),
    el('p', { class: 'aviso-medico' }, 'O CuidaQuemCuida organiza e orienta. Não substitui orientação médica.'));

  const arco = conteudo.querySelector('.arco');
  if (arco) ajustarArco(arco);
  if (animar) animarEntrada(conteudo);
  else if (arco) desenharArco(arco, Number(arco.dataset.fracao));

  // o destaque mudou numa atualização: segura os botões do cartão um instante, para um toque
  // que ia para o item antigo não cair no novo (ex.: "Feito" virar "Dei o remédio")
  const chaveDestaque = destaque ? chave(destaque) : null;
  if (!animar && tela.ultimoDestaque !== chaveDestaque) {
    const botoes = [...conteudo.querySelectorAll('.agora .linha-botoes button')];
    for (const b of botoes) b.disabled = true;
    setTimeout(() => { for (const b of botoes) b.disabled = false; }, 700);
  }
  tela.ultimoDestaque = chaveDestaque;
  return true;
}

/** Enquanto a tela velha não foi atualizada, ninguém toca nela. */
function ocupar() { if (tela) { tela.conteudo.inert = true; tela.conteudo.setAttribute('aria-busy', 'true'); } }
function liberar() { if (tela) { tela.conteudo.inert = false; tela.conteudo.removeAttribute('aria-busy'); } }

/**
 * Redesenha no lugar, sem voltar ao topo. Sozinha (a cada minuto ou ao voltar para o app)
 * não atualiza se houver formulário aberto ou registro esperando o "Desfazer".
 * Guarda o que estava aberto e onde estava o foco. Depois de um registro, o foco vai para o título
 * do próximo item (não para o botão: evita registrar sem querer).
 */
async function atualizar({ forcar = false, focar = false } = {}) {
  try {
    if (!tela || !location.hash.startsWith('#/hoje')) { clearInterval(vigia); vigia = null; return; }
    if (aguardando.size) return;
    if (!forcar && tela.conteudo.querySelector('.form-inline, .aviso-sinal, .confirmar-cobrir:not([hidden])')) return;
    const { conteudo } = tela;
    const abertos = [...conteudo.querySelectorAll('details[open][data-chave]')].map((d) => d.dataset.chave);
    const ativo = document.activeElement;
    const focoEm = conteudo.contains(ativo) ? ativo.closest('[data-chave]')?.dataset.chave : null;
    const rolagem = window.scrollY;
    await reenviarFila();
    const montou = await tentar(() => montar({ animar: false, forcar }));
    if (!montou) return;
    for (const d of conteudo.querySelectorAll('details[data-chave]')) if (abertos.includes(d.dataset.chave)) d.open = true;
    window.scrollTo(0, rolagem);
    if (focar) conteudo.querySelector('#agora-titulo')?.focus({ preventScroll: true });
    else if (focoEm) {
      const alvo = [...conteudo.querySelectorAll('[data-chave]')].find((n) => n.dataset.chave === focoEm);
      (alvo?.querySelector('summary, button, a') || alvo)?.focus({ preventScroll: true });
    }
  } finally {
    liberar();
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') descarregar();
  else { ocupar(); atualizar(); }   // a tela antiga fica travada até chegar a atualizada
});
window.addEventListener('hashchange', descarregar);

registrarTela('/hoje', async (conteudo) => {
  tela = { conteudo, pacienteId: pacienteAtual().id };
  clearInterval(vigia);
  vigia = setInterval(() => atualizar(), MINUTO);
  await reenviarFila();
  await montar({ animar: true });
});
