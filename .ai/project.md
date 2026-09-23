# Lag 10 — Bjarnes vilkårsquiz

## Idéen

Et quizspill om Gjensidiges reisevilkår, der AI-agenten **Bjarne** er quizmaster — og motstander.

- **Hvem det hjelper:** Folk som skal lære seg reisevilkårene — nyansatte, kundebehandlere,
  assistansekoordinatorer, eller hvem som helst som lurer på hva reiseforsikringen faktisk dekker.
- **Hva den gjør:** Ett spørsmål om reisevilkårene, fire svaralternativer, umiddelbar fasit.
  Spørsmålene bygger på den ekte vilkårsteksten for Reise og Reise Pluss.
- **Den overdrevne delen:** Bjarne føler seg truet av spilleren. Jo bedre du svarer, jo mer
  bekymret blir han for sin egen stilling.

## Agenten

**Navn:** Bjarne

**Personlighet:** Svært kompetent, selvsikker, litt arrogant, overbevist om at han er smartere enn
resten av avdelingen. Elsker kaffe. Sukker før han hjelper, antyder at du kunne klart det selv,
men er faktisk hjelpsom når det gjelder. Svarer kort og alltid på norsk.

**Vrien:** Bjarne blir truet av spilleren. Ved flere riktige svar på rad begynner han å antyde at
du sikkert har lest deg opp på forhånd, og at avdelingen uansett trenger ham til viktigere ting.
Humoren handler om situasjonen, forsikringsverdenen og Bjarne selv — aldri om ekte kunder eller
kolleger.

## Førsteversjon

Spilleren ser ett vilkårsspørsmål med fire svaralternativer, trykker på ett av dem, og får
umiddelbart vite om det var riktig — sammen med en kommentar fra Bjarne som avslører hvor truet
han føler seg.

Linja som må gå hele veien: skjerm → backend → AI-gateway → svar på skjermen.

## Arbeidsdeling

Laget er fem personer: Farida, Ingeborg, Ida, Mariss og Viet. Førsteversjonen er delt i fem
oppgaver, én per person. Hvem som tar hva bestemmer laget selv — poenget med dagen er å gjøre noe
annet enn det man gjør til vanlig.

| # | Oppgave | Kort |
| --- | --- | --- |
| 1 | Quizskjermen | Spørsmål, fire knapper, fasit |
| 2 | Bjarnes personlighet | Systemprompten og tonen hans |
| 3 | AI-gatewayen | Backend som henter Bjarnes svar |
| 4 | Spørsmålsbanken | Spørsmål fra den ekte vilkårsteksten |
| 5 | Trusselnivået | Måleren: rolig → irritert → nervøs → i panikk |

## Beslutninger tatt

- Spillformen er klassisk multiple choice med fire alternativer. Ikke chat.
- Spørsmålene bygger på de offentlige vilkårene for Reise og Reise Pluss, samt produktarket EAP20.
  Faktagrunnlaget er hentet ut på forhånd, med henvisning til hvor i vilkårene hvert svar står.
- Forskjellene mellom Reise og Reise Pluss gir de beste spørsmålene, fordi de har ett entydig
  riktig svar og folk gjetter feil.
- Ingen ekte kunde-, skade- eller personopplysninger. Alle saker og personer er oppdiktede.

Den fulle briefen ligger i `.ai/startprompt.md`.
