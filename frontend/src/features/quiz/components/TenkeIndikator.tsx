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
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        border: "2px solid #FFC542",
        boxShadow: "0 8px 24px rgba(255, 197, 66, 0.25)"
      }}
      className="bjarne-thinking-pulse"
    >
      <Group gap="sm">
        <Text size="xl">☕</Text>
        <Text size="md" fw={700} style={{ color: "#1F2A44", fontStyle: "italic" }}>
          {TENKE_MELDINGER[indeks]}
        </Text>
      </Group>
    </Box>
  );
};
