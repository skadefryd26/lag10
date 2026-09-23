import type React from "react";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Alert, Text, Group, Title } from "@mantine/core";
import { hentNesteSpørsmål, sendSvar } from "../api/quizApi.js";
import type { SvarResponse } from "../types/quizTypes.js";
import { hentTilstand } from "../components/Trusselmåler.js";
import { SpørsmålKort } from "../components/SpørsmålKort.js";
import { Nedtelling } from "../components/Nedtelling.js";
import { BjarneAvatar } from "../components/BjarneAvatar.js";
import { useNedtelling } from "../hooks/useNedtelling.js";
import { avfyrKonfetti } from "../utils/konfetti.js";

export const QuizPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [trusselnivå, setTrusselnivå] = useState(0);
  const [valgtId, setValgtId] = useState<string | null>(null);
  const [svarResultat, setSvarResultat] = useState<SvarResponse | null>(null);
  const [streak, setStreak] = useState(0);
  const [spørsmålNøkkel, setSpørsmålNøkkel] = useState(0);
  const [showShake, setShowShake] = useState(false);
  const [showRedFlash, setShowRedFlash] = useState(false);

  const {
    data: spørsmål,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
    error: questionError,
    refetch
  } = useQuery({
    queryKey: ["spørsmål"],
    queryFn: hentNesteSpørsmål,
    refetchOnWindowFocus: false
  });

  const triggerWrongFeedback = useCallback(() => {
    setShowShake(true);
    setShowRedFlash(true);
    const timer = setTimeout(() => {
      setShowShake(false);
      setShowRedFlash(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const svarMutation = useMutation({
    mutationFn: sendSvar,
    onSuccess: (data) => {
      setSvarResultat(data);
      setTrusselnivå(data.nyttTrusselnivå);
      if (data.riktig) {
        setStreak((prev) => {
          const nyStreak = prev + 1;
          avfyrKonfetti(nyStreak);
          return nyStreak;
        });
      } else {
        setStreak(0);
        triggerWrongFeedback();
      }
    }
  });

  const handleTimeout = useCallback(() => {
    if (!spørsmål || svarMutation.isPending || svarResultat) return;
    setValgtId("tidsavbrudd");
    setStreak(0);
    triggerWrongFeedback();
    svarMutation.mutate({
      spørsmålId: spørsmål.id,
      valgtAlternativId: "tidsavbrudd",
      trusselnivå,
      tidsavbrudd: true
    });
  }, [spørsmål, svarMutation, svarResultat, trusselnivå, triggerWrongFeedback]);

  const isTimerActive = Boolean(spørsmål && !isQuestionLoading && !svarMutation.isPending && !svarResultat);
  const tidGjenstår = useNedtelling({
    varighetSekunder: 20,
    aktiv: isTimerActive,
    onTimeout: handleTimeout,
    resetKey: spørsmål ? `${spørsmål.id}-${spørsmålNøkkel}` : spørsmålNøkkel
  });

  const handleVelgAlternativ = (alternativId: string) => {
    if (!spørsmål || svarMutation.isPending || svarResultat) return;
    setValgtId(alternativId);
    svarMutation.mutate({
      spørsmålId: spørsmål.id,
      valgtAlternativId: alternativId,
      trusselnivå
    });
  };

  const handleNesteSpørsmål = () => {
    setValgtId(null);
    setSvarResultat(null);
    setSpørsmålNøkkel((prev) => prev + 1);
    queryClient.invalidateQueries({ queryKey: ["spørsmål"] });
    refetch();
  };

  const tilstand = hentTilstand(trusselnivå);

  return (
    <Box className="quiz-scene">
      {showRedFlash && <div className="red-flash-overlay" />}
      <Box className={showShake ? "quiz-shell shake-effect" : "quiz-shell"}>
        <header className="quiz-header">
          <Box>
            <Text className="eyebrow">BJARNE LIVE</Text>
            <Title order={1} className="quiz-title">Vilkårsduellen</Title>
            <Text className="quiz-subtitle">Svar før Bjarne rekker å forklare hvorfor han har rett.</Text>
          </Box>
          <Group gap="sm" className="header-stats">
            <Box className="streak-chip"><span>🔥</span> {streak} på rad</Box>
            <Box className="threat-chip"><span className="live-dot" /> Bjarne: {tilstand}</Box>
          </Group>
          {isTimerActive && (
            <Box className="header-timer">
              <Nedtelling tidGjenstår={tidGjenstår} totalTid={20} />
            </Box>
          )}
        </header>

        <Box className="play-area">
          <Box className="quiz-main-column">
            {isQuestionLoading && <Box className="loading-card"><Text fw={700}>Bjarne blar i vilkårene…</Text></Box>}
            {isQuestionError && <Alert title="Beklager!" color="red" radius="lg">Kunne ikke laste spørsmål: {questionError?.message || "Ukjent feil"}</Alert>}
            {spørsmål && !isQuestionLoading && (
              <SpørsmålKort
                spørsmål={spørsmål}
                valgtId={valgtId}
                svarResultat={svarResultat}
                isSubmitting={svarMutation.isPending}
                onVelgAlternativ={handleVelgAlternativ}
                onNesteSpørsmål={handleNesteSpørsmål}
              />
            )}
          </Box>

          <Box className="bjarne-sidekick" aria-label="Bjarne">
            <BjarneAvatar tilstand={tilstand} nivå={trusselnivå} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
