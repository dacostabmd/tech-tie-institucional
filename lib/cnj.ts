// Numero unico CNJ (Res. CNJ 65/2008): NNNNNNN-DD.AAAA.J.TR.OOOO (20 digitos).

const CNJ_SEPARATORS = ["", "-", ".", ".", ".", "."];
const CNJ_SLICES: Array<[number, number]> = [
  [0, 7],
  [7, 9],
  [9, 13],
  [13, 14],
  [14, 16],
  [16, 20],
];

/** Aplica a mascara CNJ progressivamente enquanto o usuario digita. */
export function formatCnj(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 20);
  return CNJ_SLICES.reduce((acc, [start, end], i) => {
    const part = digits.slice(start, end);
    return part ? acc + CNJ_SEPARATORS[i] + part : acc;
  }, "");
}

export function isCompleteCnj(value: string) {
  return value.replace(/\D/g, "").length === 20;
}

export const CNJ_PLACEHOLDER = "0000000-00.0000.0.00.0000";
