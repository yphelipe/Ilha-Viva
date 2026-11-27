# Grama viva | M02-A | 0.8

Estado: protótipo funcional, direção artística pendente de validação pelo usuário. Protagonista preservado conforme checkpoint v0.7. Nenhum envio ao Claude Code nem migração Godot.

## Arte original
48 tiles de 32×32 (6 estados, 8 variações por estado) e 24 sobreposições transparentes de tufos (3 famílias, 8 variantes). Raster criado por algoritmo de desenho pixel a pixel, semente fixa; fontes Python e PNGs versionados. Paleta e escala provisórias. Não foram utilizados pacotes externos. Solo exposto é apenas estado residual, não o futuro sistema de terra. O campo é um laboratório, não o mapa definitivo; transições orgânicas refinadas ainda pendentes.

## Modelo
126 células, valores normalizados 0–1: umidade, biomassa, reservas de crescimento, fertilidade e dias de estresse. Clima natural determinístico ou cenários de chuva, estiagem e frio. Passo diário atualiza água, crescimento e reservas; o corte reduz biomassa, desfolha intensa reduz reservas; estiagem limita crescimento. Regador aumenta água; foice remove biomassa no quadro de contato aproximado, posição fixa. Pastoreio abstrato opcional seleciona autonomamente célula com maior pontuação de forragem e consome uma porção. Não representa uma espécie animal, dieta, animação ou fisiologia completa. Tempo automático é acelerado para demonstração. Modelo não calibrado em unidades físicas nem por espécie; fertilidade constante nesta fase; sem persistência do campo ou acoplamento aos NPCs do protótipo anterior.

## Pesquisa consultada
- Colorado State University Extension, Grass Growth and Response to Grazing: https://extension.colostate.edu/resource/grass-growth-and-response-to-grazing/ — desfolha severa, reservas, disponibilidade hídrica e rebrota.
- University of Maryland Extension, Drought Management and Recovery for Pastures and Hayfields: https://extension.umd.edu/resource/drought-management-and-recovery-pastures-and-hayfields — preservar folhas residuais, limitar pressão de pastejo durante seca.
- USDA NRCS, Pasture and Grazing Management: https://www.nrcs.usda.gov/plantmaterials/idpmspu10096.pdf — diferenças por espécie, estágio e reservas. Coeficientes do protótipo são decisões de design, não parâmetros extraídos dessas fontes.

## QA
10 testes de modelo Node aprovados (determinismo, limites em 3650 dias, clima, corte, rebrota, pastoreio, frio e estados visuais). Em 30 dias, chuva constante: biomassa média 0,9676; estiagem: 0,2064; consumo autônomo acumulado no cenário chuvoso 6,60 unidades normalizadas. Chromium Playwright em viewport móvel: abertura por set_content (file:// bloqueado pelo ambiente), foice, bloqueio de movimento, caminhada, regador executado, avanço 30 dias, reset, pastoreio e zero erros JS. Captura real registrada. Não validado em Android físico. Arte ainda não aprovada. Testes anteriores preservados; não reexecutados integralmente nesta sessão.

## Próximo gate
Validar grama no celular antes de iniciar terra, transições de caminhos e solo agrícola. Refinar densidade e leitura visual, caso necessário. Não produzir novos NPCs ou animais definitivos antes de aprovar escala de ambiente.
