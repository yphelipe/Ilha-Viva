---
name: rigging-esqueletico
description: Construir e inspecionar uma guia biomecânica com FK/IK, exportar spritesheet RGBA e comparar com a marcha tradicional aprovada.
---

# Guia esquelética de marcha

Aplicar quando uma ação tiver uma família anatômica definida e houver quadros aprovados para comparar. No piloto humano lateral, cada tornozelo obedece a um alvo local. O joelho resulta da interseção de dois segmentos rígidos no plano sagital, com o ramo anterior fixo. O ombro deriva da bacia, o cotovelo do ombro e o punho do cotovelo. A mão terminal pode servir de ponto de encaixe para uma ferramenta em trabalho futuro.

1. Identificar ação, espécie, vista e referência biomecânica. A marcha humana confortável tem cerca de 60% do ciclo em apoio e 40% em balanço, com sobreposição dos apoios. O piloto alterna os lados em meio ciclo e usa o braço contralateral. Cadência, comprimento dos ossos em pixels, avanço por ciclo e altura de elevação são parâmetros experimentais. [AAPM&R](https://now.aapmr.org/biomechanics-normal-gait/) · [Fases e fotos laterais](https://www.ipnfa.org/wp-content/uploads/2020/11/gait-cycle-perry-with-carsten-colors-final.pdf)
2. Definir os ossos em coordenadas locais e comprimentos fixos. Calcular a passada em unidades de deslocamento do corpo; no apoio, descontar esse deslocamento do tornozelo para manter a posição no mundo. No balanço, interpolar a posição e a elevação e testar as duas extremidades do ciclo. Manter o deslocamento lógico zero para repouso. Rejeitar alvo inalcançável antes da exportação.
3. Executar `python tools/rig_humano.py`. O build lê as referências existentes de `assets/runtime/ART.json` e preserva os PNGs, escala, orientação e metadados de pivô. O esquema experimental usa grade fixa de 80 × 96 px e pivô (40,84). Abrir `play/Ilha_Viva_Rig_Humano.html`, inspecionar os quadros e baixar a faixa RGBA da ação. A animação aprovada segue a cadência histórica de seis referências por segundo.
4. Executar `python tests/test_rig_humano.py` e `CHROMIUM_PATH=/usr/bin/chromium python tests/test_rig_browser.py`. Cinco testes numéricos e de raster cobrem comprimentos, flexão máxima de guarda, contato, continuidade periódica, repouso, alcance, transparência e margens. A prova de navegador decodifica as imagens, reproduz por toque, troca a ação, baixa o PNG e grava `qa/rig_humano.png`. O Chromium gerenciado bloqueou a navegação file://; o teste carrega os bytes locais do build em um contexto offline.
5. Avaliar os apoios, a silhueta e a anatomia no tamanho de jogo antes de redesenhar qualquer quadro. A sincronização compara a mesma fração dos dois ciclos, sem atribuir automaticamente contatos aos quadros originais. O piloto representa centros articulares em vista lateral, sem volume corporal, rotação no plano transversal, força de reação do solo ou articulação dos dedos. A próxima revisão pode marcar contatos e juntas à mão sobre cópias das referências; novas famílias e outras vistas precisam de cadeias e evidências próprias.

## Ferramentas e evidência

Pillow 13.0.0 produziu as duas faixas PNG com CPU. Playwright executou Chromium com toque e viewport 393 × 852. Blender respondeu a `--version` com 4.3.2; oferece armatures e IK, com potencial para futuras vistas correlacionadas. A prova atual cabe em duas dimensões e tem exportação reproduzível diretamente com Pillow. [Documentação de IK do Blender](https://docs.blender.org/manual/en/4.4/animation/constraints/tracking/ik_solver.html)

Krita (pintura e animação quadro a quadro), LibreSprite e Pixelorama (edição de pixel art) e Synfig (ossos e deformação de bitmap, GPLv3) foram considerados para acabamento e autoria manual. A verificação de executáveis no PATH deste checkout encontrou apenas Blender dentre esses editores. O piloto executa sem MCP de terceiros, credenciais ou instalação desses editores. [Krita](https://krita.org/en/features/) · [LibreSprite](https://libresprite.github.io/) · [Pixelorama](https://www.pixelorama.org/) · [Synfig](https://www.synfig.org/)

O histórico da implementação e seu commit de introdução podem ser recuperados por `git log --diff-filter=A --format=%H -- tools/rig_humano.py`. A base de comparação foi o checkpoint CP-2026-11-27-05 no commit 7b12617.
