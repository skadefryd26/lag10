import { Router, Request, Response } from "express";
import { SPORSMAL_BANK } from "../data/sporsmal.js";
import { SpørsmålResponse, SvarRequest, SvarResponse } from "../types/quizTypes.js";
import { beregnNyttTrusselnivå } from "../services/trusselnivaa.js";
import { genererBjarneKommentar } from "../services/bjarneService.js";

const router = Router();

let tilgjengeligeSpørsmål: string[] = [];

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

router.get("/sporsmal", (_req: Request, res: Response) => {
  if (tilgjengeligeSpørsmål.length === 0) {
    fyllOgStokkKø();
  }

  const nesteId = tilgjengeligeSpørsmål.shift();
  const spørsmålDokument = SPORSMAL_BANK.find((s) => s.id === nesteId) ?? SPORSMAL_BANK[0];

  const respons: SpørsmålResponse = {
    id: spørsmålDokument.id,
    tekst: spørsmålDokument.tekst,
    alternativer: stokk(spørsmålDokument.alternativer)
  };

  res.json(respons);
});

router.post("/svar", async (req: Request, res: Response) => {
  const body = req.body as Partial<SvarRequest>;

  if (!body || typeof body.spørsmålId !== "string" || typeof body.valgtAlternativId !== "string" || typeof body.trusselnivå !== "number") {
    res.status(400).json({ error: "Ugyldig forespørsel. Må inneholde spørsmålId, valgtAlternativId og trusselnivå." });
    return;
  }

  const spørsmål = SPORSMAL_BANK.find((s) => s.id === body.spørsmålId);
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
    trusselnivå: body.trusselnivå,
    tidsavbrudd: isTimeout
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

export default router;
