-- =====================================================================
-- CuidaQuemCuida — 02: liga a segurança por linha (RLS) em todas as tabelas
--
-- Por quê: o Supabase expõe as tabelas do schema public por uma API
-- automática, acessível com a chave pública (anon). Com o RLS ligado e
-- NENHUMA política criada, essa API não lê nem grava nada.
--
-- O sistema não usa essa API: todo acesso passa pela aplicação Java, via
-- JDBC, com o usuário dono das tabelas (postgres). O dono da tabela não é
-- afetado pelo RLS, então a aplicação continua funcionando normalmente.
-- =====================================================================
ALTER TABLE pessoa          ENABLE ROW LEVEL SECURITY;
ALTER TABLE paciente        ENABLE ROW LEVEL SECURITY;
ALTER TABLE membro_rede     ENABLE ROW LEVEL SECURITY;
ALTER TABLE consentimento   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessao          ENABLE ROW LEVEL SECURITY;
ALTER TABLE turno           ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicamento     ENABLE ROW LEVEL SECURITY;
ALTER TABLE regra_horario   ENABLE ROW LEVEL SECURITY;
ALTER TABLE dose            ENABLE ROW LEVEL SECURITY;
ALTER TABLE sinal_vital     ENABLE ROW LEVEL SECURITY;
ALTER TABLE faixa_sinal     ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefa_cuidado  ENABLE ROW LEVEL SECURITY;
ALTER TABLE execucao_tarefa ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacao_zarit ENABLE ROW LEVEL SECURITY;
ALTER TABLE resposta_zarit  ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerta          ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria       ENABLE ROW LEVEL SECURITY;
