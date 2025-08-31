export function base64urlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function base64urlDecode(input: string): Buffer {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  while (input.length % 4 !== 0) {
    input += "=";
  }
  return Buffer.from(input, "base64");
}