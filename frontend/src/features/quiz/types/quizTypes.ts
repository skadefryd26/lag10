export type Spørsmål = {
  id: string;
  tekst: string;
  /** Oppdiktet skadehistorie som leder opp til spørsmålet. */
  historie?: string;
  alternativer: { id: string; tekst: string }[];
};

export type SvarRequest = {
  spørsmålId: string;
  valgtAlternativId: string;
  trusselnivå: number;
  tidsavbrudd?: boolean;
};

export type SvarResponse = {
  riktig: boolean;
  riktigAlternativId: string;
  kilde: string;
  bjarneKommentar: string;
  nyttTrusselnivå: number;
  bevisfoto: string;
};

export type TrusselnivåTilstand = "rolig" | "irritert" | "nervøs" | "i panikk";
