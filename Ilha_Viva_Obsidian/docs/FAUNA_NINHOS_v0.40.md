# v0.40 | Fauna, nidificação e recuperação

Continuação direta da v0.39. Ilha oceânica fictícia inspirada em Madagascar. Escala relativa e perspectiva top-down oblíqua da v0.34 obrigatórias. Nenhuma arte anterior modificada.

## Implementação
- Tenrec ecaudatus: 12 agentes iniciais, atividade predominantemente noturna, caça a insetos (inclusive cupins), fuga de fossa, gestação experimental de 60 dias, cuidado materno. Ninhada de um indivíduo no modelo, não representativa da espécie real; ampliar dieta e ninhadas posteriormente.
- Fossa: alternativas de presa lêmures e tenreques; contabilização por espécie.
- Aves piscívoras: estoques de ovos e filhotes, incubação experimental de 21 dias, perdas por cheias, transferência de biomassa dos adultos, maturação média. Representação funcional agregada, sem ninho físico ou sprite final.
- Larvas: dieta funcional ampliada para detritos. Peixes: maior aproveitamento de insetos terrestres e manutenção metabólica reduzida experimentalmente.
- Balanços C/N/P/água preservados; fósforo orgânico terrestre ainda aproximado por nitrogênio.

## Referências
- Animal Diversity Web, Tenrec ecaudatus: https://animaldiversity.org/accounts/Tenrec_ecaudatus/ (dieta, hábitos noturnos, gestação 56 a 64 dias).
- IUCN Afrotheria Specialist Group: https://afrotheria.net/tenrecs/ (ecologia e dieta de tenrecos).
- African Museum, Pachypanchax sparksorum: https://faunafri.africamuseum.be/cloffa/table/taxon2/view?idtaxon%3Aint=11609 (insetos terrestres/aquáticos e pequenos camarões).
- FishBase: https://www.fishbase.net.br/summary/Pachypanchax-sparksorum (predação por aves e insetos aquáticos).
Os coeficientes, incubação de aves e taxas populacionais são escolhas experimentais de gameplay, não parâmetros calibrados por espécie.

## QA
18 verificações núcleo (616 passos nos cenários principais), 7 verificações específicas de tenreque e 25 verificações Chromium em viewport móvel com armazenamento simulado. Total 50 verificações. Relatórios JSON no pacote. Após 90 dias de seca, biomassa de peixes 0.0864416; após 30 dias de chuva, 0.0500629. Melhor que v0.39 (0.0392 e 0.02246), mas recuperação ainda insuficiente. Sem respawn artificial. Sem teste Android físico, sem arte final. Próximo: estabilizar cadeia aquática, ampliar dieta e reprodução dos tenreques, validar escala dos sprites animais e testar cenários plurianuais.
