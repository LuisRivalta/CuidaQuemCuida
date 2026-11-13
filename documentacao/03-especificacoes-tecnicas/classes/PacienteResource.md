---
tipo: classe
camada: resource
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/resource/PacienteResource.java
tags: [classe, resource]
---

# PacienteResource

**Classe** da camada **API REST (JAX-RS)** · `codigo/src/main/java/br/com/cuidaquemcuida/resource/PacienteResource.java`

## Para que serve
Tudo o que é de um paciente: a rede, a escala, os remédios, os sinais, as tarefas e o painel. Fica numa só classe porque o JAX-RS escolhe um único recurso raiz por caminho ("pacientes"). Cada método só lê os parâmetros e chama o serviço; as regras e a autorização estão nos serviços.

Faz parte do [[Módulo Cadastros e Rede]].

Declaração: `class PacienteResource extends RecursoBase`

## Métodos
| Método | O que faz |
|---|---|
| `minhasRedes() → List<PacienteResumo>` |  |
| `criar(PacienteEntrada dados) → Response` |  |
| `entrar(EntrarEntrada dados) → EntrarSaida` |  |

## Usa
[[ApiException]], [[Dtos]], [[EscalaService]], [[EstatisticaService]], [[MedicacaoService]], [[RecursoBase]], [[RedeService]], [[SinalVitalService]], [[TarefaService]], [[TipoSinal]]

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
