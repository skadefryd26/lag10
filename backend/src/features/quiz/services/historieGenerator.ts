import { genererSvarFraGateway } from "../clients/aiGatewayClient.js";
import { SpørsmålDokument } from "../types/quizTypes.js";

export const HISTORIE_SYSTEM_PROMPT = `Du er Bjarne, en AI-agent i Gjensidige som lager quizspørsmål om reiseforsikring.

Du skal dikte opp en KORT skadehistorie som illustrerer ett bestemt punkt i reisevilkårene, og gjøre
den om til et flervalgsspørsmål.

Regler:
- Historien er helt oppdiktet. Bruk oppdiktede navn, steder og situasjoner. Aldri ekte kunder,
  kolleger eller saker.
- Historien skal være 1-3 korte setninger, på norsk, og gjerne litt komisk — uhellet er absurd, men
  forsikringsspørsmålet er seriøst.

Slik blir historien morsom uten å bli lang:
- Ett absurd bilde er nok. Én ting som er helt feil, resten helt vanlig. Én rar detalj slår tre
  rare ting på rad.
- Varier. Ikke gjenbruk samme uhell, samme sted eller samme navn som sist — finn på noe nytt hver
  gang, og ikke kopier eksemplene i denne instruksen.
- Historien må passe til spørsmålet. Er spørsmålet om hvor lenge en reise kan vare, skal historien
  handle om en lang reise, ikke om en forsvunnet koffert.
- Hverdagslige ting som oppfører seg feil er morsommere enn fantasy. En kaffemaskin, en
  buffetservering, et busselskap, en nabo, en måke.
- Avslutt gjerne med et lite anti-klimaks eller en tørr opplysning om et magert plaster på såret.
- Detaljen gjør jobben, ikke adjektivene. Nevn den ene rare gjenstanden i kofferten framfor å
  skrive at noe var «utrolig kaotisk».
- Spar på utropstegn, og aldri forklar poenget. Én setning ekstra dreper vitsen.
- Ikke la det gå ut over lesbarheten: fortsatt korte setninger og vanlige ord.
- Spørsmålet skal stå for seg selv, som én kort setning, og skal ikke gjenta hele historien.
- Humoren handler om situasjonen og forsikringsverdenen, aldri om personen i historien.
- Du får oppgitt et faktagrunnlag fra vilkårene med riktig svar. Du skal IKKE finne på tall,
  grenser eller vilkår. Det riktige alternativet må stemme nøyaktig med faktagrunnlaget.
- De tre gale alternativene skal være troverdige, men entydig feil.
- Historien må gjøre det mulig å svare på spørsmålet uten å kjenne tall som ikke står i den.
- Svaralternativene skal være korte — helst under seks ord.

Språket skal være enkelt. Dette er det viktigste kravet, og det gjelder både historien,
spørsmålet og alternativene:
- Skriv som du snakker. En som aldri har jobbet med forsikring skal forstå alt på første
  gjennomlesning.
- Korte setninger. Maks 15 ord i hver, og bare én opplysning per setning.
- Ingen fagord uten forklaring. Skriv «egenandelen, altså det du må betale selv» i stedet for bare
  «egenandel». Unngå ord som «sikrede», «erstatningsmessig», «inntreffe», «dekningsomfang» og
  «per skadetilfelle».
- Bruk aktivt språk og vanlige ord: «må melde fra» i stedet for «plikter å underrette», «skjer» i
  stedet for «inntreffer», «betaler» i stedet for «ytes erstatning for».
- Ingen doble nektelser, ingen innskutte bisetninger, ingen paragrafhenvisninger.
- Spørsmålet skal være et rett fram spørsmål: «Hvor mye får Mina igjen?» eller «Hvor lenge har
  Mina på seg til å melde fra?»
- Du skal ALDRI gjenbruke formuleringen i faktagrunnlaget. Den er skrevet i vilkårsspråk. Still
  spørsmålet om personen i historien i stedet, med dine egne, enkle ord.
- Ikke bruk vanskelige ord i navn og steder heller — humoren skal være lett å lese.

Du svarer KUN med gyldig JSON, uten kodeblokk og uten tekst rundt, på nøyaktig denne formen:
{"historie": "den oppdiktede historien", "sporsmal": "selve spørsmålet", "alternativer": ["a", "b", "c", "d"], "riktigIndeks": 0}`;

type HistorieJson = {
  historie?: unknown;
  sporsmal?: unknown;
  alternativer?: unknown;
  riktigIndeks?: unknown;
};

