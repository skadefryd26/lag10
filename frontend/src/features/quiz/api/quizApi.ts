import { ResultatRequest, ResultatResponse, Spørsmål, SvarRequest, SvarResponse } from "../types/quizTypes.js";

export async function hentNesteSpørsmål(): Promise<Spørsmål> {
  const res = await fetch("/api/quiz/sporsmal");
  if (!res.ok) {
    throw new Error(`Kunne ikke hente spørsmål. Status: ${res.status}`);
  }
  return res.json();
}

export async function sendSvar(data: SvarRequest): Promise<SvarResponse> {
  const res = await fetch("/api/quiz/svar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(`Kunne ikke sende svar. Status: ${res.status}`);
  }

  return res.json();
}

export async function hentResultatkommentar(data: ResultatRequest): Promise<ResultatResponse> {
  const res = await fetch("/api/quiz/resultat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(`Kunne ikke hente resultat. Status: ${res.status}`);
  }

  return res.json();
}
