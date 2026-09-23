import React from "react";
import { Badge, Group, Box } from "@mantine/core";
import { SpillerAvatar } from "./SpillerAvatar.js";
import { BjarneAvatar } from "./BjarneAvatar.js";
import { TrusselnivåTilstand } from "../types/quizTypes.js";

type Props = {
  streak: number;
  tilstand: TrusselnivåTilstand;
  trusselnivå: number;
};

export const VsBanner: React.FC<Props> = ({ streak, tilstand, trusselnivå }) => {
  return (
    <Group justify="center" align="center" gap="xl" py="xs">
      <SpillerAvatar streak={streak} />
      
      <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Badge
          size="lg"
          radius="xl"
          style={{
            background: "linear-gradient(135deg, #FF4D6D 0%, #FF7B93 100%)",
            color: "#FFFFFF",
            fontWeight: 900,
            fontSize: "1.1rem",
            padding: "8px 16px",
            boxShadow: "0 4px 14px rgba(255, 77, 109, 0.4)",
            border: "2px solid #FFFFFF",
            letterSpacing: "1px"
          }}
        >
          VS
        </Badge>
      </Box>

      <BjarneAvatar tilstand={tilstand} nivå={trusselnivå} />
    </Group>
  );
};
