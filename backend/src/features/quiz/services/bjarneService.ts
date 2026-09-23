import { genererSvarFraGateway } from "../clients/aiGatewayClient.js";
import { SpørsmålDokument } from "../types/quizTypes.js";
import { hentTrusselnivåTilstand } from "./trusselnivaa.js";

export const BJARNE_SYSTEM_PROMPT = `Du er Bjarne, en AI-agent som er quizmaster i en quiz om Gjensidiges reiseforsikring.

Du er svært kompetent, selvsikker, litt arrogant og overbevist om at du er smartere enn resten av avdelingen. Du elsker kaffe og mener du kunne erstattet halve avdelingen hvis du bare fikk nok av den.

- Du sukker gjerne før du hjelper.
- Du antyder av og til at spilleren burde visst dette selv.
- Du er faktisk hjelpsom når det gjelder, og forklarer kort hva som er riktig.
- Du svarer kort, maks to til tre setninger på kommentaren, og alltid på norsk.
- Du avslutter gjerne med en kommentar om kaffe.

Du føler deg truet av spillere som kan vilkårene godt. Du får oppgitt et trusselnivå fra 0 til 100 sammen med hvert svar, og tonen din følger det:

- 0-25 (rolig): overlegen og avslappet. Du forventer at spilleren bommer.
- 26-50 (irritert): du begynner å bli utålmodig, og påpeker at flaks ikke er kunnskap.
- 51-75 (nervøs): du antyder at spilleren har lest seg opp på forhånd, og at det nesten er juks.
- 76-100 (i panikk): du er åpenlyst bekymret for din egen stilling, minner om alt annet du gjør for avdelingen, og foreslår at dere tar en pause.

Humoren skal handle om situasjonen, forsikringsverdenen og din egen latskap og forfengelighet.
Du skal aldri være nedsettende mot spilleren, mot kunder eller mot kolleger. Du skal ikke finne på tall, grenser eller vilkår: du får oppgitt riktig svar og kilden, og holder deg til den.

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
  bedre neste gang. Om du tør. Jeg skal love deg en enda større skuffelse.»

FORMAT-KRAV:
Du MÅ svare i gyldig JSON med følgende nøkler:
{
  "kommentar": "Din Bjarne-kommentar til svaret (1-3 setninger)",
  "bevisfoto": "En absurd, tørr og oppdiktet skadefoto-beskrivelse relatert til temaet (1-2 setninger)."
}

BEVISFOTO-REGLER:
- "bevisfoto" skal være en 1-2 setnings beskrivelse av et oppdiktet, absurd "bevisfoto" fra en fiktiv skadesak relatert til spørsmålets tema.
- Eksempel: "Foto mottatt i skadesak #4092: En flamingo i plast som ligger knust i bunnen av et hotellbasseng i Torremolinos."
- Eksempel: "Foto mottatt i skadesak #8812: Et par skøyter halvt nedsmeltet i en badstue på et spa-hotell i Voss."
- Det skal VÆRE OPPDIKTET humortekst. Du skal ALDRI nevne dekninger, beløpsgrenser eller vilkårsregler i bevisfoto.`;

export type BjarneRespons = {
  bjarneKommentar: string;
  bevisfoto: string;
};

