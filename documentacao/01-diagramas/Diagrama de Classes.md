---
titulo: Diagrama de Classes
versao: 1 (planejada)
data: 2026-11-13
tags: [diagrama, classes, uml, oo]
---

# Diagrama de Classes

> **Versão 1 (planejada) — 13/11/2026.** Ver [[Arquitetura]], [[Diagrama do Banco]] e [[Mapa do Código]].
> Conteúdo do curso: Fase 2 (diagrama de classes, classes e métodos, "quando as partes se conversam") e Fase 3 (encapsulamento, herança e polimorfismo).

## Modelo do domínio (`model`)

```mermaid
classDiagram
    direction TB

    class Pessoa {
        <<abstract>>
        -Long id
        -String nome
        -LocalDate dataNascimento
        +descricao()* String
        +idade(LocalDate hoje) Integer
    }
    class Cuidador {
        -String email
        -String telefone
        -String senhaHash
        -String senhaSalt
        -String genero
        -boolean ativo
        +descricao() String
        +anonimizar() void
    }
    class Paciente {
        -String condicao
        -boolean precisa24h
        -String observacoes
        -String responsavelNome
        -String responsavelParentesco
        -String codigoConvite
        +descricao() String
    }
    Pessoa <|-- Cuidador
    Pessoa <|-- Paciente

    class MembroRede {
        <<record>>
        long pessoaId
        long pacienteId
        Papel papel
        Vinculo vinculo
        boolean ativo
        boolean compartilhaZarit
        +coordenador() boolean
    }
    Cuidador "1" --> "*" MembroRede : participa
    Paciente "1" --> "*" MembroRede : tem na rede

    class Turno {
        -long pacienteId
        -Long pessoaId
        -LocalDateTime inicio
        -LocalDateTime fim
        -StatusTurno status
        +minutos() long
        +sobrepoe(Turno outro) boolean
        +noturno() boolean
        +vago() boolean
    }
    Paciente "1" --> "*" Turno
    Cuidador "0..1" --> "*" Turno : cobre

    class Medicamento {
        -String nome
        -String dosagem
        -boolean ativo
        +horariosEntre(de, ate) List~LocalDateTime~
    }
    class RegraHorario {
        <<abstract>>
        -LocalDate inicio
        -LocalDate fim
        +horariosEntre(de, ate)* List~LocalDateTime~
        +tipo()* TipoRegra
        +criar(tipo, ...)$ RegraHorario
    }
    class RegraIntervalo {
        -int intervaloHoras
        -LocalTime primeiraDose
        +horariosEntre(de, ate) List~LocalDateTime~
    }
    class RegraHorariosFixos {
        -List~LocalTime~ horarios
        +horariosEntre(de, ate) List~LocalDateTime~
        #valeNoDia(LocalDate) boolean
    }
    class RegraDiasAlternados {
        #valeNoDia(LocalDate) boolean
    }
    RegraHorario <|-- RegraIntervalo
    RegraHorario <|-- RegraHorariosFixos
    RegraHorariosFixos <|-- RegraDiasAlternados
    Paciente "1" --> "*" Medicamento
    Medicamento "1" --> "1" RegraHorario : segue

    class Dose {
        -LocalDateTime previstoPara
        -LocalDateTime dadaEm
        -Long dadaPor
        -StatusDose status
    }
    Medicamento "1" --> "*" Dose : gera

    class SinalVital {
        -TipoSinal tipo
        -double valor
        -Double valor2
        -LocalDateTime medidoEm
    }
    class FaixaSinal {
        <<record>>
        TipoSinal tipo
        Double minimo
        Double maximo
    }
    Paciente "1" --> "*" SinalVital
    Paciente "1" --> "*" FaixaSinal

    class TarefaCuidado {
        -String titulo
        -String orientacao
        -int recorrenciaHoras
        -LocalTime primeiraVez
        -TipoSinal tipoSinal
        +horariosDoDia(LocalDate) List~LocalDateTime~
        +medicao() boolean
    }
    class ExecucaoTarefa {
        -LocalDateTime previstaPara
        -LocalDateTime feitaEm
        -Long feitaPor
        +feita() boolean
    }
    Paciente "1" --> "*" TarefaCuidado
    TarefaCuidado "1" --> "*" ExecucaoTarefa : gera

    class AvaliacaoZarit {
        -int[] respostas
        -int pontuacao
        -FaixaZarit faixa
        -Double horasSono
        -Integer qualidadeSono
    }
    Cuidador "1" --> "*" AvaliacaoZarit : responde
```

## Alertas (polimorfismo)

Cada alerta monta a **própria mensagem**. O serviço trata todos como `Alerta` e só chama `mensagem()`.

