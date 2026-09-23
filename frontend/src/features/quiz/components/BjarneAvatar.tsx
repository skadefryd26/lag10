import React from "react";
import { Box, Stack, Text, Tooltip } from "@mantine/core";
import { TrusselnivåTilstand } from "../types/quizTypes.js";
import { hentValiumBehov } from "./Trusselmåler.js";

type Props = {
  tilstand: TrusselnivåTilstand;
  nivå: number;
};

const VISNINGER: Record<TrusselnivåTilstand, { farge: string; tittel: string; filter: string }> = {
  rolig: { farge: "#56A7F7", tittel: "Rolig", filter: "saturate(0.9)" },
  irritert: { farge: "#FFC542", tittel: "Irritert", filter: "saturate(1.05) contrast(1.03)" },
  nervøs: { farge: "#FF7B93", tittel: "Nervøs", filter: "saturate(1.15) contrast(1.08)" },
  "i panikk": { farge: "#EF4444", tittel: "I panikk", filter: "saturate(1.3) contrast(1.15)" }
};

export const BjarneAvatar: React.FC<Props> = ({ tilstand, nivå }) => {
  const visning = VISNINGER[tilstand];

  return (
    <Stack align="center" gap={4}>
      <Tooltip label={`Bjarne (${visning.tittel} – ${hentValiumBehov(nivå)})`} withArrow position="top">
        <Box
          className={tilstand === "i panikk" ? "bjarne-photo bjarne-photo-panic" : "bjarne-photo"}
          style={{
            borderColor: visning.farge,
            boxShadow: `0 8px ${tilstand === "i panikk" ? 30 : 18}px ${visning.farge}99`
          }}
        >
          <img
            src="/assets/bjarne-avatar.jpg"
            alt="Bjarne med trekkspill, klar for quiz"
            style={{ filter: visning.filter }}
          />
          <span className="bjarne-photo-sheen" aria-hidden="true" />
        </Box>
      </Tooltip>
      <Text fw={800} size="sm" style={{ color: "#FFFFFF", textShadow: "0 2px 4px rgba(0,0,0,0.25)" }}>
        Bjarne
      </Text>
      <Text size="xs" fw={700} style={{ color: "#1F2A44", backgroundColor: visning.farge, padding: "2px 10px", borderRadius: "12px" }}>
        {visning.tittel}
      </Text>
    </Stack>
  );
};
