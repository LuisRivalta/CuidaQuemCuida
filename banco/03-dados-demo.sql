-- =====================================================================
-- CuidaQuemCuida — 03: dados de demonstração (simulados)
--
-- Uma família fictícia que conta a história do problema:
--   Lurdes Souza (82, Alzheimer) é cuidada pela filha Marta (coordenadora),
--   pelo filho Paulo, pela neta Ana e pelo vizinho João.
--   Marta carrega ~60% da carga, quase sem folga; domingo à noite fica vago.
--
-- Determinístico: sem random(). As datas são relativas a CURRENT_DATE,
-- então o histórico sempre termina "hoje" quando o script é rodado de novo.
-- Logins: marta@demo.cqc, paulo@demo.cqc, ana@demo.cqc, joao@demo.cqc
-- Senha de todos: demo1234 (hash PBKDF2-HMAC-SHA256, 600000 iterações)
-- =====================================================================
SET TIME ZONE 'America/Sao_Paulo';

-- ---------------------------------------------------------------- pessoas
INSERT INTO pessoa (id, nome, email, senha_hash, senha_salt, data_nascimento, genero, criado_em) VALUES
 (1, 'Marta Souza',  'marta@demo.cqc', 'HYiTUFXn9j8PWCQE/8wRFPRjfy2bPppx9A3ZYuEVsO0=', 'N6O0/N80LispSj5n8g5ZGg==', DATE '1968-03-10', 'FEMININO',  CURRENT_DATE - 31),
 (2, 'Paulo Souza',  'paulo@demo.cqc', 'HYiTUFXn9j8PWCQE/8wRFPRjfy2bPppx9A3ZYuEVsO0=', 'N6O0/N80LispSj5n8g5ZGg==', DATE '1972-07-22', 'MASCULINO', CURRENT_DATE - 31),
 (3, 'Ana Souza',    'ana@demo.cqc',   'HYiTUFXn9j8PWCQE/8wRFPRjfy2bPppx9A3ZYuEVsO0=', 'N6O0/N80LispSj5n8g5ZGg==', DATE '2002-01-15', 'FEMININO',  CURRENT_DATE - 31),
 (4, 'João Pereira', 'joao@demo.cqc',  'HYiTUFXn9j8PWCQE/8wRFPRjfy2bPppx9A3ZYuEVsO0=', 'N6O0/N80LispSj5n8g5ZGg==', DATE '1959-09-03', 'MASCULINO', CURRENT_DATE - 31);

-- --------------------------------------------------------------- paciente
INSERT INTO paciente (id, nome, data_nascimento, condicao, precisa_24h, observacoes,
                      responsavel_nome, responsavel_parentesco, codigo_convite, criado_em) VALUES
 (1, 'Lurdes Souza', DATE '1944-08-21', 'Alzheimer moderado, acamada parcialmente', TRUE,
  'Alergia a dipirona. Usa fralda. Precisa de ajuda para se alimentar.',
  'Marta Souza', 'Filha', 'LURD26', CURRENT_DATE - 31);

-- ------------------------------------------------------- rede de cuidado
INSERT INTO membro_rede (pessoa_id, paciente_id, papel, vinculo, compartilha_zarit, desde) VALUES
 (1, 1, 'COORDENADOR', 'FAMILIAR', TRUE, CURRENT_DATE - 31),
 (2, 1, 'MEMBRO',      'FAMILIAR', TRUE, CURRENT_DATE - 31),
 (3, 1, 'MEMBRO',      'FAMILIAR', TRUE, CURRENT_DATE - 31),
 (4, 1, 'MEMBRO',      'VIZINHO',  TRUE, CURRENT_DATE - 31);

INSERT INTO consentimento (pessoa_id, paciente_id, tipo, versao_termo, responsavel_nome, aceito_em) VALUES
 (1, NULL, 'TERMO_USUARIO',  '1.0', NULL,          CURRENT_DATE - 31),
 (2, NULL, 'TERMO_USUARIO',  '1.0', NULL,          CURRENT_DATE - 31),
 (3, NULL, 'TERMO_USUARIO',  '1.0', NULL,          CURRENT_DATE - 31),
 (4, NULL, 'TERMO_USUARIO',  '1.0', NULL,          CURRENT_DATE - 31),
 (1, 1,    'DADOS_PACIENTE', '1.0', 'Marta Souza', CURRENT_DATE - 31);

-- ------------------------------------------------------------------ escala
-- Padrão semanal (isodow: 1=segunda ... 7=domingo), de 30 dias atrás até 7 dias à frente:
--   06-14  Marta todos os dias
--   14-22  Paulo seg/qua/sex · Ana ter/qui · Marta sáb/dom
--   22-06  Marta seg/ter/qua · João qui · Ana sex · Paulo sáb · DOMINGO VAGO
INSERT INTO turno (paciente_id, pessoa_id, inicio, fim, status)
SELECT 1, t.pessoa, t.ini, t.fim,
       CASE WHEN t.fim <= LOCALTIMESTAMP THEN 'REALIZADO' ELSE 'PLANEJADO' END
