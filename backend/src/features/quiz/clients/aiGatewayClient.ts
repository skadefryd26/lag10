type AIGatewayPayload = {
  instructions: string;
  input: string;
};

type ResponseContent = {
  type: string;
  text?: string;
};

type ResponseOutput = {
  type: string;
  content?: ResponseContent[];
};

type ResponsesApiResponse = {
  id?: string;
  model?: string;
  output?: ResponseOutput[];
};

export async function genererSvarFraGateway(payload: AIGatewayPayload): Promise<string> {
  const token = process.env.AI_GATEWAY_TOKEN;
  if (!token) {
    throw new Error("AI_GATEWAY_TOKEN er ikke satt i miljøvariabler.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch("https://genai.gjensidige.io/openai/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        instructions: payload.instructions,
        input: payload.input,
        stream: false
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Ingen responstekst");
      throw new Error(`AI Gateway returnerte status ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as ResponsesApiResponse;

    if (!data.output || !Array.isArray(data.output)) {
      throw new Error("Ugyldig responsstruktur fra AI Gateway (mangler output-array).");
    }

    let samletTekst = "";
    for (const item of data.output) {
      if (item.content && Array.isArray(item.content)) {
        for (const contentItem of item.content) {
          if (contentItem.text) {
            samletTekst += contentItem.text;
          }
        }
      }
    }

    if (!samletTekst.trim()) {
      throw new Error("AI Gateway returnerte tom tekst.");
    }

    return samletTekst.trim();
  } finally {
    clearTimeout(timeoutId);
  }
}
