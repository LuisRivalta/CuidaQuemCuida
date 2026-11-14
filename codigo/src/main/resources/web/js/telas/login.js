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
  { email: 'paulo@demo.cqc', nome: 'Paulo', papel: 'Filho · reveza os turnos', cor: 'salvia' },
  { email: 'ana@demo.cqc', nome: 'Ana', papel: 'Neta · ajuda a cobrir turnos', cor: 'lilas' },
  { email: 'joao@demo.cqc', nome: 'João', papel: 'Vizinho · apoia a família', cor: 'azul' },
];

const MARCA = `<svg class="entrada-marca" viewBox="0 0 32 32" aria-hidden="true">
  <path class="coracao-grande" fill="#ef8a62" d="M14 27S3 20.5 3 11.6A6 6 0 0 1 14 8.2a6 6 0 0 1 11 3.4C25 20.5 14 27 14 27Z"/>
  <path class="coracao-pequeno" fill="#7aa98a" d="M23 29s-6-3.6-6-8.4a3.3 3.3 0 0 1 6-1.9 3.3 3.3 0 0 1 6 1.9C29 25.4 23 29 23 29Z"/></svg>`;

function campoSenha() {
  const entrada = el('input', { name: 'senha', type: 'password', autocomplete: 'current-password', required: true });
  const botao = el('button', {
    type: 'button', class: 'mostrar-senha', 'aria-label': 'Mostrar a senha',
    onclick: () => {
      const mostrar = entrada.type === 'password';
      entrada.type = mostrar ? 'text' : 'password';
      botao.textContent = mostrar ? 'Ocultar' : 'Mostrar';
      botao.setAttribute('aria-label', mostrar ? 'Ocultar a senha' : 'Mostrar a senha');
    },
  }, 'Mostrar');
  const bloco = campo('Senha', entrada);
  const caixa = el('div', { class: 'campo-senha' });
  entrada.replaceWith(caixa);
  caixa.append(entrada, botao);
  return bloco;
}

function formularioEntrar() {
  const emailInput = el('input', {
    name: 'email', type: 'email', inputmode: 'email', autocomplete: 'email', required: true,
  });
  const senhaCampo = campoSenha();
  const senhaInput = senhaCampo.querySelector('input');
  const erro = el('p', { id: 'erro-entrar', class: 'erro-campo', role: 'alert' });
  const botao = el('button', { type: 'submit', class: 'largo' }, 'Entrar');
  const form = el('form', { class: 'entrada-form', novalidate: true, 'aria-labelledby': 't-entrar' },
    el('h2', { id: 't-entrar' }, 'Entrar'),
    campo('E-mail', emailInput),
    senhaCampo,
    el('label', { class: 'entrada-lembrar' },
      el('input', { type: 'checkbox', name: 'lembrar', checked: true }), 'Continuar conectado neste aparelho'),
    erro,
    botao);

  function limparErro() {
    erro.textContent = '';
    for (const controle of [emailInput, senhaInput]) {
      controle.removeAttribute('aria-invalid');
      controle.removeAttribute('aria-describedby');
    }
  }

  function indicarErro(mensagem, controle) {
    erro.textContent = mensagem;
    if (controle) {
      controle.setAttribute('aria-invalid', 'true');
      controle.setAttribute('aria-describedby', erro.id);
      controle.focus();
    } else {
      botao.focus();
    }
  }

  form.addEventListener('input', limparErro);
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    if (botao.disabled) return;
    limparErro();
    const { email, senha, lembrar } = lerFormulario(form);
    if (!email) return indicarErro('Digite seu e-mail.', emailInput);
    if (!emailInput.validity.valid) return indicarErro('Confira o endereço de e-mail.', emailInput);
    if (!senha) return indicarErro('Digite sua senha.', senhaInput);
    const botoes = [botao, ...form.parentElement.querySelectorAll('.pessoa-demo')];
    botoes.forEach((item) => { item.disabled = true; });
    botao.textContent = 'Entrando...';
    try {
      const resposta = await chamar('POST', '/auth/login', { email, senha });
      if (!form.isConnected) return;
      salvarSessao(resposta.token, resposta.pessoa, lembrar);
      await tentar(carregarContexto);
      if (form.isConnected) ir('/hoje');
    } catch (falha) {
      botoes.forEach((item) => { item.disabled = false; });
      if (falha.status === 401) indicarErro('E-mail ou senha incorretos. Confira os dois campos e tente novamente.', senhaInput);
      else indicarErro(falha.message);
    } finally {
      botoes.forEach((item) => { item.disabled = false; });
      botao.textContent = 'Entrar';
    }
  });
  return form;
}

function familiaDemo(form) {
  return el('section', { class: 'entrada-demo', 'aria-labelledby': 't-demo' },
    el('h2', { id: 't-demo' }, 'Experimente com a família Souza'),
    el('p', { class: 'detalhe' }, 'Neste exemplo, a família Souza cuida de Dona Lurdes, de 82 anos, que tem Alzheimer. Escolha uma pessoa para ver como ela ajuda.'),
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
      el('div', { class: 'entrada-criar' },
        el('p', {}, 'Recebeu um código de convite? Crie sua conta e digite o código em seguida.'),
        el('a', { href: '#/cadastro' }, 'Criar minha conta')),
      MODO === 'demo' ? familiaDemo(form) : null)));
  animar(conteudo);
});
