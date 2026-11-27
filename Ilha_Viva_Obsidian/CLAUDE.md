# Instruções de projeto | YNOVIQ Studios

> **Vigência 27/11/2026:** cenário continental fictício dos EUA substitui Madagascar e Amazônia; ler `Ilha_Viva_Obsidian/docs/AMBIENTACAO_EUA.md` (ou `docs/AMBIENTACAO_EUA.md` dentro do vault). Campo 05/v0.47 é base histórica. Preservar protagonista e animações, substituir terreno, fauna, flora e dados ecológicos; não confundir piloto científico com build jogável.

> **Vigência v0.29 (26/11/2026):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevalece sobre trechos históricos conflitantes. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.


Este arquivo é um suplemento de contexto. Se Claude Code Game Studios já tiver CLAUDE.md ou project.yaml no novo repositório, mescle as instruções com os arquivos oficiais preservando seus hooks, regras e esquema. Não os sobrescreva. Leia README.md, docs/GDD.md, docs/SIMULACAO.md, docs/ARTE.md, docs/NARRATIVA.md, docs/ARQUITETURA_QA.md, docs/ROADMAP.md, docs/IA_ADAPTATIVA.md, docs/MIGRACAO.md e research/FONTES.md.

## Missão inicial para Claude Code
Crie um novo projeto de fazenda 2D em HTML5 Canvas e TypeScript primeiro, com migração posterior para Godot, sem reaproveitar projetos anteriores, com arte/áudio próprios. Priorize Android offline, PC secundário; GDScript tipado na fase Godot. Utilize as skills e agents do Claude Code Game Studios já instalados. Verifique comandos e versão locais antes de invocar; se disponíveis, use `/project-stage-detect` ou `/start`, `/adopt` para integrar docs existentes sem perda, `/setup-engine` somente quando aplicável à etapa atual, e o fluxo apropriado de arquitetura, arte, narrativa, epics, stories e gates. Confira referência oficial em research/FONTES.md. Iniciar pelo protótipo web jogável; não migrar para Godot antes do gate MG.

Execute M00 completa com progressão alta: estruturar repo e CI, comprovar importação/build quando ambiente permitir, criar runner, matriz de testes, ADRs e fichas iniciais rastreáveis, começar prova artística autoral sem baixar assets. Distribuir frentes independentes entre direção criativa, sistemas, narrativa, arte, programação web e arquitetura de portabilidade, QA e DevOps conforme agentes disponíveis. Não interromper para perguntas sobre detalhes reversíveis; documentar decisões provisórias. Preservar gates humanos para nome, estilo e escopo irreversível. Não expandir conteúdo antes de validar o piloto visual e a integração causal.

## Regras obrigatórias
- Pesquisar qualquer mecânica de natureza, agricultura, animais ou clima antes de implementar: fonte primária, tradução em gameplay, abstração documentada, teste e limitação. Fichas de espécie e região antes de inserir novos conteúdos.
- Criar toda a arte, sprites, animações, UI, música e SFX do zero. Sem import de asset packs, imagens, sprites, música ou código proprietário de outros jogos. Ferramentas de produção e dependências técnicas auditadas podem ser usadas, não confundir ferramenta com asset.
- Não declarar qualidade artística por teste unitário. Exigir prova visual, frame-by-frame e validação humana; sem estética de IA genérica.
- Simulação desacoplada da apresentação, determinística quando seed/comandos iguais, consistente dentro/fora da tela. Dependências e save testados.
- Toda missão termina com suite completa de regressão, evidências, revisão e commit; sem regressão silenciosa. Não inventar números de testes, APK, FPS ou aprovação. Se algo falhar, registrar e corrigir; nunca reduzir critérios para marcar como pronto.
- Não instalar serviços pagos, publicar, apagar ou alterar projetos não relacionados sem autorização. Trabalhar no repo dedicado. Evitar microiterações, preservar decisões aprovadas e reportar impedimentos reais.

Entregável M00: resumo técnico, decisões e pendências, caminhos dos docs, log de testes e build, build HTML jogável com link/artefato; APK somente após MG, prova visual se produzida, hash do commit e backlog M01. Não prometer entrega futura sem execução verificável.

## Adendo obrigatório v0.2
IA local baseada em necessidades, utilidade, memória e conhecimento limitado; nenhuma API de LLM exigida. História principal escrita com duração significativa, final persistente e pós-história sem limite obrigatório. Implementar IA desde a primeira fatia jogável, não como sistema cosmético tardio. Não declarar comportamento aprendido sem evidência do estado persistente e da mudança de decisão.


