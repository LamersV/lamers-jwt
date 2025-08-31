import { base64urlDecode } from "../utils/base64";
import { AuthError } from "@lamersv/error";

export function decode(token: string): object {
  const parts = token.split(".");
  if (parts.length < 2) {
    throw new AuthError("Token inválido");
  }

  const payload = base64urlDecode(parts[1]).toString("utf8");
  return JSON.parse(payload);
}