import type React from "react";
import { Badge, Box, Group, Stack, Text } from "@mantine/core";
import type { Spørsmål, SvarResponse } from "../types/quizTypes.js";
import { Domsplate } from "./Domsplate.js";

type Props = {
  spørsmål: Spørsmål;
  valgtId: string | null;
  svarResultat: SvarResponse | null;
  isSubmitting: boolean;
  onVelgAlternativ: (id: string) => void;
  onNesteSpørsmål: () => void;
};

const OPTION_LABELS = ["A", "B", "C", "D"];

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
    <Stack gap="lg" style={{ width: "100%" }}>
      {/* Central Question Stage Panel */}
      <Box
        p="xl"
        style={{
          backgroundColor: "#131b2e",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)"
        }}
        className="corner-brackets"
      >
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <span className="live-dot" />
              <Badge
                size="md"
                variant="filled"
                radius="xs"
                style={{
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "0.75rem",
                  letterSpacing: "1px"
                }}
              >
                LIVE SAK
              </Badge>
            </Group>

            <Badge
              size="sm"
              variant="outline"
               color="dark"
              radius="xl"
              style={{
                 borderColor: "#9a6700",
                 color: "#5c3b00",
                fontWeight: 700,
                fontSize: "0.75rem"
              }}
            >
              🔒 Vilkårskilde skjult til dommen
            </Badge>
          </Group>

          {erTidsavbrudd && (
            <Group justify="flex-start">
              <Badge
                color="red"
                size="lg"
                variant="filled"
                radius="xl"
                style={{
                  fontSize: "0.85rem",
                  padding: "10px 18px",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)"
                }}
              >
                ⏱️ Tiden gikk ut! Bjarne overtok behandlingen.
              </Badge>
            </Group>
          )}

          <Text
            size="xl"
            fw={800}
            style={{
              color: "#1f2a44",
              lineHeight: 1.5,
              fontSize: "1.4rem",
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            {spørsmål.tekst}
          </Text>
        </Stack>
      </Box>

      {/* 2x2 Answer Control Pads */}
      <Box
        className="quiz-options"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          width: "100%"
        }}
      >
        {spørsmål.alternativer.map((alt, index) => {
          const keyLabel = OPTION_LABELS[index % OPTION_LABELS.length];
          const erValgt = valgtId === alt.id;
          const erRiktigFasit = harBesvart && svarResultat.riktigAlternativId === alt.id;
          const erFeilValgt = harBesvart && erValgt && !svarResultat.riktig;

          let bgColor = "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";
          let borderColor = "#334155";
          let textColor = "#1f2a44";
          let badgeBg = "rgba(255, 255, 255, 0.08)";
          let badgeColor = "#facc15";

          if (erRiktigFasit) {
            bgColor = "linear-gradient(135deg, #166534 0%, #14532d 100%)";
            borderColor = "#22c55e";
            textColor = "#ffffff";
            badgeBg = "#22c55e";
            badgeColor = "#0f172a";
          } else if (erFeilValgt) {
            bgColor = "linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)";
            borderColor = "#ef4444";
            textColor = "#ffffff";
            badgeBg = "#ef4444";
            badgeColor = "#ffffff";
          } else if (erValgt) {
            bgColor = "linear-gradient(135deg, #854d0e 0%, #713f12 100%)";
            borderColor = "#facc15";
            textColor = "#ffffff";
            badgeBg = "#facc15";
            badgeColor = "#0f172a";
          }

            return (
              <button
                key={alt.id}
                type="button"
                className={`svar-alternativ ${erRiktigFasit ? "svar-riktig" : ""} ${erFeilValgt ? "svar-feil" : ""} ${erValgt && !harBesvart ? "svar-valgt" : ""}`}
                disabled={isSubmitting || harBesvart}
              onClick={() => onVelgAlternativ(alt.id)}
              data-alternativ
              style={{
                background: bgColor,
                borderColor: borderColor,
                color: textColor
              }}
            >
              <Box className="pad-key-badge" style={{ backgroundColor: badgeBg, color: badgeColor }}>
                {keyLabel}
              </Box>

              <Box style={{ flex: 1 }}>
                <Text fw={700} style={{ color: textColor, fontSize: "1.05rem" }}>
                  {alt.tekst}
                </Text>
              </Box>

              {erRiktigFasit && (
                <Badge
                  radius="xl"
                  size="sm"
                  style={{
                    backgroundColor: "#22c55e",
                    color: "#0f172a",
                    fontWeight: 900,
                    marginLeft: "8px",
                    flexShrink: 0
                  }}
                >
                  ✓ Riktig
                </Badge>
              )}
              {erFeilValgt && (
                <Badge
                  radius="xl"
                  size="sm"
                  style={{
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    fontWeight: 900,
                    marginLeft: "8px",
                    flexShrink: 0
                  }}
                >
                  ✕ Feil
                </Badge>
              )}
            </button>
          );
        })}
      </Box>

      {/* After Answering: Dramatic Verdict Panel */}
      {harBesvart && (
        <Domsplate
          svarResultat={svarResultat}
          erTidsavbrudd={erTidsavbrudd}
          onNesteSpørsmål={onNesteSpørsmål}
        />
      )}
    </Stack>
  );
};
