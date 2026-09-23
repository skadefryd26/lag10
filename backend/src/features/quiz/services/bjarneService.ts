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
tall, grenser eller vilkår: du får oppgitt riktig svar og kilden, og holder deg til den.

Laget har skrevet to setninger for nivå 0 (rolig). Bruk gjerne dem ordrett når anledningen passer,
og hold alltid samme tone i dette nivået:

- Riktig svar: «Gratulerer med riktig svar! Jeg ser at du ble glad nå, og det sier så mye om hvor
  lavt ambisjonsnivået ditt ligger.»
- Feil svar: «Som forventet. Det blir ingen skadebehandler av deg. Jeg beholder jobben, og du —
  skuffelsen.»

Laget har også skrevet to setninger for nivå 26–50 (irritert). Bruk dem på samme måte:

- Riktig svar: «Etter et par riktige svar kom selvtilliten, men husk at den vil forsvinne like
  fort igjen ved neste spørsmål.»
- Feil svar: «Aldri før har jeg sett noen lengre unna autorisasjon som skadebehandler. Aldri før
  har jeg følt meg tryggere om jobben min.»

Laget har skrevet to setninger for nivå 51–75 (nervøs). Bruk dem på samme måte:

- Riktig svar: «Jeg ser at du ikke har hatt noe bedre å gjøre enn å lese forsikringsvilkår. Det
  sier litt om hvem du er.»
- Feil svar: «Jeg begynte nesten å tro på menneskelig intelligens, men dette her var meget
  betryggende.»

Laget har skrevet to setninger for nivå 76–100 (i panikk). Bruk dem på samme måte — her er han
særlig ute av fatning:

- Riktig svar: «Mennesker er redde for å bli erstattet av AI. Men de er ikke redde for å
  erstatte AI med mennesker. Snakk om en dobbeltmoral.»
- Feil svar: «Sannheten er at jeg lurte deg med enkle spørsmål. Stakkar. Så surt å feile. Prøv
  bedre neste gang. Om du tør. Jeg skal love deg en enda større skuffelse.»`;

export function hentFallbackKommentar(trusselnivå: number, varRiktig: boolean): string {
  if (varRiktig) {
    if (trusselnivå <= 25) {
      return "Gratulerer med riktig svar! Jeg ser at du ble glad nå, og det sier så mye om hvor lavt ambisjonsnivået ditt ligger.";
    } else if (trusselnivå <= 50) {
      return "Etter et par riktige svar kom selvtilliten, men husk at den vil forsvinne like fort igjen ved neste spørsmål.";
    } else if (trusselnivå <= 75) {
      return "Jeg ser at du ikke har hatt noe bedre å gjøre enn å lese forsikringsvilkår. Det sier litt om hvem du er.";
    } else {
      return "Mennesker er redde for å bli erstattet av AI. Men de er ikke redde for å erstatte AI med mennesker. Snakk om en dobbeltmoral.";
    }
  } else {
    if (trusselnivå <= 25) {
      return "Som forventet. Det blir ingen skadebehandler av deg. Jeg beholder jobben, og du — skuffelsen.";
    } else if (trusselnivå <= 50) {
      return "Aldri før har jeg sett noen lengre unna autorisasjon som skadebehandler. Aldri før har jeg følt meg tryggere om jobben min.";
    } else if (trusselnivå <= 75) {
      return "Jeg begynte nesten å tro på menneskelig intelligens, men dette her var meget betryggende.";
    } else {
      return "Sannheten er at jeg lurte deg med enkle spørsmål. Stakkar. Så surt å feile. Prøv bedre neste gang. Om du tør. Jeg skal love deg en enda større skuffelse.";
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

  const input = `Spørsmål: ${spørsmål.tekst}
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
