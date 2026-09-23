import React from "react";
import { Badge, Box, Group, Text } from "@mantine/core";

type Props = {
  bevisfotoTekst?: string;
};

export const Bevisfoto: React.FC<Props> = ({ bevisfotoTekst }) => {
  if (!bevisfotoTekst || !bevisfotoTekst.trim()) {
    return null;
  }

  return (
    <Box
      p="sm"
      mt="sm"
      className="bevisfoto-card"
      style={{
        backgroundColor: "#F8FAFC",
        borderRadius: "16px",
        border: "2px dashed #B07BE8",
        boxShadow: "0 4px 12px rgba(176, 123, 232, 0.1)"
      }}
    >
      <Group gap="xs" mb={6}>
        <Badge
          size="sm"
          variant="filled"
          radius="xl"
          style={{
            background: "linear-gradient(135deg, #B07BE8 0%, #8E7BE8 100%)",
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: "0.75rem",
            padding: "4px 10px",
            letterSpacing: "0.5px"
          }}
        >
          📷 BEVISFOTO (SKADESAK)
        </Badge>
      </Group>
      <Text
        size="sm"
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          color: "#1F2A44",
          lineHeight: 1.5,
          fontStyle: "italic",
          fontWeight: 600
        }}
      >
        "{bevisfotoTekst.trim()}"
      </Text>
    </Box>
  );
};
