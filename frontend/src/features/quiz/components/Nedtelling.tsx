import type React from "react";
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

  let farge = "#3b82f6";
  let bgFarge = "rgba(59, 130, 246, 0.2)";
  if (erGul) {
    farge = "#facc15";
    bgFarge = "rgba(250, 204, 21, 0.2)";
  } else if (erRød) {
    farge = "#ef4444";
    bgFarge = "rgba(239, 68, 68, 0.25)";
  }

  const radius = 18;
  const omkrets = 2 * Math.PI * radius;
  const framdrift = Math.max(0, Math.min(1, tidGjenstår / totalTid));
  const offset = omkrets * (1 - framdrift);

  return (
    <Box
      px="sm"
      py="xs"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        borderRadius: "14px",
        border: `1px solid ${farge}`,
        boxShadow: erRød ? "0 0 16px rgba(239, 68, 68, 0.4)" : "0 2px 10px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease"
      }}
      className={erRød ? "pulse-red-timer" : undefined}
    >
      <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
        <Group gap="xs" align="center" wrap="nowrap">
          <Box style={{ position: "relative", width: "42px", height: "42px", flexShrink: 0 }}>
            <svg width="42" height="42" viewBox="0 0 44 44">
              <title>Nedtelling timer</title>
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="4"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke={farge}
                strokeWidth="4"
                strokeDasharray={omkrets}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
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
              <Text fw={800} size="xs" style={{ color: farge, fontFamily: "'Space Grotesk', sans-serif" }}>
                {tidGjenstår}
              </Text>
            </Box>
          </Box>

          <Stack gap={0} style={{ overflow: "hidden", minWidth: 0 }}>
            <Text size="xs" fw={800} style={{ color: farge, letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.65rem" }}>
              NEDTELLING — {tidGjenstår}S
            </Text>
            <Text
              size="xs"
              fw={600}
              style={{
                color: "#e2e8f0",
                fontStyle: "italic",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: "220px"
              }}
            >
              {utålmodigTekst}
            </Text>
          </Stack>
        </Group>

        <Text
          size="xs"
          fw={900}
          style={{
            color: farge,
            backgroundColor: bgFarge,
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontFamily: "'Space Grotesk', sans-serif"
          }}
        >
          {tidGjenstår}s
        </Text>
      </Group>
    </Box>
  );
};

