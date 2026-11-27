# Ilha Viva | YNOVIQ Studios

RPG 2D de simulação ecológica e vida rural inspirado em Madagascar. O Campo 06 integra vida animal, lavoura e oficina rural. O jogo usa HTML autossuficiente, sem serviços externos, com prioridade para Android.

## Jogar

Abra `play/Ilha_Viva_Campo_06.html` no navegador. Use setas, WASD ou o controle tátil. As ações de lavoura e oficina usam o alvo à frente do jogador. Fabricação, construção, tratamento de água e movimentação de estoque ficam no painel **Lavoura e oficina**.

`python tools/build.py` regenera o Campo 06. `python tools/build_viewer.py` regenera `play/Ilha_Viva_Lemur_Movimentos_05.html`. O Campo 05 da v0.47 segue em `play/`.

## Qualidade e continuidade

Instale `python -m pip install -r requirements.txt` e `python -m playwright install chromium`, ou indique um Chromium existente com `CHROMIUM_PATH`. Execute:

```sh
python tests/regression.py
python tests/test_new.py
python tests/test_campo048.py
node --test tests/test_*048.js
```

O Campo 06 importa o salvamento do Campo 05 quando a origem do navegador é a mesma e ainda não existe uma partida v0.48. A gravação da v0.48 usa uma chave independente.

[Orientações do projeto](AGENTS.md) · [Estado atual](ESTADO_ATUAL.md) · [Obsidian](Ilha_Viva_Obsidian/INICIO.md)
