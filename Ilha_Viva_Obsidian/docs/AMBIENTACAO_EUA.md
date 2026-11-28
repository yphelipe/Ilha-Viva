# Ambientação continental norte-americana | Decisão 27/11/2026

## Vigência
Aprovado pelo usuário: substituir Madagascar por uma região rural fictícia continental inspirada nos EUA, tendo os Apalaches/Blue Ridge e Ridge and Valley como referência inicial proposta. Madagascar deixa de ser cenário ativo; manter todo o acervo e a base v0.47 como histórico, sem espécies, biomas ou parâmetros malgaxes na nova campanha. Não deletar os assets antigos. Ilha Viva permanece codinome até escolha de título. Preservar o protagonista aprovado e suas animações; reconstruir terreno, flora, fauna, arquitetura e dados científicos. Aproveitar somente infraestrutura e algoritmos genéricos após auditoria, sem portar parâmetros antigos por padrão. Esta decisão prevalece sobre GDD, NARRATIVA, ILHA_VIVA, MADAGASCAR_v0.29, ROADMAP, CLAUDE e notas anteriores em conflito.

## Mundo
Vale rural fictício habitado, conectado a outras cidades por estradas e comércio, sem obrigação de ilha ou porto. Proposta narrativa: protagonista muda de vida e assume uma propriedade antiga mediante cooperativa local; comunidade autônoma, história escrita com conclusão e pós-história indefinido. Origem pessoal, época, nomes e mapa final pendentes. Quatro estações com clima regional, neve onde condições permitirem, fotoperíodo, congelamento e degelo; não aplicar neve uniformemente. Casa, celeiro, galinheiro, curral, silo, oficinas, estradas, pontes, escolas e comércio em escala coerente; construção por custo, tempo, trabalho, materiais, propriedade e demanda. NPCs independentes, sem crescimento garantido.

## Macro-regiões propostas
- Apalaches/Blue Ridge e Ridge and Valley: mosaico de floresta temperada, riachos, pastagem, lavoura e pomares; piloto.
- Nordeste/Grandes Lagos: floresta mista, lagos, inverno mais rigoroso.
- Grandes Planícies/Meio-Oeste: pradarias, lavoura, pastagem e zonas úmidas.
- Sudeste/Golfo: clima quente, pântanos e planícies costeiras.
- Montanhas Rochosas: coníferas, altitude e neve.
- Noroeste do Pacífico: florestas úmidas, rios e montanhas.
- Sudoeste: deserto, vegetação xerófita, escassez de água.
- Alasca e Havaí: módulos futuros separados, não obrigatórios nem misturados por proximidade artificial.
Cada região terá perfil de clima, relevo, solo, água, conectividade e ocorrência de espécies. O mapa é fictício, não cópia cartográfica 1:1. Migração, introdução doméstica/invasora, corredores e barreiras explicitamente modelados. Não juntar jacarés, bisões e alces no mesmo habitat sem justificativa ecológica. Escopo, dimensões e biomas dependem de testes.

## Motor científico novo
A unidade de estado regional é uma célula ecológica (área em m²) com camadas solo, água, vegetação e organismos; dados externos versionados com ID taxonômico, unidade, região, estação, fonte e intervalo de incerteza. Células distantes usam coortes, grupos funcionais microbianos e fluxos agregados; indivíduos próximos conservam identidade, idade, sexo, condição corporal e memória. Simular tempo de jogo, não tempo real com aplicativo fechado. Usar ticks fixos e RNG seeded; replay e save com migração explícita, nunca carregar um save de Madagascar como se fosse americano.

| Camada | Estado/processos mínimos |
|---|---|
| Meteorologia | radiação, fotoperíodo, precipitação, vento, temperatura, umidade, neve e degelo; extremos plausíveis |
| Terreno/hidrologia | elevação, declive, textura, infiltração, escoamento, água subterrânea simplificada, rios, erosão, retenção |
| Solo | carbono orgânico, N mineral e orgânico, P disponível, pH, temperatura, umidade e oxigenação; estoques e fluxos |
| Microbiologia | bactérias e fungos decompositores, micorrizas, nitrificantes, desnitrificantes, fixadores, protozoários e nematoides por grupos funcionais; crescimento limitado por substrato, ambiente e recursos |
| Flora | fenologia, germinação, fotossíntese, respiração, raízes, nutrientes, sementes, polinização, competição, sucessão e dormência |
| Fauna | dieta por espécie/idade/estação, energia, água, abrigo, reprodução sexuada quando aplicável, cuidado parental, dispersão, predadores e presas, doenças e parasitas abstratos |
| Pecuária | raças e espécies domésticas, alimentação, água, pasto, reprodução, gestação/incubação, lactação, ovos, bem-estar e manejo |
| IA | percepção local, memória, utilidade, rotinas, território, fuga, caça/forrageio, sociabilidade, aprendizado e decisões com custos; NPCs com objetivos e conhecimento parcial |
| Economia | trabalho, estoques, preços, transporte, contratos, recursos e construção; ações de NPCs continuam sem jogador |

