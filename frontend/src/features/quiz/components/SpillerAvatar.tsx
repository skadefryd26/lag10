import React, { useEffect, useState } from "react";
import { Box, Stack, Text, Tooltip } from "@mantine/core";

type Props = {
  streak: number;
};

export const SpillerAvatar: React.FC<Props> = ({ streak }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (streak <= 0) return;
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 450);
    return () => clearTimeout(timer);
  }, [streak]);

  return (
    <Stack align="center" gap={4}>
      <Tooltip label={`Deg (${streak} på rad)`} withArrow position="top">
        <Box
          className={animate ? "streak-pop-animation" : undefined}
          style={{
            position: "relative",
            display: "inline-block",
            borderRadius: "50%"
          }}
        >
          <svg
            width="76"
            height="76"
            viewBox="0 0 100 100"
            style={{
              borderRadius: "50%",
              background: "linear-gradient(135deg, #B07BE8 0%, #8E7BE8 100%)",
              border: "4px solid #FFFFFF",
              boxShadow: "0 8px 20px rgba(142, 123, 232, 0.4)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              display: "block"
            }}
          >
            <title>Deg (Spiller)</title>

            <path d="M 18 100 Q 22 78 50 78 Q 78 78 82 100 Z" fill="#FFB4A2" />
            <path d="M 42 78 Q 50 86 58 78 L 58 100 L 42 100 Z" fill="#FFFFFF" opacity="0.85" />

            <ellipse cx="23" cy="50" rx="5" ry="7" fill="#E5A07E" />
            <ellipse cx="77" cy="50" rx="5" ry="7" fill="#E5A07E" />

            <ellipse cx="50" cy="48" rx="26" ry="29" fill="#F7CBA6" />

            <path
              d="M 24 46 Q 24 18 50 18 Q 76 18 76 46 Q 72 36 62 33 Q 54 41 40 38 Q 30 37 24 46 Z"
              fill="#5B3A29"
            />

            <path d="M 32 41 Q 38 38 44 41" stroke="#5B3A29" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 56 41 Q 62 38 68 41" stroke="#5B3A29" strokeWidth="3" fill="none" strokeLinecap="round" />

            <ellipse cx="38" cy="50" rx="5.4" ry="5.8" fill="#FFFFFF" />
            <circle cx="38" cy="50.5" r="2.6" fill="#2A2320" />
            <ellipse cx="62" cy="50" rx="5.4" ry="5.8" fill="#FFFFFF" />
            <circle cx="62" cy="50.5" r="2.6" fill="#2A2320" />

            <path d="M 50 53 L 50 59 Q 50 61 47 61" stroke="#E5A07E" strokeWidth="2" fill="none" strokeLinecap="round" />

            <ellipse cx="30" cy="59" rx="5" ry="3.2" fill="#FF8FA3" opacity="0.55" />
            <ellipse cx="70" cy="59" rx="5" ry="3.2" fill="#FF8FA3" opacity="0.55" />

            <path d="M 40 65 Q 50 73 60 65" stroke="#2A2320" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </Box>
      </Tooltip>
      <Text fw={800} size="sm" style={{ color: "#FFFFFF", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
        Deg
      </Text>
      <Text
        size="xs"
        fw={700}
        style={{
          color: streak > 0 ? "#FFC542" : "#E0E7FF",
          backgroundColor: streak > 0 ? "rgba(255, 197, 66, 0.25)" : "rgba(255, 255, 255, 0.18)",
          padding: "2px 10px",
          borderRadius: "12px",
          backdropFilter: "blur(4px)"
        }}
      >
        {streak} på rad
      </Text>
    </Stack>
  );
};
