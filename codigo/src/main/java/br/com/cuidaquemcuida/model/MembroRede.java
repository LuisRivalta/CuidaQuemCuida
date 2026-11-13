package br.com.cuidaquemcuida.model;

/**
 * Participação de uma pessoa na rede de cuidado de um paciente (associativa N:N, tabela {@code membro_rede}).
 * {@code compartilhaZarit}: consentimento para a pontuação Zarit entrar no painel do coordenador.
 */
public record MembroRede(long pessoaId, long pacienteId, Papel papel, Vinculo vinculo, boolean ativo, boolean compartilhaZarit) {

    public boolean coordenador() {
        return ativo && papel == Papel.COORDENADOR;
    }
}
