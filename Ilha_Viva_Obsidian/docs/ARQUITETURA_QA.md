# Arquitetura técnica e garantia de qualidade

> **Vigência v0.29 (26/11/2026):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevalece sobre trechos históricos conflitantes. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.


## Stack proposta
Fase web: HTML5 Canvas 2D, TypeScript strict, Vite, Vitest e Playwright. Fixar versões após smoke test, sem dependência de API externa durante gameplay. IndexedDB para saves e export/import JSON. Fase Godot: versão estável e templates compatíveis verificados no gate MG, GDScript tipado, renderer Compatibility como candidato. CI testa web primeiro e ambos durante portabilidade.

## Estrutura de repositório sugerida
```
web/{src,public,tests}/
content/{crops,animals,npcs,items,dialogues,weather}/
art_source/
assets/original/
contracts/{schemas,fixtures,replays}/
docs/
research/
tools/
.github/workflows/
godot/                     # somente no gate MG
```

## Contratos e desempenho
Separar modelo puro de simulação da cena/render. WorldState contém entidades por IDs estáveis; Definições JSON validadas por schema, estado serializável separado. WorldClock e SimulationCoordinator controlam ordem; serviços explícitos com sinais de domínio, evitar autoload para cada classe. Adaptador de input -> comando validado -> transação -> evento -> apresentação. Uma única fonte de verdade para inventário, moeda e relógio. Comandos idempotentes onde necessário. Sem dependências circulares, acoplamento por nome de node ou caminhos mágicos. Canvas e grid para terreno, objetos e colisões na web; TileMapLayer e CharacterBody2D após port; Y-sort por pivô do pé, navegação por grid/custos e recalcular só quando necessário. Chunks e níveis de detalhe lógico: agentes próximos em alta resolução, distantes agregados em ticks; resultados equivalentes dentro de tolerância documentada. Não criar node por célula agrícola. Pooling somente após perfil. Perfil no aparelho real, não confundir FPS headless com FPS do jogo.

Save local versionado: schema_version, IDs, relógio, RNG, estado, eventos, transações, inventário e progresso. Transações IndexedDB e snapshot validado na web; escrita temporária e substituição atômica quando suportada no Godot, backup recuperável; migrações incrementais, testes de save anterior e corrupção. Sem tempo offline forçado. Sem dados pessoais exigidos; telemetria opcional e consentida caso adotada.

## Testes automatizados
Vitest para núcleo e integração; Playwright para browser, toque, saves e screenshots; runner Godot headless após MG. CI retorna código não zero em falha e gera relatório de unitários, integração, regressão, simulação longa, build web e validação de arte; export debug Android após MG. Testes com seeds fixas e variantes, mocks de relógio, snapshots de estado, propriedades/invariantes, cenas de smoke. Não usar espera real de dias.

| ID | Cenário / asserção mínima |
|---|---|
| TIME-001 | 24h, virada de estação e ano sem tick perdido/duplicado |
| WTH-001 | mesma seed e comandos reproduzem estado; salvar/reabrir preserva sequência |
| WATER-001 | balanço hídrico conserva fluxos com tolerância, sem água negativa |
| CROP-001 | chuva adequada substitui rega; planta cresce em janela adequada |
| CROP-002 | frio/estresse afeta espécies diferentemente; estação não apaga plantas indiscriminadamente |
| CROP-003 | rotação reduz risco em configuração controlada; compostagem consome insumos |
| ANML-001 | animal bebe e come só recurso disponível e apropriado; sem duplicação |
| ANML-002 | galinha não bota antes de maturidade; sem galo permite ovo infértil |
| ANML-003 | calor e falta de água elevam estresse; mitigação reduz risco |
| ECO-001 | pasto diminui ao pastejo e recupera quando em repouso sob condições adequadas |
| ECO-002 | habitat/floração afetam polinização de cultura dependente; independente não ganha bônus arbitrário |
| FISH-001 | captura reduz estoque; regeneração respeita capacidade |
| ECON-001 | compra/venda atomicamente atualizam moeda/estoque, sem negativos ou duplicação |
| NPC-001 | agenda adapta chuva e caminhos bloqueados, sem teleporte indevido |
| NAR-001 | evento respeita requisitos, cooldown, conhecimento e memória |
| SAVE-001 | round-trip preserva estado, seed, flags e posição; migra versão anterior |
| SAVE-002 | arquivo truncado restaura backup ou informa falha sem sobrescrever último válido |
| INPUT-001 | toque/cancelamento/multitouch não duplica ação; impacto apenas uma vez |
| VIS-001 | PNG/atlas/âncora/direções e transparência válidos; revisão de movimento por vídeo |
| PERF-001 | simular 365 dias, limites e recursos estáveis; relatório de CPU/memória |
| APK-001 (após MG) | export Android instala, abre, inicia, salva, reabre, recupera de suspensão e opera offline |

