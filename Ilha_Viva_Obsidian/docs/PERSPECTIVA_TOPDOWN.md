# Perspectiva top-down do protagonista

Checkpoint v0.12 | 26/11/2026

Feedback: cenário de solo de mata considerado interessante; personagem parecia andar deitado pela incompatibilidade entre sprite em ângulo frontal e chão visto de cima.

Decisão: câmera 2D ortográfica elevada, top-down oblíqua (aprox. 45–60 graus como alvo artístico, não medição do desenho); mostrar topo da cabeça e ombros, encurtamento perspectivo natural e pés ancorados. Não girar o sprite deitado nem trocar identidade do protagonista. Preservar cabelo castanho, camisa azul, calça marrom, botas e cores.

Entrega experimental: folha nova de caminhada em quatro direções, 16 quadros recortados e atlas de 96 px por célula. Repouso usa primeiro quadro por direção. Corrida usa caminhada acelerada provisoriamente; foice e regador preservam os sprites antigos, com perspectiva pendente de revisão. Nenhum outro asset substituído.

QA: 11 verificações anteriores da mata repetidas no Chromium e aprovadas, incluindo deslocamento, posição fixa em ações, foice, regador, clima, pastoreio, tráfego, 3650 dias e zero erros JS. A aprovação artística e o teste Android ainda pendem. A nova folha apresenta proporções visualmente mais compactas, que precisam de aprovação.

- [[GDD]]
- [[COMPATIBILIDADE_VISUAL]]
- [[QA_SPRITES]]
- [[SOLO_MATA]]
- [[../builds/Ilha_Viva_Solo_Mata_02_Topdown.html|Laboratório HTML 02]]
- ![[../assets/protagonista/andar_topdown_atlas.png]]


## Checkpoint v0.13 (26/11/2026)
A referência-mestre do protagonista top-down foi fixada em [[REFERENCIA_MESTRE_PROTAGONISTA]]. Fundo PNG transparente obrigatório. Machado e ambos os nados permanecem pendentes; gerações que mudaram a identidade foram rejeitadas. Nenhuma arte anterior foi substituída.