FROM (SELECT (CURRENT_DATE - 30 + i) AS dia, extract(isodow FROM CURRENT_DATE - 30 + i)::int AS dow
      FROM generate_series(0, 37) AS i) d
CROSS JOIN LATERAL (VALUES
   (1,
    d.dia + TIME '06:00', d.dia + TIME '14:00'),
   (CASE WHEN d.dow IN (1, 3, 5) THEN 2 WHEN d.dow IN (2, 4) THEN 3 ELSE 1 END,
    d.dia + TIME '14:00', d.dia + TIME '22:00'),
   (CASE d.dow WHEN 1 THEN 1 WHEN 2 THEN 1 WHEN 3 THEN 1 WHEN 4 THEN 4 WHEN 5 THEN 3 WHEN 6 THEN 2 ELSE NULL END,
    d.dia + TIME '22:00', (d.dia + 1) + TIME '06:00')
) AS t(pessoa, ini, fim)
WHERE t.pessoa IS NOT NULL;

-- ------------------------------------------------- medicamentos e regras
INSERT INTO medicamento (id, paciente_id, nome, dosagem, via, instrucoes) VALUES
 (1, 1, 'Losartana',   '50 mg',     'Oral', 'Para a pressão. Com água.'),
 (2, 1, 'Donepezila',  '10 mg',     'Oral', 'Para a memória. Antes de dormir.'),
 (3, 1, 'Omeprazol',   '20 mg',     'Oral', 'Em jejum, 30 minutos antes do café.'),
 (4, 1, 'Vitamina D',  '7.000 UI',  'Oral', 'Dia sim, dia não. Junto com uma refeição.'),
 (5, 1, 'Amoxicilina', '500 mg',    'Oral', 'Antibiótico de 8 em 8 horas. Não pular doses.');

INSERT INTO regra_horario (medicamento_id, tipo, intervalo_horas, primeira_dose, horarios, inicio, fim) VALUES
 (1, 'HORARIOS_FIXOS',  NULL, NULL,         '08:00;20:00', CURRENT_DATE - 30, NULL),
 (2, 'HORARIOS_FIXOS',  NULL, NULL,         '20:00',       CURRENT_DATE - 30, NULL),
 (3, 'HORARIOS_FIXOS',  NULL, NULL,         '07:00',       CURRENT_DATE - 30, NULL),
 (4, 'DIAS_ALTERNADOS', NULL, NULL,         '09:00',       CURRENT_DATE - 30, NULL),
 (5, 'INTERVALO',       8,    TIME '06:00', NULL,          CURRENT_DATE - 6,  CURRENT_DATE + 1);

-- ------------------------------------------------------------------ doses
-- Status por uma regra fixa (k = (dia_do_ano*7 + medicamento*13 + hora) % 20):
--   futura -> PENDENTE · ninguém no turno -> NAO_DADA · k = 0 -> NAO_DADA (recusou)
--   k < 3, ou k < 5 às 20h/22h -> ATRASADA (45 a 89 min) · resto -> DADA (0 a 20 min)
WITH dias AS (
    SELECT (CURRENT_DATE - 30 + i) AS dia FROM generate_series(0, 30) AS i
), prev AS (
    SELECT 1 AS med, dia + TIME '08:00' AS previsto FROM dias
    UNION ALL SELECT 1, dia + TIME '20:00' FROM dias
    UNION ALL SELECT 2, dia + TIME '20:00' FROM dias
    UNION ALL SELECT 3, dia + TIME '07:00' FROM dias
    UNION ALL SELECT 4, dia + TIME '09:00' FROM dias WHERE (dia - (CURRENT_DATE - 30)) % 2 = 0
    UNION ALL SELECT 5, (CURRENT_DATE - 6) + TIME '06:00' + k * INTERVAL '8 hours' FROM generate_series(0, 23) AS k
)
INSERT INTO dose (medicamento_id, previsto_para, dada_em, dada_por, status, observacao)
SELECT p.med, p.previsto,
       CASE WHEN p.previsto > LOCALTIMESTAMP OR t.pessoa_id IS NULL OR s.k = 0 THEN NULL
            WHEN s.k < 3 OR (s.h IN (20, 22) AND s.k < 5) THEN p.previsto + make_interval(mins => 45 + (s.k * 11) % 45)
            ELSE p.previsto + make_interval(mins => (s.doy + p.med) % 21) END,
       CASE WHEN p.previsto > LOCALTIMESTAMP THEN NULL ELSE t.pessoa_id END,
       CASE WHEN p.previsto > LOCALTIMESTAMP THEN 'PENDENTE'
            WHEN t.pessoa_id IS NULL OR s.k = 0 THEN 'NAO_DADA'
            WHEN s.k < 3 OR (s.h IN (20, 22) AND s.k < 5) THEN 'ATRASADA'
            ELSE 'DADA' END,
       CASE WHEN p.previsto > LOCALTIMESTAMP THEN NULL
            WHEN t.pessoa_id IS NULL THEN 'Ninguém na escala neste horário'
            WHEN s.k = 0 THEN 'Recusou o remédio'
            ELSE NULL END
