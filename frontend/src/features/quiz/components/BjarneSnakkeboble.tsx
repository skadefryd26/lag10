import type React from "react";
import { Box, Text } from "@mantine/core";
import type { TrusselnivåTilstand } from "../types/quizTypes.js";

type Props = {
  tilstand: TrusselnivåTilstand;
  kommentar: string | null;
  tenker: boolean;
  laster: boolean;
};

// Det Bjarne sier mens spilleren tenker, før han har fått noe å kommentere.
const VENTEREPLIKKER: Record<TrusselnivåTilstand, string> = {
  rolig: "*sukk* Vel. Svar da. Jeg har kaffe som blir kald.",
  irritert: "Flaks er ikke kunnskap. Bare så det er sagt.",
  nervøs: "Du har lest vilkårene på forhånd, ikke sant? Det er nesten juks.",
  "i panikk": "Kan vi ikke bare ta en kaffepause? Nå? Vær så snill?"
};

export const BjarneSnakkeboble: React.FC<Props> = ({ tilstand, kommentar, tenker, laster }) => {
  let tekst = VENTEREPLIKKER[tilstand];
  if (laster) tekst = "Et øyeblikk. Jeg blar i vilkårene. Igjen.";
  if (tenker) tekst = "Hmm… la meg sjekke om du tilfeldigvis hadde rett. *slurp*";
  if (kommentar) tekst = kommentar;

  return (
    <Box className="bjarne-snakkeboble" role="status" aria-live="polite">
      <Text className="bjarne-snakkeboble-navn">Bjarne sier</Text>
      <Text className={tenker ? "bjarne-snakkeboble-tekst bjarne-tenker" : "bjarne-snakkeboble-tekst"}>
        «{tekst}»
      </Text>
    </Box>
  );
};
