import React from "react";
import { Box, Stack, Text, Tooltip } from "@mantine/core";
import { TrusselnivåTilstand } from "../types/quizTypes.js";

type Props = {
  tilstand: TrusselnivåTilstand;
  nivå: number;
};

export const BjarneAvatar: React.FC<Props> = ({ tilstand, nivå }) => {
  const hentGradientOgInfo = (): { gradient: string; glow: string; tittel: string } => {
    switch (tilstand) {
      case "rolig":
        return {
          gradient: "linear-gradient(135deg, #56A7F7 0%, #3B8EF0 100%)",
          glow: "0 8px 20px rgba(59, 142, 240, 0.45)",
          tittel: "Rolig"
        };
      case "irritert":
        return {
          gradient: "linear-gradient(135deg, #FFD56B 0%, #FFC542 100%)",
          glow: "0 8px 20px rgba(255, 197, 66, 0.45)",
          tittel: "Irritert"
        };
      case "nervøs":
        return {
          gradient: "linear-gradient(135deg, #FF7B93 0%, #FF4D6D 100%)",
          glow: "0 8px 20px rgba(255, 77, 109, 0.45)",
          tittel: "Nervøs"
        };
      case "i panikk":
        return {
          gradient: "linear-gradient(135deg, #FF6B6B 0%, #EF4444 100%)",
          glow: "0 8px 26px rgba(239, 68, 68, 0.65)",
          tittel: "I panikk"
        };
    }
  };

  const { gradient, glow, tittel } = hentGradientOgInfo();

  const HUD = "#F3C9A2";
  const HUD_SKYGGE = "#E0AE83";
  const HÅR = "#3A2E2A";
  const MØRK = "#2A2320";

  return (
    <Stack align="center" gap={4}>
      <Tooltip label={`Bjarne (${tittel} – ${nivå}%)`} withArrow position="top">
        <Box
          style={{
            position: "relative",
            display: "inline-block",
            borderRadius: "50%",
            animation:
              tilstand === "i panikk"
                ? "bjarnePanicTremble 0.2s infinite ease-in-out"
                : "bjarneBob 3s infinite ease-in-out"
          }}
        >
          <svg
            width="76"
            height="76"
            viewBox="0 0 100 100"
            style={{
              borderRadius: "50%",
              background: gradient,
              border: "4px solid #FFFFFF",
              boxShadow: glow,
              transition: "all 0.4s ease",
              display: "block"
            }}
          >
            <title>Bjarne {tittel}</title>

            {/* Skuldre */}
            <path d="M 18 100 Q 22 78 50 78 Q 78 78 82 100 Z" fill="#2F3E5B" />
            <path d="M 44 78 L 50 90 L 56 78 Z" fill="#FFFFFF" opacity="0.9" />

            {/* Ører */}
            <ellipse cx="23" cy="50" rx="5" ry="7" fill={HUD_SKYGGE} />
            <ellipse cx="77" cy="50" rx="5" ry="7" fill={HUD_SKYGGE} />

            {/* Hode */}
            <ellipse cx="50" cy="48" rx="26" ry="29" fill={HUD} />

            {/* Hår */}
            <path
              d="M 24 44 Q 26 19 50 19 Q 74 19 76 44 Q 70 33 50 33 Q 30 33 24 44 Z"
              fill={HÅR}
            />

            {/* Øyenbryn */}
            {tilstand === "rolig" && (
              <>
                <path d="M 31 40 Q 38 37 45 40" stroke={HÅR} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 55 40 Q 62 37 69 40" stroke={HÅR} strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
            {tilstand === "irritert" && (
              <>
                <path d="M 31 36 Q 38 40 45 42" stroke={HÅR} strokeWidth="3.4" fill="none" strokeLinecap="round" />
                <path d="M 55 42 Q 62 40 69 36" stroke={HÅR} strokeWidth="3.4" fill="none" strokeLinecap="round" />
              </>
            )}
            {tilstand === "nervøs" && (
              <>
                <path d="M 31 40 Q 38 33 45 36" stroke={HÅR} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                <path d="M 55 36 Q 62 33 69 40" stroke={HÅR} strokeWidth="3.2" fill="none" strokeLinecap="round" />
              </>
            )}
            {tilstand === "i panikk" && (
              <>
                <path d="M 30 38 Q 38 28 46 34" stroke={HÅR} strokeWidth="3.6" fill="none" strokeLinecap="round" />
                <path d="M 54 34 Q 62 28 70 38" stroke={HÅR} strokeWidth="3.6" fill="none" strokeLinecap="round" />
              </>
            )}

            {/* Øyne */}
            {tilstand === "rolig" && (
              <>
                <path d="M 33 50 Q 38 46 43 50" stroke={MØRK} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 57 50 Q 62 46 67 50" stroke={MØRK} strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
            {tilstand === "irritert" && (
              <>
                <ellipse cx="38" cy="49" rx="4.6" ry="3" fill="#FFFFFF" />
                <circle cx="38" cy="49" r="2.4" fill={MØRK} />
                <ellipse cx="62" cy="49" rx="4.6" ry="3" fill="#FFFFFF" />
                <circle cx="62" cy="49" r="2.4" fill={MØRK} />
              </>
            )}
            {tilstand === "nervøs" && (
              <>
                <ellipse cx="38" cy="49" rx="5.6" ry="6" fill="#FFFFFF" />
                <circle cx="38" cy="49.5" r="2.6" fill={MØRK} />
                <ellipse cx="62" cy="49" rx="5.6" ry="6" fill="#FFFFFF" />
                <circle cx="62" cy="49.5" r="2.6" fill={MØRK} />
              </>
            )}
            {tilstand === "i panikk" && (
              <>
                <ellipse cx="38" cy="49" rx="7" ry="7.6" fill="#FFFFFF" />
                <circle cx="38" cy="49.5" r="2.2" fill={MØRK} />
                <ellipse cx="62" cy="49" rx="7" ry="7.6" fill="#FFFFFF" />
                <circle cx="62" cy="49.5" r="2.2" fill={MØRK} />
              </>
            )}

            {/* Nese */}
            <path d="M 50 52 L 50 58 Q 50 60 47 60" stroke={HUD_SKYGGE} strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Munn */}
            {tilstand === "rolig" && (
              <path d="M 41 66 Q 50 71 59 65" stroke={MØRK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            )}
            {tilstand === "irritert" && (
              <path d="M 41 68 Q 50 64 59 68" stroke={MØRK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            )}
            {tilstand === "nervøs" && (
              <path d="M 40 67 Q 45 63 50 67 T 60 67" stroke={MØRK} strokeWidth="2.8" fill="none" strokeLinecap="round" />
            )}
            {tilstand === "i panikk" && (
              <ellipse cx="50" cy="68" rx="7" ry="8.5" fill={MØRK} />
            )}

            {/* Svettedråpe */}
            {(tilstand === "nervøs" || tilstand === "i panikk") && (
              <path
                d="M 74 34 C 74 34 79 41 79 45 C 79 48 76.5 50 74 50 C 71.5 50 69 48 69 45 C 69 41 74 34 74 34 Z"
                fill="#38BDF8"
                opacity="0.95"
              />
            )}
          </svg>
        </Box>
      </Tooltip>
      <Text fw={800} size="sm" style={{ color: "#FFFFFF", textShadow: "0 2px 4px rgba(0,0,0,0.25)" }}>
        Bjarne
      </Text>
      <Text
        size="xs"
        fw={700}
        style={{
          color: "#FFFFFF",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          padding: "2px 10px",
          borderRadius: "12px",
          backdropFilter: "blur(4px)",
          textTransform: "capitalize"
        }}
      >
        {tittel}
      </Text>
    </Stack>
  );
};