### Conservação e interfaces
Fotossíntese incorpora carbono a partir do CO2 atmosférico, usando energia luminosa, água e nutrientes; respiração e decomposição devolvem carbono. Consumo transfere biomassa do recurso para consumidor, fezes e perdas respiratórias; cadáver e serapilheira entram em detritos. Mineralização disponibiliza nutrientes, imobilização os retém; lixiviação/erosão exportam para água ou fronteira. Energia não é reciclada como matéria. Registrar entradas/saídas, unidades e tolerâncias numéricas; não gerar nutrientes, comida, nascimento ou estoque do nada. Ações concorrentes reservam recurso e resolvem em ordem determinística. Separar motor, dados, apresentação, narrativa e persistência.
Reprodução depende de espécie, estação, maturidade, energia, saúde, parceiro/estratégia e capacidade de suporte. Não usar chance universal de nascimento. Herança simples validada por espécie, sem alegar genética completa. IA do jogador limitada a comandos assistidos, necessidades e animações contextuais, não tomar decisões pessoais; IA dos NPCs e animais offline.

## Piloto e gates
M48-A: inventário, arquivo histórico, isolamento do novo perfil; terreno temperado com relevo, solo, água, luz e clima; construir fatia mínima em HTML separada do Campo 05.
M48-B: teia do solo e vegetação; pasto, carvalho regional, detritos, grupos decompositores e polinizadores, testes de balanço.
M48-C: animais domésticos e selvagens candidatos (galinha, bovino, cervo-de-cauda-branca, coelho, raposa, insetos) somente após ficha e validação de ocorrência/dieta; testes de fome, energia, morte, reprodução e relação predador-presa.
M48-D: IA autônoma de NPCs, produção, logística, construção e integração causal. Expandir regiões por gate, não por lista de centenas de sprites.
Testar invariantes de massa/água/nutrientes, ausência de estados negativos, reprodutibilidade, continuidade LOD sem duplicações, clima sazonal, compatibilidade geográfica, reprodução, populações em simulação plurianual, ausência do jogador, save/reload, regressões, render/pivô/escala e desempenho em Android. Metas anteriores de 60 FPS Galaxy S23/30 FPS intermediário não são medições. Interface oferece sinais naturais e diário opcional; não exigir planilha do jogador. Não migrar a Godot nesta etapa. Arte nova original, perspectiva oblíqua consistente. HTML jogável e evidência real antes de declarar implementação.

## Fontes oficiais iniciais (consultadas em 27/11/2026)
- EPA, ecorregiões III/IV: https://www.epa.gov/eco-research/level-iii-and-iv-ecoregions-continental-united-states
- NOAA NCEI, normais climáticas 1991–2020: https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals
- USDA NRCS, Soil Biology Primer: https://www.nrcs.usda.gov/resources/education-and-teaching-materials/soil-biology-primer
- USDA NRCS, Soil Health Management: https://www.nrcs.usda.gov/conservation-basics/soil/soil-health/soil-health-management
- USGS GAP, ocorrência e habitat: https://www.usgs.gov/programs/gap-analysis-project/science/species-data-overview
- US Forest Service FEIS, história de vida/ecologia: https://research.fs.usda.gov/feis/about
Estas fontes fundamentam o desenho inicial, não fornecem parâmetros já calibrados. Fichas por espécie e sítio, dados agrícolas e veterinários de extensão universitária/USDA e validação adicional pendentes.

## Estado
Decisão e arquitetura documental estabelecidas primeiro; implementação experimental isolada registrada abaixo. Nenhum HTML ou sprite alterado. Base histórica v0.47, commit 90a601a86ed489704568dd9b6df8a9338265a197. Protagonista preservado.
## Prova técnica inicial do motor continental | 27/11/2026
M48-A parcial, sem alteração do Campo 05. `scientific/us/soil_cell.mjs` implementa uma célula diária isolada com água, neve, degelo, infiltração, escoamento, drenagem, evaporação, estoques de C/N vegetal, detritos, biomassa microbiana e N mineral, decomposição, respiração e crescimento limitado por água/luz/temperatura/N. Coeficientes ilustrativos não calibrados; transpiração explícita, fósforo, pH, grupos microbianos distintos, transporte espacial, terreno visual, fauna, IA, save e interface ainda pendentes. Teste `scientific/us/soil_cell.test.mjs`: 1.095 dias sintéticos, 4.387 verificações de conservação de água/C/N, determinismo, neve/degelo, seca e ausência de luz; aprovadas na execução das mesmas funções em JavaScript nesta sessão. Não foi executado Node CLI, CI, suite antiga, HTML ou Android. Commits c1385aa3bab322dd150939bd12b1e5ecc7bc668e (módulo) e 6422b75fd54700e750ae2249322936140041cb40 (teste). Não declarar a simulação completa ou validada cientificamente. O build v0.47 permanece histórico, não entregar como cenário EUA.

