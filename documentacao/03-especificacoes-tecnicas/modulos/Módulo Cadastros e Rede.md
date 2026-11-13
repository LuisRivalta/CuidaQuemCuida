---
tipo: modulo
tags: [modulo, cadastro, rede, lgpd]
---

# Módulo Cadastros e Rede

**Para que serve:** criar conta (com termo), entrar, cadastrar a pessoa cuidada (com o responsável legal), convidar familiares e vizinhos por código, papéis (coordenador e membro), meus dados e excluir conta. Casos de uso: UC01, UC02, UC08, UC09 e UC16 ([[Casos de Uso]]).

| Camada | Onde |
|---|---|
| Telas | `web/js/telas/login.js`, `cadastros.js` (cadastro, início, novo paciente, entrar com código), `mais.js` (Pessoas da rede, Paciente, Minha conta) |
| Rotas | `/api/auth/*`, `/api/pessoas*`, `/api/pacientes`, `/api/pacientes/{id}`, `.../entrar`, `.../convite`, `.../membros*`, `.../compartilhar-zarit` ([[API]]) |
| Recursos | [[AuthResource]], [[PessoaResource]], [[PacienteResource]] |
| Serviços | [[ContaService]], [[RedeService]] |
| Acesso a dados | [[PessoaDao]], [[PacienteDao]], [[MembroRedeDao]], [[ConsentimentoDao]], [[SessaoDao]], [[AuditoriaDao]] |
| Modelo | [[Pessoa]], [[Cuidador]], [[Paciente]], [[MembroRede]], [[Papel]], [[Vinculo]] |
| Tabelas | `pessoa`, `paciente`, `membro_rede` (N:N), `consentimento`, `sessao`, `auditoria` ([[Diagrama do Banco]]) |

## Regras
- Cada pessoa tem o **próprio login** e aceita o **próprio termo** (versão 1.0).
- Quem cadastra o paciente vira **coordenador** e declara a autorização do **responsável legal**, que fica registrada em `consentimento`.
- O código de convite tem **6 caracteres**, sem letras que se confundem (sem O/0, I/1), e pode ser renovado.
- Uma pessoa pode estar em **várias redes**. Quem sai da rede e volta com o código é reativado.
- A rede nunca fica sem coordenador.
- **Excluir conta:** anonimiza a pessoa, apaga as avaliações Zarit e as sessões, e mantém os registros de cuidado. Coordenador único de rede com outros membros precisa passar a coordenação antes. Ver [[LGPD, Segurança e Acessibilidade]].
