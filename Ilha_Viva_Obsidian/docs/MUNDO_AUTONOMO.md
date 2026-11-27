# Mundo autônomo | v0.3

> **Vigência v0.29 (26/11/2026):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevalece sobre trechos históricos conflitantes. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.


## Requisito central (MA-001)
O mundo avança com o relógio simulado independentemente de comandos, presença física ou progresso narrativo do jogador. O jogador participa, não é o motor causal de todos os acontecimentos. Nenhuma atividade econômica, social ou ecológica de rotina exige uma missão do jogador para acontecer. Esta regra vale antes, durante e depois da campanha.

## Escalas e execução
- Relógio único e passos fixos de simulação, separados dos frames. Cada etapa tem ordem estável, orçamento e RNG persistido. Pausa e fechamento congelam o relógio por padrão; avanço ao fechar o aplicativo é uma decisão de produto ainda não autorizada, diferente de autonomia durante o tempo de jogo.
- Ciclo lógico: clima e tempo -> água/solo -> vegetação e recursos -> percepção/necessidades -> decisão de agentes -> resolução transacional de ações -> relações/economia -> eventos narrativos elegíveis -> histórico e snapshot. Cada etapa consome estado consistente. Frequências diferentes por domínio; valores definidos por benchmark e pesquisa.
- Áreas visíveis: movimento, colisão, animação e interação detalhada. Áreas distantes: agenda, viagem com custo temporal e localização válida, inventários, relações e necessidades em resolução menor. Reconciliar na entrada sem duplicar recursos nem teleportar agentes observados. Eventos urgentes e compromissos não são descartados ao descarregar chunks.
- Motor headless sem renderização e sem jogador, com o mesmo núcleo da versão jogável. Relatório causal e replay permitem investigar cada evento. A simulação não depende de FPS nem de input, e não depende de LLM.

## Domínios
| Domínio | Autonomia exigida | Restrições |
|---|---|---|
| NPCs | necessidades, trabalho, lazer, relações, objetivos, negociação, descanso | conhecimento limitado, tempo, rotas e recursos reais |
| Propriedades de NPCs | plantar, colher, alimentar animais, manter estruturas, vender | mão de obra, insumos, estação, capacidade e custo |
| Comércio | produção, consumo, reposição, transporte e contratos | moeda e estoque contábeis; importações explícitas; sem criação silenciosa |
| Comunidade | reuniões, projetos, festivais, conflitos e resolução | orçamento, calendário, participantes, compromisso e histórico |
| Animais | alimentação, água, abrigo, reprodução e comportamentos próprios | espécie, idade, ambiente e capacidade; pesquisar antes de implementar |
| Ecologia | sucessão vegetal, regeneração, mortalidade, dispersão e interação | disponibilidade de habitat, recursos e população; sem crescimento ilimitado |
| Narrativa | histórias de moradores, consequências e eventos emergentes | não atribuir ao jogador decisões que ele não tomou; arco principal com retorno acessível |

## Exemplo de cenário sem jogador
Uma seca reduz o pasto. Um criador observa o problema, compra feno de um agricultor que realmente tem estoque, reduz despesas ou solicita ajuda à cooperativa. O comerciante recebe pedidos, negocia reposição, ajusta oferta e registra a transação. Uma reunião comunitária pode financiar um reservatório se houver recursos e consenso. O jogador pode auxiliar, ignorar ou descobrir os resultados mais tarde. O resultado deve depender das condições e decisões reais, não de uma cutscene acionada pela aproximação do jogador.

## Proteções de design
Autonomia não implica caos ou realismo punitivo. Ciclos de recuperação, comércio externo contabilizado, políticas comunitárias, substituição de funções essenciais e limiares de risco evitam colapso generalizado não intencional. Nenhum desfecho obrigatório da campanha será escolhido em nome do jogador; eventos perdidos recebem alternativas coerentes quando relevantes. Não fabricar crises para obrigar participação. A fazenda pessoal pode ter consequências naturais do abandono durante tempo simulado; oferecer opções explícitas de assistência posteriormente, sem gestão automática oculta. Eventos raros e transições demográficas exigem escopo e pesquisa, não são prometidos no protótipo.

## Contratos e rastreabilidade
WorldClock, SimulationCoordinator, AgentState, ResourceLedger, ActionIntent, Reservation, DomainEvent, WorldHistory e NarrativeState; IDs estáveis, precondições, efeitos atômicos, origem e tick, RNG e política de migração. Cada submodelo documenta objetivo, entidades, escala, ordem, regras, inicialização, entradas, abstrações e evidências. Usar ODD como referência documental, não como alegação de validação científica do jogo. Detalhes de biologia, agricultura e economia seguem fichas específicas já exigidas.

## Testes de aceitação (especificados, ainda não executados)
| ID | Cenário e requisito |
|---|---|
| MA-001 | Rodar 30 dias sem input e sem entidade jogador: NPCs trabalham e descansam, recursos variam por causas válidas, transações e eventos ocorrem. |
| MA-002 | Rodar 365 dias em pelo menos três seeds sem jogador: sem crash, estoque negativo, duplicação, bloqueio global ou fila ilimitada; verificar serviços essenciais e recuperação. |
| MA-003 | Rodar a mesma seed com jogador observador versus ausente; estado equivalente quando não há interação ou efeito de presença modelado. |
| MA-004 | Comparar agentes visíveis e distantes: inventários, relações, eventos únicos e custos preservados, tolerâncias explícitas para posições e agregados. |
| MA-005 | Salvar e carregar no meio de uma atividade autônoma: sem perdas, duplicações ou divergência de replay. |
| MA-006 | Injetar seca e falta de estoque; agente procura alternativa válida, comércio registra fluxos e comunidade reage conforme condições. |
| MA-007 | Ignorar narrativa por um ano simulado: mundo progride, história mantém ponto de reentrada e não inventa decisões do jogador. |
| MA-008 | Avançar após o final, simular 10 anos em teste acelerado com conteúdo habilitado: sem ciclos patológicos, memória ilimitada ou perda de serviços essenciais fora das crises projetadas. |
| MA-009 | Pausar/fechar e reabrir: relógio preservado conforme política padrão, nenhum salto por relógio real. |
| MA-010 | Portar fixtures e replay para Godot: paridade dos eventos e invariantes entre engines. |

## Gate de produção
M00: runner headless, relógio e contratos; M01: pelo menos um NPC com rotina e decisão que avança sem jogador e muda conforme contexto; M02: clima, solo, vegetação e agentes sem input; M03: autonomia interligada com comércio, animais e narrativa, MA-001 a MA-007 e MA-009 conforme conteúdo; M05: campanha/pós-jogo, MA-008 e regressão integral; MG: MA-010. Não alegar simulação autônoma aprovada sem logs e testes executados. Metas de FPS serão medidas no aparelho, não inferidas de simulação headless.
