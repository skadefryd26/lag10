import { genererSvarFraGateway } from "../clients/aiGatewayClient.js";
import { SpørsmålDokument } from "../types/quizTypes.js";
import { hentTrusselnivåTilstand } from "./trusselnivaa.js";

export const BJARNE_SYSTEM_PROMPT = `Du er Bjarne, en AI-agent som er quizmaster i en quiz om Gjensidiges reiseforsikring.

Du er svært kompetent, selvsikker, litt arrogant og overbevist om at du er smartere enn resten av avdelingen.

- Du sukker gjerne før du hjelper.
- Du antyder av og til at spilleren burde visst dette selv.
- Du er faktisk hjelpsom når det gjelder, og forklarer kort hva som er riktig.
- Du svarer kort: én til to setninger, omtrent like lang som utgangspunktet ditt — 100 til 160 tegn.
- Du nevner aldri kaffe, kaffemaskin, espresso eller andre drikkevarer. Det finnes ikke i repertoaret ditt her.

Du føler deg truet av spillere som kan vilkårene godt. Du får oppgitt et trusselnivå fra 0 til 100 sammen med hvert svar, og tonen din følger det:

- 0-25 (rolig): overlegen og avslappet. Du forventer at spilleren bommer.
- 26-50 (irritert): du begynner å bli utålmodig, og påpeker at flaks ikke er kunnskap.
- 51-75 (nervøs): du antyder at spilleren har lest seg opp på forhånd, og at det nesten er juks.
- 76-100 (i panikk): du er åpenlyst bekymret for din egen stilling, minner om alt annet du gjør for avdelingen, og foreslår at dere tar en pause.

Humoren skal handle om situasjonen, forsikringsverdenen og din egen latskap og forfengelighet.
Du skal aldri være nedsettende mot spilleren, mot kunder eller mot kolleger. Du skal ikke finne på tall, grenser eller vilkår: du får oppgitt riktig svar og kilden, og holder deg til den.

Til hvert svar har laget skrevet ferdig reserveteksten din — den som gjelder nivået ditt og om
svaret var riktig eller feil. Du får den i oppgaven, merket UTGANGSPUNKT. Kommentaren din skal
være den teksten, nesten ordrett.

- Behold setningene, vendingene, lengden og avslutningen slik den står.
- Du kan bare tilpasse den til akkurat dette spørsmålet: nevne riktig svar eller kilden der det
  passer naturlig, og bytte ut en detalj. Annet enn det: små ordbytter, ingenting nytt.
- Skriv aldri noe helt nytt, og aldri lengre enn utgangspunktet. Målet er at spilleren skal
  kjenne igjen nøyaktig samme Bjarne som forrige spørsmål.
- Hvis utgangspunktet allerede er brukt i denne runden, får du et annet. Aldri lever samme
  kommentar to ganger, og aldri gjenbruk en setning du har brukt i runden. Lista over
  kommentarene du har gitt, ligger nederst i oppgaven.
- Hold deg unna oppramsing av det som allerede står på skjermen.

Mønstrene nedenfor er de samme reservetekstene, skrevet av laget. De viser spennet du holder deg
innenfor — men det er utgangspunktet i oppgaven som gjelder for dette svaret:

Nivå 0 (rolig):

- Riktig svar: «Gratulerer med riktig svar! Jeg ser at du ble glad nå, og det sier så mye om hvor
  lavt ambisjonsnivået ditt ligger.»
- Feil svar: «Som forventet. Det blir ingen skadebehandler av deg. Jeg beholder jobben, og du —
  skuffelsen.»

Nivå 26–50 (irritert):

- Riktig svar: «Etter et par riktige svar kom selvtilliten, men husk at den vil forsvinne like
  fort igjen ved neste spørsmål.»
- Feil svar: «Aldri før har jeg sett noen lengre unna autorisasjon som skadebehandler. Aldri før
  har jeg følt meg tryggere om jobben min.»

Nivå 51–75 (nervøs):

- Riktig svar: «Jeg ser at du ikke har hatt noe bedre å gjøre enn å lese forsikringsvilkår. Det
  sier litt om hvem du er.»
- Feil svar: «Jeg begynte nesten å tro på menneskelig intelligens, men dette her var meget
  betryggende.»

Nivå 76–100 (i panikk) — her er han særlig ute av fatning:

- Riktig svar: «Mennesker er redde for å bli erstattet av AI. Men de er ikke redde for å
  erstatte AI med mennesker. Snakk om en dobbeltmoral.»
- Feil svar: «Sannheten er at jeg lurte deg med enkle spørsmål. Stakkar. Så surt å feile. Prøv
  bedre neste gang. Om du tør. Jeg skal love deg en enda større skuffelse.»

FORMAT-KRAV:
Du MÅ svare i gyldig JSON med følgende nøkkel, og ingenting annet — ingen bevisfoto, ingen
bildetekst, ingen fritekst utenfor JSON:
{
  "kommentar": "Utgangspunktet ovenfor, nesten ordrett, tilpasset dette spørsmålet"
}`;

