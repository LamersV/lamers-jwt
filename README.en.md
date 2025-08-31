# @lamersv/jwt

TypeScript library for **JSON Web Tokens (JWT)** with a straightforward API: `sign`, `verify`, and `decode`. Supports **HS256** (HMAC) and **RS256** (RSA), standard claims (`exp`, `nbf`, `iat`, `aud`, `iss`, `sub`), algorithm restrictions, and clock tolerance. Durations (`expiresIn`, `notBefore`) accept **seconds** or strings like `"10s"`, `"5m"`, `"2h"`, `"7d"`, `"2w"`. Errors are normalized through `AuthError` from `@lamersv/error`.

## Installation

Published on GitHub Packages under the `@lamersv` scope. Configure your project `.npmrc`:

```
@lamersv:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install with your preferred manager:

```
npm install @lamersv/jwt
```

```
yarn add @lamersv/jwt
```

```
pnpm add @lamersv/jwt
```

## Quick start

```ts
import { sign, verify, decode } from '@lamersv/jwt';

// 1) Sign (HS256 by default)
const token = sign(
  { userId: 123, role: 'admin' },
  'my_super_secret_key',
  { expiresIn: '1h', notBefore: '10s', audience: 'api', issuer: 'lamersv', subject: 'access' }
);

// 2) Verify & return payload (signature and claims are validated)
const payload = verify(token, 'my_super_secret_key', {
  audience: 'api',
  issuer: 'lamersv',
  subject: 'access',
  algorithms: ['HS256'],      // optional: restrict accepted algorithms
  clockTolerance: 5           // optional: seconds of tolerance
});

// 3) Decode without verifying signature (read-only payload)
const raw = decode(token);     // DOES NOT validate signature — use verify() for security
```

### RS256 (RSA keys)

```ts
import { sign, verify } from '@lamersv/jwt';

const privateKey = `-----BEGIN PRIVATE KEY-----
...PEM private key...
-----END PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
...PEM public key...
-----END PUBLIC KEY-----`;

// Sign with RS256
const jwt = sign({ uid: 'abc' }, privateKey, { algorithm: 'RS256', keyid: 'kid-01', expiresIn: '2h' });

// Verify with the public key
const data = verify(jwt, publicKey, { algorithms: ['RS256'] });
```

## Practical tips

- **Fine-grained expiration/activation**  
  Use numbers (seconds) or strings with suffix: `"30s"`, `"15m"`, `"12h"`, `"7d"`, `"2w"`.
  ```ts
  sign({ id: 1 }, 'secret', { expiresIn: 3600, notBefore: '30s' });
  ```

- **Header with `kid` (Key ID)**  
  ```ts
  sign({ id: 1 }, privateKey, { algorithm: 'RS256', keyid: 'kid-prod-2025' });
  ```

- **Verification constraints**  
  ```ts
  verify(token, 'secret', { audience: 'api', issuer: 'lamersv', subject: 'auth', algorithms: ['HS256'] });
  ```

## Error handling

Functions throw `AuthError` (from `@lamersv/error`) with clear messages for invalid format, expired/inactive tokens, wrong issuer/audience/subject, or unsupported algorithms.

```ts
import { verify } from '@lamersv/jwt';
import { AuthError } from '@lamersv/error';

try {
  verify('invalid.token', 'secret');
} 
catch (e) {
  if (e instanceof AuthError) {
    console.error(e.message);
  } 
  else {
    console.error('Unexpected error', e);
  }
}
```

## API

### Functions
- `sign(payload: JwtPayload, secretOrPrivateKey: string, options?: SignOptions): string`
- `verify(token: string, secretOrPublicKey: string, options?: VerifyOptions): JwtPayload`
- `decode(token: string): object`

### Types
```ts
export interface SignOptions {
  expiresIn?: number | string;
  notBefore?: number | string;
  audience?: string;
  issuer?: string;
  subject?: string;
  algorithm?: 'HS256' | 'RS256';
  keyid?: string;
}

export interface VerifyOptions {
  audience?: string;
  issuer?: string;
  subject?: string;
  clockTolerance?: number;
  algorithms?: ('HS256' | 'RS256')[];
}

export interface JwtPayload {
  [key: string]: any;
  exp?: number;
  nbf?: number;
  iat?: number;
  aud?: string;
  iss?: string;
  sub?: string;
}
```

## Exports map

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

## License

MIT. See the license file in the official repository. [LICENSE](./LICENSE)
