import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Container, Group, Stack, Text, Title, Alert, Box } from "@mantine/core";
import { hentNesteSpørsmål, sendSvar } from "../api/quizApi.js";
import { SvarResponse } from "../types/quizTypes.js";
import { Trusselmåler, hentTilstand } from "../components/Trusselmåler.js";
import { BjarneAvatar } from "../components/BjarneAvatar.tsx";
import { TenkeIndikator } from "../components/TenkeIndikator.tsx";
import { SpørsmålKort } from "../components/SpørsmålKort.tsx";

export const QuizPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [trusselnivå, setTrusselnivå] = useState(0);
  const [valgtId, setValgtId] = useState<string | null>(null);
  const [svarResultat, setSvarResultat] = useState<SvarResponse | null>(null);

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

  const svarMutation = useMutation({
    mutationFn: sendSvar,
    onSuccess: (data) => {
      setSvarResultat(data);
      setTrusselnivå(data.nyttTrusselnivå);
    }
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
    queryClient.invalidateQueries({ queryKey: ["spørsmål"] });
    refetch();
  };

  const tilstand = hentTilstand(trusselnivå);

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Box
          p="lg"
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "16px",
            border: "1px solid #334155",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
          }}
        >
          <Group justify="space-between" align="center" mb="md">
            <div>
              <Title order={1} size="h2" style={{ color: "#f8fafc", letterSpacing: "-0.5px" }}>
                Bjarnes vilkårsquiz ☕
              </Title>
              <Text size="sm" c="dimmed">
                Pass deg — jo mer du kan om reiseforsikringen, jo mer truet føler Bjarne seg!
              </Text>
            </div>
            <BjarneAvatar tilstand={tilstand} nivå={trusselnivå} />
          </Group>

          <Trusselmåler trusselnivå={trusselnivå} />
        </Box>

        {isQuestionLoading && (
          <Box p="xl" style={{ textAlign: "center" }}>
            <Text c="dimmed">Henter neste spørsmål fra vilkårene…</Text>
          </Box>
        )}

        {isQuestionError && (
          <Alert title="Beklager!" color="red">
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
  );
};
