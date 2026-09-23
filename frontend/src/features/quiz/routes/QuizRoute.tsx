import type React from "react";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Alert, Text, Group, Title } from "@mantine/core";
import { hentNesteSpørsmål, hentResultatkommentar, sendSvar } from "../api/quizApi.js";
import type { SvarResponse } from "../types/quizTypes.js";
import { hentTilstand, Trusselmåler } from "../components/Trusselmåler.js";
import { SpørsmålKort } from "../components/SpørsmålKort.js";
import { ResultatKort } from "../components/ResultatKort.js";
import { Nedtelling } from "../components/Nedtelling.js";
import { BjarneAvatar } from "../components/BjarneAvatar.js";
import { BjarneSnakkeboble } from "../components/BjarneSnakkeboble.js";
import { useNedtelling } from "../hooks/useNedtelling.js";
import { avfyrKonfetti } from "../utils/konfetti.js";

/** En runde er ferdig etter fem spørsmål. */
export const SPØRSMÅL_I_RUNDEN = 5;

export const QuizPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [trusselnivå, setTrusselnivå] = useState(0);
  const [valgtId, setValgtId] = useState<string | null>(null);
  const [svarResultat, setSvarResultat] = useState<SvarResponse | null>(null);
  const [streak, setStreak] = useState(0);
  const [spørsmålNøkkel, setSpørsmålNøkkel] = useState(0);
  const [showShake, setShowShake] = useState(false);
  const [showRedFlash, setShowRedFlash] = useState(false);

  const [besvart, setBesvart] = useState(0);
  const [riktige, setRiktige] = useState(0);
  const [besteRekke, setBesteRekke] = useState(0);
  const [tidligereKommentarer, setTidligereKommentarer] = useState<string[]>([]);
  const [visResultat, setVisResultat] = useState(false);
  const streakRef = useRef(0);

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
      setBesvart((prev) => prev + 1);
      setTidligereKommentarer((prev) => [...prev, data.bjarneKommentar]);
      if (data.riktig) {
        setRiktige((prev) => prev + 1);
        streakRef.current += 1;
        setStreak(streakRef.current);
        setBesteRekke((prev) => Math.max(prev, streakRef.current));
        avfyrKonfetti(streakRef.current);
      } else {
        streakRef.current = 0;
        setStreak(0);
        triggerWrongFeedback();
      }
    }
  });

  const resultatMutation = useMutation({
    mutationFn: hentResultatkommentar
  });

  const handleTimeout = useCallback(() => {
    if (!spørsmål || svarMutation.isPending || svarResultat) return;
    setValgtId("tidsavbrudd");
    streakRef.current = 0;
    setStreak(0);
    triggerWrongFeedback();
    svarMutation.mutate({
      spørsmålId: spørsmål.id,
      valgtAlternativId: "tidsavbrudd",
      trusselnivå,
      tidsavbrudd: true,
      tidligereKommentarer
    });
  }, [spørsmål, svarMutation, svarResultat, trusselnivå, triggerWrongFeedback, tidligereKommentarer]);

  const isTimerActive = Boolean(
    spørsmål && !isQuestionLoading && !svarMutation.isPending && !svarResultat && !visResultat
  );
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
      trusselnivå,
      tidligereKommentarer
    });
  };

  const erSisteSpørsmål = besvart >= SPØRSMÅL_I_RUNDEN;

  const handleNesteSpørsmål = () => {
    if (erSisteSpørsmål) {
      setVisResultat(true);
      resultatMutation.mutate({
        riktige,
        totalt: SPØRSMÅL_I_RUNDEN,
        besteRekke,
        trusselnivå,
        tidligereKommentarer
      });
      return;
    }

    setValgtId(null);
    setSvarResultat(null);
    setSpørsmålNøkkel((prev) => prev + 1);
    queryClient.invalidateQueries({ queryKey: ["spørsmål"] });
    refetch();
  };

  const handleSpillIgjen = () => {
    setValgtId(null);
    setSvarResultat(null);
    setTrusselnivå(0);
    setBesvart(0);
    setRiktige(0);
    setBesteRekke(0);
    setTidligereKommentarer([]);
    setVisResultat(false);
    setSpørsmålNøkkel((prev) => prev + 1);
    streakRef.current = 0;
    setStreak(0);
    resultatMutation.reset();
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
            <Title order={1} className="quiz-title">Bjarnegodkjent</Title>
            <Text className="quiz-tagline">en uoffisiell autorisasjonsordning for skadeforsikring</Text>
            <Box className="bjarne-meter-stack" aria-label="Bjarne og kaffebehov">
              <Box className="bjarne-stage">
                <Box className="bjarne-stage-venstre">
                  <BjarneAvatar tilstand={tilstand} nivå={trusselnivå} />
                  <BjarneSnakkeboble
                    tilstand={tilstand}
                    kommentar={svarResultat?.bjarneKommentar ?? null}
                    tenker={svarMutation.isPending}
                    laster={isQuestionLoading}
                  />
                </Box>
                <Box className="bjarne-stage-hoyre">
                  <Trusselmåler trusselnivå={trusselnivå} />
                </Box>
              </Box>
              <Group gap="sm" className="bjarne-status-chips">
                <Box className="streak-chip"><span>🔥</span> {streak} på rad</Box>
                <Box className="threat-chip"><span className="live-dot" /> Bjarne: {tilstand}</Box>
              </Group>
              {spørsmål && !isQuestionLoading && !visResultat && (
                <Box className="header-timer header-timer-under-meter">
                  <Nedtelling tidGjenstår={tidGjenstår} totalTid={20} aktiv={isTimerActive} />
                </Box>
              )}
            </Box>
          </Box>
        </header>

        <Box className="play-area">
          <Box className="quiz-main-column">
            {isQuestionLoading && <Box className="loading-card"><Text fw={700}>Bjarne blar i vilkårene…</Text></Box>}
            {isQuestionError && <Alert title="Beklager!" color="red" radius="lg">Kunne ikke laste spørsmål: {questionError?.message || "Ukjent feil"}</Alert>}
            {visResultat && (
              <ResultatKort
                riktige={riktige}
                totalt={SPØRSMÅL_I_RUNDEN}
                besteRekke={besteRekke}
                kommentar={resultatMutation.data?.kommentar ?? null}
                erLastet={resultatMutation.isSuccess}
                onSpillIgjen={handleSpillIgjen}
              />
            )}
            {spørsmål && !isQuestionLoading && !visResultat && (
              <SpørsmålKort
                spørsmål={spørsmål}
                valgtId={valgtId}
                svarResultat={svarResultat}
                isSubmitting={svarMutation.isPending}
                onVelgAlternativ={handleVelgAlternativ}
                onNesteSpørsmål={handleNesteSpørsmål}
                tekstKnapp={erSisteSpørsmål ? "Se resultatet →" : "Neste spørsmål →"}
              />
            )}
          </Box>

        </Box>
      </Box>
    </Box>
  );
};
