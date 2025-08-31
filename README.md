# SIEG-AD/JWT

Uma biblioteca minimalista e segura para criar, verificar e decodificar JWTs usando apenas módulos nativos do Node.js. Sem dependências externas.

## ✨ Destaques

- 🔒 Suporte aos algoritmos HS256 (HMAC) e RS256 (RSA)
- ⚡ Sem dependências externas
- 📦 Ideal para projetos TypeScript ou JavaScript
- 🗝️ Suporte a chave pública/privada (RS256)
- ⏱️ Suporte a `exp`, `nbf`, `iat`, `aud`, `iss`, `sub`
- 🪶 Leve, auditável e fácil de manter

## 📦 Instalação

```bash
npm install @lamersv/jwt
```

## 🚀 Uso

### Geração de token

```ts
import { sign } from '@lamersv/jwt';

const payload = { userId: 123 };

const token = sign(payload, privateKey, {
  algorithm: 'RS256',
  expiresIn: '1h',           // Também aceita número (segundos)
  issuer: 'sua-api',
  audience: 'seus-clientes',
  subject: '123',
  keyid: 'main-key'
});
```

### Verificação de token

```ts
import { verify } from '@lamersv/jwt';

const decoded = verify(token, publicKey, {
  issuer: 'sua-api',
  audience: 'seus-clientes',
  algorithms: ['RS256']
});
```

### Decodificação sem validação

```ts
import { decode } from '@lamersv/jwt';

const data = decode(token);
```

## 🔧 Algoritmos Suportados

- `HS256` – Assinatura com segredo simétrico (HMAC)
- `RS256` – Assinatura com chave privada RSA e verificação com chave pública

## ⏳ Formatos aceitos para `expiresIn` e `notBefore`

Você pode usar strings como:

- `'10s'` – 10 segundos
- `'15m'` – 15 minutos
- `'2h'` – 2 horas
- `'1d'` – 1 dia

Ou fornecer número em segundos diretamente.

## 🛡️ Segurança

- Toda a criptografia é feita com `crypto` do Node.js
- Nenhuma dependência externa
- Totalmente auditável e leve

## 📜 Licença

Este projeto está licenciado sob a licença MIT. Veja [LICENSE](./LICENSE) para mais detalhes.
