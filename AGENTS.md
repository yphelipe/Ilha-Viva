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

## Prioridade de retomada 28/11/2026
A missão vigente é a seção PRIORIDADE VIGENTE do arquivo Ilha_Viva_Obsidian/docs/MISSAO_CODEX_M48A.md. Recuperar trabalho Codex não publicado e produzir o primeiro campo continental HTML jogável, com artes e protagonista originais e motor CP-10 integrado. Nenhum laboratório novo nesta missão. Commits incrementais, teste Chromium real e HTML baixável. Esta atualização é documental, sem novo build.

## Fluxo híbrido permanente: Codex + ChatGPT
Decisão do usuário em 28/11/2026: desenvolver o mesmo jogo em ambos os ambientes, mantendo o HTML como formato comum executável e portátil até a migração futura autorizada para Godot. O repositório é a fonte de verdade; não criar versões paralelas incompatíveis nem reiniciar o jogo quando o limite do Codex acabar. Antes de trabalhar, verificar HEAD, branches, checkpoint e alterações pendentes; preservar trabalho local e sincronizar sem sobrescrever. Cada ambiente entrega alterações incrementais testadas e publicadas, com caminho, commit, build HTML autônomo, dependências/arte incorporadas e instruções de abertura no celular. Manter o campo jogável integrado, não substituir por laboratório diagnóstico. Registrar o último estado funcional, testes realizados e bloqueios; o próximo ambiente retoma exatamente desse ponto. Se publicação ou acesso a arquivos grandes falhar, registrar limitação e entregar artefato/diff acessível quando possível; não alegar sincronização, execução real ou testes não realizados. Não depender de acesso ao ambiente privado do outro agente. Evitar trabalho concorrente na mesma branch; usar branches de trabalho e integrar seletivamente com testes. O Codex não precisa aguardar autorização para cada microetapa da missão vigente. ChatGPT continua implementação real quando Codex estiver indisponível, dentro das ferramentas acessíveis. GDD, Obsidian e skills refletem resultados e decisões; documentação curta não substitui entrega funcional. Esta atualização registra o fluxo, sem novo build.

## CP-2026-11-28-11
Branch missao/campo-continental: Campo 02 preservado e código Campo 03 com rega conservativa, corrida tátil e proteção durante animações. 29 verificações de modelo aprovadas (runtime JS); build/Chromium pendentes por bloqueio de acesso ao atlas/HTML grande. Pipeline CI criado, sem execução confirmada. Consultar [[CHECKPOINT_CONTINUIDADE]]. Não afirmar que Campo 03 foi empacotado; continuar na branch ativa e validar antes de merge.

CP-11 confirmado: Campo 03 compilado e entregue como HTML/artefato CI; run 46151967224, SHA-256 77fc75da07e8cb05c8a0a282b54184d9b1f60ccd85cfcd2cfce49ccd4dd9752a. 20 testes Chromium e testes Node/atlas aprovados. Sem teste Android físico. Ver checkpoint mestre para evidências e limites.

## CP-2026-11-28-12
Campo 04: coleta de água conservativa, cobertura orgânica, colheita condicionada a 14 dias/biomassa, analógico tátil, zoom, destaque e progresso do canteiro. 64 verificações de modelo; QA real/artefato pendentes de confirmação CI. Preserva artes e Campo 03. Ver checkpoint mestre.
