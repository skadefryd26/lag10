import React, { useEffect, useState } from "react";
import { Box, Group, Text } from "@mantine/core";

const TENKE_MELDINGER = [
  "Bjarne sukker…",
  "Bjarne leter etter kaffe…",
  "Bjarne slår opp i vilkårene…",
  "Bjarne fyller kaffekoppen sin…",
  "Bjarne vurderer å ta en pause…"
];

export const TenkeIndikator: React.FC = () => {
  const [indeks, setIndeks] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndeks((prev) => (prev + 1) % TENKE_MELDINGER.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      p="md"
      style={{
        backgroundColor: "rgba(30, 41, 59, 0.8)",
        borderRadius: "12px",
        border: "1px stroke #334155",
        backdropFilter: "blur(4px)"
      }}
      className="bjarne-thinking-pulse"
    >
      <Group gap="sm">
        <Text size="xl">☕</Text>
        <Text size="md" fw={600} c="amber.4" style={{ fontStyle: "italic" }}>
          {TENKE_MELDINGER[indeks]}
        </Text>
      </Group>
    </Box>
  );
};
