import React from "react";
import { Box, Group, Text } from "@mantine/core";
import { TrusselnivåTilstand } from "../types/quizTypes.js";

type Props = {
  trusselnivå: number;
};

export function hentTilstand(nivå: number): TrusselnivåTilstand {
  if (nivå <= 25) return "rolig";
  if (nivå <= 50) return "irritert";
  if (nivå <= 75) return "nervøs";
  return "i panikk";
}

export function hentValiumBehov(nivå: number): string {
  if (nivå <= 20) return "Valium-behov nivå 1";
  if (nivå <= 40) return "Valium-behov nivå 2";
  if (nivå <= 60) return "Valium-behov nivå 3";
  if (nivå <= 80) return "Valium-behov nivå 4";
  return "Valium-behov nivå 5";
}

function hentValiumNivå(nivå: number): number {
  return Math.min(5, Math.floor(nivå / 20) + 1);
}

export const Trusselmåler: React.FC<Props> = ({ trusselnivå }) => {
  const tilstand = hentTilstand(trusselnivå);

  const hentMålerFarge = () => {
    switch (tilstand) {
      case "rolig":
        return "#3B8EF0";
      case "irritert":
        return "#FFC542";
      case "nervøs":
        return "#FF7B93";
      case "i panikk":
        return "#EF4444";
    }
  };

  const farge = hentMålerFarge();
  const erPanikk = tilstand === "i panikk";
  const nålvinkel = -90 + trusselnivå * 1.8;

  return (
    <Box
      className={erPanikk ? "threat-meter threat-meter-danger" : "threat-meter"}
      style={{ "--threat-color": farge } as React.CSSProperties}
    >
      <Group justify="space-between" align="flex-end" mb="xs">
        <Box>
          <Group gap={8} align="center">
            <Box className="threat-meter-signal" />
            <Text size="xs" fw={800} style={{ color: "#6B7793", letterSpacing: "1px", textTransform: "uppercase" }}>
              Bjarnes Valium-behov
            </Text>
          </Group>
          <Text size="xs" mt={4} style={{ color: "#8B96AE" }}>
            Fiktiv spillmåler, ikke ekte dosering
          </Text>
        </Box>
        <Box style={{ textAlign: "right" }}>
          <Box className="valium-dose-visual" aria-label={`${hentValiumBehov(trusselnivå)}. Kun spillvisualisering.`}>
            {Array.from({ length: hentValiumNivå(trusselnivå) }, (_, index) => (
              <Box key={index} className="valium-pill" aria-hidden="true">
                <span />
              </Box>
            ))}
          </Box>
          <Text size="xs" fw={800} style={{ color: "#1F2A44", textTransform: "uppercase", letterSpacing: "0.8px" }}>
            {tilstand}
          </Text>
        </Box>
      </Group>

      <Box
        className="threat-barometer"
        role="meter"
        aria-label="Bjarnes fiktive Valium-behov"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={trusselnivå}
      >
        <svg viewBox="0 0 320 178" aria-hidden="true">
          <defs>
            <linearGradient id="barometerScale" x1="0" x2="1">
              <stop offset="0%" stopColor="#3B8EF0" />
              <stop offset="50%" stopColor="#FFC542" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <path className="barometer-arc barometer-arc-base" d="M 35 150 A 125 125 0 0 1 285 150" />
          <path className="barometer-arc" d="M 35 150 A 125 125 0 0 1 285 150" stroke="url(#barometerScale)" />
          {Array.from({ length: 11 }, (_, index) => {
            const angle = -135 + index * 27;
            const radians = (angle * Math.PI) / 180;
            const x1 = 160 + Math.cos(radians) * 108;
            const y1 = 150 + Math.sin(radians) * 108;
            const x2 = 160 + Math.cos(radians) * 119;
            const y2 = 150 + Math.sin(radians) * 119;
            return <line key={angle} className="barometer-tick" x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          <g
            className="barometer-needle"
            style={{ transform: `rotate(${nålvinkel}deg)`, transformOrigin: "160px 150px" }}
          >
            <path d="M 160 35 L 154 56 L 166 56 Z" />
            <line x1="160" y1="150" x2="160" y2="48" />
          </g>
          <circle className="barometer-needle-hub" cx="160" cy="150" r="10" />
          <text x="30" y="171">STÅLKONTROLL</text>
          <text x="247" y="171">SVETTER KRAFTIG</text>
        </svg>
      </Box>

      <Text size="xs" fw={700} mt="xs" style={{ color: "#6B7793" }}>
        BJARNE OG KONTROLL
      </Text>
    </Box>
  );
};
