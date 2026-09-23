import type React from "react";
import { Box, Button, Group, Stack, Text, Title, Badge } from "@mantine/core";

type Props = {
  riktige: number;
  totalt: number;
  besteRekke: number;
  /** Bjarnes oppsummering. Null mens den hentes, eller ved feil. */
  kommentar: string | null;
  erLastet: boolean;
  onSpillIgjen: () => void;
};

/**
 * Resultatkortet arver quizens lyse papirutseende fra index.css
 * (.quiz-main-column .corner-brackets) — fargene her er valgt for å passe det,
 * ikke i motsetning til det.
 */
export const ResultatKort: React.FC<Props> = ({
  riktige,
  totalt,
  besteRekke,
  kommentar,
  erLastet,
  onSpillIgjen
}) => {
  const perfekt = riktige === totalt;

  const tallfelt = {
    backgroundColor: "var(--surface-soft, #f4f6fb)",
    border: "1px solid var(--line-strong, #cbd5e5)",
    borderRadius: "14px",
    flex: 1
  } as const;

  return (
    <Box p="xl" className="corner-brackets" style={{ width: "100%" }}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Text className="eyebrow" mb={0}>
            {perfekt ? "FULLT HUS" : "RUNDEN ER SLUTT"}
          </Text>
          <Badge
            size="md"
            variant="filled"
            radius="xl"
            style={{
              backgroundColor: perfekt ? "#facc15" : "var(--line-strong, #cbd5e5)",
              color: "var(--ink-strong, #17213a)",
              fontWeight: 900
            }}
          >
            {perfekt ? "BJARNE I PANIKK" : "DOMMEN ER FALT"}
          </Badge>
        </Group>

        <Title order={2} style={{ letterSpacing: "-0.5px" }}>
          {riktige}/{totalt} riktig
        </Title>

        <Group gap="sm">
          <Box p="sm" style={tallfelt}>
            <Text size="xs" fw={800} mb={2}>
              RIKTIGE
            </Text>
            <Text size="lg" fw={800}>
              {riktige} av {totalt}
            </Text>
          </Box>

          <Box p="sm" style={tallfelt}>
            <Text size="xs" fw={800} mb={2}>
              BESTE REKKE
            </Text>
            <Text size="lg" fw={800}>
              {besteRekke} på rad
            </Text>
          </Box>
        </Group>

        <Box
          p="md"
          style={{
            backgroundColor: "#fff8dd",
            border: "1px solid #f2d772",
            borderRadius: "12px",
            borderLeft: "4px solid #ca8a04"
          }}
        >
          <Text size="xs" fw={800} mb={2}>
            BJARNE OPPSUMERER
          </Text>
          <Text size="sm" fw={600} style={{ fontStyle: "italic", lineHeight: 1.6 }}>
            {erLastet && kommentar ? `«${kommentar}»` : "Bjarne summerer runden…"}
          </Text>
        </Box>

        <Group justify="flex-end">
          <Button
            size="lg"
            radius="xl"
            onClick={onSpillIgjen}
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
            Spill igjen ↻
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};
