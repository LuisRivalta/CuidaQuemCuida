// Estado compartilhado entre as telas: quem está logado e qual paciente está aberto.

function ler(chave) {
  try { return JSON.parse(sessionStorage.getItem(chave)); } catch { return null; }
}

function gravar(chave, valor) {
  try {
    if (valor === null || valor === undefined) sessionStorage.removeItem(chave);
    else sessionStorage.setItem(chave, JSON.stringify(valor));
  } catch { /* navegador sem sessionStorage: segue só em memória */ }
}

const CHAVE_SESSAO = 'cqc.sessao-lembrada';

function lerSessaoLembrada() {
  try { return JSON.parse(localStorage.getItem(CHAVE_SESSAO)); } catch { return null; }
}

function gravarSessaoLembrada(sessao) {
  try {
    if (sessao) localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    else localStorage.removeItem(CHAVE_SESSAO);
  } catch { /* navegador sem localStorage: usa a sessão da aba */ }
}

const tokenDaAba = ler('cqc.token');
const sessaoLembrada = tokenDaAba ? null : lerSessaoLembrada();

export const estado = {
  token: tokenDaAba ?? sessaoLembrada?.token ?? null,
  pessoa: tokenDaAba ? ler('cqc.pessoa') : sessaoLembrada?.pessoa ?? null,
  pacientes: [],                    // [{ id, nome, condicao, papel }]
  pacienteId: ler('cqc.paciente'),
};

export function salvarSessao(token, pessoa, lembrar = false) {
  estado.token = token;
  estado.pessoa = pessoa;
  gravar('cqc.token', token);
  gravar('cqc.pessoa', pessoa);
  gravarSessaoLembrada(lembrar ? { token, pessoa } : null);
}

export function limparSessao() {
  if (lerSessaoLembrada()?.token === estado.token) gravarSessaoLembrada(null);
  estado.token = null;
  estado.pessoa = null;
  estado.pacientes = [];
  estado.pacienteId = null;
  gravar('cqc.token', null);
  gravar('cqc.pessoa', null);
  gravar('cqc.paciente', null);
}

export function escolherPaciente(id) {
  estado.pacienteId = id;
  gravar('cqc.paciente', id);
}

/** O paciente aberto, ou o primeiro da lista. */
export function pacienteAtual() {
  return estado.pacientes.find((p) => p.id === estado.pacienteId) || estado.pacientes[0] || null;
}

export function souCoordenador() {
  return pacienteAtual()?.papel === 'COORDENADOR';
}
