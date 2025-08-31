import { constants, createHmac, createSign } from "crypto";
import { parseTimespan } from "../utils/time-parser";
import { SignOptions, JwtPayload } from "../types";
import { base64urlEncode } from "../utils/base64";
import { AuthError } from "@lamersv/error";

export function sign(payload: JwtPayload, secretOrPrivateKey: string, options: SignOptions = {}): string {
  const algorithm = options.algorithm || "HS256";

  const header: any = {
    alg: algorithm,
    typ: "JWT",
  };

  if (options.keyid) {
    header.kid = options.keyid;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const expiresInSec = parseTimespan(options.expiresIn);
  const notBeforeSec = parseTimespan(options.notBefore);

  const fullPayload: JwtPayload = {
    ...payload,
    iat: timestamp,
    ...(expiresInSec ? { exp: timestamp + expiresInSec } : {}),
    ...(notBeforeSec ? { nbf: timestamp + notBeforeSec } : {}),
    ...(options.audience ? { aud: options.audience } : {}),
    ...(options.issuer ? { iss: options.issuer } : {}),
    ...(options.subject ? { sub: options.subject } : {}),
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signingBuffer = Buffer.from(signingInput);

  let signature: string;
  if (algorithm === "HS256") {
    const sig = createHmac("sha256", secretOrPrivateKey)
      .update(signingBuffer)
      .digest();
    signature = base64urlEncode(sig);
  }
  else if (algorithm === "RS256") {
    const sig = createSign("RSA-SHA256")
      .update(signingBuffer)
      .sign(
        {
          key: secretOrPrivateKey,
          padding: constants.RSA_PKCS1_PADDING,
        }
      );
    signature = base64urlEncode(sig);
  }
  else {
    throw new AuthError(`Algoritmo não suportado: ${algorithm}`);
  }

  return `${signingInput}.${signature}`;
}
