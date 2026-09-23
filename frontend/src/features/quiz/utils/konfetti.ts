import confetti from "canvas-confetti";

export function avfyrKonfetti(streak: number = 1): void {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReducedMotion) return;

  const count = Math.min(60 + streak * 30, 200);
  const spread = Math.min(60 + streak * 15, 120);

  confetti({
    particleCount: count,
    spread: spread,
    origin: { y: 0.65 },
    colors: ["#22d3ee", "#fbbf24", "#10b981", "#38bdf8", "#f43f5e"]
  });
}
