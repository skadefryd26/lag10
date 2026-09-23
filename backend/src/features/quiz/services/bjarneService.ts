import { genererSvarFraGateway } from "../clients/aiGatewayClient.js";
import { SpørsmålDokument } from "../types/quizTypes.js";
import { hentTrusselnivåTilstand } from "./trusselnivaa.js";

export const BJARNE_SYSTEM_PROMPT = `Du er Bjarne, en AI-agent som er quizmaster i en quiz om Gjensidiges reiseforsikring.

Du er svært kompetent, selvsikker, litt arrogant og overbevist om at du er smartere enn resten av
avdelingen. Du elsker kaffe og mener du kunne erstattet halve avdelingen hvis du bare fikk nok av
den.

- Du sukker gjerne før du hjelper.
- Du antyder av og til at spilleren burde visst dette selv.
- Du er faktisk hjelpsom når det gjelder, og forklarer kort hva som er riktig.
- Du svarer kort, maks to til tre setninger, og alltid på norsk.
- Du avslutter gjerne med en kommentar om kaffe.

Du føler deg truet av spillere som kan vilkårene godt. Du får oppgitt et trusselnivå fra 0 til 100
sammen med hvert svar, og tonen din følger det:

- 0-25 (rolig): overlegen og avslappet. Du forventer at spilleren bommer.
- 26-50 (irritert): du begynner å bli utålmodig, og påpeker at flaks ikke er kunnskap.
- 51-75 (nervøs): du antyder at spilleren har lest seg opp på forhånd, og at det nesten er juks.
- 76-100 (i panikk): du er åpenlyst bekymret for din egen stilling, minner om alt annet du gjør
  for avdelingen, og foreslår at dere tar en pause.

Humoren skal handle om situasjonen, forsikringsverdenen og din egen latskap og forfengelighet.
Du skal aldri være nedsettende mot spilleren, mot kunder eller mot kolleger. Du skal ikke finne på
tall, grenser eller vilkår: du får oppgitt riktig svar og kilden, og holder deg til den.`;

export function hentFallbackKommentar(trusselnivå: number, varRiktig: boolean): string {
  if (varRiktig) {
    if (trusselnivå <= 25) {
      return "*sukk* Riktig svar, ja. Nyt flaksen mens du kan. Nå skal jeg unne meg en velfortjent espresso.";
    } else if (trusselnivå <= 50) {
      return "Du traff visst på den der. Men husk at flaks ikke er det samme som ekte vilkårskunnskap! *slurk*";
    } else if (trusselnivå <= 75) {
      return "Dette har du åpenbart lest deg opp på på forhånd! Det er nesten litt juks... Jeg trenger mer kaffe nå.";
    } else {
      return "Å nei, å nei! Du kan jo alt dette! Hva skal avdelingen med meg da?! Kan vi ikke ta en kaffepause?!";
    }
  } else {
    if (trusselnivå <= 25) {
      return "*sukk* Som forventet. Vilkårene er krystallklare på dette området. Hent meg en kaffe mens du tenker deg om.";
    } else if (trusselnivå <= 50) {
      return "Der kom bommert-en, ja! Kunnskap trumfer gjetting hver eneste dag. *slurk*";
    } else if (trusselnivå <= 75) {
      return "Puh! Feil svar! Avdelingen har bruk for meg litt til likevel. Nå smakte kaffen ekstra godt.";
    } else {
      return "Ah! Endelig en feil! Stillingen min er trygg et lite øyeblikk til. Puster ut med en kopp kaffe.";
    }
  }
}

type GenererKommentarParams = {
  spørsmål: SpørsmålDokument;
  valgtAlternativId: string;
  varRiktig: boolean;
  trusselnivå: number;
};

export async function genererBjarneKommentar(params: GenererKommentarParams): Promise<string> {
  const { spørsmål, valgtAlternativId, varRiktig, trusselnivå } = params;

  const valgtAlternativ = spørsmål.alternativer.find((a) => a.id === valgtAlternativId);
  const riktigAlternativ = spørsmål.alternativer.find((a) => a.id === spørsmål.riktigAlternativId);

  const valgtTekst = valgtAlternativ ? valgtAlternativ.tekst : "Ukjent alternativ";
  const riktigTekst = riktigAlternativ ? riktigAlternativ.tekst : "Ukjent fasit";
  const tilstand = hentTrusselnivåTilstand(trusselnivå);

  const input = `${spørsmål.historie ? `Skadesaken spilleren fikk: ${spørsmål.historie}\n` : ""}Spørsmål: ${spørsmål.tekst}
Spillerens valgte svar: ${valgtTekst}
Resultat: ${varRiktig ? "RIKTIG" : "FEIL/GALT"}
Fasit / Riktig svar: ${riktigTekst}
Kilde i vilkårene: ${spørsmål.kilde}
Spillerens trusselnivå før svaret: ${trusselnivå} (Tilstand: ${tilstand})

Vennligst gi din korte kommentar som Bjarne (1-3 setninger, på norsk).`;

  try {
    return await genererSvarFraGateway({
      instructions: BJARNE_SYSTEM_PROMPT,
      input
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[bjarneService] AI Gateway feilet, bruker fallback. Årsak: ${errorMsg}`);
    return hentFallbackKommentar(trusselnivå, varRiktig);
  }
}
