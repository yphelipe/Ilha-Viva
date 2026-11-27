# Missão Codex M48-A | primeira fatia continental jogável

Executar imediatamente no repositório existente. Consultar AGENTS.md, ESTADO_ATUAL.md, checkpoint mestre vigente, GDD, AMBIENTACAO_EUA e SKILLS_PROJETO. CP-2026-11-27-03 é a base técnica; usar checkpoint posterior se existir. Madagascar/Amazônia históricos, sem apagar arquivos. Preservar protagonista aprovado, atlas, animações, pivôs e proporções. Não migrar engine.

## Entrega integrada
- Recuperar atlas local assets/runtime/ART.json; conferir blob/hash e extrair apenas metadados necessários. Não redesenhar protagonista.
- Novo campo continental HTML offline independente, inspirado nos Apalaches: terreno orgânico, grama, terra, trilhas, água, pedras, vegetação temperada, cercas, casa, celeiro e plantio. Pixel art original detalhada e realista no estilo; perspectiva oblíqua, escala, iluminação, volumes e oclusão coerentes. Referências reais apenas para estudo.
- Integrar protagonista, controles táteis, câmera, colisões e profundidade. Preservar Campo 05 histórico.
- Integrar scientific/us/world.mjs e soil_cell.mjs: clima, relevo, escoamento, solo, água, decomposição e crescimento vegetal com estado persistente. Separar perfil regional, regras, apresentação e save. Pesquisar fontes primárias e registrar unidades e incertezas.
- Núcleo de mundo avança sem jogador; estruturar IA offline por percepção, necessidades, utilidade, memória, aprendizagem local persistente e LOD. Provar pelo menos um comportamento adaptativo quando implementado; não confundir aleatoriedade com aprendizado. Não tomar decisões pessoais do jogador.
- Priorizar sistemas reutilizáveis e uma fatia funcional. Aprofundar microbiologia, flora, fauna, genética e sociedade em sequência conforme os gates; não fingir implementação total.

## Execução econômica
Ler .agents/skills/economia-de-sessao/SKILL.md e skills pertinentes. Agrupar trabalho, testar alterações dirigidas e regressão nos marcos integrados, automatizar tarefas repetitivas, usar leitura seletiva e frentes independentes. Não consumir sessão apenas com documentação. Registrar bloqueios e avançar alternativas. Atualizar skills com evidências, não hipóteses.

## Fechamento
HTML real com link, código e commit, testes realmente executados, evidência visual se disponível, limitações e próxima missão. Atualizar GDD, Obsidian, roadmap, diário, estado, checkpoint mestre e snapshot; VERSION apenas para build real. Android físico/FPS somente se medidos. Não afirmar aprovação artística sem avaliação humana. Complexidade interna, simplicidade externa.
