// Telas de cadastro: criar conta (com termo), início sem rede, cadastrar paciente e entrar com código.
import { chamar } from '../api.js';
import { escolherPaciente } from '../estado.js';
import { registrarTela, carregarContexto, ir } from '../rotas.js';
import { el, campo, lerFormulario, tentar, mostrarAviso } from '../ui.js';

const VERSAO_TERMO = '1.0';

function termoDeUso() {
  return el('div', { class: 'termo', tabindex: '0', 'aria-label': 'Termo de uso e de consentimento' },
    el('h3', {}, 'Termo de uso e consentimento (versão 1.0)'),
    el('p', {}, 'O CuidaQuemCuida organiza o cuidado de uma pessoa entre familiares e voluntários. Para isso, guardamos:'),
    el('ul', {},
      el('li', {}, 'seus dados de cadastro (nome, e-mail, telefone, data de nascimento e, se quiser, gênero);'),
      el('li', {}, 'os registros de cuidado que você fizer (turnos, remédios dados, sinais vitais medidos, tarefas feitas);'),
      el('li', {}, 'suas respostas ao questionário de bem-estar (Escala Zarit), que são dados de saúde.')),
    el('p', {}, 'Dados de saúde são dados sensíveis (LGPD, art. 11). Só são usados para organizar o cuidado e mostrar indicadores à própria rede. ',
      'Suas respostas de bem-estar são privadas: só você vê, a não ser que escolha compartilhar.'),
    el('p', {}, 'Os dados ficam guardados no Brasil. Você pode ver seus dados e excluir sua conta a qualquer momento, em Mais → Minha conta.'),
    el('p', {}, 'O CuidaQuemCuida organiza e orienta. Não substitui orientação médica.'));
}

registrarTela('/cadastro', (conteudo) => {
  const form = el('form', { class: 'cartao', novalidate: true },
    campo('Nome completo', el('input', { name: 'nome', autocomplete: 'name', required: true })),
    campo('E-mail', el('input', { name: 'email', type: 'email', autocomplete: 'email', required: true })),
    campo('Senha', el('input', { name: 'senha', type: 'password', autocomplete: 'new-password', minlength: '8', required: true }),
      'Pelo menos 8 caracteres.'),
    campo('Telefone (opcional)', el('input', { name: 'telefone', type: 'tel', autocomplete: 'tel' })),
    campo('Data de nascimento (opcional)', el('input', { name: 'dataNascimento', type: 'date' })),
    campo('Gênero (opcional)', el('select', { name: 'genero' },
      el('option', { value: '' }, 'Prefiro não responder agora'),
      el('option', { value: 'FEMININO' }, 'Feminino'),
      el('option', { value: 'MASCULINO' }, 'Masculino'),
      el('option', { value: 'OUTRO' }, 'Outro'),
      el('option', { value: 'NAO_INFORMAR' }, 'Prefiro não informar')),
    'Usado só em números gerais da rede, para mostrar como o cuidado se divide.'),
    termoDeUso(),
    el('label', { class: 'caixa' }, el('input', { type: 'checkbox', name: 'aceiteTermo' }),
      'Li e aceito o termo de uso e consentimento.'),
    el('button', { type: 'submit', class: 'largo' }, 'Criar minha conta'));

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const dados = lerFormulario(form);
    if (!dados.aceiteTermo) return tentar(() => { throw new Error('Para continuar, marque que leu e aceita o termo.'); });
    if (!dados.nome || !dados.email) return tentar(() => { throw new Error('Preencha nome e e-mail.'); });
    if (!dados.senha || dados.senha.length < 8) return tentar(() => { throw new Error('A senha precisa ter pelo menos 8 caracteres.'); });
    const criado = await tentar(() => chamar('POST', '/pessoas', { ...dados, versaoTermo: VERSAO_TERMO }));
    if (!criado) return;
    mostrarAviso('Conta criada! Agora entre com seu e-mail e senha.');
    ir('/login');
  });

  conteudo.replaceChildren(el('h1', {}, 'Criar minha conta'), form,
    el('p', {}, 'Já tem conta? ', el('a', { href: '#/login' }, 'Entrar')));
});

