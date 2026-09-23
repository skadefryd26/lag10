import { Router, Request, Response } from "express";
import { SPORSMAL_BANK } from "../data/sporsmal.js";
import { SpørsmålDokument, SpørsmålResponse, SvarRequest, SvarResponse, ResultatRequest, ResultatResponse } from "../types/quizTypes.js";
import { beregnNyttTrusselnivå } from "../services/trusselnivaa.js";
import { genererBjarneKommentar } from "../services/bjarneService.js";
import { genererResultatkommentar } from "../services/resultatService.js";
import { genererHistoriespørsmål } from "../services/historieGenerator.js";

const router = Router();

let tilgjengeligeSpørsmål: string[] = [];

/** Historiespørsmål Bjarne har diktet opp i denne økta, så fasiten finnes når svaret kommer inn. */
const diktedeSpørsmål = new Map<string, SpørsmålDokument>();
const MAKS_DIKTEDE_I_MINNE = 200;

function husk(spørsmål: SpørsmålDokument): void {
  if (diktedeSpørsmål.size >= MAKS_DIKTEDE_I_MINNE) {
    const eldste = diktedeSpørsmål.keys().next().value;
    if (eldste) {
      diktedeSpørsmål.delete(eldste);
    }
  }
  diktedeSpørsmål.set(spørsmål.id, spørsmål);
}

function finnSpørsmål(id: string): SpørsmålDokument | undefined {
  return diktedeSpørsmål.get(id) ?? SPORSMAL_BANK.find((s) => s.id === id);
}

function stokk<T>(liste: readonly T[]): T[] {
  const kopi = [...liste];
  for (let i = kopi.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopi[i], kopi[j]] = [kopi[j], kopi[i]];
  }
  return kopi;
}

function fyllOgStokkKø(): void {
  tilgjengeligeSpørsmål = stokk(SPORSMAL_BANK.map((s) => s.id));
}

function nesteBankSpørsmål(): SpørsmålDokument {
  if (tilgjengeligeSpørsmål.length === 0) {
    fyllOgStokkKø();
  }
  const nesteId = tilgjengeligeSpørsmål.shift();
  return SPORSMAL_BANK.find((s) => s.id === nesteId) ?? SPORSMAL_BANK[0];
}

/**
 * Bjarne dikter i forkant, så spilleren slipper å vente mens han tenker.
 * Bufferet fylles i bakgrunnen med én gang et spørsmål er hentet ut.
 */
const ferdigDiktede: SpørsmålDokument[] = [];
const BUFFERMÅL = 2;
let fyllerBuffer = false;

async function fyllBuffer(): Promise<void> {
  if (fyllerBuffer) return;
  fyllerBuffer = true;
  try {
    while (ferdigDiktede.length < BUFFERMÅL) {
      const historie = await genererHistoriespørsmål(nesteBankSpørsmål());
      if (!historie) break;
      husk(historie);
      ferdigDiktede.push(historie);
    }
  } finally {
    fyllerBuffer = false;
  }
}

router.get("/sporsmal", async (_req: Request, res: Response) => {
  let spørsmålDokument = ferdigDiktede.shift();

  if (!spørsmålDokument) {
    // Ingenting ferdig diktet ennå — vent på Bjarne, og fall tilbake til banken hvis han svikter.
    const bankSpørsmål = nesteBankSpørsmål();
    const historie = await genererHistoriespørsmål(bankSpørsmål);
    if (historie) {
      husk(historie);
    }
    spørsmålDokument = historie ?? bankSpørsmål;
  }

  const respons: SpørsmålResponse = {
    id: spørsmålDokument.id,
    tekst: spørsmålDokument.tekst,
    historie: spørsmålDokument.historie,
    alternativer: stokk(spørsmålDokument.alternativer)
  };

  res.json(respons);

  void fyllBuffer();
});

router.post("/svar", async (req: Request, res: Response) => {
  const body = req.body as Partial<SvarRequest>;

  if (!body || typeof body.spørsmålId !== "string" || typeof body.valgtAlternativId !== "string" || typeof body.trusselnivå !== "number") {
    res.status(400).json({ error: "Ugyldig forespørsel. Må inneholde spørsmålId, valgtAlternativId og trusselnivå." });
    return;
  }

  const spørsmål = finnSpørsmål(body.spørsmålId);
  if (!spørsmål) {
    res.status(400).json({ error: `Ukjent spørsmålId: ${body.spørsmålId}` });
    return;
  }

  const isTimeout = Boolean(body.tidsavbrudd || body.valgtAlternativId === "tidsavbrudd");
  const varRiktig = !isTimeout && body.valgtAlternativId === spørsmål.riktigAlternativId;
  const nyttTrusselnivå = beregnNyttTrusselnivå(body.trusselnivå, varRiktig);

  const { bjarneKommentar, bevisfoto } = await genererBjarneKommentar({
    spørsmål,
    valgtAlternativId: body.valgtAlternativId,
    varRiktig,
    trusselnivå: nyttTrusselnivå,
    tidsavbrudd: isTimeout,
    tidligereKommentarer: Array.isArray(body.tidligereKommentarer) ? body.tidligereKommentarer : []
  });

  const svarRespons: SvarResponse = {
    riktig: varRiktig,
    riktigAlternativId: spørsmål.riktigAlternativId,
    kilde: spørsmål.kilde,
    bjarneKommentar,
    nyttTrusselnivå,
    bevisfoto
  };

  res.json(svarRespons);
});

router.post("/resultat", async (req: Request, res: Response) => {
  const body = req.body as Partial<ResultatRequest>;

  if (
    !body ||
    typeof body.riktige !== "number" ||
    typeof body.totalt !== "number" ||
    typeof body.besteRekke !== "number"
  ) {
    res.status(400).json({ error: "Ugyldig forespørsel. Må inneholde riktige, totalt og besteRekke." });
    return;
  }

  const respons: ResultatResponse = {
    kommentar: await genererResultatkommentar({
      riktige: body.riktige,
      totalt: body.totalt,
      besteRekke: body.besteRekke,
      trusselnivå: typeof body.trusselnivå === "number" ? body.trusselnivå : 0,
      tidligereKommentarer: Array.isArray(body.tidligereKommentarer) ? body.tidligereKommentarer : []
    })
  };

  res.json(respons);
});

export default router;
