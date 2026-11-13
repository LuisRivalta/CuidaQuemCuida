-- =====================================================================
-- CuidaQuemCuida — 01: criação das tabelas
-- Rodar depois do 00-apagar-tabelas.sql. PostgreSQL (Supabase).
-- Modelo descrito em documentacao/01-diagramas/Diagrama do Banco.md
-- =====================================================================
SET TIME ZONE 'America/Sao_Paulo';

-- Pessoas com login (cuidador principal, familiares, vizinhos)
CREATE TABLE pessoa (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(120) NOT NULL,
    email           VARCHAR(160) NOT NULL UNIQUE,
    senha_hash      VARCHAR(64)  NOT NULL,          -- PBKDF2-HMAC-SHA256, Base64
    senha_salt      VARCHAR(32)  NOT NULL,          -- 16 bytes, Base64
    telefone        VARCHAR(20),
    data_nascimento DATE,
    genero          VARCHAR(20) CHECK (genero IN ('FEMININO','MASCULINO','OUTRO','NAO_INFORMAR')),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,  -- FALSE = conta excluída (anonimizada)
    criado_em       TIMESTAMP NOT NULL DEFAULT now()
);

-- Pessoa cuidada (não tem login)
CREATE TABLE paciente (
    id                     BIGSERIAL PRIMARY KEY,
    nome                   VARCHAR(120) NOT NULL,
    data_nascimento        DATE,
    condicao               VARCHAR(200),
    precisa_24h            BOOLEAN NOT NULL DEFAULT FALSE,
    observacoes            TEXT,
    responsavel_nome       VARCHAR(120) NOT NULL,   -- responsável legal (LGPD art. 11)
    responsavel_parentesco VARCHAR(40)  NOT NULL,
    codigo_convite         CHAR(6)      NOT NULL UNIQUE,
    criado_em              TIMESTAMP NOT NULL DEFAULT now()
);

-- Associativa N:N pessoa x paciente: quem faz parte da rede de cuidado
CREATE TABLE membro_rede (
    pessoa_id          BIGINT NOT NULL REFERENCES pessoa(id),
    paciente_id        BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
    papel              VARCHAR(12) NOT NULL CHECK (papel IN ('COORDENADOR','MEMBRO')),
    vinculo            VARCHAR(10) NOT NULL CHECK (vinculo IN ('FAMILIAR','VIZINHO','AMIGO','OUTRO')),
    ativo              BOOLEAN NOT NULL DEFAULT TRUE,
    compartilha_zarit  BOOLEAN NOT NULL DEFAULT FALSE, -- consentimento: pontuação visível ao coordenador
    desde              TIMESTAMP NOT NULL DEFAULT now(),
    PRIMARY KEY (pessoa_id, paciente_id)
);

-- Registro dos consentimentos (termo do usuário e dados do paciente)
CREATE TABLE consentimento (
    id               BIGSERIAL PRIMARY KEY,
    pessoa_id        BIGINT NOT NULL REFERENCES pessoa(id),
    paciente_id      BIGINT REFERENCES paciente(id) ON DELETE CASCADE,
    tipo             VARCHAR(16) NOT NULL CHECK (tipo IN ('TERMO_USUARIO','DADOS_PACIENTE')),
    versao_termo     VARCHAR(10) NOT NULL,
    responsavel_nome VARCHAR(120),
    aceito_em        TIMESTAMP NOT NULL DEFAULT now()
);

-- Sessões de login (token enviado no cabeçalho Authorization)
CREATE TABLE sessao (
    token     VARCHAR(64) PRIMARY KEY,
    pessoa_id BIGINT NOT NULL REFERENCES pessoa(id) ON DELETE CASCADE,
    expira_em TIMESTAMP NOT NULL
);

-- Escala de revezamento (pessoa_id NULL = turno vago)
CREATE TABLE turno (
    id          BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
    pessoa_id   BIGINT REFERENCES pessoa(id),
    inicio      TIMESTAMP NOT NULL,
    fim         TIMESTAMP NOT NULL,
    status      VARCHAR(10) NOT NULL DEFAULT 'PLANEJADO' CHECK (status IN ('PLANEJADO','REALIZADO','CANCELADO')),
    CHECK (fim > inicio)
);

CREATE TABLE medicamento (
    id          BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
    nome        VARCHAR(120) NOT NULL,
    dosagem     VARCHAR(60),
    via         VARCHAR(40),
    instrucoes  VARCHAR(300),
    ativo       BOOLEAN NOT NULL DEFAULT TRUE
);

-- Regra de horário do medicamento (uma por medicamento)
CREATE TABLE regra_horario (
    id              BIGSERIAL PRIMARY KEY,
    medicamento_id  BIGINT NOT NULL UNIQUE REFERENCES medicamento(id) ON DELETE CASCADE,
    tipo            VARCHAR(16) NOT NULL CHECK (tipo IN ('INTERVALO','HORARIOS_FIXOS','DIAS_ALTERNADOS')),
    intervalo_horas INT CHECK (intervalo_horas BETWEEN 1 AND 24),
    primeira_dose   TIME,
    horarios        VARCHAR(100),                  -- formato 08:00;20:00
    inicio          DATE NOT NULL,
    fim             DATE
);

-- Doses previstas e o que aconteceu com cada uma
CREATE TABLE dose (
    id             BIGSERIAL PRIMARY KEY,
    medicamento_id BIGINT NOT NULL REFERENCES medicamento(id) ON DELETE CASCADE,
    previsto_para  TIMESTAMP NOT NULL,
    dada_em        TIMESTAMP,
    dada_por       BIGINT REFERENCES pessoa(id),
    status         VARCHAR(10) NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE','DADA','ATRASADA','NAO_DADA')),
    observacao     VARCHAR(200),
    UNIQUE (medicamento_id, previsto_para)          -- impede dose duplicada
);