registrarTela('/inicio-rede', (conteudo) => {
  conteudo.replaceChildren(
    el('h1', {}, 'Vamos começar'),
    el('p', {}, 'Você ainda não faz parte de nenhuma rede de cuidado.'),
    el('div', { class: 'cartao' },
      el('h2', {}, 'Sou quem coordena o cuidado'),
      el('p', {}, 'Cadastre a pessoa cuidada e depois convide familiares e vizinhos.'),
      el('a', { class: 'botao largo', href: '#/novo-paciente' }, 'Cadastrar a pessoa cuidada')),
    el('div', { class: 'cartao' },
      el('h2', {}, 'Recebi um código de convite'),
      el('p', {}, 'Entre na rede de quem já usa o CuidaQuemCuida.'),
      el('a', { class: 'botao secundario largo', href: '#/entrar-rede' }, 'Entrar com código')));
});

registrarTela('/novo-paciente', (conteudo) => {
  const form = el('form', { class: 'cartao', novalidate: true },
    campo('Nome da pessoa cuidada', el('input', { name: 'nome', required: true })),
    campo('Data de nascimento', el('input', { name: 'dataNascimento', type: 'date' })),
    campo('Condição', el('input', { name: 'condicao', placeholder: 'Ex.: Alzheimer moderado, acamada' })),
    el('label', { class: 'caixa campo' }, el('input', { type: 'checkbox', name: 'precisa24h' }),
      'Precisa de alguém por perto 24 horas'),
    campo('Observações importantes', el('textarea', { name: 'observacoes', placeholder: 'Alergias, cuidados especiais...' })),
    el('h3', {}, 'Responsável legal'),
    el('p', { class: 'ajuda' }, 'Quem responde legalmente pela pessoa cuidada. Pode ser você ou outra pessoa.'),
    campo('Nome do responsável legal', el('input', { name: 'responsavelNome', required: true })),
    campo('Parentesco', el('input', { name: 'responsavelParentesco', placeholder: 'Ex.: Filha', required: true })),
    el('label', { class: 'caixa campo' }, el('input', { type: 'checkbox', name: 'declaracaoAutorizacao' }),
      'Declaro que sou o responsável legal ou tenho a autorização dele para registrar os dados de saúde desta pessoa.'),
    el('button', { type: 'submit', class: 'largo' }, 'Cadastrar'));

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const dados = lerFormulario(form);
    if (!dados.nome) return tentar(() => { throw new Error('Preencha o nome da pessoa cuidada.'); });
    if (!dados.responsavelNome || !dados.responsavelParentesco) {
      return tentar(() => { throw new Error('Preencha o nome e o parentesco do responsável legal.'); });
    }
    if (!dados.declaracaoAutorizacao) return tentar(() => { throw new Error('Marque a declaração de autorização para continuar.'); });
    const criado = await tentar(() => chamar('POST', '/pacientes', dados));
    if (!criado) return;
    await tentar(carregarContexto);
    escolherPaciente(criado.id);
    mostrarAviso(`Pronto! Código de convite da rede: ${criado.codigoConvite}`);
    ir('/mais/pessoas');
  });

  conteudo.replaceChildren(el('h1', {}, 'Cadastrar a pessoa cuidada'), form);
});

registrarTela('/entrar-rede', (conteudo) => {
  const form = el('form', { class: 'cartao', novalidate: true },
    campo('Código de convite', el('input', {
      name: 'codigo', required: true, maxlength: '6', autocapitalize: 'characters', placeholder: 'Ex.: LURD26',
    }), 'Peça o código a quem coordena a rede.'),
    campo('Qual é sua relação com a pessoa cuidada?', el('select', { name: 'vinculo' },
      el('option', { value: 'FAMILIAR' }, 'Familiar'),
      el('option', { value: 'VIZINHO' }, 'Vizinho(a)'),
      el('option', { value: 'AMIGO' }, 'Amigo(a)'),
      el('option', { value: 'OUTRO' }, 'Outro'))),
    el('button', { type: 'submit', class: 'largo' }, 'Entrar na rede'));

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const dados = lerFormulario(form);
    if (!dados.codigo) return tentar(() => { throw new Error('Digite o código de convite.'); });
    const resposta = await tentar(() => chamar('POST', '/pacientes/entrar', {
      codigo: dados.codigo.toUpperCase(), vinculo: dados.vinculo,
    }));
    if (!resposta) return;
    await tentar(carregarContexto);
    escolherPaciente(resposta.pacienteId);
    mostrarAviso(`Você agora faz parte da rede de ${resposta.pacienteNome}.`);
    ir('/hoje');
  });

  conteudo.replaceChildren(el('h1', {}, 'Entrar com código'), form);
});
