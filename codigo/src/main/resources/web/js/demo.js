// Modo demonstração: implementa o contrato da API (documentacao/03-especificacoes-tecnicas/API.md)
// sobre dados em memória, com a mesma família fictícia dos dados de demonstração do banco.
// Serve para usar as telas sem o sistema Java. Os dados voltam ao início ao recarregar a página.

const MINUTO = 60 * 1000;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;
const SENHA_DEMO = 'demo1234';

// ---------------------------------------------------------------- datas
const dois = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}T${dois(d.getHours())}:${dois(d.getMinutes())}:00`;
const isoDia = (d) => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
function data(texto) {
  const [d, h = '00:00:00'] = texto.split('T');
  const [a, m, dd] = d.split('-').map(Number);
  const [hh, mm] = h.split(':').map(Number);
  return new Date(a, m - 1, dd, hh, mm);
}
const ms = (texto) => data(texto).getTime();
function meiaNoite(offsetDias = 0, base = new Date()) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + offsetDias);
  return d;
}
function emHora(dia, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), h, m);
}
const agora = () => Date.now();
const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// ---------------------------------------------------------------- utilidades
function falha(status, erro, extra = {}) {
  return { status, erro, ...extra };
}
let ultimoId = 5000;
const novoId = () => ++ultimoId;
const copia = (valor) => (valor === undefined ? null : JSON.parse(JSON.stringify(valor)));

const logSql = [];
function sql(texto) {
  const tipo = texto.trim().split(/\s+/)[0].toUpperCase();
  logSql.unshift({ quando: iso(new Date()), tipo, sql: texto, ms: 15 + ((logSql.length * 7) % 40) });
  if (logSql.length > 50) logSql.length = 50;
}

// ---------------------------------------------------------------- dados iniciais
const db = {
  pessoas: [
    { id: 1, nome: 'Marta Souza', email: 'marta@demo.cqc', senha: SENHA_DEMO, telefone: '11988887777', dataNascimento: '1968-03-10', genero: 'FEMININO', ativo: true },
    { id: 2, nome: 'Paulo Souza', email: 'paulo@demo.cqc', senha: SENHA_DEMO, telefone: null, dataNascimento: '1972-07-22', genero: 'MASCULINO', ativo: true },
    { id: 3, nome: 'Ana Souza', email: 'ana@demo.cqc', senha: SENHA_DEMO, telefone: null, dataNascimento: '2002-01-15', genero: 'FEMININO', ativo: true },
    { id: 4, nome: 'João Pereira', email: 'joao@demo.cqc', senha: SENHA_DEMO, telefone: null, dataNascimento: '1959-09-03', genero: 'MASCULINO', ativo: true },
  ],
  pacientes: [
    {
      id: 1, nome: 'Lurdes Souza', dataNascimento: '1944-08-21', condicao: 'Alzheimer moderado, acamada parcialmente',
      precisa24h: true, observacoes: 'Alergia a dipirona. Usa fralda. Precisa de ajuda para se alimentar.',
      responsavelNome: 'Marta Souza', responsavelParentesco: 'Filha', codigoConvite: 'LURD26',
    },
  ],
  membros: [
    { pessoaId: 1, pacienteId: 1, papel: 'COORDENADOR', vinculo: 'FAMILIAR', ativo: true, compartilhaZarit: true },
    { pessoaId: 2, pacienteId: 1, papel: 'MEMBRO', vinculo: 'FAMILIAR', ativo: true, compartilhaZarit: true },
    { pessoaId: 3, pacienteId: 1, papel: 'MEMBRO', vinculo: 'FAMILIAR', ativo: true, compartilhaZarit: true },
    { pessoaId: 4, pacienteId: 1, papel: 'MEMBRO', vinculo: 'VIZINHO', ativo: true, compartilhaZarit: true },
  ],
  turnos: [],
  medicamentos: [
    { id: 1, pacienteId: 1, nome: 'Losartana', dosagem: '50 mg', via: 'Oral', instrucoes: 'Para a pressão. Com água.', ativo: true,
      regra: { tipo: 'HORARIOS_FIXOS', intervaloHoras: null, primeiraDose: null, horarios: ['08:00', '20:00'], inicio: isoDia(meiaNoite(-30)), fim: null } },
    { id: 2, pacienteId: 1, nome: 'Donepezila', dosagem: '10 mg', via: 'Oral', instrucoes: 'Para a memória. Antes de dormir.', ativo: true,
      regra: { tipo: 'HORARIOS_FIXOS', intervaloHoras: null, primeiraDose: null, horarios: ['20:00'], inicio: isoDia(meiaNoite(-30)), fim: null } },
    { id: 3, pacienteId: 1, nome: 'Omeprazol', dosagem: '20 mg', via: 'Oral', instrucoes: 'Em jejum, 30 minutos antes do café.', ativo: true,
      regra: { tipo: 'HORARIOS_FIXOS', intervaloHoras: null, primeiraDose: null, horarios: ['07:00'], inicio: isoDia(meiaNoite(-30)), fim: null } },
    { id: 4, pacienteId: 1, nome: 'Vitamina D', dosagem: '7.000 UI', via: 'Oral', instrucoes: 'Dia sim, dia não. Junto com uma refeição.', ativo: true,
      regra: { tipo: 'DIAS_ALTERNADOS', intervaloHoras: null, primeiraDose: null, horarios: ['09:00'], inicio: isoDia(meiaNoite(-30)), fim: null } },
    { id: 5, pacienteId: 1, nome: 'Amoxicilina', dosagem: '500 mg', via: 'Oral', instrucoes: 'Antibiótico de 8 em 8 horas. Não pular doses.', ativo: true,
      regra: { tipo: 'INTERVALO', intervaloHoras: 8, primeiraDose: '06:00', horarios: null, inicio: isoDia(meiaNoite(-6)), fim: isoDia(meiaNoite(1)) } },
  ],
  doses: [],
  sinais: [],
  faixas: [
    { pacienteId: 1, tipo: 'PRESSAO', minimo: 90, maximo: 150 },
    { pacienteId: 1, tipo: 'GLICEMIA', minimo: 70, maximo: 180 },
    { pacienteId: 1, tipo: 'TEMPERATURA', minimo: 35.5, maximo: 37.8 },
    { pacienteId: 1, tipo: 'SATURACAO', minimo: 92, maximo: 100 },
    { pacienteId: 1, tipo: 'FREQUENCIA_CARDIACA', minimo: 50, maximo: 110 },
  ],
  tarefas: [
    { id: 1, pacienteId: 1, titulo: 'Mudar de posição', recorrenciaHoras: 2, primeiraVez: '06:00', tipoSinal: null, ativa: true,
      orientacao: 'Vire a pessoa de lado, alternando direita, costas e esquerda. Coloque um travesseiro entre os joelhos e confira calcanhares, quadril e lombar: pele vermelha que não clareia ao apertar é sinal de escara começando.' },
    { id: 2, pacienteId: 1, titulo: 'Oferecer água', recorrenciaHoras: 3, primeiraVez: '07:00', tipoSinal: null, ativa: true,
      orientacao: 'Ofereça meio copo de água em pequenos goles, com a pessoa sentada ou com a cabeceira elevada. Idosos com Alzheimer muitas vezes não sentem sede.' },
    { id: 3, pacienteId: 1, titulo: 'Higiene e troca', recorrenciaHoras: 24, primeiraVez: '08:00', tipoSinal: null, ativa: true,
      orientacao: 'Banho no leito ou de chuveiro com cadeira, troca de fralda e hidratação da pele com creme. Mantenha a pele seca nas dobras.' },
    { id: 4, pacienteId: 1, titulo: 'Medir pressão', recorrenciaHoras: 24, primeiraVez: '10:00', tipoSinal: 'PRESSAO', ativa: true,
      orientacao: 'Com a pessoa sentada ou deitada há 5 minutos, braço apoiado na altura do coração. Anote os dois números.' },
    { id: 5, pacienteId: 1, titulo: 'Medir glicemia', recorrenciaHoras: 24, primeiraVez: '07:30', tipoSinal: 'GLICEMIA', ativa: true,
      orientacao: 'Lave e seque o dedo, use a lateral da ponta do dedo e registre o valor do aparelho.' },
  ],
  execucoes: [],
  zarit: [],
  alertasGravados: [],   // SINAL_* e PEDIDO_AJUDA
  idsAlerta: new Map(),  // chave estável -> id
  lidos: new Set(),      // "id:pessoa"
};

// Escala: o mesmo padrão semanal do banco (isodow 1=segunda ... 7=domingo). Domingo 22h-6h vago.
(function gerarEscala() {
  for (let offset = -21; offset <= 14; offset++) {
    const dia = meiaNoite(offset);
    const dow = dia.getDay() === 0 ? 7 : dia.getDay();
    const tarde = [1, 3, 5].includes(dow) ? 2 : [2, 4].includes(dow) ? 3 : 1;
    const noite = { 1: 1, 2: 1, 3: 1, 4: 4, 5: 3, 6: 2, 7: null }[dow];
    const faixas = [[1, '06:00', 0, '14:00'], [tarde, '14:00', 0, '22:00']];
    if (noite) faixas.push([noite, '22:00', 1, '06:00']);
    for (const [pessoaId, ini, maisDia, fim] of faixas) {
      const inicio = emHora(dia, ini);
      const termino = emHora(meiaNoite(offset + maisDia), fim);
      db.turnos.push({
        id: novoId(), pacienteId: 1, pessoaId, inicio: iso(inicio), fim: iso(termino),
        status: termino.getTime() <= agora() ? 'REALIZADO' : 'PLANEJADO',
      });
    }
  }
}());

// Sinais vitais dos últimos 30 dias (pressão às 10h, glicemia às 7h30) e o ponto fora da curva.
(function gerarSinais() {
  for (let offset = -30; offset <= 0; offset++) {
    const dia = meiaNoite(offset);
    const n = Math.abs(offset);
    const pressao = emHora(dia, '10:00');
    if (pressao.getTime() <= agora()) {
      const fora = offset === -2;
      db.sinais.push({ id: novoId(), pacienteId: 1, tipo: 'PRESSAO', valor: fora ? 175 : 125 + (n * 7) % 11,
        valor2: fora ? 100 : 78 + (n * 3) % 8, medidoEm: iso(pressao), medidoPor: 1 });
    }
    const glicemia = emHora(dia, '07:30');
    if (glicemia.getTime() <= agora()) {
      db.sinais.push({ id: novoId(), pacienteId: 1, tipo: 'GLICEMIA', valor: 95 + (n * 13) % 36, valor2: null,
        medidoEm: iso(glicemia), medidoPor: 1 });
    }
  }
}());

// Avaliações Zarit (20 e 6 dias atrás): quem faz mais noites tem mais sobrecarga.
[[1, 30, 'ALTA', 5.0, 2, 34, 'ALTA', 4.5, 1], [3, 14, 'MODERADA', 6.5, 3, 15, 'MODERADA', 6.5, 3],
  [2, 11, 'MODERADA', 7.0, 4, 12, 'MODERADA', 7.0, 4], [4, 7, 'BAIXA', 7.5, 5, 6, 'BAIXA', 7.0, 4]]
  .forEach(([pessoaId, p1, f1, h1, q1, p2, f2, h2, q2]) => {
    db.zarit.push({ id: novoId(), pessoaId, pontuacao: p1, faixa: f1, horasSono: h1, qualidadeSono: q1, respondidaEm: iso(emHora(meiaNoite(-20), '21:00')) });
    db.zarit.push({ id: novoId(), pessoaId, pontuacao: p2, faixa: f2, horasSono: h2, qualidadeSono: q2, respondidaEm: iso(emHora(meiaNoite(-6), '21:00')) });
  });

// ---------------------------------------------------------------- consultas auxiliares
const pessoa = (id) => db.pessoas.find((p) => p.id === id);
const nomeDe = (id) => (id ? pessoa(id)?.nome ?? null : null);
const paciente = (id) => db.pacientes.find((p) => p.id === id);
const membrosAtivos = (pacienteId) => db.membros.filter((m) => m.pacienteId === pacienteId && m.ativo);
const coordenadores = (pacienteId) => membrosAtivos(pacienteId).filter((m) => m.papel === 'COORDENADOR').map((m) => m.pessoaId);

function pessoaNoTurno(pacienteId, instante) {
  const t = db.turnos.find((x) => x.pacienteId === pacienteId && x.pessoaId
    && ms(x.inicio) <= instante && ms(x.fim) > instante && x.status !== 'CANCELADO');
  return t ? t.pessoaId : null;
}

function autenticar(token) {
  const id = Number(String(token || '').replace('demo-', ''));
  const p = pessoa(id);
  if (!p || !p.ativo) throw falha(401, 'Sua sessão expirou. Entre de novo.');
  return id;
}

function exigirMembro(eu, pacienteId) {
  const m = db.membros.find((x) => x.pessoaId === eu && x.pacienteId === pacienteId && x.ativo);
  if (!m || !paciente(pacienteId)) throw falha(403, 'Você não faz parte da rede deste paciente');
  return m;
}

function exigirCoordenador(eu, pacienteId) {
  if (exigirMembro(eu, pacienteId).papel !== 'COORDENADOR') throw falha(403, 'Só o coordenador pode fazer isso');
}

// ---------------------------------------------------------------- regras (mesmas do Java, versão simples)
function horasNaJanela(turnos, fimJanela, dias) {
  const inicio = fimJanela - dias * DIA;
  return turnos.reduce((soma, t) => soma + Math.max(0, Math.min(ms(t.fim), fimJanela) - Math.max(ms(t.inicio), inicio)), 0) / HORA;
}

function blocosSemFolga(turnos) {
  const ordenados = [...turnos].sort((a, b) => ms(a.inicio) - ms(b.inicio));
  const blocos = [];
  for (const t of ordenados) {
    const ultimo = blocos[blocos.length - 1];
    if (ultimo && ms(t.inicio) - ultimo.fim < 11 * HORA) {
      ultimo.fim = Math.max(ultimo.fim, ms(t.fim));
      ultimo.horas += (ms(t.fim) - ms(t.inicio)) / HORA;
    } else {
      blocos.push({ inicio: ms(t.inicio), fim: ms(t.fim), horas: (ms(t.fim) - ms(t.inicio)) / HORA });
    }
  }
  return blocos;
}

function nivel(horas7d, horasSeguidas) {
  if (horas7d > 60 || horasSeguidas > 36) return 'ALERTA';
  if (horas7d > 44 || horasSeguidas > 24) return 'ATENCAO';
  return 'OK';
}

function sobrepoe(a, b) {
  return ms(a.inicio) < ms(b.fim) && ms(b.inicio) < ms(a.fim);
}

function turnosDaPessoa(pessoaId) {
  return db.turnos.filter((t) => t.pessoaId === pessoaId && t.status !== 'CANCELADO');
}

function cargaDe(pessoaId) {
  const turnos = turnosDaPessoa(pessoaId).filter((t) => ms(t.inicio) <= agora());
  const horas7d = horasNaJanela(turnos, agora(), 7);
  const recentes = blocosSemFolga(turnos).filter((b) => b.fim > agora() - 7 * DIA);
  const horasSeguidas = recentes.reduce((max, b) => Math.max(max, b.horas), 0);
  return { horas7d: Math.round(horas7d * 10) / 10, horasSeguidas: Math.round(horasSeguidas * 10) / 10 };
}

function periodosDescobertos(pacienteId, de, ate) {
  const turnos = db.turnos.filter((t) => t.pacienteId === pacienteId && t.pessoaId && t.status !== 'CANCELADO'
    && ms(t.fim) > de && ms(t.inicio) < ate).sort((a, b) => ms(a.inicio) - ms(b.inicio));
  const vagos = [];
  let cursor = de;
  for (const t of turnos) {
    if (ms(t.inicio) > cursor) vagos.push({ inicio: iso(new Date(cursor)), fim: t.inicio });
    cursor = Math.max(cursor, ms(t.fim));
  }
  if (cursor < ate) vagos.push({ inicio: iso(new Date(cursor)), fim: iso(new Date(ate)) });
  return vagos;
}

function noturno(t) {
  let minutos = 0;
  for (let x = ms(t.inicio); x < ms(t.fim); x += 30 * MINUTO) {
    const h = new Date(x).getHours();
    if (h >= 22 || h < 6) minutos += 30;
  }
  return minutos >= 180;
}

function horariosRegra(regra, dia) {
  const inicioRegra = data(regra.inicio + 'T00:00:00');
  const fimRegra = regra.fim ? data(regra.fim + 'T00:00:00').getTime() + DIA : Infinity;
  const de = dia.getTime();
  const ate = de + DIA;
  let lista = [];
  if (regra.tipo === 'INTERVALO') {
    for (let t = emHora(inicioRegra, regra.primeiraDose).getTime(); t < Math.min(ate, fimRegra); t += regra.intervaloHoras * HORA) {
      if (t >= de) lista.push(t);
    }
  } else {
    const diasDesdeInicio = Math.round((de - inicioRegra.getTime()) / DIA);
    const valeHoje = de >= inicioRegra.getTime() && de < fimRegra
      && (regra.tipo === 'HORARIOS_FIXOS' || diasDesdeInicio % 2 === 0);
    if (valeHoje) lista = regra.horarios.map((h) => emHora(dia, h).getTime());
  }
  return lista;
}

function horariosTarefa(tarefa, dia) {
  const [h, m] = tarefa.primeiraVez.split(':').map(Number);
  const minutos = new Set();
  for (let k = 0; k * tarefa.recorrenciaHoras < 24; k++) minutos.add((h * 60 + m + k * tarefa.recorrenciaHoras * 60) % 1440);
  return [...minutos].sort((a, b) => a - b).map((min) => dia.getTime() + min * MINUTO);
}

// Gera as doses do dia (sem duplicar). Passado: dadas por quem estava no turno; últimos 90 min: pendentes.
function garantirDoses(pacienteId, dia) {
  for (const med of db.medicamentos.filter((m) => m.pacienteId === pacienteId && m.ativo)) {
    for (const t of horariosRegra(med.regra, dia)) {
      const previstoPara = iso(new Date(t));
      if (db.doses.some((d) => d.medicamentoId === med.id && d.previstoPara === previstoPara)) continue;
      const dose = { id: novoId(), medicamentoId: med.id, previstoPara, status: 'PENDENTE', dadaEm: null, dadaPor: null, observacao: null };
      if (t < agora() - 90 * MINUTO) {
        const quem = pessoaNoTurno(pacienteId, t);
        if (!quem) Object.assign(dose, { status: 'NAO_DADA', observacao: 'Ninguém na escala neste horário' });
        else if (new Date(t).getHours() >= 20 && new Date(t).getDate() % 3 === 0) {
          Object.assign(dose, { status: 'ATRASADA', dadaEm: iso(new Date(t + 55 * MINUTO)), dadaPor: quem });
        } else Object.assign(dose, { status: 'DADA', dadaEm: iso(new Date(t + 6 * MINUTO)), dadaPor: quem });
      }
      db.doses.push(dose);
    }
  }
}

function garantirExecucoes(pacienteId, dia) {
  for (const tarefa of db.tarefas.filter((x) => x.pacienteId === pacienteId && x.ativa)) {
    for (const t of horariosTarefa(tarefa, dia)) {
      const previstaPara = iso(new Date(t));
      if (db.execucoes.some((e) => e.tarefaId === tarefa.id && e.previstaPara === previstaPara)) continue;
      const execucao = { id: novoId(), tarefaId: tarefa.id, previstaPara, feitaEm: null, feitaPor: null };
      const quem = pessoaNoTurno(pacienteId, t);
      if (t < agora() - 90 * MINUTO && quem) Object.assign(execucao, { feitaEm: iso(new Date(t + 10 * MINUTO)), feitaPor: quem });
      db.execucoes.push(execucao);
    }
  }
}

function statusDose(dose) {
  if (dose.status === 'PENDENTE' && agora() > ms(dose.previstoPara) + 120 * MINUTO) {
    dose.status = 'NAO_DADA';
  }
  return dose.status;
}

const pacienteDaDose = (dose) => db.medicamentos.find((m) => m.id === dose.medicamentoId)?.pacienteId;
const pacienteDaExecucao = (e) => db.tarefas.find((t) => t.id === e.tarefaId)?.pacienteId;

function doseJson(d) {
  const med = db.medicamentos.find((m) => m.id === d.medicamentoId);
  return { id: d.id, medicamentoId: d.medicamentoId, medicamentoNome: med.nome, dosagem: med.dosagem,
    previstoPara: d.previstoPara, status: statusDose(d), dadaEm: d.dadaEm, dadaPorNome: nomeDe(d.dadaPor), observacao: d.observacao };
}

function execucaoJson(e) {
  const t = db.tarefas.find((x) => x.id === e.tarefaId);
  return { id: e.id, tarefaId: t.id, titulo: t.titulo, orientacao: t.orientacao, tipoSinal: t.tipoSinal,
    previstaPara: e.previstaPara, feitaEm: e.feitaEm, feitaPorNome: nomeDe(e.feitaPor) };
}

function turnoJson(t) {
  return { id: t.id, pessoaId: t.pessoaId, pessoaNome: nomeDe(t.pessoaId), inicio: t.inicio, fim: t.fim, status: t.status, noturno: noturno(t) };
}

const sinalJson = (s) => ({ id: s.id, tipo: s.tipo, valor: s.valor, valor2: s.valor2, medidoEm: s.medidoEm, medidoPorNome: nomeDe(s.medidoPor) });

function validarTurno(corpo) {
  if (!corpo.inicio || !corpo.fim) throw falha(400, 'Informe início e fim do turno');
  if (ms(corpo.fim) <= ms(corpo.inicio)) throw falha(400, 'O fim do turno precisa ser depois do início');
}

function conflitosCom(turno, ignorarId) {
  if (!turno.pessoaId) return [];
  return turnosDaPessoa(turno.pessoaId).filter((t) => t.id !== ignorarId && sobrepoe(t, turno));
}

function exigirSemConflito(turno, ignorarId) {
  const conflitos = conflitosCom(turno, ignorarId);
  if (conflitos.length) {
    throw falha(409, `${nomeDe(turno.pessoaId)} já tem turno nesse horário`,
      { conflitos: conflitos.map((c) => ({ id: c.id, inicio: c.inicio, fim: c.fim })) });
  }
}

// ---------------------------------------------------------------- alertas (calculados na hora)
function idAlerta(chave) {
  if (!db.idsAlerta.has(chave)) db.idsAlerta.set(chave, novoId());
  return db.idsAlerta.get(chave);
}

function alertasPara(eu, pacienteId) {
  const lista = [];
  const coords = coordenadores(pacienteId);
  const add = (tipo, referencia, mensagem, prioridade, destinatarios) => {
    if (!destinatarios.includes(eu)) return;
    const id = idAlerta(`${tipo}:${referencia}`);
    if (db.lidos.has(`${id}:${eu}`)) return;
    lista.push({ id, tipo, mensagem, prioridade, criadoEm: iso(new Date()), lido: false });
  };
  const todos = membrosAtivos(pacienteId).map((m) => m.pessoaId);

  if (paciente(pacienteId)?.precisa24h) {
    for (const v of periodosDescobertos(pacienteId, agora(), agora() + 7 * DIA)) {
      if (ms(v.fim) - ms(v.inicio) < HORA) continue;
      const ini = data(v.inicio);
      add('TURNO_VAGO', v.inicio, `${DIAS_SEMANA[ini.getDay()]} ${ini.getHours()}h–${data(v.fim).getHours()}h está sem ninguém`, 60, todos);
    }
  }

  garantirDoses(pacienteId, meiaNoite(0));
  for (const d of db.doses.filter((x) => pacienteDaDose(x) === pacienteId && x.previstoPara.startsWith(isoDia(new Date())))) {
    const status = statusDose(d);
    const previsto = ms(d.previstoPara);
    const nome = db.medicamentos.find((m) => m.id === d.medicamentoId).nome;
    const quem = pessoaNoTurno(pacienteId, previsto);
    const alvo = [...new Set([...(quem ? [quem] : []), ...coords])];
    if (status === 'PENDENTE' && agora() > previsto + 30 * MINUTO) {
      add('DOSE_ATRASADA', `dose:${d.id}`, `${nome} das ${data(d.previstoPara).getHours()}h ainda não foi dado`, 70, alvo);
    } else if (status === 'PENDENTE' && previsto - agora() <= 30 * MINUTO && previsto > agora()) {
      add('DOSE_PROXIMA', `dose:${d.id}`, `${nome} às ${data(d.previstoPara).getHours()}h, daqui a pouco`, 20, alvo);
    }
  }

  for (const m of membrosAtivos(pacienteId)) {
    const carga = cargaDe(m.pessoaId);
    const n = nivel(carga.horas7d, carga.horasSeguidas);
    if (n !== 'OK') {
      add('SOBRECARGA', `pessoa:${m.pessoaId}:${isoDia(new Date())}`,
        `${nomeDe(m.pessoaId)}: ${Math.round(carga.horas7d)} h nos últimos 7 dias, ${Math.round(carga.horasSeguidas)} h seguidas sem folga`,
        40, [...new Set([m.pessoaId, ...coords])]);
    }
  }

  for (const g of db.alertasGravados.filter((x) => x.pacienteId === pacienteId)) {
    add(g.tipo, g.referencia, g.mensagem, g.prioridade, g.destinatarios);
  }
  return lista.sort((a, b) => b.prioridade - a.prioridade);
}

// ---------------------------------------------------------------- rotas
const rotas = [];
function rota(metodo, padrao, publica, funcao) {
  const regex = new RegExp('^' + padrao.replace(/\{[a-zA-Z]+\}/g, '([^/]+)') + '$');
  rotas.push({ metodo, regex, publica, funcao });
}

rota('GET', '/saude', true, () => ({ ok: true }));

rota('POST', '/auth/login', true, ({ corpo }) => {
  sql('SELECT id, nome, email, senha_hash, senha_salt FROM pessoa WHERE email = ? AND ativo = TRUE');
  const p = db.pessoas.find((x) => x.email === String(corpo.email || '').toLowerCase() && x.ativo);
  if (!p || p.senha !== corpo.senha) throw falha(401, 'E-mail ou senha incorretos');
  sql('INSERT INTO sessao (token, pessoa_id, expira_em) VALUES (?, ?, ?)');
  return { token: 'demo-' + p.id, pessoa: { id: p.id, nome: p.nome, email: p.email } };
});

rota('POST', '/auth/logout', false, () => { sql('DELETE FROM sessao WHERE token = ?'); return null; });

rota('POST', '/pessoas', true, ({ corpo }) => {
  if (!corpo.aceiteTermo) throw falha(400, 'É preciso aceitar o termo de uso');
  if (!corpo.nome || !corpo.email) throw falha(400, 'Preencha nome e e-mail');
  if (!corpo.senha || corpo.senha.length < 8) throw falha(400, 'A senha precisa ter pelo menos 8 caracteres');
  const email = corpo.email.toLowerCase();
  if (db.pessoas.some((p) => p.email === email)) throw falha(409, 'Este e-mail já tem cadastro');
  const nova = { id: novoId(), nome: corpo.nome, email, senha: corpo.senha, telefone: corpo.telefone || null,
    dataNascimento: corpo.dataNascimento || null, genero: corpo.genero || null, ativo: true };
  db.pessoas.push(nova);
  sql('INSERT INTO pessoa (nome, email, senha_hash, senha_salt, telefone, data_nascimento, genero) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id');
  sql('INSERT INTO consentimento (pessoa_id, tipo, versao_termo) VALUES (?, ?, ?)');
  return { id: nova.id, nome: nova.nome, email: nova.email };
});

rota('GET', '/pessoas/eu', false, ({ eu }) => {
  const p = pessoa(eu);
  return { id: p.id, nome: p.nome, email: p.email, telefone: p.telefone, dataNascimento: p.dataNascimento, genero: p.genero,
    redes: db.membros.filter((m) => m.pessoaId === eu && m.ativo).map((m) => ({
      pacienteId: m.pacienteId, pacienteNome: paciente(m.pacienteId)?.nome, papel: m.papel, vinculo: m.vinculo, compartilhaZarit: m.compartilhaZarit })) };
});

rota('DELETE', '/pessoas/eu', false, ({ eu }) => {
  for (const m of db.membros.filter((x) => x.pessoaId === eu && x.ativo)) {
    const outros = membrosAtivos(m.pacienteId).filter((x) => x.pessoaId !== eu);
    if (m.papel === 'COORDENADOR' && outros.length && !outros.some((x) => x.papel === 'COORDENADOR')) {
      throw falha(409, 'Passe a coordenação a outro membro antes de excluir sua conta');
    }
  }
  const p = pessoa(eu);
  Object.assign(p, { nome: 'Pessoa removida', email: `removido-${eu}@anonimo`, senha: null, telefone: null, dataNascimento: null, genero: null, ativo: false });
  db.zarit = db.zarit.filter((z) => z.pessoaId !== eu);
  db.membros.filter((m) => m.pessoaId === eu).forEach((m) => { m.ativo = false; });
  sql("UPDATE pessoa SET nome = 'Pessoa removida', email = ?, senha_hash = '', senha_salt = '', telefone = NULL, data_nascimento = NULL, genero = NULL, ativo = FALSE WHERE id = ?");
  sql('DELETE FROM avaliacao_zarit WHERE pessoa_id = ?');
  return null;
});

rota('GET', '/pacientes', false, ({ eu }) => {
  sql('SELECT p.id, p.nome, p.condicao, m.papel FROM paciente p JOIN membro_rede m ON m.paciente_id = p.id WHERE m.pessoa_id = ? AND m.ativo');
  return db.membros.filter((m) => m.pessoaId === eu && m.ativo && paciente(m.pacienteId))
    .map((m) => ({ id: m.pacienteId, nome: paciente(m.pacienteId).nome, condicao: paciente(m.pacienteId).condicao, papel: m.papel }));
});

rota('POST', '/pacientes', false, ({ eu, corpo }) => {
  if (!corpo.nome) throw falha(400, 'Informe o nome da pessoa cuidada');
  if (!corpo.responsavelNome || !corpo.responsavelParentesco) throw falha(400, 'Informe o nome e o parentesco do responsável legal');
  if (!corpo.declaracaoAutorizacao) throw falha(400, 'É preciso declarar a autorização do responsável legal');
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo;
  do { codigo = Array.from({ length: 6 }, () => letras[Math.floor(Math.random() * letras.length)]).join(''); }
  while (db.pacientes.some((p) => p.codigoConvite === codigo));
  const novo = { id: novoId(), nome: corpo.nome, dataNascimento: corpo.dataNascimento || null, condicao: corpo.condicao || null,
    precisa24h: !!corpo.precisa24h, observacoes: corpo.observacoes || null, responsavelNome: corpo.responsavelNome,
    responsavelParentesco: corpo.responsavelParentesco, codigoConvite: codigo };
  db.pacientes.push(novo);
  db.membros.push({ pessoaId: eu, pacienteId: novo.id, papel: 'COORDENADOR', vinculo: 'FAMILIAR', ativo: true, compartilhaZarit: false });
  sql('INSERT INTO paciente (nome, data_nascimento, condicao, precisa_24h, observacoes, responsavel_nome, responsavel_parentesco, codigo_convite) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id');
  sql("INSERT INTO membro_rede (pessoa_id, paciente_id, papel, vinculo) VALUES (?, ?, 'COORDENADOR', ?)");
  sql("INSERT INTO consentimento (pessoa_id, paciente_id, tipo, versao_termo, responsavel_nome) VALUES (?, ?, 'DADOS_PACIENTE', ?, ?)");
  return { id: novo.id, nome: novo.nome, codigoConvite: codigo };
});

rota('POST', '/pacientes/entrar', false, ({ eu, corpo }) => {
  const p = db.pacientes.find((x) => x.codigoConvite === String(corpo.codigo || '').toUpperCase());
  if (!p) throw falha(404, 'Código de convite não encontrado');
  const existente = db.membros.find((m) => m.pessoaId === eu && m.pacienteId === p.id);
  if (existente?.ativo) throw falha(409, 'Você já faz parte desta rede');
  if (existente) Object.assign(existente, { ativo: true, papel: 'MEMBRO', vinculo: corpo.vinculo || 'OUTRO' });
  else db.membros.push({ pessoaId: eu, pacienteId: p.id, papel: 'MEMBRO', vinculo: corpo.vinculo || 'OUTRO', ativo: true, compartilhaZarit: false });
  sql('SELECT id, nome FROM paciente WHERE codigo_convite = ?');
  sql("INSERT INTO membro_rede (pessoa_id, paciente_id, papel, vinculo) VALUES (?, ?, 'MEMBRO', ?)");
  return { pacienteId: p.id, pacienteNome: p.nome };
});

rota('GET', '/pacientes/{id}', false, ({ eu, params: [id] }) => {
  const m = exigirMembro(eu, id);
  sql('SELECT * FROM paciente WHERE id = ?');
  return { ...paciente(id), codigoConvite: m.papel === 'COORDENADOR' ? paciente(id).codigoConvite : null };
});

rota('PUT', '/pacientes/{id}', false, ({ eu, params: [id], corpo }) => {
  exigirCoordenador(eu, id);
  const p = paciente(id);
  for (const campo of ['nome', 'dataNascimento', 'condicao', 'precisa24h', 'observacoes', 'responsavelNome', 'responsavelParentesco']) {
    if (campo in corpo) p[campo] = corpo[campo];
  }
  sql('UPDATE paciente SET nome = ?, data_nascimento = ?, condicao = ?, precisa_24h = ?, observacoes = ?, responsavel_nome = ?, responsavel_parentesco = ? WHERE id = ?');
  return p;
});

rota('DELETE', '/pacientes/{id}', false, ({ eu, params: [id] }) => {
  exigirCoordenador(eu, id);
  db.pacientes = db.pacientes.filter((p) => p.id !== id);
  db.membros = db.membros.filter((m) => m.pacienteId !== id);
  sql('DELETE FROM paciente WHERE id = ?');
  return null;
});

rota('POST', '/pacientes/{id}/convite', false, ({ eu, params: [id] }) => {
  exigirCoordenador(eu, id);
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  paciente(id).codigoConvite = Array.from({ length: 6 }, () => letras[Math.floor(Math.random() * letras.length)]).join('');
  sql('UPDATE paciente SET codigo_convite = ? WHERE id = ?');
  return { codigoConvite: paciente(id).codigoConvite };
});

rota('GET', '/pacientes/{id}/membros', false, ({ eu, params: [id] }) => {
  exigirMembro(eu, id);
  sql('SELECT m.pessoa_id, p.nome, m.papel, m.vinculo FROM membro_rede m JOIN pessoa p ON p.id = m.pessoa_id WHERE m.paciente_id = ? AND m.ativo');
  return membrosAtivos(id).map((m) => ({ pessoaId: m.pessoaId, nome: nomeDe(m.pessoaId), papel: m.papel, vinculo: m.vinculo, horas7d: cargaDe(m.pessoaId).horas7d }));
});

rota('PUT', '/pacientes/{id}/membros/{pessoaId}', false, ({ eu, params: [id, pessoaId], corpo }) => {
  exigirCoordenador(eu, id);
  const m = membrosAtivos(id).find((x) => x.pessoaId === pessoaId);
  if (!m) throw falha(404, 'Pessoa não encontrada nesta rede');
  m.papel = corpo.papel === 'COORDENADOR' ? 'COORDENADOR' : 'MEMBRO';
  sql('UPDATE membro_rede SET papel = ? WHERE paciente_id = ? AND pessoa_id = ?');
  return { pessoaId, papel: m.papel };
});

rota('DELETE', '/pacientes/{id}/membros/{pessoaId}', false, ({ eu, params: [id, pessoaId] }) => {
  exigirCoordenador(eu, id);
  const m = membrosAtivos(id).find((x) => x.pessoaId === pessoaId);
  if (m) m.ativo = false;
  sql('UPDATE membro_rede SET ativo = FALSE WHERE paciente_id = ? AND pessoa_id = ?');
  return null;
});

rota('PUT', '/pacientes/{id}/compartilhar-zarit', false, ({ eu, params: [id], corpo }) => {
  const m = exigirMembro(eu, id);
  m.compartilhaZarit = !!corpo.compartilha;
  sql('UPDATE membro_rede SET compartilha_zarit = ? WHERE paciente_id = ? AND pessoa_id = ?');
  return { compartilha: m.compartilhaZarit };
});

// ---- escala
rota('GET', '/pacientes/{id}/turnos', false, ({ eu, params: [id], q }) => {
  exigirMembro(eu, id);
  const de = data((q.de || isoDia(new Date())) + 'T00:00:00').getTime();
  const ate = data((q.ate || isoDia(new Date())) + 'T00:00:00').getTime() + DIA;
  sql('SELECT t.*, p.nome FROM turno t LEFT JOIN pessoa p ON p.id = t.pessoa_id WHERE t.paciente_id = ? AND t.inicio >= ? AND t.inicio < ? ORDER BY t.inicio');
  return db.turnos.filter((t) => t.pacienteId === id && ms(t.inicio) >= de && ms(t.inicio) < ate && t.status !== 'CANCELADO')
    .sort((a, b) => ms(a.inicio) - ms(b.inicio)).map(turnoJson);
});

rota('POST', '/pacientes/{id}/turnos', false, ({ eu, params: [id], corpo }) => {
  const membro = exigirMembro(eu, id);
  if (membro.papel !== 'COORDENADOR' && corpo.pessoaId !== eu) throw falha(403, 'Você só pode marcar turnos para você mesmo(a)');
  validarTurno(corpo);
  const novo = { id: novoId(), pacienteId: id, pessoaId: corpo.pessoaId || null, inicio: corpo.inicio, fim: corpo.fim, status: 'PLANEJADO' };
  exigirSemConflito(novo);
  db.turnos.push(novo);
  sql('SELECT id, inicio, fim FROM turno WHERE pessoa_id = ? AND status <> ? ORDER BY inicio');
  sql('INSERT INTO turno (paciente_id, pessoa_id, inicio, fim) VALUES (?, ?, ?, ?) RETURNING id');
  return turnoJson(novo);
});

function turnoPorId(eu, id, exigirCoord) {
  const t = db.turnos.find((x) => x.id === id);
  if (!t) throw falha(404, 'Turno não encontrado');
  if (exigirCoord) exigirCoordenador(eu, t.pacienteId); else exigirMembro(eu, t.pacienteId);
  return t;
}

rota('PUT', '/turnos/{id}', false, ({ eu, params: [id], corpo }) => {
  const t = turnoPorId(eu, id, true);
  validarTurno(corpo);
  const alterado = { ...t, pessoaId: corpo.pessoaId || null, inicio: corpo.inicio, fim: corpo.fim, status: corpo.status || t.status };
  exigirSemConflito(alterado, id);
  Object.assign(t, alterado);
  sql('UPDATE turno SET pessoa_id = ?, inicio = ?, fim = ?, status = ? WHERE id = ?');
  return turnoJson(t);
});

rota('DELETE', '/turnos/{id}', false, ({ eu, params: [id] }) => {
  turnoPorId(eu, id, true);
  db.turnos = db.turnos.filter((t) => t.id !== id);
  sql('DELETE FROM turno WHERE id = ?');
  return null;
});

rota('POST', '/turnos/{id}/assumir', false, ({ eu, params: [id] }) => {
  const t = turnoPorId(eu, id, false);
  if (t.pessoaId) throw falha(409, 'Este turno já tem responsável');
  exigirSemConflito({ ...t, pessoaId: eu }, id);
  t.pessoaId = eu;
  sql('UPDATE turno SET pessoa_id = ? WHERE id = ? AND pessoa_id IS NULL');
  return turnoJson(t);
});

rota('GET', '/turnos/{id}/sugestoes', false, ({ eu, params: [id] }) => {
  const t = turnoPorId(eu, id, false);
  return membrosAtivos(t.pacienteId)
    .filter((m) => conflitosCom({ ...t, pessoaId: m.pessoaId }, id).length === 0)
    .map((m) => ({ pessoaId: m.pessoaId, nome: nomeDe(m.pessoaId), horas7d: cargaDe(m.pessoaId).horas7d }))
    .sort((a, b) => a.horas7d - b.horas7d);
});

rota('GET', '/pacientes/{id}/escala/analise', false, ({ eu, params: [id], q }) => {
  exigirMembro(eu, id);
  const de = data((q.de || isoDia(new Date())) + 'T00:00:00').getTime();
  const ate = data((q.ate || isoDia(new Date())) + 'T00:00:00').getTime() + DIA;
  const conflitos = [];
  for (const m of membrosAtivos(id)) {
    const lista = turnosDaPessoa(m.pessoaId).filter((t) => ms(t.inicio) < ate && ms(t.fim) > de);
    for (let i = 0; i < lista.length; i++) {
      for (let j = i + 1; j < lista.length; j++) {
        if (sobrepoe(lista[i], lista[j])) conflitos.push({ turnoA: turnoJson(lista[i]), turnoB: turnoJson(lista[j]) });
      }
    }
  }
  return {
    conflitos,
    vagos: paciente(id).precisa24h ? periodosDescobertos(id, de, ate) : [],
    sobrecarga: membrosAtivos(id).map((m) => {
      const carga = cargaDe(m.pessoaId);
      return { pessoaId: m.pessoaId, nome: nomeDe(m.pessoaId), ...carga, nivel: nivel(carga.horas7d, carga.horasSeguidas) };
    }),
  };
});

// ---- medicação
rota('GET', '/pacientes/{id}/medicamentos', false, ({ eu, params: [id] }) => {
  exigirMembro(eu, id);
  sql('SELECT m.*, r.* FROM medicamento m JOIN regra_horario r ON r.medicamento_id = m.id WHERE m.paciente_id = ?');
  return db.medicamentos.filter((m) => m.pacienteId === id).map(({ pacienteId, ...m }) => m);
});

function validarMedicamento(corpo) {
  if (!corpo.nome) throw falha(400, 'Informe o nome do remédio');
  const r = corpo.regra || {};
  if (!['INTERVALO', 'HORARIOS_FIXOS', 'DIAS_ALTERNADOS'].includes(r.tipo)) throw falha(400, 'Escolha o tipo de horário');
  if (r.tipo === 'INTERVALO' && (!(r.intervaloHoras >= 1 && r.intervaloHoras <= 24) || !r.primeiraDose)) {
    throw falha(400, 'Informe o intervalo (1 a 24 horas) e o horário da primeira dose');
  }
  if (r.tipo !== 'INTERVALO' && !(r.horarios || []).length) throw falha(400, 'Informe pelo menos um horário');
  if (!r.inicio) throw falha(400, 'Informe a data de início');
}

rota('POST', '/pacientes/{id}/medicamentos', false, ({ eu, params: [id], corpo }) => {
  exigirCoordenador(eu, id);
  validarMedicamento(corpo);
  const novo = { id: novoId(), pacienteId: id, nome: corpo.nome, dosagem: corpo.dosagem || null, via: corpo.via || null,
    instrucoes: corpo.instrucoes || null, ativo: corpo.ativo !== false, regra: corpo.regra };
  db.medicamentos.push(novo);
  sql('INSERT INTO medicamento (paciente_id, nome, dosagem, via, instrucoes) VALUES (?, ?, ?, ?, ?) RETURNING id');
  sql('INSERT INTO regra_horario (medicamento_id, tipo, intervalo_horas, primeira_dose, horarios, inicio, fim) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const { pacienteId, ...saida } = novo;
  return saida;
});

function medicamentoPorId(eu, id) {
  const m = db.medicamentos.find((x) => x.id === id);
  if (!m) throw falha(404, 'Remédio não encontrado');
  exigirCoordenador(eu, m.pacienteId);
  return m;
}

rota('PUT', '/medicamentos/{id}', false, ({ eu, params: [id], corpo }) => {
  const m = medicamentoPorId(eu, id);
  validarMedicamento(corpo);
  Object.assign(m, { nome: corpo.nome, dosagem: corpo.dosagem || null, via: corpo.via || null, instrucoes: corpo.instrucoes || null,
    ativo: corpo.ativo !== false, regra: corpo.regra });
  sql('UPDATE medicamento SET nome = ?, dosagem = ?, via = ?, instrucoes = ?, ativo = ? WHERE id = ?');
  sql('UPDATE regra_horario SET tipo = ?, intervalo_horas = ?, primeira_dose = ?, horarios = ?, inicio = ?, fim = ? WHERE medicamento_id = ?');
  const { pacienteId, ...saida } = m;
  return saida;
});

rota('DELETE', '/medicamentos/{id}', false, ({ eu, params: [id] }) => {
  medicamentoPorId(eu, id);
  db.medicamentos = db.medicamentos.filter((m) => m.id !== id);
  db.doses = db.doses.filter((d) => d.medicamentoId !== id);
  sql('DELETE FROM medicamento WHERE id = ?');
  return null;
});

rota('GET', '/pacientes/{id}/doses', false, ({ eu, params: [id], q }) => {
  exigirMembro(eu, id);
  const dia = data((q.data || isoDia(new Date())) + 'T00:00:00');
  garantirDoses(id, dia);
  sql('INSERT INTO dose (medicamento_id, previsto_para) VALUES (?, ?) ON CONFLICT (medicamento_id, previsto_para) DO NOTHING');
  sql('SELECT d.*, m.nome, m.dosagem, p.nome FROM dose d JOIN medicamento m ON m.id = d.medicamento_id LEFT JOIN pessoa p ON p.id = d.dada_por WHERE m.paciente_id = ? AND d.previsto_para >= ? AND d.previsto_para < ? ORDER BY d.previsto_para');
  return db.doses.filter((d) => pacienteDaDose(d) === id && d.previstoPara.startsWith(isoDia(dia)))
    .sort((a, b) => ms(a.previstoPara) - ms(b.previstoPara)).map(doseJson);
});

function registrarDose(eu, id, dada, texto) {
  const d = db.doses.find((x) => x.id === id);
  if (!d) throw falha(404, 'Dose não encontrada');
  exigirMembro(eu, pacienteDaDose(d));
  if (statusDose(d) !== 'PENDENTE') {
    sql('SELECT p.nome FROM dose d JOIN pessoa p ON p.id = d.dada_por WHERE d.id = ?');
    throw falha(409, `Essa dose já foi registrada${d.dadaPor ? ' por ' + nomeDe(d.dadaPor) : ''}`);
  }
  const instante = agora();
  if (dada) Object.assign(d, { status: instante > ms(d.previstoPara) + 30 * MINUTO ? 'ATRASADA' : 'DADA', dadaEm: iso(new Date(instante)), dadaPor: eu, observacao: texto || null });
  else Object.assign(d, { status: 'NAO_DADA', dadaPor: eu, observacao: texto });
  sql("UPDATE dose SET status = ?, dada_em = ?, dada_por = ?, observacao = ? WHERE id = ? AND status = 'PENDENTE'");
  sql("INSERT INTO auditoria (pessoa_id, acao, tabela, registro_id, detalhe) VALUES (?, 'ALTERAR', 'dose', ?, ?)");
  return doseJson(d);
}

rota('PUT', '/doses/{id}/dar', false, ({ eu, params: [id], corpo }) => registrarDose(eu, id, true, corpo.observacao));
rota('PUT', '/doses/{id}/nao-dar', false, ({ eu, params: [id], corpo }) => {
  if (!corpo.motivo) throw falha(400, 'Informe o motivo');
  return registrarDose(eu, id, false, corpo.motivo);
});

// ---- sinais vitais
rota('GET', '/pacientes/{id}/sinais', false, ({ eu, params: [id], q }) => {
  exigirMembro(eu, id);
  const de = q.de ? ms(q.de + 'T00:00:00') : 0;
  const ate = q.ate ? ms(q.ate + 'T00:00:00') + DIA : Infinity;
  sql('SELECT s.*, p.nome FROM sinal_vital s LEFT JOIN pessoa p ON p.id = s.medido_por WHERE s.paciente_id = ? AND s.tipo = ? AND s.medido_em BETWEEN ? AND ? ORDER BY s.medido_em');
  return db.sinais.filter((s) => s.pacienteId === id && (!q.tipo || s.tipo === q.tipo) && ms(s.medidoEm) >= de && ms(s.medidoEm) < ate)
    .sort((a, b) => ms(a.medidoEm) - ms(b.medidoEm)).map(sinalJson);
});

rota('POST', '/pacientes/{id}/sinais', false, ({ eu, params: [id], corpo }) => {
  exigirMembro(eu, id);
  const valor = Number(corpo.valor);
  if (!corpo.tipo) throw falha(400, 'Escolha o tipo de medição');
  if (!(valor > 0)) throw falha(400, 'O valor precisa ser maior que zero');
  const historico = db.sinais.filter((s) => s.pacienteId === id && s.tipo === corpo.tipo).map((s) => s.valor);
  const faixa = db.faixas.find((f) => f.pacienteId === id && f.tipo === corpo.tipo);
  let alerta = null;
  if (faixa && ((faixa.minimo != null && valor < faixa.minimo) || (faixa.maximo != null && valor > faixa.maximo))) alerta = 'FORA_DA_FAIXA';
  else if (historico.length >= 7) {
    const media = historico.reduce((a, b) => a + b, 0) / historico.length;
    const desvio = Math.sqrt(historico.reduce((a, b) => a + (b - media) ** 2, 0) / historico.length);
    if (desvio > 0 && Math.abs((valor - media) / desvio) > 2) alerta = 'FORA_DA_CURVA';
  }
  const novo = { id: novoId(), pacienteId: id, tipo: corpo.tipo, valor, valor2: corpo.valor2 == null || corpo.valor2 === '' ? null : Number(corpo.valor2),
    medidoEm: corpo.medidoEm || iso(new Date()), medidoPor: eu };
  db.sinais.push(novo);
  sql('SELECT valor FROM sinal_vital WHERE paciente_id = ? AND tipo = ?');
  sql('INSERT INTO sinal_vital (paciente_id, tipo, valor, valor2, medido_em, medido_por) VALUES (?, ?, ?, ?, ?, ?) RETURNING id');
  if (alerta) {
    const quem = pessoaNoTurno(id, agora());
    db.alertasGravados.push({ pacienteId: id, tipo: alerta === 'FORA_DA_FAIXA' ? 'SINAL_FORA_FAIXA' : 'SINAL_FORA_CURVA', referencia: `sinal:${novo.id}`,
      mensagem: `${corpo.tipo === 'PRESSAO' ? 'Pressão' : 'Medição'} ${valor}${novo.valor2 ? '/' + novo.valor2 : ''} ${alerta === 'FORA_DA_FAIXA' ? 'fora da faixa' : 'fora do padrão'} de ${paciente(id).nome}`,
      prioridade: 90, destinatarios: [...new Set([...(quem ? [quem] : []), eu, ...coordenadores(id)])] });
    sql('INSERT INTO alerta (paciente_id, destinatario_id, tipo, referencia, mensagem, prioridade) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING');
  }
  return { ...sinalJson(novo), alerta };
});

rota('GET', '/pacientes/{id}/faixas', false, ({ eu, params: [id] }) => {
  exigirMembro(eu, id);
  return db.faixas.filter((f) => f.pacienteId === id).map(({ pacienteId, ...f }) => f);
});

rota('PUT', '/pacientes/{id}/faixas', false, ({ eu, params: [id], corpo }) => {
  exigirCoordenador(eu, id);
  db.faixas = db.faixas.filter((f) => f.pacienteId !== id).concat((corpo || []).map((f) => ({ ...f, pacienteId: id })));
  sql('DELETE FROM faixa_sinal WHERE paciente_id = ?');
  sql('INSERT INTO faixa_sinal (paciente_id, tipo, minimo, maximo) VALUES (?, ?, ?, ?)');
  return db.faixas.filter((f) => f.pacienteId === id).map(({ pacienteId, ...f }) => f);
});

// ---- tarefas
rota('GET', '/pacientes/{id}/tarefas', false, ({ eu, params: [id] }) => {
  exigirMembro(eu, id);
  return db.tarefas.filter((t) => t.pacienteId === id).map(({ pacienteId, ...t }) => t);
});

function validarTarefa(corpo) {
  if (!corpo.titulo) throw falha(400, 'Informe o nome da tarefa');
  if (!(corpo.recorrenciaHoras >= 1 && corpo.recorrenciaHoras <= 24)) throw falha(400, 'A repetição precisa ser de 1 a 24 horas');
  if (!corpo.primeiraVez) throw falha(400, 'Informe o horário da primeira vez');
}

rota('POST', '/pacientes/{id}/tarefas', false, ({ eu, params: [id], corpo }) => {
  exigirCoordenador(eu, id);
  validarTarefa(corpo);
  const nova = { id: novoId(), pacienteId: id, titulo: corpo.titulo, orientacao: corpo.orientacao || null,
    recorrenciaHoras: corpo.recorrenciaHoras, primeiraVez: corpo.primeiraVez, tipoSinal: corpo.tipoSinal || null, ativa: corpo.ativa !== false };
  db.tarefas.push(nova);
  sql('INSERT INTO tarefa_cuidado (paciente_id, titulo, orientacao, recorrencia_horas, primeira_vez, tipo_sinal) VALUES (?, ?, ?, ?, ?, ?) RETURNING id');
  const { pacienteId, ...saida } = nova;
  return saida;
});

function tarefaPorId(eu, id) {
  const t = db.tarefas.find((x) => x.id === id);
  if (!t) throw falha(404, 'Tarefa não encontrada');
  exigirCoordenador(eu, t.pacienteId);
  return t;
}

rota('PUT', '/tarefas/{id}', false, ({ eu, params: [id], corpo }) => {
  const t = tarefaPorId(eu, id);
  validarTarefa(corpo);
  Object.assign(t, { titulo: corpo.titulo, orientacao: corpo.orientacao || null, recorrenciaHoras: corpo.recorrenciaHoras,
    primeiraVez: corpo.primeiraVez, tipoSinal: corpo.tipoSinal || null, ativa: corpo.ativa !== false });
  sql('UPDATE tarefa_cuidado SET titulo = ?, orientacao = ?, recorrencia_horas = ?, primeira_vez = ?, tipo_sinal = ?, ativa = ? WHERE id = ?');
  const { pacienteId, ...saida } = t;
  return saida;
});

rota('DELETE', '/tarefas/{id}', false, ({ eu, params: [id] }) => {
  tarefaPorId(eu, id);
  db.tarefas = db.tarefas.filter((t) => t.id !== id);
  db.execucoes = db.execucoes.filter((e) => e.tarefaId !== id);
  sql('DELETE FROM tarefa_cuidado WHERE id = ?');
  return null;
});

rota('GET', '/pacientes/{id}/execucoes', false, ({ eu, params: [id], q }) => {
  exigirMembro(eu, id);
  const dia = data((q.data || isoDia(new Date())) + 'T00:00:00');
  garantirExecucoes(id, dia);
  sql('INSERT INTO execucao_tarefa (tarefa_id, prevista_para) VALUES (?, ?) ON CONFLICT (tarefa_id, prevista_para) DO NOTHING');
  return db.execucoes.filter((e) => pacienteDaExecucao(e) === id && e.previstaPara.startsWith(isoDia(dia)))
    .sort((a, b) => ms(a.previstaPara) - ms(b.previstaPara)).map(execucaoJson);
});

rota('PUT', '/execucoes/{id}/feita', false, ({ eu, params: [id] }) => {
  const e = db.execucoes.find((x) => x.id === id);
  if (!e) throw falha(404, 'Tarefa não encontrada');
  exigirMembro(eu, pacienteDaExecucao(e));
  if (e.feitaEm) throw falha(409, `Essa tarefa já foi feita por ${nomeDe(e.feitaPor)}`);
  Object.assign(e, { feitaEm: iso(new Date()), feitaPor: eu });
  sql('UPDATE execucao_tarefa SET feita_em = ?, feita_por = ? WHERE id = ? AND feita_em IS NULL');
  return execucaoJson(e);
});

// ---- Zarit
function faixaZarit(pontos) {
  return pontos > 20 ? 'ALTA' : pontos > 10 ? 'MODERADA' : 'BAIXA';
}

rota('POST', '/zarit', false, ({ eu, corpo }) => {
  const r = corpo.respostas;
  if (!Array.isArray(r) || r.length !== 12 || r.some((v) => !Number.isInteger(v) || v < 0 || v > 4)) {
    throw falha(400, 'São 12 respostas, cada uma de 0 a 4');
  }
  if (corpo.qualidadeSono != null && !(corpo.qualidadeSono >= 1 && corpo.qualidadeSono <= 5)) throw falha(400, 'A qualidade do sono vai de 1 a 5');
  const pontuacao = r.reduce((a, b) => a + b, 0);
  const nova = { id: novoId(), pessoaId: eu, pontuacao, faixa: faixaZarit(pontuacao), horasSono: corpo.horasSono ?? null,
    qualidadeSono: corpo.qualidadeSono ?? null, respondidaEm: iso(new Date()) };
  db.zarit.push(nova);
  sql('INSERT INTO avaliacao_zarit (pessoa_id, pontuacao, faixa, horas_sono, qualidade_sono) VALUES (?, ?, ?, ?, ?) RETURNING id');
  sql('INSERT INTO resposta_zarit (avaliacao_id, item, valor) VALUES (?, ?, ?)');
  return { id: nova.id, pontuacao, faixa: nova.faixa, respondidaEm: nova.respondidaEm };
});

rota('GET', '/zarit/minhas', false, ({ eu }) => {
  sql('SELECT * FROM avaliacao_zarit WHERE pessoa_id = ? ORDER BY respondida_em DESC');
  const minhas = db.zarit.filter((z) => z.pessoaId === eu).sort((a, b) => ms(b.respondidaEm) - ms(a.respondidaEm));
  const proxima = minhas.length ? isoDia(new Date(ms(minhas[0].respondidaEm) + 14 * DIA)) : isoDia(new Date());
  return { avaliacoes: minhas.map(({ pessoaId, ...z }) => z), proximaSugerida: proxima };
});

rota('DELETE', '/zarit/{id}', false, ({ eu, params: [id] }) => {
  const z = db.zarit.find((x) => x.id === id);
  if (!z || z.pessoaId !== eu) throw falha(404, 'Avaliação não encontrada');
  db.zarit = db.zarit.filter((x) => x.id !== id);
  sql('DELETE FROM avaliacao_zarit WHERE id = ? AND pessoa_id = ?');
  return null;
});

rota('POST', '/zarit/{id}/pedir-ajuda', false, ({ eu, params: [id], corpo }) => {
  const z = db.zarit.find((x) => x.id === id && x.pessoaId === eu);
  if (!z) throw falha(404, 'Avaliação não encontrada');
  let criados = 0;
  for (const pacienteId of corpo.pacienteIds || []) {
    exigirMembro(eu, pacienteId);
    const destinatarios = membrosAtivos(pacienteId).map((m) => m.pessoaId).filter((p) => p !== eu);
    db.alertasGravados.push({ pacienteId, tipo: 'PEDIDO_AJUDA', referencia: `zarit:${id}`,
      mensagem: `${nomeDe(eu)} pediu ajuda à rede: está muito sobrecarregada(o). Que tal oferecer um turno?`, prioridade: 100, destinatarios });
    criados += destinatarios.length;
    sql('INSERT INTO alerta (paciente_id, destinatario_id, tipo, referencia, mensagem, prioridade) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING');
  }
  return { alertasCriados: criados };
});

// ---- Hoje e alertas
rota('GET', '/hoje', false, ({ eu, q }) => {
  const minhasRedes = db.membros.filter((m) => m.pessoaId === eu && m.ativo);
  const pacienteId = q.pacienteId ? Number(q.pacienteId) : minhasRedes[0]?.pacienteId;
  exigirMembro(eu, pacienteId);
  const hoje = meiaNoite(0);
  garantirDoses(pacienteId, hoje);
  garantirExecucoes(pacienteId, hoje);
  const meus = db.turnos.filter((t) => t.pacienteId === pacienteId && t.pessoaId === eu && t.status !== 'CANCELADO');
  const atual = meus.find((t) => ms(t.inicio) <= agora() && ms(t.fim) > agora());
  const proximo = atual ? null : meus.filter((t) => ms(t.inicio) > agora()).sort((a, b) => ms(a.inicio) - ms(b.inicio))[0];
  const dentro = (instante) => (atual ? instante >= ms(atual.inicio) && instante < ms(atual.fim) : true);

  const itens = [];
  for (const d of db.doses.filter((x) => pacienteDaDose(x) === pacienteId && x.previstoPara.startsWith(isoDia(hoje)))) {
    const status = statusDose(d);
    if (!dentro(ms(d.previstoPara)) || (!atual && status !== 'PENDENTE')) continue;
    const med = db.medicamentos.find((m) => m.id === d.medicamentoId);
    itens.push({ tipo: 'DOSE', id: d.id, horario: d.previstoPara, titulo: `${med.nome} ${med.dosagem || ''}`.trim(),
      detalhe: med.instrucoes || med.via, status, tipoSinal: null });
  }
  for (const e of db.execucoes.filter((x) => pacienteDaExecucao(x) === pacienteId && x.previstaPara.startsWith(isoDia(hoje)))) {
    if (!dentro(ms(e.previstaPara)) || (!atual && e.feitaEm)) continue;
    const t = db.tarefas.find((x) => x.id === e.tarefaId);
    itens.push({ tipo: 'TAREFA', id: e.id, horario: e.previstaPara, titulo: t.titulo, detalhe: t.orientacao,
      status: e.feitaEm ? 'FEITA' : 'PENDENTE', tipoSinal: t.tipoSinal });
  }
  itens.sort((a, b) => ms(a.horario) - ms(b.horario));
  sql('SELECT * FROM turno WHERE paciente_id = ? AND pessoa_id = ? AND fim > ? ORDER BY inicio LIMIT 2');
  return {
    paciente: { id: pacienteId, nome: paciente(pacienteId).nome },
    turnoAtual: atual ? { id: atual.id, inicio: atual.inicio, fim: atual.fim } : null,
    proximoTurno: proximo ? { id: proximo.id, inicio: proximo.inicio, fim: proximo.fim } : null,
    itens,
    alertas: alertasPara(eu, pacienteId),
  };
});

rota('GET', '/alertas', false, ({ eu, q }) => {
  const pacienteId = Number(q.pacienteId);
  exigirMembro(eu, pacienteId);
  sql('SELECT * FROM alerta WHERE destinatario_id = ? AND paciente_id = ? AND lido_em IS NULL ORDER BY prioridade DESC');
  return alertasPara(eu, pacienteId);
});

rota('PUT', '/alertas/{id}/lido', false, ({ eu, params: [id] }) => {
  db.lidos.add(`${id}:${eu}`);
  sql('UPDATE alerta SET lido_em = ? WHERE id = ? AND destinatario_id = ?');
  return null;
});

// ---- estatísticas (fixas na demonstração, coerentes com os dados simulados)
rota('GET', '/pacientes/{id}/estatisticas', false, ({ eu, params: [id], q }) => {
  exigirCoordenador(eu, id);
  sql('SELECT m.nome, AVG(CASE WHEN d.status = \'DADA\' THEN 1.0 ELSE 0 END) AS taxa FROM dose d JOIN medicamento m ON m.id = d.medicamento_id WHERE m.paciente_id = ? AND d.previsto_para < ? GROUP BY m.nome');
  sql('SELECT p.nome, SUM(EXTRACT(EPOCH FROM (t.fim - t.inicio)) / 3600) AS horas FROM turno t JOIN pessoa p ON p.id = t.pessoa_id WHERE t.paciente_id = ? GROUP BY p.nome HAVING SUM(EXTRACT(EPOCH FROM (t.fim - t.inicio)) / 3600) > (SELECT AVG(h) FROM (...) sub)');
  const serie = (base, variacao) => Array.from({ length: 14 }, (_, i) => ({
    data: isoDia(meiaNoite(i - 13)), valor: Math.round((base + ((i * variacao) % 5) - 2) * 10) / 10 }));
  return {
    periodoDias: Number(q.dias) || 30,
    adesao: {
      geral: 0.89,
      porMedicamento: [{ nome: 'Amoxicilina', taxa: 0.83 }, { nome: 'Donepezila', taxa: 0.82 }, { nome: 'Losartana', taxa: 0.9 },
        { nome: 'Omeprazol', taxa: 0.94 }, { nome: 'Vitamina D', taxa: 0.93 }],
      porPeriodo: [{ periodo: 'MADRUGADA', taxa: 0.86 }, { periodo: 'MANHA', taxa: 0.95 }, { periodo: 'TARDE', taxa: 0.9 }, { periodo: 'NOITE', taxa: 0.79 }],
    },
    cargaPorPessoa: [
      { nome: 'Marta Souza', horas: 410, percentual: 0.6 }, { nome: 'Paulo Souza', horas: 137, percentual: 0.2 },
      { nome: 'Ana Souza', horas: 103, percentual: 0.15 }, { nome: 'João Pereira', horas: 34, percentual: 0.05 }],
    acimaDaMedia: ['Marta Souza'],
    equilibrio: { desvioPadrao: 146.1, coeficienteVariacao: 0.85 },
    mediaMovelHoras: [
      { nome: 'Marta Souza', serie: serie(13.7, 3) }, { nome: 'Paulo Souza', serie: serie(4.6, 2) },
      { nome: 'Ana Souza', serie: serie(3.4, 1) }, { nome: 'João Pereira', serie: serie(1.2, 1) }],
    horasPorTurno: { media: 8, mediana: 8, moda: 8 },
    horaComMaisAtrasos: 20,
    chanceAtraso: { noturno: 0.21, diurno: 0.09 },
    zarit: { compartilharam: 4, total: 4, media: 16.1, mediana: 13, moda: 6, pearsonNoturnosZarit: 0.93, pearsonNoturnosSono: -0.88 },
  };
});

rota('GET', '/demo/sql', false, () => logSql);

// ---------------------------------------------------------------- ponto de entrada
/** Responde como a API real: devolve o JSON ou lança { status, erro }. */
export async function responder(metodo, caminhoCompleto, corpo, token) {
  await new Promise((ok) => setTimeout(ok, 80));
  const [caminho, consulta = ''] = caminhoCompleto.split('?');
  const q = Object.fromEntries(new URLSearchParams(consulta));
  for (const r of rotas) {
    if (r.metodo !== metodo) continue;
    const achou = caminho.match(r.regex);
    if (!achou) continue;
    const eu = r.publica ? null : autenticar(token);
    const params = achou.slice(1).map((p) => (/^\d+$/.test(p) ? Number(p) : p));
    return copia(r.funcao({ eu, params, q, corpo: corpo || {} }));
  }
  throw falha(404, 'Rota não encontrada');
}
