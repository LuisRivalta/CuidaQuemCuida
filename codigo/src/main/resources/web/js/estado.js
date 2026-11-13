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

export const estado = {
  token: ler('cqc.token'),
  pessoa: ler('cqc.pessoa'),        // { id, nome, email }
  pacientes: [],                    // [{ id, nome, condicao, papel }]
  pacienteId: ler('cqc.paciente'),
};

export function salvarSessao(token, pessoa) {
  estado.token = token;
  estado.pessoa = pessoa;
  gravar('cqc.token', token);
  gravar('cqc.pessoa', pessoa);
}

export function limparSessao() {
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
