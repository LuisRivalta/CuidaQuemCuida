---
titulo: LGPD, Segurança e Acessibilidade
tags: [lgpd, seguranca, acessibilidade, inclusao]
---

# LGPD, Segurança e Acessibilidade

O edital pede "quais cuidados foram previstos para acessibilidade, inclusão, segurança e proteção de dados". Ver [[Design da Solução]] (seção 11), [[Módulo Infraestrutura e Segurança]] e [[Wireframes]].

## Proteção de dados (LGPD)
O sistema guarda **dados pessoais sensíveis de saúde** (remédios, sinais vitais, sobrecarga do cuidador). Por isso:

| Princípio / artigo | Como o sistema atende |
|---|---|
| **Base legal: consentimento específico e destacado** (art. 11, I) | Termo de uso com caixa "Li e aceito" obrigatória no cadastro, registrado na tabela `consentimento` com a versão |
| **Dados de quem não pode consentir** | O paciente não tem login. Quem o cadastra declara ser o **responsável legal** ou ter a autorização dele, com nome e parentesco registrados |
| **Necessidade / minimização** (art. 6, III) | O membro vê só o necessário para cuidar no turno; gênero é opcional e só entra em números gerais |
| **Finalidade e transparência** (art. 6, I e VI) | Tela **"Dados coletados"**: cada dado, por que é coletado, quem vê e por quanto tempo |
| **Direitos do titular** (art. 18) | "Ver meus dados" e **"Excluir minha conta"** em Minha conta |
| **Eliminação e anonimização** (arts. 16 e 18) | Ao excluir a conta, a pessoa é **anonimizada** ("Pessoa removida"); os registros de cuidado continuam sem identificar ninguém; as **avaliações Zarit são apagadas de verdade** |
| **Dado sensível do cuidador** | A Zarit é **privada por padrão**; entra no painel só com consentimento (por rede); o pedido de ajuda não mostra a pontuação; a auditoria não grava a pontuação |
| **Localização** | Banco no Supabase, região **São Paulo**: dados guardados no Brasil |
| **Prazo de guarda** | Cadastro: enquanto a conta existir · cuidado: enquanto a rede existir · Zarit: até a pessoa apagar · sessão: 7 dias · auditoria: 6 meses (Marco Civil, art. 15) |

## Segurança
| Risco | Medida | Onde |
|---|---|---|
| Senha vazada | **Hash PBKDF2-HMAC-SHA256** com salt e 600 mil iterações; comparação em tempo constante | [[hash da senha]] |
| Acesso sem login | Token aleatório de 32 bytes no cabeçalho `Authorization`; sessão expira em 7 dias | [[AuthFilter]] |
| Ver dados de outra família trocando o id na URL | Toda rota de paciente confere se a pessoa é da rede (403) | [[Autorizacao]] |
| Ação de coordenador por membro | Rotas de coordenador conferem o papel (403) | [[Autorizacao]] |
| Injeção de SQL | **Só `PreparedStatement`** com `?`; nenhum SQL montado com texto do usuário | [[Sql]] |
| API automática do Supabase exposta | **RLS ligado em todas as tabelas, sem política**: a chave pública não lê nada; o Java entra como dono das tabelas | `banco/02-ligar-rls.sql` |
| Senha do banco no GitHub | Fica em `config.properties`, que está no `.gitignore` | [[Config]] |
| Dois registros ao mesmo tempo | `UPDATE ... WHERE status = 'PENDENTE'` (atômico) | [[registrar dose]] |
| Rastreabilidade | Tabela `auditoria`: quem inseriu, alterou ou excluiu o quê e quando (Fase 5) | [[AuditoriaDao]] |
| Mensagens de erro reveladoras | Erros internos voltam como "Erro interno. Tente de novo."; o detalhe fica só no console do servidor | [[ErroMapper]] |
| Produção (roadmap) | HTTPS no servidor publicado; a demonstração roda localmente | — |

Conteúdo do curso: Fase 3 (cybersecurity, ISO 27000, direito digital) e Fase 5 (LGPD, auditoria de sistemas).

## Acessibilidade e inclusão
| Cuidado | Detalhe |
|---|---|
| **Celular primeiro** | A maioria usa em pé, ao lado do paciente |
| **Letra grande** | Texto base de 18 px |
| **Alvos de toque grandes** | Botões e campos com pelo menos 48 px de altura |
| **Contraste AA** | Cor principal com 5,4:1 sobre branco; texto secundário com 6:1 |
| **Ícone sempre com texto** | Nenhuma informação só por ícone ou só por cor (o "fora da faixa" tem cor e texto) |
| **Linguagem simples** | "Dei o remédio", "Posso cobrir", "Como você está?" |
| **Teclado e leitor de tela** | Rótulo em todo campo, foco visível, "pular para o conteúdo", `aria-live` nas mensagens e alertas, `role="alert"` nos alertas |
| **Gráficos acessíveis** | Paleta validada para daltonismo, legenda, "Ver em tabela" e interpretação em palavras |
| **Movimento reduzido** | Respeita `prefers-reduced-motion` |
| **Inclusão econômica** | Gratuito, roda no navegador de qualquer celular, sem instalar (ver [[ODS]]) |
| **Saúde mental** | Resultado alto da Zarit mostra **CVV 188**, UBS e CAPS; o sistema diz que não é diagnóstico |
| **Aviso** | "O CuidaQuemCuida organiza e orienta. Não substitui orientação médica." |
