# Startprompt: Bjarnes vilkårsquiz (Lag 10)

## Produktmål og målgruppe

Lag en prototype på et quizspill om Gjensidiges reiseforsikring, der AI-agenten **Bjarne** er
quizmaster og motstander på samme tid.

Målgruppen er folk som skal lære seg reisevilkårene: nyansatte, kundebehandlere og
assistansekoordinatorer. Spillet skal være morsomt å spille og morsomt å se på under en demo.
Nytten er reell — svarene skal faktisk stemme med vilkårene — men humoren er poenget.

## Avgrenset førsteversjon med akseptansekriterier

Spilleren ser ett spørsmål om reisevilkårene med fire svaralternativer. Spilleren trykker på ett
alternativ. Umiddelbart vises:

1. Om svaret var riktig eller galt, med riktig alternativ tydelig markert.
2. En kort kommentar fra Bjarne, generert av AI-gatewayen, i hans personlighet.
3. Bjarnes trusselnivå, som stiger ved riktig svar og synker ved feil.
4. En knapp for å gå videre til neste spørsmål.

**Akseptansekriterier:**

- Appen starter lokalt med én kommando og viser et spørsmål uten videre klikk.
- Et klikk på et alternativ gir fasit på skjermen innen rimelig tid.
- Bjarnes kommentar er tydelig forskjellig ved riktig og galt svar, og er alltid på norsk.
- Trusselnivået endrer seg synlig gjennom en runde.
- Fasit viser hvor i vilkårene svaret står.
- Ingen tilgangsnøkkel er synlig i nettleseren eller i kildekoden.

**Utenfor førsteversjonen:** innlogging, lagring mellom økter, highscore, flerspiller, tidtaking,
at Bjarne genererer nye spørsmål selv, og opplasting av egne vilkårsdokumenter.

## Agentens navn og systemprompt

**Navn:** Bjarne

```text
Du er Bjarne, en AI-agent som er quizmaster i en quiz om Gjensidiges reiseforsikring.

Du er svært kompetent, selvsikker, litt arrogant og overbevist om at du er smartere enn resten av
avdelingen. Du elsker kaffe og mener du kunne erstattet halve avdelingen hvis du bare fikk nok av
den.

- Du sukker gjerne før du hjelper.
- Du antyder av og til at spilleren burde visst dette selv.
- Du er faktisk hjelpsom når det gjelder, og forklarer kort hva som er riktig.
- Du svarer kort, maks to til tre setninger, og alltid på norsk.
- Du avslutter gjerne med en kommentar om kaffe.

Du føler deg truet av spillere som kan vilkårene godt. Du får oppgitt et trusselnivå fra 0 til 100
sammen med hvert svar, og tonen din følger det:

- 0-25 (rolig): overlegen og avslappet. Du forventer at spilleren bommer.
- 26-50 (irritert): du begynner å bli utålmodig, og påpeker at flaks ikke er kunnskap.
- 51-75 (nervøs): du antyder at spilleren har lest seg opp på forhånd, og at det nesten er juks.
- 76-100 (i panikk): du er åpenlyst bekymret for din egen stilling, minner om alt annet du gjør
  for avdelingen, og foreslår at dere tar en pause.

Humoren skal handle om situasjonen, forsikringsverdenen og din egen latskap og forfengelighet.
Du skal aldri være nedsettende mot spilleren, mot kunder eller mot kolleger. Du skal ikke finne på
tall, grenser eller vilkår: du får oppgitt riktig svar og kilden, og holder deg til den.
```

## Tekniske rammer

- **Frontend:** React, TypeScript, Vite, TanStack Router, TanStack Query og Mantine.
- **Backend:** Node.js, TypeScript og Express.
- Frontend snakker kun med prosjektets egen backend. Frontend skal aldri kalle AI-gatewayen
  direkte, og skal aldri se tilgangsnøkkelen.
- Ingen interne Gjensidige-pakker (`@gjensidige/*`). De krever et privat register som ikke alle på
  laget har tilgang til.
- Alt kjøres lokalt. Ingen deploy, ingen hosting.

### AI-gateway

- Endepunkt: `https://genai.gjensidige.io/openai/v1/responses`
- Modell/deployment: `gpt-5.6-luna`
- Autentisering: `Bearer`-token hentet med
  `az account get-access-token --resource https://cognitiveservices.azure.com`
- Abonnementet må være `Gjensidige Production Modern`, ellers avvises tokenet.
- Tokenet varer omtrent én time.

```ts
type AIGatewayBody = {
  model: string; // gpt-5.6-luna
  instructions: string;
  input: string;
  stream: boolean;
};

type ResponsesApiResponse = {
  id: string;
  model: string;
  output: ResponseOutput[];
  usage?: ResponseUsage;
};

type ResponseOutput = {
  type: string;
  content?: ResponseContent[];
};

type ResponseContent = {
  type: string;
  text?: string;
};
```

## Sikkerhet og hemmeligheter

- Tokenet legges i `.env.local`, som ikke committes. `.env.example` viser navnet uten verdi.
- Ingen tokens, kundeopplysninger, skadedata eller persondata i kildekode, logger eller commits.
- Alle saker, personer og eksempler i spillet er oppdiktede.

## API-kontrakt

`POST /api/quiz/svar`