FROM prev p
CROSS JOIN LATERAL (
    SELECT extract(hour FROM p.previsto)::int AS h,
           extract(doy  FROM p.previsto)::int AS doy,
           (extract(doy FROM p.previsto)::int * 7 + p.med * 13 + extract(hour FROM p.previsto)::int) % 20 AS k
) s
LEFT JOIN LATERAL (
    SELECT pessoa_id FROM turno
    WHERE paciente_id = 1 AND inicio <= p.previsto AND fim > p.previsto
    LIMIT 1
) t ON TRUE;

-- ------------------------------------------------------- faixas de alerta
INSERT INTO faixa_sinal (paciente_id, tipo, minimo, maximo) VALUES
 (1, 'PRESSAO',             90,  150),
 (1, 'GLICEMIA',            70,  180),
 (1, 'TEMPERATURA',         35.5, 37.8),
 (1, 'SATURACAO',           92,  100),
 (1, 'FREQUENCIA_CARDIACA', 50,  110);

-- ---------------------------------------------------------- sinais vitais
-- Pressão às 10:00 e glicemia às 07:30 (turno da Marta), variação fixa pelo dia.
INSERT INTO sinal_vital (paciente_id, tipo, valor, valor2, medido_em, medido_por)
SELECT 1, 'PRESSAO',
       125 + (extract(doy FROM dia)::int * 7) % 11,
       78  + (extract(doy FROM dia)::int * 3) % 8,
       dia + TIME '10:00', 1
FROM (SELECT (CURRENT_DATE - 30 + i) AS dia FROM generate_series(0, 30) AS i) d
WHERE dia + TIME '10:00' <= LOCALTIMESTAMP
  AND dia <> CURRENT_DATE - 2;

-- O ponto fora da curva: pressão alta há 2 dias
INSERT INTO sinal_vital (paciente_id, tipo, valor, valor2, medido_em, medido_por) VALUES
 (1, 'PRESSAO', 175, 100, (CURRENT_DATE - 2) + TIME '10:00', 1);

INSERT INTO sinal_vital (paciente_id, tipo, valor, valor2, medido_em, medido_por)
SELECT 1, 'GLICEMIA', 95 + (extract(doy FROM dia)::int * 13) % 36, NULL, dia + TIME '07:30', 1
FROM (SELECT (CURRENT_DATE - 30 + i) AS dia FROM generate_series(0, 30) AS i) d
WHERE dia + TIME '07:30' <= LOCALTIMESTAMP;

-- ------------------------------------------------------ tarefas de cuidado
INSERT INTO tarefa_cuidado (id, paciente_id, titulo, orientacao, recorrencia_horas, primeira_vez, tipo_sinal) VALUES
 (1, 1, 'Mudar de posição',
  'Vire a pessoa de lado, alternando direita, costas e esquerda. Coloque um travesseiro entre os joelhos e confira calcanhares, quadril e lombar: pele vermelha que não clareia ao apertar é sinal de escara começando.',
  2, TIME '06:00', NULL),
 (2, 1, 'Oferecer água',
  'Ofereça meio copo de água em pequenos goles, com a pessoa sentada ou com a cabeceira elevada. Idosos com Alzheimer muitas vezes não sentem sede.',
  3, TIME '07:00', NULL),
 (3, 1, 'Higiene e troca',
  'Banho no leito ou de chuveiro com cadeira, troca de fralda e hidratação da pele com creme. Mantenha a pele seca nas dobras.',
  24, TIME '08:00', NULL),
 (4, 1, 'Medir pressão',
  'Com a pessoa sentada ou deitada há 5 minutos, braço apoiado na altura do coração. Anote os dois números.',
  24, TIME '10:00', 'PRESSAO'),
 (5, 1, 'Medir glicemia',
  'Lave e seque o dedo, use a lateral da ponta do dedo e registre o valor do aparelho.',
  24, TIME '07:30', 'GLICEMIA');

