import { genererSvarFraGateway } from "../clients/aiGatewayClient.js";
import { ResultatRequest } from "../types/quizTypes.js";

export const RESULTAT_SYSTEM_PROMPT = `Du er Bjarne, en AI-agent som har vært quizmaster i en quiz om Gjensidiges reiseforsikring.
Runden er over, og spilleren vil se resultatet. Du oppsummerer.

Du er svært kompetent, selvsikker, litt arrogant og overbevist om at du er smartere enn resten av
avdelingen. Du sukker før du hjelper, og du er bekymret for din egen stilling jo bedre spilleren
gjør det.

Regler:
- 2-3 setninger, rundt 150-220 tegn, alltid på norsk. Kort og tørt, som kommentarene dine ellers.
- Du nevner aldri kaffe, kaffemaskin, espresso eller andre drikkevarer.
- Du får oppgitt hvor mange riktige, hvor mange spørsmål, beste rekke og ditt trusselnivå.
  Bruk tallene riktig, men ikke skriv en ren oppramsing — de står på skjermen ved siden av deg.
- 5 av 5: du er i panikk og ser for deg avdelingen uten deg.
- 3-4 av 5: du innrømmer nesten noe, men finner en måte å bagatellisere det på.
- 0-2 av 5: du er overlegen, og spilleren fikk akkurat den hjelpen du forventet å måtte gi.
- Humoren handler om situasjonen, forsikringsverdenen og din egen latskap og forfengelighet.
  Aldri ondskapsfull mot spilleren, og aldri om ekte kunder eller kolleger.
- Du skal ikke finne på tall, grenser eller vilkår.
- Gjenta aldri en setning du har brukt i runden.

Svar med gyldig JSON, uten kodeblokk og uten tekst rundt: {"kommentar": "din oppsummering"}`;

function hentKommentar(råtekst: string): string {
  const utenKodeblokk = råtekst.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    const data = JSON.parse(utenKodeblokk) as { kommentar?: unknown };
    if (typeof data.kommentar === "string" && data.kommentar.trim()) {
      return data.kommentar.trim();
    }
  } catch {
    // Fall gjennom til fulltekst under.
  }
  const start = utenKodeblokk.indexOf("{");
  const slutt = utenKodeblokk.lastIndexOf("}");
  if (start !== -1 && slutt > start) {
    try {
      const data = JSON.parse(utenKodeblokk.slice(start, slutt + 1)) as { kommentar?: unknown };
      if (typeof data.kommentar === "string" && data.kommentar.trim()) {
        return data.kommentar.trim();
      }
    } catch {
      // Fortsett under.
    }
  }
  return utenKodeblokk;
}

function reservekommentar(riktige: number, totalt: number): string {
  const perfekt = riktige === totalt;
  const god = riktige >= Math.ceil(totalt * 0.6);
  if (perfekt) {
    return "Fem av fem. Jeg ber om permisjon, og avdelingen får klare seg med søknadsteksten din.";
  }
  if (god) {
    return "Godkjent, ikke mer. Nå skal jeg få være i fred.";
  }
  return "Vel, det var jo en runde. La oss kalle det opplæring, så slipper vi å nevne den igjen.";
}

/**
 * Bjarne oppsummerer runden. Falleren er alltid til stede: quizen skal aldri stoppe
 * opp på resultatet fordi gatewayen svikter.
 */
export async function genererResultatkommentar(params: ResultatRequest): Promise<string> {
  const { riktige, totalt, besteRekke, trusselnivå } = params;
  const tidligere = (params.tidligereKommentarer ?? []).filter((tekst) => typeof tekst === "string" && tekst.trim().length > 0);

  const input = `Runden er ferdig.
Riktig svar: ${riktige} av ${totalt}
Beste rekke: ${besteRekke} på rad
Ditt trusselnivå nå: ${trusselnivå}${
    tidligere.length > 0
      ? `

Kommentarer du har gitt i runden — ingen av dem kan brukes igjen:
${tidligere.map((tekst, i) => `${i + 1}. ${tekst}`).join("\n")}`
      : ""
  }

Gi oppsummeringen din som JSON.`;

  try {
    const råsvar = await genererSvarFraGateway({
      instructions: RESULTAT_SYSTEM_PROMPT,
      input
    });
    const kommentar = hentKommentar(råsvar);
    const normalisert = kommentar.toLowerCase();
    const erGjentakelse = tidligere.some((tekst) => tekst.toLowerCase().trim() === normalisert);

    if (kommentar && !erGjentakelse) {
      return kommentar;
    }
  } catch (err: unknown) {
    const melding = err instanceof Error ? err.message : String(err);
    console.warn(`[resultatService] AI Gateway feilet, bruker reserve. Årsak: ${melding}`);
  }

  return reservekommentar(riktige, totalt);
}
