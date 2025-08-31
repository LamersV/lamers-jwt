# @lamersv/jwt

Biblioteca TypeScript para **JSON Web Tokens (JWT)** com API direta para `sign`, `verify` e `decode`. Suporta **HS256** (HMAC) e **RS256** (RSA) e aceita *claims* e metadados padrão (exp, nbf, iat, aud, iss, sub), além de validações como tolerância de relógio e restrição de algoritmos. O tempo (`expiresIn`, `notBefore`) pode ser informado em **segundos** ou com sufixo (`"10s"`, `"5m"`, `"2h"`, `"7d"`, `"2w"`). Os erros são padronizados via `AuthError` do pacote `@lamersv/error`.

## Instalação

Publicado no GitHub Packages sob o escopo `@lamersv`. Configure a autenticação no `.npmrc` do seu projeto:

```
@lamersv:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Depois, instale com seu gerenciador de pacotes:

```
npm install @lamersv/jwt
```

```
yarn add @lamersv/jwt
```

```
pnpm add @lamersv/jwt
```

## Uso básico

```ts
import { sign, verify, decode } from '@lamersv/jwt';

// 1) Assinar (HS256 por padrão)
const token = sign(
  { userId: 123, role: 'admin' },
  'minha_chave_super_secreta',
  { expiresIn: '1h', notBefore: '10s', audience: 'api', issuer: 'lamersv', subject: 'acesso' }
);

// 2) Verificar e obter o payload (valida assinatura e claims)
const payload = verify(token, 'minha_chave_super_secreta', {
  audience: 'api',
  issuer: 'lamersv',
  subject: 'acesso',
  algorithms: ['HS256'],              // opcional: restringe algoritmos aceitos
  clockTolerance: 5                   // tolerância em segundos (opcional)
});

// 3) Decodificar sem verificar assinatura (apenas leitura do payload)
const raw = decode(token);            // NÃO valida assinatura — use verify() quando segurança for necessária
```

### RS256 (chave RSA)

```ts
import { sign, verify } from '@lamersv/jwt';

const privateKey = `-----BEGIN PRIVATE KEY-----
...chave privada PEM...
-----END PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
...chave pública PEM...
-----END PUBLIC KEY-----`;

// Assinar com RS256
const jwt = sign({ uid: 'abc' }, privateKey, { algorithm: 'RS256', keyid: 'kid-01', expiresIn: '2h' });

// Verificar com a chave pública
const data = verify(jwt, publicKey, { algorithms: ['RS256'] });
```

## Exemplos práticos

- **Controle fino de expiração e ativação**  
  Use números (segundos) ou strings com sufixo: `"30s"`, `"15m"`, `"12h"`, `"7d"`, `"2w"`.
  ```ts
  sign({ id: 1 }, 'secret', { expiresIn: 3600, notBefore: '30s' });
  ```

- **Cabeçalho com `kid` (Key ID)**  
  ```ts
  sign({ id: 1 }, privateKey, { algorithm: 'RS256', keyid: 'kid-prod-2025' });
  ```

- **Restrições de verificação**  
  ```ts
  verify(token, 'secret', { audience: 'api', issuer: 'lamersv', subject: 'auth', algorithms: ['HS256'] });
  ```

## Tratamento de erros

As funções lançam `AuthError` (de `@lamersv/error`) com mensagens claras para formato inválido, token expirado/inativo, emissor/audiência/assunto incorretos, ou algoritmo não suportado.

```ts
import { verify } from '@lamersv/jwt';
import { AuthError } from '@lamersv/error';

try {
  verify('token.invalido', 'secret');
} 
catch (e) {
  if (e instanceof AuthError) {
    console.error(e.message);
  } 
  else {
    console.error('Erro inesperado', e);
  }
}
```

## Mapa de exports

O pacote expõe apenas a entrada principal:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.js",
      "default": "./dist/index.js",
      "types": "./dist/types/index.d.ts"
    }
  }
}
```

## Licença

MIT. Consulte o arquivo de licença no repositório oficial. [LICENSE](./LICENSE)
