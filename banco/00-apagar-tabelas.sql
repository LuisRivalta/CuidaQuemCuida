-- =====================================================================
-- CuidaQuemCuida — 00: apaga todas as tabelas (reset completo)
-- Para recomeçar do zero: rode 00, 01, 02 e 03, nesta ordem.
-- =====================================================================
DROP TABLE IF EXISTS auditoria       CASCADE;
DROP TABLE IF EXISTS alerta          CASCADE;
DROP TABLE IF EXISTS resposta_zarit  CASCADE;
DROP TABLE IF EXISTS avaliacao_zarit CASCADE;
DROP TABLE IF EXISTS execucao_tarefa CASCADE;
DROP TABLE IF EXISTS tarefa_cuidado  CASCADE;
DROP TABLE IF EXISTS faixa_sinal     CASCADE;
DROP TABLE IF EXISTS sinal_vital     CASCADE;
DROP TABLE IF EXISTS dose            CASCADE;
DROP TABLE IF EXISTS regra_horario   CASCADE;
DROP TABLE IF EXISTS medicamento     CASCADE;
DROP TABLE IF EXISTS turno           CASCADE;
DROP TABLE IF EXISTS sessao          CASCADE;
DROP TABLE IF EXISTS consentimento   CASCADE;
DROP TABLE IF EXISTS membro_rede     CASCADE;
DROP TABLE IF EXISTS paciente        CASCADE;
DROP TABLE IF EXISTS pessoa          CASCADE;
