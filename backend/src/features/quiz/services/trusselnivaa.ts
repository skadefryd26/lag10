export type TrusselnivåTilstand = "rolig" | "irritert" | "nervøs" | "i panikk";

export function beregnNyttTrusselnivå(nåværende: number, varRiktig: boolean): number {
  const delta = varRiktig ? 15 : -10;
  const nytt = nåværende + delta;
  return Math.max(0, Math.min(100, nytt));
}

export function hentTrusselnivåTilstand(nivå: number): TrusselnivåTilstand {
  if (nivå <= 25) return "rolig";
  if (nivå <= 50) return "irritert";
  if (nivå <= 75) return "nervøs";
  return "i panikk";
}
