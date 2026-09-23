import { createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "'Outfit', sans-serif",
  headings: {
    fontFamily: "'Space Grotesk', sans-serif"
  },
  defaultRadius: "xl",
  primaryColor: "blue",
  colors: {
    blue: [
      "#eef2ff",
      "#e0e7ff",
      "#c7d2fe",
      "#a5b4fc",
      "#818cf8",
      "#5b6bf0",
      "#4c6fef",
      "#3b8ef0",
      "#312e81",
      "#1e1b4b"
    ]
  },
  shadows: {
    md: "0 10px 30px rgba(31, 42, 68, 0.14)",
    lg: "0 14px 36px rgba(31, 42, 68, 0.18)"
  }
});
