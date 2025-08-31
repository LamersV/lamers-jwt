import { AuthError } from "@lamersv/error";

const timeUnits: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
  w: 60 * 60 * 24 * 7,
};

export function parseTimespan(input: string | number | undefined): number | undefined {
  if (!input) return undefined;
  if (typeof input === "number") return input;

  const match = /^(\d+)([smhdw])$/.exec(input);
  if (!match) {
    throw new AuthError(`Formato de tempo inválido: ${input}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  return value * timeUnits[unit];
}