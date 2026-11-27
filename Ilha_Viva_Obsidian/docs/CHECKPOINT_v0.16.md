# Laboratório 07 | checkpoint v0.16

Data: 2026-11-26.

## Decisão
O usuário reenviou o laboratório 02 e solicitou adaptação top-down e redução de movimentação exagerada durante ações. Preservar o arquivo original (SHA-256 `0413c6b832ce10ab084ce7aeb74cdbd2ef059b798a2c6490ceaf52a89ac2646e`) e não gerar uma nova identidade artística.

## Implementação
- Duas bibliotecas isoladas: Original 02 (imagens extraídas do HTML enviado) e Top-down (folhas candidatas produzidas anteriormente). Nenhuma geração nova.
- 248 entradas de quadros, 240 PNGs únicos no HTML, preservando alfa. Divisões escolhidas pela máscara alfa; nenhuma borda de célula cruza pixels com alfa acima de 128. Arte original arquivada no HTML enviado.
- Pivôs de apoio calculados pelos pés, excluindo em parte ferramentas e efeitos; revisão manual dos pivôs frontais e laterais de ferramentas top-down. Nado ancorado na região superior do corpo.
- Ferramentas, repouso e entrada na água bloqueiam translação e mudança de orientação por setas. Seleção explícita da orientação no painel. Caminhada, corrida e natação permitem movimento.
- Velocidade, zoom, pausa, avanço por quadro, fundo branco/xadrez e pivô visível.
- Algumas laterais top-down são espelhadas (enxada, machado, foice e nados). São candidatos, não aprovação artística.

## QA
98 verificações aprovadas no Chromium (viewport móvel 390 x 844, HTML carregado via set_content devido à política que bloqueia file://). Nenhum erro JavaScript. Testes cobrem ações/direções, bloqueio de posição e direção e movimento permitido. Sem teste físico no Android.

## Pendências e limitações
A adaptação top-down reutiliza imagens já existentes; não é uma nova projeção perfeita da arte original. As ferramentas top-down têm três quadros por direção e o nado quatro; orientação da lâmina, naturalidade, continuidade e apoio dos pés exigem revisão visual. Nado sem camisa usa variante previamente criada. Espelhamento inverte assimetrias. Não avançar para Godot ou Claude Code; não substituir os sprites oficiais. Nenhum sistema ambiental foi alterado.

## Arquivos
[[QA_LAB07]]; `builds/Ilha_Viva_Laboratorio_07_Topdown.html`; `builds/Ilha_Viva_Laboratorio_07_preview.png`.
