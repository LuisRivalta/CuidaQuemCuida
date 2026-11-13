// Cliente da API. Em modo demonstração, responde com dados em memória (demo.js),
// seguindo exatamente o mesmo contrato (documentacao/03-especificacoes-tecnicas/API.md).
import { responder } from './demo.js';
import { estado, limparSessao } from './estado.js';

const forcado = new URLSearchParams(location.search).get('modo');

/** 'api' quando servido pelo sistema Java (porta 8080); senão 'demo'. ?modo=demo|api força. */
export const MODO = forcado === 'demo' || forcado === 'api'
  ? forcado
  : (location.port === '8080' ? 'api' : 'demo');

function erroDe(status, dados) {
  const erro = new Error(dados?.erro || 'Algo deu errado. Tente de novo.');
  erro.status = status;
  erro.dados = dados;
  return erro;
}

function sessaoExpirada(caminho) {
  if (caminho === '/auth/login') return;
  limparSessao();
  location.hash = '#/login';
}

/**
 * Chama a API. Devolve o JSON (ou null no 204). Em erro, lança Error com a mensagem do servidor.
 * Ex.: await chamar('PUT', '/doses/301/dar', { observacao: null })
 */
export async function chamar(metodo, caminho, corpo) {
  if (MODO === 'demo') {
    try {
      return await responder(metodo, caminho, corpo, estado.token);
    } catch (falha) {
      if (falha.status === 401) sessaoExpirada(caminho);
      throw erroDe(falha.status, falha);
    }
  }

  const cabecalhos = { 'Content-Type': 'application/json' };
  if (estado.token) cabecalhos.Authorization = 'Bearer ' + estado.token;

  let resposta;
  try {
    resposta = await fetch('/api' + caminho, {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw erroDe(0, { erro: 'Sem conexão com o servidor. Confira a internet e tente de novo.' });
  }

  if (resposta.status === 204) return null;
  const dados = await resposta.json().catch(() => null);
  if (resposta.status === 401) sessaoExpirada(caminho);
  if (!resposta.ok) throw erroDe(resposta.status, dados);
  return dados;
}