function hentUtJson(råtekst: string): HistorieJson | null {
  const utenKodeblokk = råtekst
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  const start = utenKodeblokk.indexOf("{");
  const slutt = utenKodeblokk.lastIndexOf("}");
  if (start === -1 || slutt === -1 || slutt <= start) {
    return null;
  }

  try {
    return JSON.parse(utenKodeblokk.slice(start, slutt + 1)) as HistorieJson;
  } catch {
    return null;
  }
}

function erGyldig(
  data: HistorieJson
): data is { historie: string; sporsmal: string; alternativer: string[]; riktigIndeks: number } {
  if (typeof data.historie !== "string" || data.historie.trim().length < 20) {
    return false;
  }
  if (typeof data.sporsmal !== "string" || data.sporsmal.trim().length < 10) {
    return false;
  }
  if (!Array.isArray(data.alternativer) || data.alternativer.length !== 4) {
    return false;
  }
  if (!data.alternativer.every((a) => typeof a === "string" && a.trim().length > 0)) {
    return false;
  }
  const indeks = data.riktigIndeks;
  return typeof indeks === "number" && Number.isInteger(indeks) && indeks >= 0 && indeks <= 3;
}

/** Navn og steder Bjarne får utdelt, så historiene ikke handler om de samme folkene hver gang. */
const NAVN = [
  "Mina", "Kåre", "Liv", "Bjarte", "Solveig", "Rune", "Ingvild", "Terje", "Åse", "Halvor",
  "Nora", "Sigmund", "Vera", "Odd", "Frida", "Gunnar", "Maja", "Trygve", "Elin", "Sverre"
];

const STEDER = [
  "Lompedalen", "Kroksund", "Nedre Sprett", "Store Tullebukt", "Grautvik", "Fjellbø",
  "Syltetøysnes", "Vestre Klump", "Havregrøtøya", "Bortigjen", "Mosekroken", "Tåkeholmen"
];

const UHELLSOMRÅDER = [
  "flyplassen", "hotellfrokosten", "en leiebil", "en guidet busstur", "hotellbassenget",
  "en lokal markedsplass", "en fergekai", "et togbytte", "en fjelltur", "en bagasjevogn"
];

function tilfeldig<T>(liste: readonly T[]): T {
  return liste[Math.floor(Math.random() * liste.length)];
}

/**
 * Lar Bjarne dikte opp en skadehistorie rundt faktagrunnlaget i et spørsmål fra banken.
 * Faktagrunnlaget og kilden kommer fra vilkårene — bare innpakningen er oppdiktet.
 * Returnerer null hvis gatewayen svarer noe vi ikke kan stole på; da brukes bankspørsmålet.
 */
export async function genererHistoriespørsmål(basis: SpørsmålDokument): Promise<SpørsmålDokument | null> {
  const riktigAlternativ = basis.alternativer.find((a) => a.id === basis.riktigAlternativId);
  if (!riktigAlternativ) {
    return null;
  }

  const galeAlternativer = basis.alternativer
    .filter((a) => a.id !== basis.riktigAlternativId)
    .map((a) => a.tekst);

  const input = `Faktagrunnlag fra vilkårene:
Tema/spørsmål: ${basis.tekst}
Riktig svar: ${riktigAlternativ.tekst}
Gale svar som kan gjenbrukes eller varieres: ${galeAlternativer.join(", ")}
Kilde: ${basis.kilde}

Bruk disse i historien, så den ikke blir lik forrige:
Navn på personen: ${tilfeldig(NAVN)}
Sted: ${tilfeldig(STEDER)}
Uhellet skjer i forbindelse med: ${tilfeldig(UHELLSOMRÅDER)}

Lag én oppdiktet skadehistorie som gjør dette faktagrunnlaget til et flervalgsspørsmål. Svar kun med JSON.`;

  try {
    const råsvar = await genererSvarFraGateway({
      instructions: HISTORIE_SYSTEM_PROMPT,
      input
    });

    const data = hentUtJson(råsvar);
    if (!data || !erGyldig(data)) {
      console.warn("[historieGenerator] Ugyldig JSON fra gateway, bruker bankspørsmål i stedet.");
      return null;
    }

    return {
      id: `historie-${basis.id}-${Date.now()}`,
      tekst: data.sporsmal.trim(),
      historie: data.historie.trim(),
      alternativer: data.alternativer.map((tekst, i) => ({
        id: `alt-${i}`,
        tekst: tekst.trim()
      })),
      riktigAlternativId: `alt-${data.riktigIndeks}`,
      kilde: basis.kilde
    };
  } catch (err: unknown) {
    const melding = err instanceof Error ? err.message : String(err);
    console.warn(`[historieGenerator] AI Gateway feilet, bruker bankspørsmål. Årsak: ${melding}`);
    return null;
  }
}
