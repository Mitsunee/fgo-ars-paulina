function toPrecision(number: number) {
  return +number.toPrecision(3);
}

export function formatLongNumber(number: number) {
  if (number > 1e9) {
    const n = number / 1e9;
    if (n > 100) return `${Math.trunc(n)}B`;
    return `${toPrecision(n)}B`;
  }
  if (number > 1e6) {
    const n = number / 1e6;
    if (n > 100) return `${Math.trunc(n)}M`;
    return `${toPrecision(n)}M`;
  }
  if (number > 1e3) {
    const n = number / 1e3;
    if (n > 100) return `${Math.trunc(n)}K`;
    return `${toPrecision(n)}K`;
  }

  return number;
}
