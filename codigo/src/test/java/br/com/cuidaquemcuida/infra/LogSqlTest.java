package br.com.cuidaquemcuida.infra;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class LogSqlTest {

    @Test
    void guardaSoOsUltimosCinquentaComOMaisNovoPrimeiro() {
        for (int i = 1; i <= 60; i++) {
            LogSql.registrar("SELECT " + i, i);
        }
        assertEquals(50, LogSql.ultimos().size());
        assertEquals("SELECT 60", LogSql.ultimos().get(0).sql());
    }

    @Test
    void tipoEhAPrimeiraPalavraEmMaiusculas() {
        LogSql.registrar("  select 1", 1);
        assertEquals("SELECT", LogSql.ultimos().get(0).tipo());
    }

    @Test
    void espacosEQuebrasDeLinhaSaoCompactados() {
        LogSql.registrar("UPDATE dose\n   SET status = ?", 2);
        assertEquals("UPDATE dose SET status = ?", LogSql.ultimos().get(0).sql());
    }
}
