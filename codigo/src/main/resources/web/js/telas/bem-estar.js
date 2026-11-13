// Tela "Bem-estar": Escala Zarit (12 perguntas, uma por vez), resultado e pedido de ajuda.
// As respostas são privadas: só a própria pessoa vê, a não ser que escolha compartilhar.
import { chamar } from '../api.js';
import { estado } from '../estado.js';
import { registrarTela, ir } from '../rotas.js';
import { el, tentar, mostrarAviso, formatarData } from '../ui.js';

const FAIXAS = {
  BAIXA: { classe: 'ok', titulo: 'Sobrecarga baixa', texto: 'Que bom! Continue cuidando de você e dividindo as tarefas com a rede.' },
  MODERADA: { classe: 'meio', titulo: 'Sobrecarga moderada', texto: 'Você está carregando bastante coisa. Vale conversar com a rede sobre dividir melhor os turnos.' },
  ALTA: { classe: 'ruim', titulo: 'Sobrecarga alta', texto: 'Você está carregando peso demais e merece apoio. Não precisa dar conta de tudo sozinha(o).' },
};

let perguntasEmCache;
async function perguntas() {
  if (!perguntasEmCache) {
    const resposta = await fetch('dados/zarit-perguntas.json');
    if (!resposta.ok) throw new Error('Não foi possível carregar o questionário.');
    perguntasEmCache = await resposta.json();
  }
  return perguntasEmCache;
}

const privado = () => el('p', { class: 'privado' }, '🔒 Só você vê suas respostas.');

function blocoAjuda(avaliacao, redes) {
  return el('div', { class: 'cartao ajuda-cvv', role: 'region', 'aria-label': 'Onde buscar ajuda' },
    el('h2', {}, 'Você não está sozinha(o)'),
    el('ul', {},
      el('li', {}, el('strong', {}, 'CVV — ligue 188: '), 'apoio emocional gratuito, 24 horas, também por chat em cvv.org.br.'),
      el('li', {}, el('strong', {}, 'UBS de referência: '), 'procure a unidade básica de saúde do seu bairro e conte que você é cuidador(a).'),
      el('li', {}, el('strong', {}, 'CAPS: '), 'o Centro de Atenção Psicossocial da sua cidade atende sem encaminhamento.')),
    redes.length ? el('button', {
      class: 'largo',
      onclick: async (evento) => {
        const resposta = await tentar(() => chamar('POST', `/zarit/${avaliacao.id}/pedir-ajuda`, { pacienteIds: redes.map((r) => r.pacienteId) }));
        if (resposta) {
          evento.target.disabled = true;
          evento.target.textContent = 'Pedido enviado à rede';
          mostrarAviso(`Avisamos ${resposta.alertasCriados} pessoa(s) da sua rede.`);
        }
      },
    }, 'Pedir ajuda à rede') : null,
    el('p', { class: 'detalhe' }, 'O pedido de ajuda avisa as pessoas da sua rede, sem mostrar sua pontuação.'));
}

function telaResultado(conteudo, avaliacao, redes) {
  const faixa = FAIXAS[avaliacao.faixa];
  conteudo.replaceChildren(
    el('h1', {}, 'Seu resultado'),
    privado(),
    el('div', { class: 'cartao' },
      el('p', {}, el('span', { class: `etiqueta ${faixa.classe}` }, faixa.titulo)),
      el('p', { class: 'numero-grande' }, `${avaliacao.pontuacao} de 48`),
      el('p', {}, faixa.texto)),
    avaliacao.faixa === 'ALTA' ? blocoAjuda(avaliacao, redes) : null,
    el('a', { class: 'botao secundario largo', href: '#/bem-estar' }, 'Voltar'));
}

