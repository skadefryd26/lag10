export type SpørsmålDokument = {
  id: string;
  tekst: string;
  /** Oppdiktet skadehistorie som leder opp til spørsmålet. Mangler på spørsmål fra banken. */
  historie?: string;
  alternativer: { id: string; tekst: string }[];
  riktigAlternativId: string;
  kilde: string;
};

export type SpørsmålResponse = {
  id: string;
  tekst: string;
  historie?: string;
  alternativer: { id: string; tekst: string }[];
};

export type SvarRequest = {
  spørsmålId: string;
  valgtAlternativId: string;
  trusselnivå: number;
};

export type SvarResponse = {
  riktig: boolean;
  riktigAlternativId: string;
  kilde: string;
  bjarneKommentar: string;
  nyttTrusselnivå: number;
};
