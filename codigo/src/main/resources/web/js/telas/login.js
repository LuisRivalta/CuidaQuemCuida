// Tela de login.
import { chamar, MODO } from '../api.js';
import { salvarSessao } from '../estado.js';
import { registrarTela, carregarContexto, ir } from '../rotas.js';
import { el, preencher, campo, lerFormulario, tentar } from '../ui.js';

registrarTela('/login', (conteudo) => {
  const form = el('form', { class: 'cartao', novalidate: true },
    campo('E-mail', el('input', { name: 'email', type: 'email', autocomplete: 'email', required: true })),
    campo('Senha', el('input', { name: 'senha', type: 'password', autocomplete: 'current-password', required: true })),
    el('button', { type: 'submit', class: 'largo' }, 'Entrar'));

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const { email, senha } = lerFormulario(form);
    if (!email || !senha) return tentar(() => { throw new Error('Preencha o e-mail e a senha.'); });
    const botao = form.querySelector('button');
    botao.disabled = true;
    const resposta = await tentar(() => chamar('POST', '/auth/login', { email, senha }));
    botao.disabled = false;
    if (!resposta) return;
    salvarSessao(resposta.token, resposta.pessoa);
    await tentar(carregarContexto);
    ir('/hoje');
  });

  preencher(conteudo,
    el('h1', {}, 'Bem-vinda(o) ao CuidaQuemCuida'),
    el('p', { class: 'subtitulo' }, 'Organize o cuidado em rede e cuide também de você.'),
    form,
    el('p', {}, 'Primeira vez aqui? ', el('a', { href: '#/cadastro' }, 'Criar minha conta')),
    MODO === 'demo'
      ? el('div', { class: 'cartao' },
        el('h2', {}, 'Contas de demonstração'),
        el('p', {}, 'Senha de todas: ', el('strong', {}, 'demo1234')),
        el('ul', {},
          el('li', {}, 'marta@demo.cqc — Marta, coordenadora (filha)'),
          el('li', {}, 'paulo@demo.cqc — Paulo (filho)'),
          el('li', {}, 'ana@demo.cqc — Ana (neta)'),
          el('li', {}, 'joao@demo.cqc — João (vizinho)')))
      : null);
});