## M48-A | Laboratório Continental 01 | CP-2026-11-27-03
Prova espacial em `scientific/us/world.mjs` e HTML autônomo `play/Ilha_Viva_Laboratorio_Continental_01.html` (11.310 bytes, blob Git 170de602406d7b03bcb6578bc974c5f792c7f062). Malha visual de 32×24 células (768) de 10 m de lado, relevo sintético, clima diário determinístico, neve, degelo, infiltração e roteamento de água superficial para vizinhos mais baixos; exportação na fronteira e drenagem profunda explicitadas. Fluxos de C/N e água do módulo de solo anterior preservados; nitrogênio lixiviado sai do domínio, não é transportado entre células nesta versão. Mapas diagnósticos de paisagem, relevo, umidade, N e biomassa microbiana; seleção tátil de célula, avanço diário/semanal/anual, simulação automática, tempestade, nevasca e reset. Sem protagonista e sem arte final: o atlas `assets/runtime/ART.json` (1.737.726 bytes, blob a3dac070adb3400e373232affcd6bbed1a84b1f3) foi localizado, mas o conector retornou conteúdo vazio; clone local falhou por DNS. Não substituímos nem alteramos o protagonista. Campo 05 e VERSION 0.47 históricos preservados. O novo laboratório é independente, não uma build jogável completa.
Fontes consultadas: EPA ecorregiões Blue Ridge/Ridge and Valley https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=91024W05.TXT ; NOAA normais https://www.ncei.noaa.gov/access/us-climate-normals/index.html ; tabela secundária Asheville Regional Airport https://climate-charts.com/usa-stations/nc/usw00003812.html (rótulos 1991–2020 e 2006–2020 conflitantes; valores mensais arredondados apenas ilustrativos; validar dados primários antes de calibrar); USGS grupos hidrológicos https://pubs.usgs.gov/ds/480/HydrologicSoilGroup.htm . Precipitação aleatória diária sintética, temperatura aproximada com gradiente altitudinal, iluminação sazonal heurística. Não é clima observado nem modelo geológico calibrado.
QA: 1.095 dias × 192 células = 210.240 células-dia; 4.423 verificações aprovadas (balanços água/C/N, finitude/não negatividade, ordem reversa de estados, escoamento, neve, degelo, seca e serialização). 15 verificações do HTML recuperado com DOM/canvas simulados; não Chromium, Android, Node CLI nem regressão histórica. Evidência `qa/continental_01.json`. Commits 4c635eee (motor), 3142c0b8 (teste), bd0539ee (HTML), c47e9f98 (QA). Teste reproduzível: `node scientific/us/world.test.mjs`. A interface não implementa save; apenas teste de serialização de estado do motor. Valores agregados de estoque são somas por célula; multiplicar pela área para total físico, e converter mm×m² em m³ dividindo por 1000. Próximo: obter o atlas original integralmente e executar build/QA real, integrar protagonista e arte de terreno orgânica autoral; melhorar hidrologia espacial e validar clima primário, depois M48-B microbiologia e flora. Não declarar M48-A completa.

## CP-2026-11-27-08 | Fertilidade experimental
Laboratório 04 e módulo fertility.mjs publicados. Deposição atmosférica inspirada em Coweeta (6,7 kg N/ha/ano) e estoque orgânico protegido com taxas sintéticas. Dois cenários de 5 anos, 14.674 verificações do motor e 7 da UI simulada. C/N finais maiores na combinação experimental, mas perdas persistem e C colhido menor. Não é calibração de campo nem prova isolada de eficácia. Ver [[CHECKPOINT_CONTINUIDADE]] e qa/continental_04.json. Protagonista e arte final ainda pendentes; preservar históricos. Próximo: teste fatorial, fontes e sumidouros específicos, microbiologia.

## CP-2026-11-27-09 | Simbiose e experimento fatorial
Módulo microbiology.mjs e Laboratório Continental 05 publicados. Nove cenários de 3 anos, 29.708 verificações do motor e 7 de UI simulada. Separados fatores de deposição, dinâmica do estoque protegido e repartição inicial; teste adicional de fixação simbiótica limitada por hospedeiro agregado, C, N, luz, água e temperatura. Fixação total pequena (0,016396 kg N, custo 0,131166 kg C), apenas no primeiro ano. Não representa microbiologia completa nem calibração. Próximo: gramíneas/leguminosas em pools separados, nodulação e fungos/micorrizas/P; campo integrado quando atlas acessível. Ver [[CHECKPOINT_CONTINUIDADE]] e qa/continental_05.json.

## CP-2026-11-27-10 | Flora funcional
Laboratório Continental 06 e flora.mjs publicados. Gramíneas/leguminosas possuem C/N próprios, competição, nodulação funcional e crescimento com fixação de N/custo C. 17.683 verificações do motor e 7 da interface simulada; 4 cenários de 3 anos. Mistura fixou 6,184 kg N continuamente nos três anos; sem hospedeiro, zero. Parâmetros sintéticos e agentes abstratos. Atlas original inacessível pelo conector, preservado. Campo jogável e arte final ainda pendentes. Ver [[CHECKPOINT_CONTINUIDADE]] e qa/continental_06.json. HTML primeiro, Godot posterior.
