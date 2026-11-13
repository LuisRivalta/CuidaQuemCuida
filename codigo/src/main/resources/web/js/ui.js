// Utilitários de interface: criar elementos, mensagens e formatação de datas.

/**
 * Cria um elemento. Atributos começando com "on" viram eventos.
 * Ex.: el('button', { class: 'pequeno', onclick: fn }, 'Salvar')
 */
export function el(tag, atributos = {}, ...filhos) {
  const elemento = document.createElement(tag);
  for (const [chave, valor] of Object.entries(atributos || {})) {
    if (valor === null || valor === undefined || valor === false) continue;
    if (chave.startsWith('on') && typeof valor === 'function') {
      elemento.addEventListener(chave.slice(2), valor);
    } else if (chave === 'class') {
      elemento.className = valor;
    } else if (valor === true) {
      elemento.setAttribute(chave, '');
    } else {
      elemento.setAttribute(chave, valor);
    }
  }
  for (const filho of filhos.flat()) {
    if (filho === null || filho === undefined || filho === false) continue;
    elemento.append(filho instanceof Node ? filho : document.createTextNode(String(filho)));
  }
  return elemento;
}

let temporizador;

function mostrar(texto, classe) {
  const caixa = document.getElementById('mensagem');
  caixa.textContent = texto;
  caixa.className = 'mensagem ' + classe;
  caixa.hidden = false;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => { caixa.hidden = true; }, 5000);
}

export function mostrarErro(texto) { mostrar(texto, 'erro'); }
export function mostrarAviso(texto) { mostrar(texto, ''); }

/** Campo com rótulo. Ex.: campo('Nome', el('input', { name: 'nome' })) */
export function campo(rotulo, controle, ajuda) {
  const id = controle.id || ('c-' + Math.random().toString(36).slice(2, 9));
  controle.id = id;
  return el('div', { class: 'campo' },
    el('label', { for: id }, rotulo, ajuda ? el('span', { class: 'ajuda' }, ajuda) : null),
    controle);
}

/** Lê os campos de um formulário como objeto ({ name: valor }). */
export function lerFormulario(form) {
  const dados = {};
  for (const elemento of form.elements) {
    if (!elemento.name) continue;
    if (elemento.type === 'checkbox') dados[elemento.name] = elemento.checked;
    else if (elemento.type === 'number') dados[elemento.name] = elemento.value === '' ? null : Number(elemento.value);
    else dados[elemento.name] = elemento.value.trim() === '' ? null : elemento.value.trim();
  }
  return dados;
}

/** Executa uma ação assíncrona mostrando o erro, se houver. Devolve o resultado ou undefined. */
export async function tentar(acao) {
  try {
    return await acao();
  } catch (erro) {
    mostrarErro(erro.message || 'Algo deu errado. Tente de novo.');
    return undefined;
  }
}

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

/** "2026-11-13T14:00:00" -> Date (hora local) */
export function paraData(iso) {
  if (!iso) return null;
  const [d, h = '00:00:00'] = iso.split('T');
  const [ano, mes, dia] = d.split('-').map(Number);
  const [hh, mm, ss = 0] = h.split(':').map(Number);
  return new Date(ano, mes - 1, dia, hh, mm, ss);
}

const dois = (n) => String(n).padStart(2, '0');

/** Date -> "2026-11-13T14:00:00" (hora local, sem fuso) */
export function isoLocal(data) {
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}T${dois(data.getHours())}:${dois(data.getMinutes())}:${dois(data.getSeconds())}`;
}

/** Date -> "2026-11-13" */
export function isoData(data) {
  return `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`;
}

export function formatarHora(iso) {
  const d = paraData(iso);
  return d ? `${dois(d.getHours())}:${dois(d.getMinutes())}` : '';
}

export function formatarData(iso) {
  const d = paraData(iso.length === 10 ? iso + 'T00:00:00' : iso);
  return d ? `${dois(d.getDate())}/${dois(d.getMonth() + 1)}` : '';
}

export function formatarDiaSemana(iso) {
  const d = paraData(iso.length === 10 ? iso + 'T00:00:00' : iso);
  return d ? `${DIAS[d.getDay()]}, ${dois(d.getDate())}/${dois(d.getMonth() + 1)}` : '';
}

/** Intervalo curto: "14h–22h" */
export function formatarIntervalo(inicio, fim) {
  const h = (iso) => {
    const d = paraData(iso);
    return d.getMinutes() ? `${d.getHours()}h${dois(d.getMinutes())}` : `${d.getHours()}h`;
  };
  return `${h(inicio)}–${h(fim)}`;
}

export function porcentagem(valor) {
  return valor === null || valor === undefined ? 'Dados insuficientes' : `${Math.round(valor * 100)}%`;
}

export function numero(valor, casas = 1) {
  return valor === null || valor === undefined ? 'Dados insuficientes'
    : Number(valor).toLocaleString('pt-BR', { maximumFractionDigits: casas });
}
