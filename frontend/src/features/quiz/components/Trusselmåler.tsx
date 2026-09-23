import React from "react";
import { Box, Group, Progress, Text } from "@mantine/core";
import { TrusselnivåTilstand } from "../types/quizTypes.js";

type Props = {
  trusselnivå: number;
};

export function hentTilstand(nivå: number): TrusselnivåTilstand {
  if (nivå <= 25) return "rolig";
  if (nivå <= 50) return "irritert";
  if (nivå <= 75) return "nervøs";
  return "i panikk";
}

export const Trusselmåler: React.FC<Props> = ({ trusselnivå }) => {
  const tilstand = hentTilstand(trusselnivå);

  const hentProgressFarge = () => {
    switch (tilstand) {
      case "rolig":
        return "#3B8EF0";
      case "irritert":
        return "#FFC542";
      case "nervøs":
        return "#FF7B93";
      case "i panikk":
        return "#EF4444";
    }
  };

  return (
    <Box style={{ width: "100%" }}>
      <Group justify="space-between" mb={6}>
        <Text size="xs" fw={800} style={{ color: "#6B7793", letterSpacing: "1px", textTransform: "uppercase" }}>
          Bjarnes trusselnivå
        </Text>
        <Group gap={6}>
          <Text size="sm" fw={800} style={{ color: "#1F2A44", textTransform: "capitalize" }}>
            {tilstand}
          </Text>
          <Text size="xs" fw={700} style={{ color: "#6B7793" }}>
            ({trusselnivå}%)
          </Text>
        </Group>
      </Group>
      <Progress
        value={trusselnivå}
        color={hentProgressFarge()}
        size="lg"
        radius="xl"
        animated={trusselnivå > 75}
        style={{
          boxShadow: "inset 0 2px 4px rgba(31, 42, 68, 0.12)",
          backgroundColor: "#E2E8F0"
        }}
      />
    </Box>
  );
};
