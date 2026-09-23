import React, { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Container, Stack, Text, Title, Alert, Box } from "@mantine/core";
import { hentNesteSpørsmål, sendSvar } from "../api/quizApi.js";
import { SvarResponse } from "../types/quizTypes.js";
import { Trusselmåler, hentTilstand } from "../components/Trusselmåler.js";
import { VsBanner } from "../components/VsBanner.js";
import { TenkeIndikator } from "../components/TenkeIndikator.js";
import { SpørsmålKort } from "../components/SpørsmålKort.js";
import { Nedtelling } from "../components/Nedtelling.js";
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
    <>
      {showRedFlash && <div className="red-flash-overlay" />}
      <Container size="sm" py="xl">
        <Stack gap="xl" className={showShake ? "shake-effect" : undefined}>
          <Stack align="center" gap="xs">
            <Title
              order={1}
              size="h1"
              style={{
                color: "#FFFFFF",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: "2.5rem",
                letterSpacing: "-0.5px",
                textAlign: "center",
                textShadow: "0 4px 0 #312E81, 0 8px 24px rgba(0, 0, 0, 0.3)"
              }}
            >
              Bjarnes vilkårsquiz ☕
            </Title>
            <Text
              size="sm"
              fw={600}
              style={{
                color: "#E0E7FF",
                textAlign: "center",
                maxWidth: "480px",
                textShadow: "0 1px 3px rgba(0,0,0,0.2)"
              }}
            >
              Pass deg — jo mer du kan om reiseforsikringen, jo mer truet føler Bjarne seg!
            </Text>
          </Stack>

          <VsBanner streak={streak} tilstand={tilstand} trusselnivå={trusselnivå} />

          <Box
            p="md"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              boxShadow: "0 10px 30px rgba(31, 42, 68, 0.14)"
            }}
          >
            <Trusselmåler trusselnivå={trusselnivå} />
          </Box>

          {isTimerActive && (
            <Nedtelling tidGjenstår={tidGjenstår} totalTid={20} />
          )}

          {isQuestionLoading && (
            <Box p="xl" style={{ textAlign: "center", backgroundColor: "#FFFFFF", borderRadius: "24px", boxShadow: "0 10px 30px rgba(31, 42, 68, 0.14)" }}>
              <Text fw={600} style={{ color: "#6B7793" }}>Henter neste spørsmål fra vilkårene…</Text>
            </Box>
          )}

          {isQuestionError && (
            <Alert title="Beklager!" color="red" radius="xl">
              Kunne ikke laste spørsmål: {questionError?.message || "Ukjent feil"}
            </Alert>
          )}

          {spørsmål && !isQuestionLoading && (
            <>
              <SpørsmålKort
                spørsmål={spørsmål}
                valgtId={valgtId}
                svarResultat={svarResultat}
                isSubmitting={svarMutation.isPending}
                onVelgAlternativ={handleVelgAlternativ}
                onNesteSpørsmål={handleNesteSpørsmål}
              />

              {svarMutation.isPending && <TenkeIndikator />}
            </>
          )}
        </Stack>
      </Container>
    </>
  );
};
