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
