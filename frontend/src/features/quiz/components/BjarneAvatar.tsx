import React from "react";
import { Avatar, Box, Tooltip } from "@mantine/core";
import { TrusselnivåTilstand } from "../types/quizTypes.js";

type Props = {
  tilstand: TrusselnivåTilstand;
  nivå: number;
};

export const BjarneAvatar: React.FC<Props> = ({ tilstand, nivå }) => {
  const hentFargeOgGlyph = (): { farge: string; bg: string; uttrykk: string } => {
    switch (tilstand) {
      case "rolig":
        return { farge: "#22d3ee", bg: "rgba(34, 211, 238, 0.15)", uttrykk: "☕ (Rolig)" };
      case "irritert":
        return { farge: "#facc15", bg: "rgba(250, 204, 21, 0.15)", uttrykk: "🤨 (Irritert)" };
      case "nervøs":
        return { farge: "#fb923c", bg: "rgba(251, 146, 60, 0.15)", uttrykk: "😰 (Nervøs)" };
      case "i panikk":
        return { farge: "#f87171", bg: "rgba(248, 113, 113, 0.25)", uttrykk: "😱 (I panikk)" };
    }
  };

  const { farge, bg, uttrykk } = hentFargeOgGlyph();

  return (
    <Tooltip label={`Bjarne (${uttrykk} - ${nivå}%)`} withArrow position="top">
      <Box style={{ position: "relative", display: "inline-block" }}>
        <Avatar
          radius="xl"
          size={64}
          style={{
            backgroundColor: bg,
            border: `3px solid ${farge}`,
            color: farge,
            fontSize: "28px",
            fontWeight: 800,
            boxShadow: `0 0 16px ${farge}66`,
            transition: "all 0.4s ease"
          }}
        >
          B
        </Avatar>
      </Box>
    </Tooltip>
  );
};
