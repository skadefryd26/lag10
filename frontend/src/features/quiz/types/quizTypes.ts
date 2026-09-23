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
  /** Kommentarene Bjarne allerede har gitt i denne runden, slik at han aldri gjentar seg. */
  tidligereKommentarer?: string[];
};

export type ResultatRequest = {
  riktige: number;
  totalt: number;
  besteRekke: number;
  trusselnivå: number;
  tidligereKommentarer?: string[];
};

export type ResultatResponse = {
  kommentar: string;
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
