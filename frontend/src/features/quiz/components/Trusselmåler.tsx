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
        return "cyan";
      case "irritert":
        return "yellow";
      case "nervøs":
        return "orange";
      case "i panikk":
        return "red";
    }
  };

  return (
    <Box style={{ width: "100%" }}>
      <Group justify="space-between" mb={6}>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1}>
          Bjarnes trusselnivå
        </Text>
        <Group gap={6}>
          <Text size="sm" fw={800} style={{ textTransform: "capitalize" }}>
            {tilstand}
          </Text>
          <Text size="xs" c="dimmed">
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
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
          backgroundColor: "#1e293b"
        }}
      />
    </Box>
  );
};
