# Inteligência adaptativa | v0.2

> **Vigência v0.29 (26/11/2026):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevalece sobre trechos históricos conflitantes. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.

## Princípio
IA de jogo offline, não chatbot obrigatório. Utilidade calcula prioridades; comportamentos executam ações válidas; memória influencia decisões. Não usar LLM como autoridade do estado. Texto inicial autoral com seleção contextual. Uma interface futura de interpretação de texto livre pode converter entradas em intenções permitidas, com validação de fatos, fallback e orçamento. Modelos generativos locais exigem benchmark de tamanho/latência/qualidade, não prometidos para Android.

## Camadas
- Percepção: visão, localização, alcance, informação recebida e contexto. Eventos públicos e privados distintos. NPC não é onisciente.
- Estado: necessidades (energia, fome, segurança), emoções transitórias, traços estáveis, relações por pessoa, profissão, agenda, objetivos e compromissos.
- Memória: registros {id, factId, subjectId, sourceId, tick, confidence, salience, expiresAt}; fatos históricos relevantes e compromissos fixados; agregar memórias comuns; limitar capacidade e registrar origem. Memória não é verdade objetiva: rumores distinguem-se de observação.
- Decisão: filtrar ações por precondições, recursos, acesso e conhecimento; score ponderado de necessidades, objetivos, traços, compromissos, clima, relações e custo. Seleção estável por ID; interrupção por segurança/urgência; histerese e cooldown evitam troca incessante.
- Execução: FSM ou árvore de comportamento por ação: planejar rota, reservar recurso, deslocar, interagir, confirmar transação, liberar reserva. Falhas têm fallback, sem teleporte/duplicação.
- Aprendizado: perfil local por tags (agricultura, pecuária, exploração, social, conservação, comércio), contagem suavizada em janela e tendência longa. Não inferir características pessoais reais. Perfil recalibrável e resetável sem apagar história. Modifica relevância de ofertas, nunca fatos, preços base, personalidade ou dificuldade às escondidas.
- Diretor: candidatos escritos com condições, janela, prioridade, dependências, cooldown, exclusão e efeitos transacionais. Seleciona eventos elegíveis com diversidade, limite diário e proteção de arcos; não fabrica crises para punir progresso.
- Animais: usar estados e necessidades por espécie, comportamentos fundamentados na pesquisa; água, alimento, abrigo, termorregulação e interação social. Sem antropomorfizar.

## Contrato inicial de dados
NPCDefinition: id, voiceId, traits, needsConfig, profession, goals, schedule, knowledgeRules, actions. NPCState: position, needs, mood, knowledge, memory, relationships, currentAction, reservations, cooldowns. PlayerProfile: version, interests, evidenceCounts, lastUpdatedTick. NarrativeState: chapter, flags, resolvedOutcome, eventHistory, activeQuests. EventDefinition: id, requirements, trigger, speakerIds, knowledgeRequirements, priority, cooldown, unique, variantIds, effects. Estado e conteúdo separados; IDs estáveis, enums e schemas compartilhados.

## Exemplo de causalidade
Seca -> pasto reduz crescimento -> Augusto observa falta de forragem -> sua agenda muda para buscar alimento -> comerciante recebe solicitação e estoque muda -> se jogador possui feno e relação conhecida, oferta elegível. Se jogador recusa, NPC busca alternativas; nenhuma oferta impossível ou aumento mágico de estoque. Helena pode saber por conversa posterior, não por acesso automático ao save.

## Execução e limites
Decisões em ticks espaçados, eventos urgentes imediatos; navegação reavaliada apenas quando necessário. NPCs fora da tela usam ações abstratas com mesmos custos e efeitos; comparar paridade. Log causal de decisão somente em debug. Diretor nunca altera física/biologia. Limites de memória e fila de eventos configuráveis e testados em anos simulados. Sem treinamento de rede neural online nem uso de dados externos pessoais. Sem manipulação de engajamento.

## Testes obrigatórios (a implementar)
| ID | Cenário |
|---|---|
| IA-001 | Mesmo estado, seed e comandos produzem mesmas decisões e eventos. |
| IA-002 | Chuva e caminho bloqueado provocam mudança de agenda válida; não teleportar. |
| IA-003 | Ação concorrente reserva recurso uma vez; cancela e libera. |
| IA-004 | NPC não menciona fato privado desconhecido; rumor tem fonte e confiança. |
| IA-005 | Favores e promessas persistem após save/load; memória transitória decai sem apagar compromissos. |
| IA-006 | Perfil agrícola e perfil social recebem ofertas distintas elegíveis; mesma física e economia para condições iguais. |
| IA-007 | Repetição de 365 dias não produz loops, memória sem limite ou spam de diálogo. |
| IA-008 | Final principal é único; após conclusão 365 dias seguem jogáveis, sem reset de flags. |
| IA-009 | Jogador que ignora história ainda joga e tem caminho de retorno ao arco. |
| IA-010 | Nova expansão carrega save antigo, preserva final e não repete eventos únicos. |

## Texto e futuras expansões
Falas autorais por personagem, intenção e contexto. Recombinação controlada de fragmentos apenas quando natural; revisão humana da voz. Se houver texto livre, validar intenção antes de qualquer efeito. LLM opcional não altera saldo, relações, inventário ou história diretamente. Atualizações adicionam IDs e migradores, sem sobrescrever decisões passadas.


## Autonomia v0.3
A IA deve decidir e executar mesmo sem entidade jogador. Adaptação ao perfil é opcional e nunca bloqueia rotinas. Cada agente usa percepção local, necessidades, objetivos, recursos, ações válidas e histórico. Ver MUNDO_AUTONOMO.md para testes sem input, sem jogador e fora da câmera.