CREATE TABLE sinal_vital (
    id          BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
    tipo        VARCHAR(20) NOT NULL CHECK (tipo IN ('PRESSAO','GLICEMIA','TEMPERATURA','SATURACAO','FREQUENCIA_CARDIACA')),
    valor       NUMERIC(6,2) NOT NULL CHECK (valor > 0), -- na pressão: sistólica
    valor2      NUMERIC(6,2),                            -- na pressão: diastólica
    medido_em   TIMESTAMP NOT NULL,
    medido_por  BIGINT REFERENCES pessoa(id)
);

CREATE TABLE faixa_sinal (
    paciente_id BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
    tipo        VARCHAR(20) NOT NULL CHECK (tipo IN ('PRESSAO','GLICEMIA','TEMPERATURA','SATURACAO','FREQUENCIA_CARDIACA')),
    minimo      NUMERIC(6,2),
    maximo      NUMERIC(6,2),
    PRIMARY KEY (paciente_id, tipo)
);

-- Protocolo de cuidado (tipo_sinal preenchido = tarefa de medição)
CREATE TABLE tarefa_cuidado (
    id                BIGSERIAL PRIMARY KEY,
    paciente_id       BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
    titulo            VARCHAR(120) NOT NULL,
    orientacao        TEXT,
    recorrencia_horas INT NOT NULL CHECK (recorrencia_horas BETWEEN 1 AND 24),
    primeira_vez      TIME NOT NULL,
    tipo_sinal        VARCHAR(20) CHECK (tipo_sinal IN ('PRESSAO','GLICEMIA','TEMPERATURA','SATURACAO','FREQUENCIA_CARDIACA')),
    ativa             BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE execucao_tarefa (
    id            BIGSERIAL PRIMARY KEY,
    tarefa_id     BIGINT NOT NULL REFERENCES tarefa_cuidado(id) ON DELETE CASCADE,
    prevista_para TIMESTAMP NOT NULL,
    feita_em      TIMESTAMP,
    feita_por     BIGINT REFERENCES pessoa(id),
    UNIQUE (tarefa_id, prevista_para)
);

-- Escala Zarit (ZBI-12) do cuidador — dado privado
CREATE TABLE avaliacao_zarit (
    id             BIGSERIAL PRIMARY KEY,
    pessoa_id      BIGINT NOT NULL REFERENCES pessoa(id) ON DELETE CASCADE,
    respondida_em  TIMESTAMP NOT NULL DEFAULT now(),
    pontuacao      INT NOT NULL CHECK (pontuacao BETWEEN 0 AND 48),
    faixa          VARCHAR(10) NOT NULL CHECK (faixa IN ('BAIXA','MODERADA','ALTA')),
    horas_sono     NUMERIC(4,1),
    qualidade_sono INT CHECK (qualidade_sono BETWEEN 1 AND 5)
);

CREATE TABLE resposta_zarit (
    avaliacao_id BIGINT NOT NULL REFERENCES avaliacao_zarit(id) ON DELETE CASCADE,
    item         INT NOT NULL CHECK (item BETWEEN 1 AND 12),
    valor        INT NOT NULL CHECK (valor BETWEEN 0 AND 4),
    PRIMARY KEY (avaliacao_id, item)
);

-- Alertas calculados na hora e guardados para controlar o "lido"
CREATE TABLE alerta (
    id              BIGSERIAL PRIMARY KEY,
    paciente_id     BIGINT NOT NULL REFERENCES paciente(id) ON DELETE CASCADE,
    destinatario_id BIGINT NOT NULL REFERENCES pessoa(id) ON DELETE CASCADE,
    tipo            VARCHAR(20) NOT NULL CHECK (tipo IN ('DOSE_PROXIMA','DOSE_ATRASADA','DOSE_NAO_DADA','TAREFA_ATRASADA',
                                                         'SINAL_FORA_FAIXA','SINAL_FORA_CURVA','TURNO_VAGO',
                                                         'CONFLITO_TURNO','SOBRECARGA','PEDIDO_AJUDA')),
    referencia      VARCHAR(60)  NOT NULL,          -- ex.: dose:301, turno:11, zarit:12
    mensagem        VARCHAR(200) NOT NULL,
    prioridade      INT NOT NULL,
    criado_em       TIMESTAMP NOT NULL DEFAULT now(),
    lido_em         TIMESTAMP,
    UNIQUE (tipo, referencia, destinatario_id)
);

-- Auditoria: quem alterou o quê e quando (guardar 6 meses)
CREATE TABLE auditoria (
    id          BIGSERIAL PRIMARY KEY,
    pessoa_id   BIGINT REFERENCES pessoa(id),
    acao        VARCHAR(8) NOT NULL CHECK (acao IN ('INSERIR','ALTERAR','EXCLUIR','LOGIN')),
    tabela      VARCHAR(40) NOT NULL,
    registro_id BIGINT,
    quando      TIMESTAMP NOT NULL DEFAULT now(),
    detalhe     VARCHAR(300)
);

-- Índices das buscas mais comuns
CREATE INDEX idx_turno_paciente_inicio ON turno (paciente_id, inicio);
CREATE INDEX idx_turno_pessoa_inicio   ON turno (pessoa_id, inicio);
CREATE INDEX idx_dose_previsto         ON dose (previsto_para);
CREATE INDEX idx_sinal_paciente_tipo   ON sinal_vital (paciente_id, tipo, medido_em);
CREATE INDEX idx_alerta_destinatario   ON alerta (destinatario_id, lido_em);
CREATE INDEX idx_execucao_prevista     ON execucao_tarefa (prevista_para);
