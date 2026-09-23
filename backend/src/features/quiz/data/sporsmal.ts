import { SpørsmålDokument } from "../types/quizTypes.js";

export const SPORSMAL_BANK: SpørsmålDokument[] = [
  {
    id: "sporsmal-1",
    tekst: "Hva er egenandelen per skadetilfelle på forsikringen Reise Pluss?",
    alternativer: [
      { id: "alt-a", tekst: "kr 0" },
      { id: "alt-b", tekst: "kr 1 000" },
      { id: "alt-c", tekst: "kr 2 000" },
      { id: "alt-d", tekst: "kr 500" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  },
  {
    id: "sporsmal-2",
    tekst: "Hva er egenandelen per skadetilfelle på standard Reiseforsikring?",
    alternativer: [
      { id: "alt-a", tekst: "kr 1 000" },
      { id: "alt-b", tekst: "kr 0" },
      { id: "alt-c", tekst: "kr 500" },
      { id: "alt-d", tekst: "kr 2 000" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  },
  {
    id: "sporsmal-3",
    tekst: "Hvor mye dekkes for forsinket bagasje per person med Reise Pluss?",
    alternativer: [
      { id: "alt-a", tekst: "kr 5 000" },
      { id: "alt-b", tekst: "kr 3 000" },
      { id: "alt-c", tekst: "kr 10 000" },
      { id: "alt-d", tekst: "kr 2 000" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  },
  {
    id: "sporsmal-4",
    tekst: "Hva er maksimal dekning for forsinket bagasje per person på standard Reise?",
    alternativer: [
      { id: "alt-a", tekst: "kr 3 000" },
      { id: "alt-b", tekst: "kr 5 000" },
      { id: "alt-c", tekst: "kr 1 000" },
      { id: "alt-d", tekst: "kr 10 000" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  },
  {
    id: "sporsmal-5",
    tekst: "Hva er grensene for ferieavbrytelse per sikret på Reise Pluss?",
    alternativer: [
      { id: "alt-a", tekst: "kr 100 000" },
      { id: "alt-b", tekst: "kr 50 000" },
      { id: "alt-c", tekst: "kr 20 000" },
      { id: "alt-d", tekst: "Ubegrenset" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  },
  {
    id: "sporsmal-6",
    tekst: "Hva er den samlede dekningen for reisegods på Reise Pluss?",
    alternativer: [
      { id: "alt-a", tekst: "Ubegrenset" },
      { id: "alt-b", tekst: "kr 100 000" },
      { id: "alt-c", tekst: "kr 500 000" },
      { id: "alt-d", tekst: "kr 50 000" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  },
  {
    id: "sporsmal-7",
    tekst: "Hva er maksimal dekning per enkeltgjenstand under reisegods på Reise Pluss?",
    alternativer: [
      { id: "alt-a", tekst: "kr 40 000" },
      { id: "alt-b", tekst: "kr 20 000" },
      { id: "alt-c", tekst: "kr 100 000" },
      { id: "alt-d", tekst: "kr 15 000" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Vilkår s. 6"
  },
  {
    id: "sporsmal-8",
    tekst: "Hva er maksimal dekning ved avbestilling av reise på standard Reiseforsikring?",
    alternativer: [
      { id: "alt-a", tekst: "kr 50 000" },
      { id: "alt-b", tekst: "kr 100 000" },
      { id: "alt-c", tekst: "Ubegrenset" },
      { id: "alt-d", tekst: "kr 25 000" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  },
  {
    id: "sporsmal-9",
    tekst: "Hva er maksimal reisevarighet per enkeltreise under reiseforsikringen?",
    alternativer: [
      { id: "alt-a", tekst: "10 uker" },
      { id: "alt-b", tekst: "8 uker" },
      { id: "alt-c", tekst: "12 uker" },
      { id: "alt-d", tekst: "6 uker" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  },
  {
    id: "sporsmal-10",
    tekst: "Inntil hvilken alder er barn dekket på en familieforsikring?",
    alternativer: [
      { id: "alt-a", tekst: "Til fylte 21 år" },
      { id: "alt-b", tekst: "Til fylte 18 år" },
      { id: "alt-c", tekst: "Til fylte 20 år" },
      { id: "alt-d", tekst: "Til fylte 25 år" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 3"
  },
  {
    id: "sporsmal-11",
    tekst: "Hvor lang tid før avreise må en naturkatastrofe senest inntreffe for at avbestillingsdekningen skal gjelde?",
    alternativer: [
      { id: "alt-a", tekst: "72 timer eller mindre" },
      { id: "alt-b", tekst: "24 timer eller mindre" },
      { id: "alt-c", tekst: "48 timer eller mindre" },
      { id: "alt-d", tekst: "7 dager eller mindre" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Vilkår s. 7 (Avbestilling)"
  },
  {
    id: "sporsmal-12",
    tekst: "Hvor lang må forsinkelsen på et transportmiddel minst være for å gi rett til erstatning?",
    alternativer: [
      { id: "alt-a", tekst: "Minst 1,5 time" },
      { id: "alt-b", tekst: "Minst 1 time" },
      { id: "alt-c", tekst: "Minst 2 timer" },
      { id: "alt-d", tekst: "Minst 3 timer" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Vilkår s. 6 (Forsinket transportmiddel)"
  },
  {
    id: "sporsmal-13",
    tekst: "Hva erstattes for tapt ferie per dag per sikret (opptil maks kr 20 000)?",
    alternativer: [
      { id: "alt-a", tekst: "kr 2 000 per dag" },
      { id: "alt-b", tekst: "kr 1 000 per dag" },
      { id: "alt-c", tekst: "kr 3 000 per dag" },
      { id: "alt-d", tekst: "kr 500 per dag" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Vilkår s. 5 (Tapt ferie)"
  },
  {
    id: "sporsmal-14",
    tekst: "Hva er maksimal dekning for privatansvar på reise utenfor Norden?",
    alternativer: [
      { id: "alt-a", tekst: "kr 15 000 000" },
      { id: "alt-b", tekst: "kr 10 000 000" },
      { id: "alt-c", tekst: "kr 5 000 000" },
      { id: "alt-d", tekst: "kr 20 000 000" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  },
  {
    id: "sporsmal-15",
    tekst: "Hva er fristen for å melde en skade til forsikringsselskapet?",
    alternativer: [
      { id: "alt-a", tekst: "1 år" },
      { id: "alt-b", tekst: "6 måneder" },
      { id: "alt-c", tekst: "2 år" },
      { id: "alt-d", tekst: "3 måneder" }
    ],
    riktigAlternativId: "alt-a",
    kilde: "Forsikringsbevis s. 1"
  }
];
