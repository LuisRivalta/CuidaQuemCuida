# Revisão do login, rodada 2 — 14/11/2026

| Heurística | Nota | Observação |
|---|---|---|
| Visibilidade do estado | 3 | Envio sinalizado e erro no formulário |
| Mundo real | 4 | Papéis da família e caminho do convite explícitos |
| Controle e liberdade | 3 | Senha pode ser exibida e permanência no aparelho é opcional |
| Consistência | 4 | Botão de senha mantém nome acessível alinhado com o texto |
| Prevenção de erros | 3 | Validação de campos e bloqueio de reenvio |
| Reconhecimento | 3 | Convite orientado abaixo do formulário |
| Flexibilidade | 4 | Sessão lembrada e atalhos da família |
| Estética | 3 | Marca inteira com fonte ampliada. Parte da demonstração fica abaixo da primeira tela |
| Recuperação de erros | 4 | Mensagem de credenciais inválidas e foco devolvido ao formulário |
| Ajuda | 3 | Instrução para convite disponível. Recuperação de senha no escopo futuro |
| **Total** | **34/40** | **Nenhum P0 ou P1 na revisão** |

O detector da Impeccable 0.1.24 retornou `[]` nos arquivos e no login renderizado a 390 × 844. As capturas cobrem dia, noite, tema escuro durante o dia, 1280 px, largura de 360 px com letra ampliada e viewport de 360 × 640. O navegador verificou e-mail vazio, credenciais inválidas, o botão de senha, a entrada como Paulo e a sessão com e sem persistência.

[[Redesenho - Tela Login]]