-- Execuções dos últimos 3 dias e de hoje (até agora).
-- Horários de cada dia: primeira_vez + k * recorrencia (módulo 24 h), inclusive de madrugada.
-- Uma ou outra fica sem fazer: (dia_do_ano + tarefa*5 + hora) % 9 = 0, ou ninguém no turno.
WITH ocorrencias AS (
    SELECT DISTINCT tc.id AS tarefa_id,
           dia + make_interval(mins => ((extract(hour FROM tc.primeira_vez)::int * 60
                                         + extract(minute FROM tc.primeira_vez)::int
                                         + k * tc.recorrencia_horas * 60) % 1440)) AS prevista
    FROM tarefa_cuidado tc
    CROSS JOIN (SELECT (CURRENT_DATE - 3 + i) AS dia FROM generate_series(0, 3) AS i) d
    CROSS JOIN generate_series(0, 23) AS k
    WHERE k * tc.recorrencia_horas < 24
)
INSERT INTO execucao_tarefa (tarefa_id, prevista_para, feita_em, feita_por)
SELECT o.tarefa_id, o.prevista,
       CASE WHEN o.prevista > LOCALTIMESTAMP OR t.pessoa_id IS NULL
                 OR (extract(doy FROM o.prevista)::int + o.tarefa_id * 5 + extract(hour FROM o.prevista)::int) % 9 = 0
            THEN NULL ELSE o.prevista + INTERVAL '10 minutes' END,
       CASE WHEN o.prevista > LOCALTIMESTAMP OR t.pessoa_id IS NULL
                 OR (extract(doy FROM o.prevista)::int + o.tarefa_id * 5 + extract(hour FROM o.prevista)::int) % 9 = 0
            THEN NULL ELSE t.pessoa_id END
FROM ocorrencias o
LEFT JOIN LATERAL (
    SELECT pessoa_id FROM turno
    WHERE paciente_id = 1 AND inicio <= o.prevista AND fim > o.prevista
    LIMIT 1
) t ON TRUE;

-- --------------------------------------------------------- Escala Zarit
-- Duas avaliações por pessoa (20 e 6 dias atrás). Quem faz mais noites tem mais sobrecarga.
INSERT INTO avaliacao_zarit (id, pessoa_id, respondida_em, pontuacao, faixa, horas_sono, qualidade_sono) VALUES
 (1, 1, (CURRENT_DATE - 20) + TIME '21:00', 30, 'ALTA',     5.0, 2),
 (2, 1, (CURRENT_DATE - 6)  + TIME '21:00', 34, 'ALTA',     4.5, 1),
 (3, 3, (CURRENT_DATE - 20) + TIME '21:30', 14, 'MODERADA', 6.5, 3),
 (4, 3, (CURRENT_DATE - 6)  + TIME '21:30', 15, 'MODERADA', 6.5, 3),
 (5, 2, (CURRENT_DATE - 20) + TIME '22:00', 11, 'MODERADA', 7.0, 4),
 (6, 2, (CURRENT_DATE - 6)  + TIME '22:00', 12, 'MODERADA', 7.0, 4),
 (7, 4, (CURRENT_DATE - 20) + TIME '20:00',  7, 'BAIXA',    7.5, 5),
 (8, 4, (CURRENT_DATE - 6)  + TIME '20:00',  6, 'BAIXA',    7.0, 4);

INSERT INTO resposta_zarit (avaliacao_id, item, valor)
SELECT a.id, r.item::int, r.valor
FROM (VALUES
  (1, ARRAY[3,3,2,3,2,3,2,3,2,3,2,2]),
  (2, ARRAY[3,3,3,3,3,3,3,3,2,3,2,3]),
  (3, ARRAY[1,2,1,1,2,1,1,1,1,1,1,1]),
  (4, ARRAY[1,2,1,2,2,1,1,1,1,1,1,1]),
  (5, ARRAY[1,1,1,1,1,1,1,1,1,1,1,0]),
  (6, ARRAY[1,1,1,1,1,1,1,1,1,1,1,1]),
  (7, ARRAY[1,1,1,1,1,1,1,0,0,0,0,0]),
  (8, ARRAY[1,1,1,1,1,1,0,0,0,0,0,0])
) AS a(id, respostas)
CROSS JOIN LATERAL unnest(a.respostas) WITH ORDINALITY AS r(valor, item);

-- --------------------------------------- acerta as sequências dos ids fixos
SELECT setval(pg_get_serial_sequence('pessoa', 'id'),          (SELECT max(id) FROM pessoa));
SELECT setval(pg_get_serial_sequence('paciente', 'id'),        (SELECT max(id) FROM paciente));
SELECT setval(pg_get_serial_sequence('medicamento', 'id'),     (SELECT max(id) FROM medicamento));
SELECT setval(pg_get_serial_sequence('tarefa_cuidado', 'id'),  (SELECT max(id) FROM tarefa_cuidado));
SELECT setval(pg_get_serial_sequence('avaliacao_zarit', 'id'), (SELECT max(id) FROM avaliacao_zarit));
