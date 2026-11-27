# Ilha Viva v0.36 | Rios e nutrientes

## Entrega
Laboratório HTML 07 offline, extensão do núcleo 06. Ilha fictícia inspirada em Madagascar. 1.120 células terrestres/fluviais e 28 trechos agregados. Protagonista, arte aprovada e regra de escala/perspectiva/geometria intactos. Não houve migração para Godot.

## Modelo e decisões
- Biomassa funcional: algas, zooplâncton, larvas consumidoras, camarões detritívoros, peixes insetívoros. Não equivalem a indivíduos, nem todos os grupos de larvas ou camarões têm essa dieta. Sem identificação taxonômica definitiva dos grupos.
- Fotossíntese dependente de luz, água, temperatura, N e P; sombreamento e capacidade de suporte. Consumo com resposta saturante à disponibilidade de presas; transferências de C/N/P para consumidores e detritos. Respiração e mineralização retornam nutrientes à água. Biomassa morta vira detrito.
- Oxigenação normalizada (0 a 1), não concentração em mg/L: reaeração, fotossíntese, respiração e demanda por decomposição. Estiagem e hipoxia afetam biomassa. Não há simulação de patógenos aquáticos ou toxinas.
- Fósforo inicial em rocha e solo; intemperismo experimental e transporte superficial. A fração de N lixiviado capturada perto do rio é debitada da saída terrestre, sem dupla contagem; serapilheira ribeirinha retirada do estoque existente. Fluxo de nutrientes dissolvidos, plâncton e detritos para jusante e saída da bacia. P contabilizado nos compartimentos modelados; absorção vegetal terrestre, P nos animais terrestres, sorção e fósforo orgânico terrestre ainda não modelados. A hidrologia usa a água do núcleo original, sem adicionar água automaticamente. As frações de transferência são hipóteses de gameplay, não taxas de campo.
- Intervenções: pesca experimental de biomassa, nutrientes e resíduos externos explicitamente contabilizados. Camadas de oxigenação, fósforo e biomassa de peixes. Corrigida falha do mapa de bactérias/fungos quando a legenda não existia. Salvamento com chave v0.36, sem migração de saves antigos.

## QA executado
10 testes Node (`node test_aquatic.js`) e 18 verificações Chromium (`python browser36.py`); 30 dias naturais, estiagem e tempestade, 360 passos nos três cenários, além de testes isolados. Maior resíduo numérico observado: 8,74e-10 nas unidades do modelo. A versão anterior dos testes plurianuais está incluída, mas não foi reexecutada nesta entrega. Três dias de excesso de matéria orgânica: índice O2 0,101 contra controle 0,905. O teste usa adição experimental de resíduos, não uma previsão de campo. Ver JSONs de resultados.

## Limites e próximos gates
No cenário natural aos 30 dias, biomassa de larvas 0,194 (inicial 0,98) e camarões 0,072 (inicial 0,728). É necessário equilibrar alimento, refúgios, ciclo reprodutivo, migração real, micro-habitats e vazão de base; não repor artificialmente. A estiagem extrema seca todos os trechos no modelo, portanto validar rios perenes e poças de refúgio. Equilíbrio anual/plurianual e benchmark Android físico pendentes. Arte diagnóstica; sem sprites novos. Próximo gate: biodiversidade aquática regional por espécie, ciclo de vida e integração de insetos terrestres com o rio; completar P terrestre e calibrar populações. Metas de desempenho e regras de escala continuam vigentes.

## Fontes (consulta para esta etapa)
- Royal Museum for Central Africa: Pachypanchax sparksorum, dieta e habitat: https://faunafri.africamuseum.be/cloffa/table/taxon2/view?idtaxon%3Aint=11609
- FishBase: https://fishbase.se/summary/Pachypanchax-sparksorum.html
- USGS, Rivers and streams: Ecosystem dynamics and integrating paradigms: https://www.usgs.gov/publication/70179801
- US EPA, nutrientes: https://www.epa.gov/nutrientpollution/basic-information-nutrient-pollution
- US EPA, oxigênio dissolvido: https://www.epa.gov/caddis/dissolved-oxygen
- Convention on Biological Diversity, Madagascar: https://www.cbd.int/countries/profile/default.shtml?country=mg
