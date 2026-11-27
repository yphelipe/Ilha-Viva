# Ilha Viva | YNOVIQ Studios

> **Vigência 27/11/2026:** cenário continental fictício dos EUA substitui Madagascar e Amazônia; ler `Ilha_Viva_Obsidian/docs/AMBIENTACAO_EUA.md` (ou `docs/AMBIENTACAO_EUA.md` dentro do vault). Campo 05/v0.47 é base histórica. Preservar protagonista e animações, substituir terreno, fauna, flora e dados ecológicos; não confundir piloto científico com build jogável.

Base v0.47 importada da versão aprovada Campo 05. RPG 2D de simulação ecológica e vida rural inspirado em Madagascar, offline, Android prioritário.

## Executar
`python tools/build.py` gera o HTML autônomo `play/Ilha_Viva_Campo_05.html`. Abra o arquivo no navegador. O visualizador do lêmure está em `play/Ilha_Viva_Lemur_Movimentos_05.html`.

## QA
`python -m pip install -r requirements.txt` e `python -m playwright install chromium`. Execute `python tests/regression.py` e `python tests/test_new.py`. Se houver Chromium instalado, use a variável `CHROMIUM_PATH`. Resultados históricos: 72 verificações na v0.47, não confundí-los com resultados novos.

## Continuidade
`AGENTS.md`, `ESTADO_ATUAL.md` e `Ilha_Viva_Obsidian/INICIO.md` são pontos de entrada. A fonte ativa é `src/field.template.html` + `src/ecosystem/` + `assets/runtime/`. O HTML é saída gerada. O Obsidian mantém toda a documentação e o histórico; scripts antigos são referência, não pipeline ativo. O pacote original do Gemini fica em `assets/original/lemur_catta/` após importar as partes.
