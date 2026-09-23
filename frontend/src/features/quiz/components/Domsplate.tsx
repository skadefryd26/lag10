import type React from "react";
import { Box, Button, Group, Stack, Text, Badge } from "@mantine/core";
import type { SvarResponse } from "../types/quizTypes.js";

type Props = {
  svarResultat: SvarResponse;
  erTidsavbrudd: boolean;
  onNesteSpørsmål: () => void;
  /** Standard er «Neste spørsmål →»; siste spørsmål i runden sier «Se resultatet →». */
  tekstKnapp?: string;
};

export const Domsplate: React.FC<Props> = ({
  svarResultat,
  erTidsavbrudd,
  onNesteSpørsmål,
  tekstKnapp = "Neste spørsmål →"
}) => {
  const erRiktig = svarResultat.riktig;

  let farge = "#22c55e";
  let bgGradient = "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)";
  let statusTittel = "MEDHOLD // RIKTIG VILKÅRSPRØVING";
  
  if (erTidsavbrudd) {
    farge = "#ef4444";
    bgGradient = "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)";
    statusTittel = "TIDEN GIKK UT — BJARNE OVERTOK";
  } else if (!erRiktig) {
    farge = "#ef4444";
    bgGradient = "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)";
    statusTittel = "AVSLÅTT // FEIL VILKÅRSPRØVING";
  }

  return (
    <Box
      p="lg"
      style={{
        background: bgGradient,
        borderRadius: "20px",
        border: `2px solid ${farge}`,
        boxShadow: `0 10px 30px ${erRiktig ? "rgba(34, 197, 94, 0.25)" : "rgba(239, 68, 68, 0.3)"}`
      }}
      className="bjarne-kommentar-box corner-brackets"
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Badge
            size="lg"
            variant="filled"
            radius="sm"
            style={{
              backgroundColor: farge,
              color: "#0f172a",
              fontWeight: 900,
              fontSize: "0.85rem",
              letterSpacing: "1.5px",
              padding: "8px 14px"
            }}
          >
            DOMMEN ER FALT
          </Badge>
          <Text fw={800} size="sm" style={{ color: farge, letterSpacing: "1px" }}>
            {statusTittel}
          </Text>
        </Group>

        <Box p="sm" className="domsplate-kilde" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" }}>
          <Text size="xs" fw={800} style={{ color: "#94a3b8", letterSpacing: "1px" }} mb={2}>
            VILKÅRSKILDE
          </Text>
          <Text size="sm" fw={700} style={{ color: "#f8fafc" }}>
            {svarResultat.kilde}
          </Text>
        </Box>

        <Group justify="flex-end" mt="xs">
          <Button
            size="lg"
            radius="xl"
            onClick={onNesteSpørsmål}
            style={{
              fontWeight: 900,
              fontSize: "1.05rem",
              background: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)",
              color: "#0f172a",
              boxShadow: "0 6px 20px rgba(250, 204, 21, 0.4)",
              border: "none",
              padding: "12px 28px",
              cursor: "pointer"
            }}
          >
            {tekstKnapp}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};
