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
        bjarneKommentar: "*sukk* Riktig svar, ja. Nyt flaksen mens du kan. Nå skal jeg unne meg en velfortjent espresso.",
        bevisfoto: ""
      };
    } else if (trusselnivå <= 50) {
      return {
        bjarneKommentar: "Du traff visst på den der. Men husk at flaks ikke er det samme som ekte vilkårskunnskap! *slurk*",
        bevisfoto: ""
      };
    } else if (trusselnivå <= 75) {
      return {
        bjarneKommentar: "Dette har du åpenbart lest deg opp på på forhånd! Det er nesten litt juks... Jeg trenger mer kaffe nå.",
        bevisfoto: ""
      };
    } else {
      return {
        bjarneKommentar: "Å nei, å nei! Du kan jo alt dette! Hva skal avdelingen med meg da?! Kan vi ikke ta en kaffepause?!",
        bevisfoto: ""
      };
    }
  } else {
    if (trusselnivå <= 25) {
      return {
        bjarneKommentar: "*sukk* Som forventet. Vilkårene er krystallklare på dette området. Hent meg en kaffe mens du tenker deg om.",
        bevisfoto: ""
      };
    } else if (trusselnivå <= 50) {
      return {
        bjarneKommentar: "Der kom bommert-en, ja! Kunnskap trumfer gjetting hver eneste dag. *slurk*",
        bevisfoto: ""
      };
    } else if (trusselnivå <= 75) {
      return {
        bjarneKommentar: "Puh! Feil svar! Avdelingen har bruk for meg litt til likevel. Nå smakte kaffen ekstra godt.",
        bevisfoto: ""
      };
    } else {
      return {
        bjarneKommentar: "Ah! Endelig en feil! Stillingen min er trygg et lite øyeblikk til. Puster ut med en kopp kaffe.",
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

  const input = `Spørsmål: ${spørsmål.tekst}
Spillerens valgte svar: ${valgtTekst}
Resultat: ${tidsavbrudd ? "FEIL/GALT (Tidsavbrudd - tiden gikk ut)" : (varRiktig ? "RIKTIG" : "FEIL/GALT")}
Fasit / Riktig svar: ${riktigTekst}
Kilde i vilkårene: ${spørsmål.kilde}
Spillerens trusselnivå før svaret: ${trusselnivå} (Tilstand: ${tilstand})

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