```mermaid
classDiagram
    direction LR
    class Alerta {
        <<abstract>>
        -TipoAlerta tipo
        -long pacienteId
        -long destinatarioId
        -String referencia
        +mensagem()* String
        +prioridade() int
    }
    class TipoAlerta {
        <<enumeration>>
        PEDIDO_AJUDA = 100
        SINAL_FORA_FAIXA = 90
        SINAL_FORA_CURVA = 90
        DOSE_NAO_DADA = 80
        DOSE_ATRASADA = 70
        TURNO_VAGO = 60
        CONFLITO_TURNO = 50
        SOBRECARGA = 40
        TAREFA_ATRASADA = 30
        DOSE_PROXIMA = 20
    }
    Alerta --> TipoAlerta
    Alerta <|-- AlertaMedicacao
    Alerta <|-- AlertaSinalVital
    Alerta <|-- AlertaTurnoVago
    Alerta <|-- AlertaConflito
    Alerta <|-- AlertaSobrecarga
    Alerta <|-- AlertaPedidoAjuda
    Alerta <|-- AlertaTarefa
```

## Regras de negócio puras (`service`)

Classes sem estado, com métodos estáticos, testadas por JUnit. Detalhes em [[Regras de Negócio]].

```mermaid
classDiagram
    direction LR
    class EscalaRegras {
        +conflitos(List~Turno~)$ List~Conflito~
        +conflitosIngenuo(List~Turno~)$ List~Conflito~
        +blocosSemFolga(List~Turno~)$ List~Bloco~
        +horasNaJanela(turnos, fim, dias)$ double
        +horasSeguidas(turnos, agora)$ double
        +nivel(horas7d, horasSeguidas)$ NivelSobrecarga
        +periodosDescobertos(turnos, de, ate)$ List~Intervalo~
        +sugerirCobertura(vago, turnosPorPessoa, agora)$ List~Long~
    }
    class Estatistica {
        +media(List)$ double
        +mediana(List)$ double
        +moda(List)$ double
        +desvioPadrao(List)$ double
        +coeficienteVariacao(List)$ double
        +mediaMovel(serie, janela)$ List
        +pearson(x, y)$ double
        +zScore(valor, historico)$ double
    }
    class DoseRegras {
        +status(previsto, dadaEm, naoDada, agora)$ StatusDose
        +podeRegistrar(StatusDose)$ boolean
    }
    class SinalVitalRegras {
        +foraDaFaixa(valor, faixa)$ boolean
        +foraDaCurva(valor, historico)$ boolean
    }
    class ZaritCalculadora {
        +pontuar(int[])$ int
        +faixa(int)$ FaixaZarit
    }
    class Limites {
        <<constantes>>
        FOLGA_MIN_HORAS = 11
        ALERTA_HORAS_SEMANA = 60
        DOSE_ATRASO_MIN = 30
        ZSCORE_LIMITE = 2.0
    }
    EscalaRegras ..> Limites
    DoseRegras ..> Limites
    SinalVitalRegras ..> Estatistica
    ZaritCalculadora ..> Limites
```

## Onde estão os conceitos de OO
| Conceito | Onde | Por quê |
|---|---|---|
| **Encapsulamento** | Todos os atributos são privados; os construtores e setters validam (ex.: `Turno` recusa fim antes do início; `Pessoa` recusa nome vazio) | O objeto nunca fica num estado inválido |
| **Herança** | `Pessoa` → `Cuidador`, `Paciente`; `RegraHorariosFixos` → `RegraDiasAlternados` | Reaproveitar o que é comum |
| **Classe abstrata** | `Pessoa`, `RegraHorario`, `Alerta` | Só existem objetos dos tipos concretos |
| **Polimorfismo** | `RegraHorario.horariosEntre()`, `Alerta.mensagem()`, `Pessoa.descricao()` | O serviço chama o mesmo método e cada tipo responde do seu jeito |
| **Método gancho** | `RegraHorariosFixos.valeNoDia()`, sobrescrito em `RegraDiasAlternados` | A subclasse troca só uma decisão |
| **Records** | `MembroRede`, `FaixaSinal`, DTOs da API | Dados imutáveis, sem código repetido |
| **Enums com dados** | `TipoSinal` (nome e unidade), `TipoAlerta` (prioridade) | Constantes com significado |

## Versão implementada, 14/11/2026

A compilação e os 64 testes confirmaram as classes de domínio e os serviços usados nas regras de escala, medicação, sinais, Zarit e estatística. O redesenho manteve as assinaturas Java e as chamadas descritas no [[API|Contrato da API]].
