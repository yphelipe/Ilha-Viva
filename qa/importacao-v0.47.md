# Validação da importação v0.47

Em 27/11/2026, os 334 arquivos de `Ilha_Viva_Base_v0.47.zip` foram conferidos byte a byte após a extração na raiz do repositório existente. A conferência incluiu 307 arquivos do Obsidian, dos quais 84 em Markdown, e os recursos de arte e animação da base ativa.

## Builds

- `python tools/build.py` gerou `play/Ilha_Viva_Campo_05.html`. O SHA-256 conferiu com `qa/baseline/html.sha256` e `AGENTS.md`: `c2f5f6a3929df4fdda5a84f2602eaaca0ce304afe89b3f17f8cb8210f44a17d4`.
- `python tools/build_viewer.py` gerou `play/Ilha_Viva_Lemur_Movimentos_05.html` com SHA-256 `df06e11379acd796ebd348c1c4d7bf7a3d958ca52bae3fb8ddad61283f6b3666`.

## Testes executados

Python 3.12.14, Playwright 1.62.0 e Chromium 156.0.8078.79 em viewport móvel de 390 × 844.

| Comando | Resultado |
| --- | --- |
| `CHROMIUM_PATH=/usr/bin/chromium python tests/regression.py` | 55 verificações passaram, zero erros JavaScript |
| `CHROMIUM_PATH=/usr/bin/chromium python tests/test_new.py` | 17 verificações passaram, zero erros JavaScript |

O teste complementar abriu os dois HTMLs via servidor HTTP local e confirmou seu funcionamento após ativar o modo offline do Chromium. O Campo 05 carregou 1.120 células, 52 vertebrados e 127 sprites e salvou e restaurou uma partida com o `localStorage` real. O visualizador carregou 10 grupos e decodificou os quadros de escalada, transporte dorsal e exposição solar. Nenhuma requisição externa ou erro JavaScript foi observado.

A primeira tentativa de executar as suítes foi interrompida por uma restrição do sandbox ao iniciar o Chromium. A repetição com a permissão apropriada concluiu as duas suítes. A navegação `file://` foi bloqueada pela política do navegador, por isso a abertura foi validada via servidor local.

## Pendências

A validação em Android físico e a incorporação do acervo histórico integral e das 35 pranchas originais do Gemini dependem do dispositivo e do pacote integral anterior, respectivamente.