Testes de cada bug devem reproduzir a falha antes da correção e permanecer na suíte. Comparar 365 dias com 3+ seeds e 30 dias de comandos simulados, com invariantes e cenários de seca/chuva. Prova de estados distantes equivalentes ao modo detalhado dentro da tolerância. Testes visuais por screenshots/vídeo no browser e posteriormente em Godot real; headless não aprova estética. Gate: 100% dos testes obrigatórios passam, zero P0/P1 abertos, sem erro de build da plataforma corrente, relatório de problemas restantes e evidências. Não mascarar testes, desativar asserts ou reportar números fictícios.

## Metas provisórias no Galaxy S23
60 FPS alvo em cena representativa e 30 FPS mínimo no perfil de carga, medidos com build release equivalente; p95 de frame-time <=16,7 ms para meta 60 FPS; 15 min de sessão sem crash e monitorar aquecimento, picos de memória e bateria. Fixar orçamentos após baseline e testar aparelho mais modesto antes de lançamento. Nenhum desempenho ou export foi validado nesta entrega documental.

## Gates adicionais
IA e migração: casos IA-001 a IA-010 em IA_ADAPTATIVA.md; PORT-001 a PORT-005 em MIGRACAO.md. Web: build estático, primeiro carregamento, touch, save/export/import, funcionamento sem chamadas externas depois de cache quando suportado. APK não exigido antes de MG.


## Gate de autonomia mundial v0.3
Incorporar MA-001 a MA-010 de MUNDO_AUTONOMO.md. Runner headless aceita cenário sem jogador, simulação de longo prazo, replay e injeção controlada de condições. Passo fixo e resolução estável independentes de render/input. Avaliar equivalência visível/distante, logs causais, orçamento de memória e filas; manter a política de congelar o tempo quando o jogo está fechado.

## QA M02-A
Ver [[GRAMA_VIVA]] e src/grama/qa.json.


## Checkpoint v0.11 | Solo de mata
Nova prancha original e laboratório HTML de trilhas curvas, compactação, serapilheira e cobertura vegetal. 10 testes anteriores e 11 verificações Chromium aprovadas. Direção artística e escala ainda pendentes de aprovação; árvores e vegetação alta não integradas. Ver [[SOLO_MATA]].


## v0.25 | Cenário oficial (26/11/2026)
Ilha fluvial amazônica fictícia aprovada pelo usuário; sem neve, friagem episódica, diversidade regional e simulação causal com desempenho Android. Purus/Juruá são referência técnica proposta; localização exata, mapa e limites populacionais permanecem em estudo. A decisão substitui o perfil marítimo temperado e as opções anteriores. Protagonista v0.22 preservado; roupa leve de frio automática pendente. HTML primeiro; sem migração ou envio ao Claude nesta etapa. Ver [[ILHA_AMAZONICA_v0.25]] para arquitetura, metas, testes e próxima missão. Nenhum código ou arte alterado.
