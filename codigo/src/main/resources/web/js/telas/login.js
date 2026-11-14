// Tela de login: o céu da hora, a marca (dois corações: quem cuida e quem é cuidado)
// e o formulário. No modo demonstração, um toque entra como uma pessoa da família Souza.
import { chamar, MODO } from '../api.js';
import { salvarSessao } from '../estado.js';
import { registrarTela, carregarContexto, ir } from '../rotas.js';
import { el, preencher, campo, lerFormulario, tentar, deHtml } from '../ui.js';
import { icone } from '../icones.js';
import { periodoDoDia, ehNoite, semMovimento, estrelas, morros } from '../ceu.js';

const FAMILIA_DEMO = [
  { email: 'marta@demo.cqc', nome: 'Marta', papel: 'Filha · coordena o cuidado', cor: 'pessego' },
  { email: 'paulo@demo.cqc', nome: 'Paulo', papel: 'Filho', cor: 'salvia' },
  { email: 'ana@demo.cqc', nome: 'Ana', papel: 'Neta', cor: 'lilas' },
  { email: 'joao@demo.cqc', nome: 'João', papel: 'Vizinho', cor: 'azul' },
];

const MARCA = `<svg class="entrada-marca" viewBox="0 0 32 32" aria-hidden="true">
  <path class="coracao-grande" fill="#ef8a62" d="M14 27S3 20.5 3 11.6A6 6 0 0 1 14 8.2a6 6 0 0 1 11 3.4C25 20.5 14 27 14 27Z"/>
  <path class="coracao-pequeno" fill="#7aa98a" d="M23 29s-6-3.6-6-8.4a3.3 3.3 0 0 1 6-1.9 3.3 3.3 0 0 1 6 1.9C29 25.4 23 29 23 29Z"/></svg>`;

function campoSenha() {
  const entrada = el('input', { name: 'senha', type: 'password', autocomplete: 'current-password', required: true });
  const botao = el('button', {
    type: 'button', class: 'mostrar-senha', 'aria-label': 'Mostrar a senha', 'aria-pressed': 'false',
    onclick: () => {
      const mostrar = entrada.type === 'password';
      entrada.type = mostrar ? 'text' : 'password';
      botao.textContent = mostrar ? 'Ocultar' : 'Mostrar';
      botao.setAttribute('aria-pressed', String(mostrar));
    },
  }, 'Mostrar');
  const bloco = campo('Senha', entrada);
  const caixa = el('div', { class: 'campo-senha' });
  entrada.replaceWith(caixa);
  caixa.append(entrada, botao);
  return bloco;
}

function formularioEntrar() {
  const form = el('form', { class: 'entrada-form', novalidate: true, 'aria-labelledby': 't-entrar' },
    el('h2', { id: 't-entrar' }, 'Entrar'),
    campo('E-mail', el('input', { name: 'email', type: 'email', inputmode: 'email', autocomplete: 'email', required: true })),
    campoSenha(),
    el('button', { type: 'submit', class: 'largo' }, 'Entrar'));

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const { email, senha } = lerFormulario(form);
    if (!email || !senha) return tentar(() => { throw new Error('Preencha o e-mail e a senha.'); });
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = 'Entrando...';
    const resposta = await tentar(() => chamar('POST', '/auth/login', { email, senha }));
    botao.disabled = false;
    botao.textContent = 'Entrar';
    if (!resposta) return;
    salvarSessao(resposta.token, resposta.pessoa);
    await tentar(carregarContexto);
    ir('/hoje');
  });
  return form;
}

function familiaDemo(form) {
  return el('section', { class: 'entrada-demo', 'aria-labelledby': 't-demo' },
    el('h2', { id: 't-demo' }, 'Experimente com a família Souza'),
    el('p', { class: 'detalhe' }, 'Dados de exemplo. Toque em alguém para entrar. A senha de todas as contas é demo1234.'),
    el('ul', { class: 'pessoas-demo' }, FAMILIA_DEMO.map((pessoa) => el('li', {},
      el('button', {
        type: 'button', class: 'pessoa-demo',
        onclick: () => { form.email.value = pessoa.email; form.senha.value = 'demo1234'; form.requestSubmit(); },
      },
      el('span', { class: `avatar ${pessoa.cor}`, 'aria-hidden': 'true' }, pessoa.nome[0]),
      el('span', { class: 'pessoa-texto' }, el('strong', {}, `Entrar como ${pessoa.nome}`), el('span', {}, pessoa.papel)),
      icone('seta', 'seta-direita'))))));
}

function animar(raiz) {
  if (semMovimento()) return;
  const { gsap } = window;
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    // o coração grande chega primeiro; o pequeno vem se aninhar ao lado dele
    .from(raiz.querySelector('.coracao-grande'), { scale: 0.4, opacity: 0, rotation: -12, transformOrigin: '50% 60%', duration: 1.2 })
    .from(raiz.querySelector('.coracao-pequeno'), { x: 7, y: 5, scale: 0.2, opacity: 0, transformOrigin: '50% 50%', duration: 1.1, ease: 'back.out(2.2)' }, 0.4)
    .from(raiz.querySelectorAll('.entrada-ceu h1, .entrada-lema, .entrada-sobre'), { y: 16, opacity: 0, duration: 1, stagger: 0.08 }, 0.3)
    .from(raiz.querySelectorAll('.morros path'), { y: 46, duration: 1.5, stagger: 0.12 }, 0)
    .from(raiz.querySelectorAll('.entrada-lado > *'), { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, 0.5);
}

registrarTela('/login', (conteudo) => {
  const periodo = periodoDoDia();
  const form = formularioEntrar();
  preencher(conteudo, el('div', { class: 'entrada' },
    el('section', { class: 'ceu entrada-ceu', 'data-periodo': periodo },
      ehNoite(periodo) ? estrelas() : null,
      el('div', { class: 'entrada-icone' }, deHtml(MARCA)),
      el('h1', {}, 'CuidaQuemCuida'),
      el('p', { class: 'entrada-lema' }, 'Quem cuida também precisa de cuidado.'),
      el('p', { class: 'entrada-sobre' }, 'Escala de revezamento, remédios e bem-estar da família, num lugar só.'),
      morros()),
    el('div', { class: 'entrada-lado' },
      form,
      el('p', { class: 'entrada-criar' }, 'Primeira vez aqui? ', el('a', { href: '#/cadastro' }, 'Criar minha conta')),
      MODO === 'demo' ? familiaDemo(form) : null)));
  animar(conteudo);
});
