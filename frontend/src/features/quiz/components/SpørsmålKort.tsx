import React from "react";
import { Badge, Box, Button, Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Spørsmål, SvarResponse } from "../types/quizTypes.js";
import { Bevisfoto } from "./Bevisfoto.js";

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
  const erTidsavbrudd = valgtId === "tidsavbrudd";

  return (
    <Card
      padding="xl"
      radius="24px"
      style={{
        backgroundColor: "#FFFFFF",
        border: "none",
        boxShadow: "0 10px 30px rgba(31, 42, 68, 0.14)"
      }}
    >
      <Stack gap="lg">
        {erTidsavbrudd && (
          <Group justify="flex-start">
            <Badge
              color="red"
              size="lg"
              variant="filled"
              radius="xl"
              style={{
                fontSize: "0.9rem",
                padding: "10px 18px",
                backgroundColor: "#EF4444",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
              }}
            >
              ⏱️ Tiden gikk ut! Bjarne svarte for deg.
            </Badge>
          </Group>
        )}

        <Text size="xl" fw={800} style={{ color: "#1F2A44", lineHeight: 1.4, fontSize: "1.35rem" }}>
          {spørsmål.tekst}
        </Text>

        <Stack gap="md">
          {spørsmål.alternativer.map((alt) => {
            const erValgt = valgtId === alt.id;
            const erRiktigFasit = harBesvart && svarResultat.riktigAlternativId === alt.id;
            const erFeilValgt = harBesvart && erValgt && !svarResultat.riktig;

            let bgColor = "#F8FAFC";
            let borderColor = "#E2E8F0";
            let textColor = "#1F2A44";

            if (erRiktigFasit) {
              bgColor = "#22C55E";
              borderColor = "#16A34A";
              textColor = "#FFFFFF";
            } else if (erFeilValgt) {
              bgColor = "#EF4444";
              borderColor = "#DC2626";
              textColor = "#FFFFFF";
            } else if (erValgt) {
              bgColor = "#FFC542";
              borderColor = "#F59E0B";
              textColor = "#1F2A44";
            }

            const erNøytral = !erRiktigFasit && !erFeilValgt && !erValgt;

            return (
              <Button
                key={alt.id}
                size="lg"
                radius="xl"
                disabled={isSubmitting || harBesvart}
                onClick={() => onVelgAlternativ(alt.id)}
                fullWidth
                data-alternativ
                style={{
                  height: "auto",
                  minHeight: "64px",
                  padding: "16px 24px",
                  justifyContent: "flex-start",
                  whiteSpace: "normal",
                  textAlign: "left",
                  fontSize: "1.05rem",
                  backgroundColor: bgColor,
                  border: `2px solid ${borderColor}`,
                  color: textColor,
                  opacity: 1,
                  boxShadow: erNøytral ? "0 2px 8px rgba(31, 42, 68, 0.04)" : "0 4px 14px rgba(0, 0, 0, 0.12)",
                  transition: "all 0.2s ease"
                }}
              >
                <Group justify="space-between" align="center" style={{ width: "100%" }}>
                  <Text fw={700} style={{ color: textColor }}>{alt.tekst}</Text>
                  {erRiktigFasit && (
                    <Badge
                      radius="xl"
                      size="md"
                      style={{
                        backgroundColor: erTidsavbrudd ? "#FFC542" : "#FFFFFF",
                        color: erTidsavbrudd ? "#1F2A44" : "#15803D",
                        fontWeight: 800
                      }}
                    >
                      {erTidsavbrudd ? "Riktig fasit (Du rakk ikke svare)" : "Riktig svar"}
                    </Badge>
                  )}
                  {erFeilValgt && (
                    <Badge radius="xl" size="md" style={{ backgroundColor: "#FFFFFF", color: "#B91C1C", fontWeight: 800 }}>
                      Ditt svar (Feil)
                    </Badge>
                  )}
                </Group>
              </Button>
            );
          })}
        </Stack>

        {harBesvart && (
          <Stack gap="md" mt="sm" className="bjarne-kommentar-box">
            <Box
              p="lg"
              style={{
                backgroundColor: svarResultat.riktig ? "#F0FDF4" : "#FEF2F2",
                borderRadius: "20px",
                borderLeft: `6px solid ${svarResultat.riktig ? "#22C55E" : "#EF4444"}`,
                boxShadow: "0 4px 16px rgba(31, 42, 68, 0.06)"
              }}
            >
              <Group gap="sm" mb="xs">
                <ThemeIcon
                  color={svarResultat.riktig ? "teal" : "red"}
                  variant="filled"
                  size="md"
                  radius="xl"
                  style={{
                    backgroundColor: svarResultat.riktig ? "#22C55E" : "#EF4444"
                  }}
                >
                  {svarResultat.riktig ? "✓" : (erTidsavbrudd ? "⏱️" : "✕")}
                </ThemeIcon>
                <Text fw={800} style={{ color: svarResultat.riktig ? "#15803D" : "#B91C1C" }}>
                  {svarResultat.riktig
                    ? "Riktig besvart!"
                    : (erTidsavbrudd ? "Tiden gikk ut — Feil besvart" : "Feil besvart")}
                </Text>
              </Group>

              <Text size="xs" fw={700} style={{ color: "#6B7793" }} mb="xs">
                Kilde: {svarResultat.kilde}
              </Text>

              <Text size="md" fw={600} style={{ fontStyle: "italic", color: "#1F2A44", lineHeight: 1.5 }}>
                «{svarResultat.bjarneKommentar}»
              </Text>

              <Bevisfoto bevisfotoTekst={svarResultat.bevisfoto} />
            </Box>

            <Group justify="flex-end">
              <Button
                size="lg"
                radius="xl"
                onClick={onNesteSpørsmål}
                style={{
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  background: "linear-gradient(135deg, #FFD56B 0%, #FFC542 100%)",
                  color: "#1F2A44",
                  boxShadow: "0 6px 20px rgba(255, 197, 66, 0.4)",
                  border: "none"
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
