import { createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "'Outfit', sans-serif",
  headings: {
    fontFamily: "'Space Grotesk', sans-serif"
  },
  primaryColor: "amber",
  colors: {
    amber: [
      "#fffbeb",
      "#fef3c7",
      "#fde68a",
      "#fcd34d",
      "#fbbf24",
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#92400e",
      "#78350f"
    ]
  },
  shadows: {
    md: "0 4px 20px rgba(0, 0, 0, 0.4)"
  }
});
