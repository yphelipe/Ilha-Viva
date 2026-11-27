# Ilha Viva | YNOVIQ Studios

## Base vigente

A fonte ativa da v0.48 é `src/field.template.html`, os módulos em `src/ecosystem/`, o adaptador `src/field048.js` e `assets/runtime/`. Leia integralmente `ESTADO_ATUAL.md` e, no vault `Ilha_Viva_Obsidian/`, `INICIO.md`, `docs/GDD.md` e `docs/ROADMAP.md` antes de alterar a base. O registro desta missão está em `docs/missoes/v0.48_Vida_e_Oficina.md` dentro do vault.

## Build e verificação

- `python tools/build.py` gera `play/Ilha_Viva_Campo_06.html`.
- `python tools/build_viewer.py` regenera o visualizador de movimentos preservado.
- Após instalar `requirements.txt` e o Chromium do Playwright, execute `python tests/regression.py`, `python tests/test_new.py` e `python tests/test_campo048.py`. Use `CHROMIUM_PATH` se o navegador vier do sistema. `ILHA_CAMPO_HTML=Ilha_Viva_Campo_05.html` seleciona a referência histórica nas duas suítes originais.
- `node --test tests/test_*048.js` executa as suítes dos módulos. `sha256sum -c qa/baseline/html.sha256` verifica o Campo 05 histórico.

## Continuidade

Preserve as artes aprovadas, perspectiva, escala, contratos ecológicos, bugs corrigidos e a compatibilidade com partidas antigas. Use apenas animações correspondentes à ação representada. Mantenha autonomia do ecossistema inteiro ao otimizar a simulação por setores. Priorize Android, offline e custo zero. O Campo 06 lê a partida da v0.47 quando ainda não possui uma própria e grava em chave independente.

A cada missão, atualize GDD, Roadmap, INICIO, estado, VERSION, testes e HTML jogável. Registre os comandos, resultados reais, referências, commit e pendências. Testes em viewport móvel e testes em Android físico têm evidências distintas. Mudanças de engine exigem autorização.

O ZIP compacto v0.47 mantém a base de origem. O acervo histórico integral de 590 entradas e as 35 pranchas originais do Gemini aguardam o pacote integral.