async function questionario(conteudo) {
  const q = await perguntas();
  const eu = await chamar('GET', '/pessoas/eu');
  const respostas = [];
  let horasSono = null;

  function mostrarPergunta(indice) {
    const pergunta = q.perguntas[indice];
    conteudo.replaceChildren(
      el('h1', {}, 'Como você está?'),
      privado(),
      el('p', { class: 'subtitulo' }, `Pergunta ${indice + 1} de ${q.perguntas.length}`),
      el('div', { class: 'progresso', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(q.perguntas.length), 'aria-valuenow': String(indice) },
        el('span', { style: `width:${(indice / q.perguntas.length) * 100}%` })),
      el('div', { class: 'cartao' },
        el('h2', { id: 'pergunta' }, pergunta.texto),
        el('div', { class: 'opcoes-resposta', role: 'group', 'aria-labelledby': 'pergunta' },
          q.opcoes.map((op) => el('button', {
            class: respostas[indice] === op.valor ? '' : 'secundario',
            onclick: () => {
              respostas[indice] = op.valor;
              if (indice + 1 < q.perguntas.length) mostrarPergunta(indice + 1);
              else mostrarSono();
            },
          }, op.texto)))),
      indice > 0 ? el('button', { class: 'link-botao', onclick: () => mostrarPergunta(indice - 1) }, '← Voltar') : null);
    conteudo.querySelector('.opcoes-resposta button')?.focus();
  }

  function mostrarSono() {
    const entrada = el('input', { type: 'number', min: '0', max: '24', step: '0.5', inputmode: 'decimal', id: 'horas-sono', value: horasSono ?? '' });
    conteudo.replaceChildren(
      el('h1', {}, 'Só mais duas'),
      privado(),
      el('div', { class: 'cartao' },
        el('label', { for: 'horas-sono' }, q.sono.horas),
        entrada,
        el('h2', { id: 'qualidade', style: 'margin-top:16px' }, q.sono.qualidade),
        el('div', { class: 'opcoes-resposta', role: 'group', 'aria-labelledby': 'qualidade' },
          q.sono.opcoesQualidade.map((op) => el('button', {
            class: 'secundario',
            onclick: async () => {
              horasSono = entrada.value === '' ? null : Number(entrada.value);
              const avaliacao = await tentar(() => chamar('POST', '/zarit', { respostas, horasSono, qualidadeSono: op.valor }));
              if (avaliacao) telaResultado(conteudo, avaliacao, eu.redes);
            },
          }, op.texto)))),
      el('button', { class: 'link-botao', onclick: () => mostrarPergunta(q.perguntas.length - 1) }, '← Voltar'));
  }

  mostrarPergunta(0);
}

registrarTela('/bem-estar/responder', questionario);

registrarTela('/bem-estar', async (conteudo) => {
  const [minhas, eu] = await Promise.all([chamar('GET', '/zarit/minhas'), chamar('GET', '/pessoas/eu')]);
  const ultima = minhas.avaliacoes[0];
  const faixa = ultima ? FAIXAS[ultima.faixa] : null;

  const compartilhar = eu.redes.map((rede) => {
    const caixa = el('input', { type: 'checkbox', checked: rede.compartilhaZarit });
    caixa.addEventListener('change', async () => {
      const ok = await tentar(() => chamar('PUT', `/pacientes/${rede.pacienteId}/compartilhar-zarit`, { compartilha: caixa.checked }));
      if (ok === undefined) caixa.checked = !caixa.checked;
      else mostrarAviso(caixa.checked ? 'Sua pontuação agora entra no painel da rede.' : 'Sua pontuação deixou de ser compartilhada.');
    });
    return el('label', { class: 'caixa campo' }, caixa,
      `Compartilhar minha pontuação com quem coordena a rede de ${rede.pacienteNome} (entra nas estatísticas do painel).`);
  });

  conteudo.replaceChildren(
    el('h1', {}, 'Bem-estar'),
    privado(),
    el('p', {}, 'Quem cuida também precisa de cuidado. Responda a 12 perguntas rápidas sobre como o cuidado tem afetado você (uns 3 minutos).'),
    ultima
      ? el('div', { class: 'cartao' },
        el('h2', {}, 'Sua última avaliação'),
        el('p', {}, el('span', { class: `etiqueta ${faixa.classe}` }, faixa.titulo), ' ', `${ultima.pontuacao} de 48, em ${formatarData(ultima.respondidaEm)}`),
        el('p', { class: 'detalhe' }, `Próxima sugerida: ${formatarData(minhas.proximaSugerida)} (a cada 14 dias).`))
      : el('div', { class: 'cartao' }, el('p', {}, 'Você ainda não respondeu. Que tal agora?')),
    el('a', { class: 'botao largo', href: '#/bem-estar/responder' }, 'Responder agora'),
    minhas.avaliacoes.length > 1 || ultima
      ? el('section', { class: 'cartao', 'aria-labelledby': 't-hist' },
        el('h2', { id: 't-hist' }, 'Histórico'),
        el('ul', { class: 'lista' }, minhas.avaliacoes.map((a) => el('li', {},
          el('span', {}, `${formatarData(a.respondidaEm)} · ${a.pontuacao} pontos · `, el('span', { class: `etiqueta ${FAIXAS[a.faixa].classe}` }, FAIXAS[a.faixa].titulo)),
          el('button', {
            class: 'pequeno secundario', 'aria-label': `Apagar avaliação de ${formatarData(a.respondidaEm)}`,
            onclick: async () => {
              if (!window.confirm('Apagar esta avaliação? Isso não pode ser desfeito.')) return;
              if (await tentar(() => chamar('DELETE', `/zarit/${a.id}`)) !== undefined) ir('/bem-estar');
            },
          }, 'Apagar')))))
      : null,
    compartilhar.length ? el('section', { class: 'cartao' }, el('h2', {}, 'Privacidade'), compartilhar) : null,
    el('p', { class: 'detalhe' }, `Olá, ${estado.pessoa?.nome?.split(' ')[0] || ''}. Esta avaliação usa a Escala Zarit, validada no Brasil. Ela não é um diagnóstico.`));
});
