import React from "react";
import { Badge, Box, Button, Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Spørsmål, SvarResponse } from "../types/quizTypes.js";

type Props = {
  spørsmål: Spørsmål;
  valgtId: string | null;
  svarResultat: SvarResponse | null;
  isSubmitting: boolean;
  onVelgAlternativ: (id: string) => void;
  onNesteSpørsmål: () => void;
};

export const SpørsmålKort: React.FC<Props> = ({
  spørsmål,
  valgtId,
  svarResultat,
  isSubmitting,
  onVelgAlternativ,
  onNesteSpørsmål
}) => {
  const harBesvart = svarResultat !== null;

  return (
    <Card
      shadow="md"
      padding="xl"
      radius="lg"
      style={{
        backgroundColor: "#1e293b",
        border: "1px solid #334155"
      }}
    >
      <Stack gap="lg">
        {spørsmål.historie && (
          <Text size="md" style={{ color: "#e2e8f0", lineHeight: 1.65 }}>
            {spørsmål.historie}
          </Text>
        )}

        <Text size="xl" fw={700} style={{ color: "#f8fafc", lineHeight: 1.45 }}>
          {spørsmål.tekst}
        </Text>

        <Stack gap="md">
          {spørsmål.alternativer.map((alt) => {
            const erValgt = valgtId === alt.id;
            const erRiktigFasit = harBesvart && svarResultat.riktigAlternativId === alt.id;
            const erFeilValgt = harBesvart && erValgt && !svarResultat.riktig;

            let buttonColor = "slate";
            let variant: "outline" | "filled" | "light" = "outline";

            if (erRiktigFasit) {
              buttonColor = "teal";
              variant = "filled";
            } else if (erFeilValgt) {
              buttonColor = "red";
              variant = "filled";
            } else if (erValgt) {
              buttonColor = "amber";
              variant = "light";
            }

            const erNøytral = !erRiktigFasit && !erFeilValgt && !erValgt;

            return (
              <Button
                key={alt.id}
                size="lg"
                variant={variant}
                color={buttonColor}
                disabled={isSubmitting || harBesvart}
                onClick={() => onVelgAlternativ(alt.id)}
                fullWidth
                data-alternativ
                style={{
                  height: "auto",
                  minHeight: "64px",
                  padding: "14px 22px",
                  justifyContent: "flex-start",
                  whiteSpace: "normal",
                  textAlign: "left",
                  fontSize: "1.05rem",
                  backgroundColor: erNøytral ? "#273549" : undefined,
                  border: erNøytral ? "2px solid #4d5f7a" : undefined,
                  color: erNøytral ? "#f8fafc" : undefined,
                  opacity: 1,
                  transition: "all 0.15s ease"
                }}
              >
                <Group justify="space-between" style={{ width: "100%" }}>
                  <Text fw={600}>{alt.tekst}</Text>
                  {erRiktigFasit && <Badge color="teal">Riktig svar</Badge>}
                  {erFeilValgt && <Badge color="red">Ditt svar (Feil)</Badge>}
                </Group>
              </Button>
            );
          })}
        </Stack>

        {harBesvart && (
          <Stack gap="md" mt="sm" className="bjarne-kommentar-box">
            <Box
              p="md"
              style={{
                backgroundColor: svarResultat.riktig ? "rgba(20, 184, 166, 0.12)" : "rgba(239, 68, 68, 0.12)",
                borderRadius: "12px",
                borderLeft: `5px solid ${svarResultat.riktig ? "#10b981" : "#ef4444"}`
              }}
            >
              <Group gap="sm" mb="xs">
                <ThemeIcon
                  color={svarResultat.riktig ? "teal" : "red"}
                  variant="light"
                  size="md"
                  radius="xl"
                >
                  {svarResultat.riktig ? "✓" : "✕"}
                </ThemeIcon>
                <Text fw={700} c={svarResultat.riktig ? "teal.3" : "red.3"}>
                  {svarResultat.riktig ? "Riktig besvart!" : "Feil besvart"}
                </Text>
              </Group>

              <Text size="sm" c="dimmed" mb="xs">
                Kilde: {svarResultat.kilde}
              </Text>

              <Text size="md" fw={500} style={{ fontStyle: "italic", color: "#f1f5f9" }}>
                «{svarResultat.bjarneKommentar}»
              </Text>
            </Box>

            <Group justify="flex-end">
              <Button
                size="md"
                color="amber"
                onClick={onNesteSpørsmål}
                style={{
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
                }}
              >
                Neste spørsmål →
              </Button>
            </Group>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};
