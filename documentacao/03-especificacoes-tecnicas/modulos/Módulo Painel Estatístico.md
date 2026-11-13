---
tipo: modulo
tags: [modulo, estatistica, painel]
---

# Módulo Painel Estatístico

**Para que serve:** mostrar ao coordenador, em números e gráficos **com interpretação em palavras**, como o cuidado está sendo feito e dividido. Caso de uso: UC07 ([[Casos de Uso]]). Detalhes dos indicadores: [[Estatística]].

| Camada | Onde |
|---|---|
| Tela | `web/js/telas/painel.js` (Chart.js; paleta validada para daltonismo; tabela alternativa) |
| Rota | `GET /api/pacientes/{id}/estatisticas?dias=30` (só coordenador) |
| Recurso | [[PacienteResource]] |
| Serviço | [[EstatisticaService]] |
| Cálculo no Java | [[Estatistica]]: [[mediaMovel]], [[desvioPadrao]], [[pearson]], média, mediana, moda |
| Cálculo no SQL | [[EstatisticaDao]]: `GROUP BY` com `COUNT(*) FILTER`, `JOIN`, `HAVING` com subconsulta, moda com `ORDER BY COUNT(*) DESC LIMIT 1` |
| Modelo | [[Periodo]] |

## Por que parte no SQL e parte no Java
Os **agrupamentos e totais** (adesão por remédio e por período, horas por pessoa, quem está acima da média) ficam onde o banco é bom: Fases 5 e 6. As medidas que dependem de **sequência ou de duas variáveis** (média móvel, correlação, chance condicional) ficam no Java, testadas por JUnit.

Testes: `EstatisticaTest` (8), `EstatisticaServiceTest` (3).
