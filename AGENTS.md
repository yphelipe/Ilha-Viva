# Ilha Viva | YNOVIQ Studios

## Retomada vigente
Ler primeiro `Ilha_Viva_Obsidian/docs/CHECKPOINT_CONTINUIDADE.md`, `Ilha_Viva_Obsidian/docs/MISSAO_CODEX_M48A.md` e `.agents/skills/economia-de-sessao/SKILL.md`, além das skills pertinentes. Cenário continental EUA; Madagascar e Amazônia históricos. O fluxo de economia de sessão é obrigatório sem reduzir qualidade ou QA.

## Primeira importação
O ZIP compacto contém a base histórica v0.47, todos os 84 documentos Markdown do Obsidian, sprites runtime e testes. O acervo histórico completo de 590 entradas e as 35 pranchas originais do Gemini permanecem no pacote integral anterior e ainda precisam ser incorporados. Não declarar migração histórica completa.

Execute `python tools/build.py` e `python tools/build_viewer.py`. O Campo 05 deve ter SHA-256 c2f5f6a3929df4fdda5a84f2602eaaca0ce304afe89b3f17f8cb8210f44a17d4. Instale requirements.txt e Chromium via Playwright, se necessário. Execute `python tests/regression.py` e `python tests/test_new.py`. Registre resultados reais antes de novas implementações.

## Desenvolvimento
Leia ESTADO_ATUAL.md, Ilha_Viva_Obsidian/INICIO.md, Ilha_Viva_Obsidian/docs/GDD.md e Ilha_Viva_Obsidian/docs/ROADMAP.md. Preserve artes aprovadas, perspectiva, escala, comportamento biológico e bugs corrigidos. Priorize Android, offline e custo zero. Progresso alto sem microiterações. Atualize GDD, roadmap, estado, VERSION, testes e HTML jogável a cada missão. Não migre de engine sem autorização. Não declare Android físico testado sem evidência. Informe commit, testes executados e pendências.

## CP-2026-11-27-04 | Entrega ao Codex e economia de sessão
Missão vigente: [[MISSAO_CODEX_M48A]], arquivo `Ilha_Viva_Obsidian/docs/MISSAO_CODEX_M48A.md`. Nova skill `.agents/skills/economia-de-sessao/SKILL.md`: leitura seletiva, trabalho agrupado, testes direcionados e regressão no marco integrado, automação, recuperação de bloqueios e atualização por evidências. Sete skills no total. Base técnica permanece CP-03; nesta revisão apenas procedimentos e documentação, sem novo build, código de jogo, arte ou testes. Próxima ação: executar a missão no checkout do Codex, recuperar atlas original e integrar campo continental em HTML. Não afirmar que Codex executou ou que economia foi medida.

## Continuidade de execução | CP-2026-11-27-06
Publicar commits incrementais coerentes após testes direcionados, sem esperar o fim de uma missão longa. Registrar checkpoint curto antes de trocar de frente e snapshot no marco integrado; evitar duplicar relatórios. Se o push não estiver disponível, informar e preservar estado local. Antes de continuar, conferir HEAD e comparar alterações ainda não publicadas do Codex com main; não sobrescrever. Laboratório 02 e IA adaptativa diagnóstica disponíveis; consultar checkpoint mestre.

## Decisão de plataforma | HTML primeiro, Godot posteriormente
Decisão explícita do usuário: manter HTML5/JavaScript como plataforma atual de desenvolvimento, visualização e testes no celular; usar Godot somente em etapa posterior. Cada missão que alterar comportamento jogável deve publicar um HTML autônomo e atualizado para download/teste, com link direto ao arquivo, identificação da versão, escopo e limitações. Laboratório diagnóstico não substitui o campo jogável. Priorizar integração do campo, protagonista original, animações e cenário em pixel art sem abandonar o motor científico. Separar simulação determinística, dados, assets, saves e apresentação; manter contratos de unidades, ticks, schema e cenários de regressão independentes da engine para futura portabilidade. A migração só começa após decisão explícita do usuário e validação do gameplay em HTML. Godot 4 é a direção prevista; GDScript é sugestão técnica provisória, não linguagem decidida nem versão da engine fixada. Não criar projeto Godot ou APK agora. Esta revisão apenas registra a decisão, sem alteração de código/build/teste.
