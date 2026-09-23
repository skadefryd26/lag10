import React from "react";
import { Box, Group, Stack, Text } from "@mantine/core";

type Props = {
  tidGjenstår: number;
  totalTid?: number;
};

const BJARNE_UTÅLMODIG_MELDINGER = [
  "Bjarne trommer utålmodig med fingrene på pulten…",
  "Bjarne ser demonstrativt på klokka…",
  "Bjarne vurderer å hente seg en ny espresso…",
  "Bjarne sjekker om han rekker mer kaffe…",
  "Bjarne sukker tungt og ruller med øynene…",
  "Bjarne begynner å lure på om du har sovnet…",
  "Bjarne sjekker e-posten sin mens han venter…",
  "Bjarne sinnet koker langsomt opp…"
];

export const Nedtelling: React.FC<Props> = ({ tidGjenstår, totalTid = 20 }) => {
  const bruktTid = totalTid - tidGjenstår;
  const meldingIndeks = Math.min(
    Math.floor(bruktTid / 5),
    BJARNE_UTÅLMODIG_MELDINGER.length - 1
  );
  const utålmodigTekst = BJARNE_UTÅLMODIG_MELDINGER[meldingIndeks];

  const erRød = tidGjenstår <= 5;
  const erGul = tidGjenstår > 5 && tidGjenstår <= 10;

  let farge = "#3B8EF0";
  let bgFarge = "rgba(59, 142, 240, 0.12)";
  if (erGul) {
    farge = "#FFC542";
    bgFarge = "rgba(255, 197, 66, 0.18)";
  } else if (erRød) {
    farge = "#FF4D6D";
    bgFarge = "rgba(255, 77, 109, 0.18)";
  }

  const radius = 22;
  const omkrets = 2 * Math.PI * radius;
  const framdrift = Math.max(0, Math.min(1, tidGjenstår / totalTid));
  const offset = omkrets * (1 - framdrift);

  return (
    <Box
      p="md"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        border: `2px solid ${farge}44`,
        boxShadow: erRød ? "0 10px 30px rgba(255, 77, 109, 0.25)" : "0 10px 30px rgba(31, 42, 68, 0.12)",
        transition: "all 0.3s ease"
      }}
      className={erRød ? "pulse-red-timer" : undefined}
    >
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap="md" align="center">
          <Box style={{ position: "relative", width: "56px", height: "56px" }}>
            <svg width="56" height="56" viewBox="0 0 60 60">
              <title>Nedtelling timer</title>
              <circle
                cx="30"
                cy="30"
                r={radius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="5"
              />
              <circle
                cx="30"
                cy="30"
                r={radius}
                fill="none"
                stroke={farge}
                strokeWidth="5"
                strokeDasharray={omkrets}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 30 30)"
                style={{ transition: "stroke-dashoffset 0.8s linear, stroke 0.3s ease" }}
              />
            </svg>
            <Box
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text fw={800} size="md" style={{ color: farge }}>
                {tidGjenstår}
              </Text>
            </Box>
          </Box>

          <Stack gap={2}>
            <Text size="xs" fw={800} style={{ color: "#6B7793", letterSpacing: "1px", textTransform: "uppercase" }}>
              Tid igjen
            </Text>
            <Text size="sm" fw={600} style={{ color: "#1F2A44", fontStyle: "italic" }}>
              {utålmodigTekst}
            </Text>
          </Stack>
        </Group>

        <Text size="xs" fw={800} style={{ color: farge, backgroundColor: bgFarge, padding: "6px 14px", borderRadius: "20px" }}>
          {tidGjenstår}s
        </Text>
      </Group>
    </Box>
  );
};