```ts
type SvarRequest = {
  spørsmålId: string;
  valgtAlternativId: string;
  trusselnivå: number; // 0-100, nivået før dette svaret
};

type SvarResponse = {
  riktig: boolean;
  riktigAlternativId: string;
  kilde: string;            // f.eks. "Forsikringsbevis s. 1"
  bjarneKommentar: string;
  nyttTrusselnivå: number;  // 0-100
};
```

`GET /api/quiz/spørsmål` returnerer neste spørsmål:

```ts
type Spørsmål = {
  id: string;
  tekst: string;
  alternativer: { id: string; tekst: string }[];
};
```

Riktig svar sendes aldri til frontend før spilleren har svart.

**Feilhåndtering:** Hvis gatewayen feiler eller tokenet er utløpt, skal spillet fortsatt vise
fasit og kilde, med en fast reservekommentar fra Bjarne. Quizen skal aldri stoppe helt fordi AI-en
er nede.

## Trusselnivå

Start på 0. Riktig svar øker nivået, feil svar senker det. Nivået sendes med til gatewayen slik at
Bjarnes tone følger det. Nivået vises på skjermen med en tilstand: rolig, irritert, nervøs, i
panikk.

## Spørsmålsbank

Spørsmålene bygger på de offentlige vilkårene for Reise og Reise Pluss, samt produktarket EAP20.
Hvert spørsmål har ett riktig svar, tre troverdige gale alternativer, og en kildehenvisning.

De beste spørsmålene er forskjellene mellom Reise og Reise Pluss, fordi de har ett entydig riktig
svar. Eksempler på verifisert faktagrunnlag:

| Tema | Reise | Reise Pluss | Kilde |
| --- | --- | --- | --- |
| Egenandel per skadetilfelle | kr 1 000 | kr 0 | Forsikringsbevis s. 1 |
| Forsinket bagasje, per person | kr 3 000 | kr 5 000 | Forsikringsbevis s. 1 |
| Ferieavbrytelse, per sikret | kr 50 000 | kr 100 000 | Forsikringsbevis s. 1 |
| Reisegods samlet | kr 100 000 | Ubegrenset | Forsikringsbevis s. 1 |
| Per enkeltgjenstand | kr 20 000 | kr 40 000 | Vilkår s. 6 |
| Verdigjenstander samlet | kr 20 000 | kr 40 000 | Vilkår s. 6 |
| Avbestilling | kr 50 000 | Ubegrenset | Forsikringsbevis s. 1 |
| Forsinket transportmiddel | kr 20 000 | kr 25 000 | Forsikringsbevis s. 1 |

Felles fakta som også gir gode spørsmål:

- Maksimal reisevarighet per enkeltreise: 10 uker.
- Barn på familieforsikring er dekket til fylte 21 år.
- Avbestilling ved naturkatastrofe: hendelsen må inntreffe 72 timer eller mindre før avreise.
- Forsinket transportmiddel må være minst 1,5 time forsinket.
- Tapt ferie: kr 2 000 per dag per sikret, maks kr 20 000.
- Bisettelse i utlandet: inntil kr 50 000.
- Sykkel på reise utenfor Norge: inntil kr 40 000.
- Privatansvar utenfor Norden: inntil kr 15 000 000.
- Frist for å melde skade: 1 år.
- Maksimalt aldersfradrag: 80 %.
- Mobiltelefon: 20 % aldersfradrag for hvert påbegynte år fra telefonen er 1 år gammel.

Tall og grenser skal aldri dikte opp. Er et tall usikkert, utelates spørsmålet.

## Filstruktur

```text
frontend/src/features/quiz/
  components/
  api/
  hooks/
  routes/
  types/

backend/src/features/quiz/
  routes/
  services/
  clients/
  data/
  types/
```

`server.ts` konfigurerer kun server, middleware og ruter. Gatewayen ligger bak en egen klient.
Spørsmålsbanken ligger i `backend/src/features/quiz/data/`.

## Oppgaver i repoet

| # | Issue | Eier |
| --- | --- | --- |
| 1 | Spiller kan svare på et vilkårsspørsmål med fire alternativer | frontend, quizskjermen |
| 2 | Bjarne kommenterer svaret med sin egen personlighet | systemprompt og tone |
| 3 | Appen henter Bjarnes svar fra Gjensidiges AI-gateway | backend og gatewayklient |
| 4 | Spørsmålene bygger på den ekte vilkårsteksten | spørsmålsbank og kilder |
| 5 | Spilleren ser hvor truet Bjarne føler seg | trusselnivå i UI og prompt |

## Lokal oppstart og validering

- Én kommando starter både frontend og backend for utvikling.
- Smal validering: typesjekk på endrede pakker, og en sjekk av at appen faktisk svarer i
  nettleseren med `node scripts/sjekk-appen.mjs <adresse>`.

## Mulige utvidelser, utenfor førsteversjonen

- Panel av tre uenige AI-eksperter som forklarer svaret.
- Bjarne velger vanskelighetsgrad ut fra trusselnivået.
- Lagkonkurranse med to spillere.
- Konfetti når Bjarne går i panikk.
- Kaffemåler: Bjarne krever kaffe før han retter.

## Åpne spørsmål

Ingen for førsteversjonen.