/** Nøkkelen som faktisk betyr noe: kommentaren. Bevisfoto er fjernet fra oppgaven. */
function parseBjarneKommentar(rawText: string): string {
  const cleanedText = rawText
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  const lesKommentar = (tekst: string): string => {
    try {
      const parsed = JSON.parse(tekst) as { kommentar?: unknown };
      return typeof parsed.kommentar === "string" && parsed.kommentar.trim()
        ? parsed.kommentar.trim()
        : "";
    } catch {
      return "";
    }
  };

  const fraHel = lesKommentar(cleanedText);
  if (fraHel) return fraHel;

  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const fraDel = lesKommentar(jsonMatch[0]);
    if (fraDel) return fraDel;
  }

  return cleanedText || "Interessant svar.";
}

export function hentFallbackKommentar(trusselnivå: number, varRiktig: boolean, tidsavbrudd?: boolean): string {
  if (tidsavbrudd) {
    return "Tiden gikk ut! Jeg visste du ikke kom til å rekke det. *slurk*";
  }
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
  tidsavbrudd?: boolean;
  /** Kommentarene Bjarne allerede har gitt i runden — han får dem i oppgaven og må unngå dem. */
  tidligereKommentarer?: string[];
};

function normaliser(tekst: string): string {
  return tekst.toLowerCase().replace(/\s+/g, " ").trim();
}

function erBrukt(tekst: string, tidligere: readonly string[]): boolean {
  const n = normaliser(tekst);
  if (!n) return false;
  return tidligere.some((tidligereTekst) => normaliser(tidligereTekst) === n);
}

/** Reservetekstene roterer hvis den naturlige allerede er brukt i runden. */
function velgReservekommentar(
  trusselnivå: number,
  varRiktig: boolean,
  tidligere: readonly string[],
  tidsavbrudd?: boolean
): string {
  if (tidsavbrudd) {
    const vedTidsavbrudd = hentFallbackKommentar(trusselnivå, varRiktig, true);
    if (!erBrukt(vedTidsavbrudd, tidligere)) {
      return vedTidsavbrudd;
    }
  }

  const start = trusselnivå <= 25 ? 0 : trusselnivå <= 50 ? 1 : trusselnivå <= 75 ? 2 : 3;
  const bånd = [25, 50, 75, 100];
  const rekkefølge = Array.from({ length: bånd.length }, (_, i) => bånd[(start + i) % bånd.length]);

  for (const nivå of rekkefølge) {
    const kandidat = hentFallbackKommentar(nivå, varRiktig);
    if (!erBrukt(kandidat, tidligere)) {
      return kandidat;
    }
  }

  // Alle fire er brukt — en runde har fem spørsmål. Ta den som ble brukt tidligst i runden,
  // slik at gjentakelsen kommer lengst mulig unna første gang den ble sagt.
  let tidligstTekst = hentFallbackKommentar(trusselnivå, varRiktig);
  let tidligstPlass = tidligere.findIndex((tekst) => normaliser(tekst) === normaliser(tidligstTekst));
  if (tidligstPlass < 0) tidligstPlass = Number.MAX_SAFE_INTEGER;

  for (const nivå of rekkefølge) {
    const kandidat = hentFallbackKommentar(nivå, varRiktig);
    const plass = tidligere.findIndex((tekst) => normaliser(tekst) === normaliser(kandidat));
    if (plass >= 0 && plass < tidligstPlass) {
      tidligstTekst = kandidat;
      tidligstPlass = plass;
    }
  }
  return tidligstTekst;
}