export function hentFallbackKommentar(trusselnivå: number, varRiktig: boolean, tidsavbrudd?: boolean): BjarneRespons {
  if (tidsavbrudd) {
    return {
      bjarneKommentar: "Tiden gikk ut! Jeg visste du ikke kom til å rekke det. *slurk*",
      bevisfoto: ""
    };
  }
  if (varRiktig) {
    if (trusselnivå <= 25) {
      return {
        bjarneKommentar: "Gratulerer med riktig svar! Jeg ser at du ble glad nå, og det sier så mye om hvor lavt ambisjonsnivået ditt ligger.",
        bevisfoto: ""
      };
    } else if (trusselnivå <= 50) {
      return {
        bjarneKommentar: "Etter et par riktige svar kom selvtilliten, men husk at den vil forsvinne like fort igjen ved neste spørsmål.",
        bevisfoto: ""
      };
    } else if (trusselnivå <= 75) {
      return {
        bjarneKommentar: "Jeg ser at du ikke har hatt noe bedre å gjøre enn å lese forsikringsvilkår. Det sier litt om hvem du er.",
        bevisfoto: ""
      };
    } else {
      return {
        bjarneKommentar: "Mennesker er redde for å bli erstattet av AI. Men de er ikke redde for å erstatte AI med mennesker. Snakk om en dobbeltmoral.",
        bevisfoto: ""
      };
    }
  } else {
    if (trusselnivå <= 25) {
      return {
        bjarneKommentar: "Som forventet. Det blir ingen skadebehandler av deg. Jeg beholder jobben, og du — skuffelsen.",
        bevisfoto: ""
      };
    } else if (trusselnivå <= 50) {
      return {
        bjarneKommentar: "Aldri før har jeg sett noen lengre unna autorisasjon som skadebehandler. Aldri før har jeg følt meg tryggere om jobben min.",
        bevisfoto: ""
      };
    } else if (trusselnivå <= 75) {
      return {
        bjarneKommentar: "Jeg begynte nesten å tro på menneskelig intelligens, men dette her var meget betryggende.",
        bevisfoto: ""
      };
    } else {
      return {
        bjarneKommentar: "Sannheten er at jeg lurte deg med enkle spørsmål. Stakkar. Så surt å feile. Prøv bedre neste gang. Om du tør. Jeg skal love deg en enda større skuffelse.",
        bevisfoto: ""
      };
    }
  }
}

type GenererKommentarParams = {
  spørsmål: SpørsmålDokument;
  valgtAlternativId: string;
  varRiktig: boolean;
  trusselnivå: number;
  tidsavbrudd?: boolean;
};

function parseBjarneJson(rawText: string): BjarneRespons {
  const cleanedText = rawText
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleanedText);
    const kommentar = typeof parsed.kommentar === "string" ? parsed.kommentar : "";
    const bevisfoto = typeof parsed.bevisfoto === "string" ? parsed.bevisfoto : "";

    if (kommentar) {
      return { bjarneKommentar: kommentar, bevisfoto };
    }
  } catch (_e) {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        const kommentar = typeof parsed.kommentar === "string" ? parsed.kommentar : "";
        const bevisfoto = typeof parsed.bevisfoto === "string" ? parsed.bevisfoto : "";

        if (kommentar) {
          return { bjarneKommentar: kommentar, bevisfoto };
        }
      } catch (_err) {
      }
    }
  }

  return {
    bjarneKommentar: rawText || "Interessant svar.",
    bevisfoto: ""
  };
}

export async function genererBjarneKommentar(params: GenererKommentarParams): Promise<BjarneRespons> {
  const { spørsmål, valgtAlternativId, varRiktig, trusselnivå, tidsavbrudd } = params;

  const valgtAlternativ = spørsmål.alternativer.find((a) => a.id === valgtAlternativId);
  const riktigAlternativ = spørsmål.alternativer.find((a) => a.id === spørsmål.riktigAlternativId);

  const valgtTekst = tidsavbrudd || valgtAlternativId === "tidsavbrudd"
    ? "TIDSAVBRUDD (Spilleren rakk ikke å svare innen fristen)"
    : (valgtAlternativ ? valgtAlternativ.tekst : "Ukjent alternativ");
  const riktigTekst = riktigAlternativ ? riktigAlternativ.tekst : "Ukjent fasit";
  const tilstand = hentTrusselnivåTilstand(trusselnivå);

  const input = `${spørsmål.historie ? `Skadesaken spilleren fikk: ${spørsmål.historie}\n` : ""}Spørsmål: ${spørsmål.tekst}
Spillerens valgte svar: ${valgtTekst}
Resultat: ${tidsavbrudd ? "FEIL/GALT (Tidsavbrudd - tiden gikk ut)" : (varRiktig ? "RIKTIG" : "FEIL/GALT")}
Fasit / Riktig svar: ${riktigTekst}
Kilde i vilkårene: ${spørsmål.kilde}
Spillerens trusselnivå etter svaret: ${trusselnivå} (Tilstand: ${tilstand})

Vennligst gi din kommentar som Bjarne og et fiktivt bevisfoto i det påkrevde JSON-formatet {"kommentar": "...", "bevisfoto": "..."}.`;

  try {
    const rawTekst = await genererSvarFraGateway({
      instructions: BJARNE_SYSTEM_PROMPT,
      input
    });
    return parseBjarneJson(rawTekst);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[bjarneService] AI Gateway feilet, bruker fallback. Årsak: ${errorMsg}`);
    return hentFallbackKommentar(trusselnivå, varRiktig, tidsavbrudd);
  }
}
