---
tipo: funcao
classe: Senha
tags: [funcao, seguranca]
---

# hash da senha

`static String Senha.hash(String senha, String saltBase64)` e `static boolean Senha.confere(String senha, String salt, String hash)` · classe [[Senha]] · [[Módulo Infraestrutura e Segurança]]

## O que faz
Transforma a senha num **hash PBKDF2-HMAC-SHA256** com **salt** aleatório de 16 bytes e **600.000 iterações** (recomendação da OWASP), usando só a biblioteca padrão do Java (`SecretKeyFactory`). A senha **nunca é gravada** e não pode ser lida de volta.
- O **salt** faz duas pessoas com a mesma senha terem hashes diferentes.
- As **600 mil iterações** deixam caro testar senhas por força bruta.
- `confere` compara em **tempo constante** (`MessageDigest.isEqual`), para não vazar informação pelo tempo de resposta.
- Conta excluída (hash vazio) **nunca** confere.

Conteúdo do curso: **Fase 3, cybersecurity e ISO 27000**.

```java
PBEKeySpec spec = new PBEKeySpec(senha.toCharArray(), Base64.getDecoder().decode(salt), 600_000, 256);
byte[] hash = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
```

## Testes
`SenhaTest` (6 testes). O principal confere que o hash de `demo1234` gravado nos dados de demonstração (`banco/03-dados-demo.sql`, gerado à parte) bate com a implementação Java.
