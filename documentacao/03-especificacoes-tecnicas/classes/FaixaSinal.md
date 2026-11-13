---
tipo: record
camada: model
arquivo: codigo/src/main/java/br/com/cuidaquemcuida/model/FaixaSinal.java
tags: [classe, model]
---

# FaixaSinal

**Record** da camada **Modelo do domínio** · `codigo/src/main/java/br/com/cuidaquemcuida/model/FaixaSinal.java`

## Para que serve
Faixa de alerta de um sinal vital, configurada por paciente. Mínimo ou máximo podem ficar em branco.

Faz parte do [[Módulo Sinais Vitais]].

Declaração: `record FaixaSinal (long pacienteId, TipoSinal tipo, Double minimo, Double maximo)`

## Usa
[[TipoSinal]]

## É usada por
[[SinalVitalDao]], [[SinalVitalRegras]], [[SinalVitalService]]

## Conceito do curso
Record com validação no construtor compacto

---
Ver também: [[Mapa do Código]] · [[Diagrama de Classes]] · [[Arquitetura]]
