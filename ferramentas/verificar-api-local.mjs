// Exercita a API Java contra o banco local de demonstração. Altera apenas dados de teste.
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:8080/api';

async function chamar(metodo, rota, status, token, dados) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const resposta = await fetch(base + rota, {
    method: metodo, headers, body: dados === undefined ? undefined : JSON.stringify(dados),
  });
  assert.equal(resposta.status, status, `${metodo} ${rota}`);
  return resposta.status === 204 ? null : resposta.json();
}

const login = (email, senha = 'demo1234', status = 200) => chamar('POST', '/auth/login', status, null, { email, senha });
const Marta = 'marta@demo.cqc';
const hoje = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());
const { ok } = await chamar('GET', '/saude', 200);
assert.equal(ok, true);
await login(Marta, 'senha-incorreta', 401);
const { token: marta } = await login(Marta);
const { token: paulo } = await login('paulo@demo.cqc');
const { token: joao } = await login('joao@demo.cqc');
const { token: ana } = await login('ana@demo.cqc');
console.log('Saúde, login e recusa de credenciais incorretas: OK');

const rotaDoses = `/pacientes/1/doses?data=${hoje}`;
const dosesAntes = await chamar('GET', rotaDoses, 200, marta);
await chamar('GET', '/hoje?pacienteId=1', 200, marta);
const doses = await chamar('GET', rotaDoses, 200, marta);
assert.deepEqual(doses.map((dose) => dose.id), dosesAntes.map((dose) => dose.id));
const pendente = (dose) => dose.status === 'PENDENTE';
let pendentes = doses.filter(pendente);
if (pendentes.length < 2) {
  const diaTeste = new Date(`${hoje}T12:00:00-03:00`);
  diaTeste.setUTCDate(diaTeste.getUTCDate() + 2);
  const futuras = await chamar('GET', `/pacientes/1/doses?data=${diaTeste.toISOString().slice(0, 10)}`, 200, marta);
  pendentes = futuras.filter(pendente);
}
assert.ok(pendentes.length >= 2, 'Recarregue os dados de demonstração antes de repetir o teste de doses');
const dadas = await Promise.all([marta, paulo].map((token) => fetch(base + `/doses/${pendentes[0].id}/dar`, {
  method: 'PUT', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: '{}',
})));
assert.deepEqual(dadas.map((resposta) => resposta.status).sort(), [200, 409]);
const repetida = await dadas.find((resposta) => resposta.status === 409).json();
assert.match(repetida.erro, /Essa dose já foi registrada por (Marta|Paulo)/);
const naoDada = await chamar('PUT', `/doses/${pendentes[1].id}/nao-dar`, 200, marta, { motivo: 'Teste com dados fictícios' });
assert.equal(naoDada.status, 'NAO_DADA');
console.log('Registro concorrente de dose e registro de motivo: OK');
console.log('Geração de doses sem duplicar: OK');

const turnoRota = '/pacientes/1/turnos';
const inicio = '2030-01-02T22:00:00';
const fim = '2030-01-03T06:00:00';
const turno = await chamar('POST', turnoRota, 201, marta, { pessoaId: null, inicio, fim });
try {
  const coberto = await chamar('POST', `/turnos/${turno.id}/assumir`, 200, ana);
  assert.equal(coberto.pessoaId, 3);
  assert.equal(coberto.noturno, true);
  const conflito = await chamar('POST', turnoRota, 409, marta, { pessoaId: coberto.pessoaId, inicio, fim });
  assert.ok(conflito.conflitos.length > 0);
} finally {
  await chamar('DELETE', `/turnos/${turno.id}`, 204, marta);
}
console.log('Cobertura, turno noturno e conflito de escala: OK');

const sinal = await chamar('POST', '/pacientes/1/sinais', 201, marta, { tipo: 'PRESSAO', valor: 180, valor2: 105 });
assert.equal(sinal.alerta, 'FORA_DA_FAIXA');
const zarit = await chamar('POST', '/zarit', 201, marta, { respostas: Array(12).fill(4), horasSono: 5, qualidadeSono: 2 });
assert.equal(zarit.pontuacao, 48);
assert.equal(zarit.faixa, 'ALTA');
try {
  const ajuda = await chamar('POST', `/zarit/${zarit.id}/pedir-ajuda`, 200, marta, { pacienteIds: [1] });
  assert.equal(ajuda.alertasCriados, 3);
  const alertas = await chamar('GET', '/alertas?pacienteId=1', 200, paulo);
  assert.ok(alertas.some((alerta) => alerta.tipo === 'PEDIDO_AJUDA' && alerta.mensagem.includes('Marta')));
  assert.ok(!(await chamar('GET', '/zarit/minhas', 200, paulo)).avaliacoes.some((a) => a.id === zarit.id));
} finally {
  await chamar('DELETE', `/zarit/${zarit.id}`, 204, marta);
}
console.log('Sinal fora da faixa, Zarit alta, privacidade e pedido de ajuda: OK');

await chamar('GET', '/pacientes/1/estatisticas?dias=30', 200, marta);
await chamar('PUT', '/pacientes/1/compartilhar-zarit', 200, paulo, { compartilha: false });
try {
  const estatisticas = await chamar('GET', '/pacientes/1/estatisticas?dias=30', 200, marta);
  assert.equal(estatisticas.zarit.compartilharam, 3);
} finally {
  await chamar('PUT', '/pacientes/1/compartilhar-zarit', 200, paulo, { compartilha: true });
}
await chamar('GET', '/pacientes/1/estatisticas?dias=30', 403, joao);
await chamar('GET', '/pacientes/999', 403, joao);
const email = `verificacao-${Date.now()}@example.invalid`;
await chamar('POST', '/pessoas', 201, null, { nome: 'Pessoa de Verificação', email, senha: 'demo1234', aceiteTermo: true, versaoTermo: '1.0' });
const { token: membro } = await login(email);
try {
  const rede = await chamar('POST', '/pacientes/entrar', 200, membro, { codigo: 'LURD26', vinculo: 'FAMILIAR' });
  assert.equal(rede.pacienteId, 1);
} finally {
  await chamar('DELETE', '/pessoas/eu', 204, membro);
}
await login(email, 'demo1234', 401);
for (const token of [ana, joao, paulo, marta]) await chamar('POST', '/auth/logout', 204, token);
await chamar('GET', '/pacientes', 401, marta);
console.log('Acesso do coordenador, isolamento, convite, exclusão e logout: OK');
