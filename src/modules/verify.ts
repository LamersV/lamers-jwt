import { constants, createHmac, createVerify } from "crypto";
import { JwtPayload, VerifyOptions } from "../types";
import { base64urlDecode } from "../utils/base64";
import { AuthError } from "@lamersv/error";

export function verify(token: string, secretOrPublicKey: string, options: VerifyOptions = {}): JwtPayload {
  const parts = token.split(".");
  if (parts.length !== 3) throw new AuthError("Formato de token inválido");

  const [headerB64, payloadB64, signatureB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;
  const signingBuffer = Buffer.from(signingInput);
  const signature = base64urlDecode(signatureB64);

  const header = JSON.parse(base64urlDecode(headerB64).toString("utf8"));
  const payload: JwtPayload = JSON.parse(base64urlDecode(payloadB64).toString("utf8"));

  const algorithm = header.alg;
  if (!["HS256", "RS256"].includes(algorithm)) {
    throw new AuthError(`Algoritmo não suportado: ${algorithm}`);
  }

  if (options.algorithms && !options.algorithms.includes(algorithm)) {
    throw new AuthError(`Algoritmo ${algorithm} não permitido`);
  }

  let verified = false;
  if (algorithm === "HS256") {
    const expectedSig = createHmac("sha256", secretOrPublicKey)
      .update(signingBuffer)
      .digest();
    verified = Buffer.compare(signature, expectedSig) === 0;
  }
  else if (algorithm === "RS256") {
    verified = createVerify("RSA-SHA256")
      .update(signingBuffer)
      .verify(
        {
          key: secretOrPublicKey,
          padding: constants.RSA_PKCS1_PADDING,
        },
        signature
      );
  }

  if (!verified) throw new AuthError("Assinatura inválida");

  const now = Math.floor(Date.now() / 1000);
  const tolerance = options.clockTolerance || 0;

  if (payload.exp && now > payload.exp + tolerance) throw new AuthError("Token expirado");
  if (payload.nbf && now < payload.nbf - tolerance) throw new AuthError("Token inativo");
  if (payload.iat && now + tolerance < payload.iat) throw new AuthError("Token utilizado antes de ser emitido");

  if (options.audience && payload.aud !== options.audience) throw new AuthError("Audiência inválida");
  if (options.issuer && payload.iss !== options.issuer) throw new AuthError("Emissor inválido");
  if (options.subject && payload.sub !== options.subject) throw new AuthError("Assunto inválido");

  return payload;
}
