---
tipo: classe
camada: service
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/service/ContaService.java
tags: [classe, service]
---

# ContaService

**Classe** da camada **Serviços e regras de negócio** · `codigo/src/main/java/br/com/cuidaquemcuida/service/ContaService.java`

## Para que serve
Cadastro, login, meus dados e exclusão de conta (LGPD).

Faz parte do [[Módulo Cadastros e Rede]].

## Métodos
| Método | O que faz |
|---|---|
| `cadastrar(CadastroEntrada dados) → estático PessoaResumo` |  |
| `login(String email, String senha) → estático LoginSaida` |  |
| `logout(String token) → estático void` |  |
| `meusDados(long pessoaId) → estático PessoaDto` |  |
| `excluir(long pessoaId) → estático void` | Exclusão de conta: anonimiza a pessoa (mantém os registros de cuidado), apaga as avaliações Zarit de verdade e tira a pessoa das redes. Coordenador único de uma rede com outros membros precisa passar a coordenação antes. |

## Usa
[[ApiException]], [[AuditoriaDao]], [[ConsentimentoDao]], [[Cuidador]], [[Dtos]], [[MembroRede]], [[MembroRedeDao]], [[PacienteDao]], [[Pessoa]], [[PessoaDao]], [[Senha]], [[SessaoDao]], [[Sql]], [[ZaritDao]]

## É usada por
[[AuthResource]], [[PessoaResource]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