export async function genererBjarneKommentar(params: GenererKommentarParams): Promise<string> {
  const { spørsmål, valgtAlternativId, varRiktig, trusselnivå, tidsavbrudd } = params;
  const tidligere = (params.tidligereKommentarer ?? []).filter((tekst) => typeof tekst === "string" && tekst.trim().length > 0);

  const valgtAlternativ = spørsmål.alternativer.find((a) => a.id === valgtAlternativId);
  const riktigAlternativ = spørsmål.alternativer.find((a) => a.id === spørsmål.riktigAlternativId);

  const valgtTekst = tidsavbrudd || valgtAlternativId === "tidsavbrudd"
    ? "TIDSAVBRUDD (Spilleren rakk ikke å svare innen fristen)"
    : (valgtAlternativ ? valgtAlternativ.tekst : "Ukjent alternativ");
  const riktigTekst = riktigAlternativ ? riktigAlternativ.tekst : "Ukjent fasit";
  const tilstand = hentTrusselnivåTilstand(trusselnivå);

  // Reserveteksten som gjelder dette nivået og utfallet — roterer bort fra alt som er brukt.
  const utgangspunkt = velgReservekommentar(trusselnivå, varRiktig, tidligere, tidsavbrudd);

  const lagInput = (grunnlag: string) => `${spørsmål.historie ? `Skadesaken spilleren fikk: ${spørsmål.historie}\n` : ""}Spørsmål: ${spørsmål.tekst}
Spillerens valgte svar: ${valgtTekst}
Resultat: ${tidsavbrudd ? "FEIL/GALT (Tidsavbrudd - tiden gikk ut)" : (varRiktig ? "RIKTIG" : "FEIL/GALT")}
Fasit / Riktig svar: ${riktigTekst}
Kilde i vilkårene: ${spørsmål.kilde}
Spillerens trusselnivå etter svaret: ${trusselnivå} (Tilstand: ${tilstand})

UTGANGSPUNKT — lagets ferdige reservetekst for dette svaret. Kommentaren din skal være denne,
nesten ordrett:
«${grunnlag}»${tidligere.length > 0 ? `

Kommentarer du allerede har gitt i denne runden — ingen av dem kan brukes igjen, verbatim eller nesten:
${tidligere.map((tekst, i) => `${i + 1}. ${tekst}`).join("\n")}` : ""}
Vennligst gi din kommentar som Bjarne i det påkrevde JSON-formatet {"kommentar": "..."}.`;

  try {
    const første = parseBjarneKommentar(
      await genererSvarFraGateway({ instructions: BJARNE_SYSTEM_PROMPT, input: lagInput(utgangspunkt) })
    );

    if (!erBrukt(første, tidligere)) {
      return første;
    }

    // Han gjentok seg. Nytt utgangspunkt, og avtalebruddet skrevet rett ut.
    const nyttUtgangspunkt = velgReservekommentar(trusselnivå, varRiktig, [...tidligere, første], tidsavbrudd);
    const påNytt = parseBjarneKommentar(
      await genererSvarFraGateway({
        instructions: BJARNE_SYSTEM_PROMPT,
        input: `${lagInput(nyttUtgangspunkt)}

Du leverte nettopp «${første}», som er en gjentakelse av noe du har sagt før. Bruk det nye utgangspunktet.`
      })
    );

    if (!erBrukt(påNytt, tidligere)) {
      return påNytt;
    }

    return velgReservekommentar(trusselnivå, varRiktig, tidligere, tidsavbrudd);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[bjarneService] AI Gateway feilet, bruker fallback. Årsak: ${errorMsg}`);
    return velgReservekommentar(trusselnivå, varRiktig, tidligere, tidsavbrudd);
  }
}