## Adendo obrigatório v0.3: autonomia mundial
Leia docs/MUNDO_AUTONOMO.md antes de implementar. O núcleo da simulação deve avançar sem comandos do jogador, inclusive sem entidade jogador no runner headless. Nenhuma atividade rotineira depende de quest, câmera ou presença do jogador. Implemente MA-001 a MA-010 conforme os gates; registre eventos causais, custos, restrições, replays e resultados efetivos. Comece na primeira versão HTML. Não implementar avanço em tempo real com jogo fechado sem aprovação. Em conflito, esta especificação prevalece sobre dependências de presença em requisitos anteriores; preservar arco autoral e decisões exclusivas do jogador.


## Prioridade v0.4
O usuário aprovou ilha parcialmente habitada, sobrevivência rural e mundo autônomo. Leia docs/ILHA_VIVA.md e execute docs/MISSAO_01.md como especificação mais recente. Em divergências, v0.4 prevalece. Não tratar o nome provisório como marca final. Primeiro perfil realista, outros parametrizados. Testar no navegador movimento, animações, ações, fauna e NPCs; não limitar o trabalho a documentação.


## Bloqueio v0.5 (prioridade sobre instruções anteriores)
Não executar missões no Claude Code ainda. Usuário determinou testar e polir em HTML nesta conversa primeiro. Ao receber autorização posterior, ler INICIO.md, docs/PROTAGONISTA.md, docs/QA_SPRITES.md, docs/DECISOES.md e docs/DIARIO.md. Preservar assets aprovados e corrigir os problemas registrados. Atualizar vault e GDD em toda entrega.

### Regra de animação v0.6
Ações estacionárias usam pivô fixo e não deslocam a posição lógica. Preservar apoio anatômico e validar em HTML antes de migrar.

## Checkpoint v0.7 | 26/11/2026
- O usuário decidiu manter o protagonista e as animações do laboratório 03 como estão por enquanto. Aceitação provisória para continuidade do projeto, não certificação final de qualidade.
- Preservar integralmente os sprites, a ancoragem, as quatro direções e as duas variantes de nado já integradas. Nenhuma nova arte ou alteração de código nesta entrega.
- Próximo elemento a criar: ainda não definido; aguardar decisão do usuário, sem iniciar produção por conta própria.
- Pendências técnicas e artísticas continuam registradas em [[QA_SPRITES]], especialmente validação no Android, transições de água e integração com o mundo. Não encaminhar ao Claude Code nem migrar para Godot sem autorização.

## Checkpoint v0.8
Preservar M02-A conforme docs/GRAMA_VIVA.md. Não avançar arte sem validação. Não iniciar migração.

## Checkpoint v0.10 | 26/11/2026
O usuário aceitou a direção geral do conceito de sítio na mata como referência visual aproximada, não como arte final. Reforçou compatibilidade gráfica com o protagonista e registro contínuo no GDD e Obsidian. A aparência do Campo 01 continua rejeitada. Próximo gate: prova de escala e compatibilidade visual em HTML, com assets autorais modulares. Não alterar o protagonista, reaproveitar apenas a lógica de simulação validada e manter IA/autonomia. Nenhum asset novo, build ou teste de jogo executado neste checkpoint. Ver [[COMPATIBILIDADE_VISUAL]].


## Checkpoint v0.11 | Solo de mata
Nova prancha original e laboratório HTML de trilhas curvas, compactação, serapilheira e cobertura vegetal. 10 testes anteriores e 11 verificações Chromium aprovadas. Direção artística e escala ainda pendentes de aprovação; árvores e vegetação alta não integradas. Ver [[SOLO_MATA]].


## v0.12
[[docs/PERSPECTIVA_TOPDOWN]] · Correção experimental de caminhada, aguardando aprovação.


## v0.25 | Cenário oficial (26/11/2026)
Ilha fluvial amazônica fictícia aprovada pelo usuário; sem neve, friagem episódica, diversidade regional e simulação causal com desempenho Android. Purus/Juruá são referência técnica proposta; localização exata, mapa e limites populacionais permanecem em estudo. A decisão substitui o perfil marítimo temperado e as opções anteriores. Protagonista v0.22 preservado; roupa leve de frio automática pendente. HTML primeiro; sem migração ou envio ao Claude nesta etapa. Ver [[ILHA_AMAZONICA_v0.25]] para arquitetura, metas, testes e próxima missão. Nenhum código ou arte alterado.
