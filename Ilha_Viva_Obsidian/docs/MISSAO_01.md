# Missão 01 | Primeiro laboratório jogável

Objetivo: entregar uma cena web realmente jogável, com personagem original, animações validadas, terreno costeiro rural e mundo mínimo autônomo. Executar pré-requisitos M00 antes ou em paralelo; não recomeçar o GDD. Conferir skills Claude Code Game Studios instaladas; não presumir nomes nem acesso. Não baixar sprites ou packs.

## Frentes e contratos
- Engenharia: Canvas 2D, TypeScript estrito, input teclado e toque, relógio determinístico, render separado da simulação, dados versionados e save local com versão. Fixar dependências; build estático para teste Android/PC. Não usar DOM como estado autoritativo.
- Arte: tile 32 px e personagem 40–48 px como hipóteses; criar protagonista autoral, idle, andar, correr, enxada e regador em quatro direções. Metadados de duração, pivot, frame de contato e alvo. Criar fonte editável e PNG transparente. Terreno com curvas, casa, vegetação, água e galinha originais. Sem expandir elenco antes de aprovação visual.
- Simulação: um NPC com necessidades, agenda flexível, deslocamento e tarefa produtiva independente; uma galinha com procura de alimento/água, repouso e resposta ao ambiente. Relógio, sol/chuva, umidade, preparo, plantio, crescimento e colheita de um cultivo com ficha de referência. Não inserir espécie não pesquisada.
- IA: decisões de utilidade com desempate determinístico e motivos rastreáveis; memória simples do NPC; interações produzem eventos persistidos. NPC e animal funcionam fora da câmera. Runner inicia inclusive sem entidade jogador.
- UX: alvo destacado, colisões, profundidade por pés, barra rápida, ação contextual, joystick e botão de ação. Pequeno ciclo plantar/regar/colher; permitir observar a rotina autônoma. Sem tela de debug como interface do jogo.

## Aceitação e evidências
| ID | Teste | Critério |
|---|---|---|
| P01 | Andar/correr em 4 direções | Sem deslizamento perceptível, colisão coerente e pivô estável |
| P02 | Enxada e regador | Efeito do comando coincide com contato visual; exatamente uma mutação por ação |
| P03 | Sprite | Transparência, dimensões, frames e metadados válidos; revisão humana pendente até aprovação |
| P04 | Clima e planta | Chuva aumenta umidade dentro de limites; crescimento respeita requisitos |
| P05 | NPC | Escolhe e conclui tarefa sem input, registra custo/resultado |
| P06 | Animal | Procura recurso disponível; não consome recurso inexistente |
| P07 | Ausência do jogador | Runner avança 30 dias com seed fixa, sem entidade jogador, registrando ações e invariantes |
| P08 | Câmera | Mesmo resultado lógico para agentes visíveis e ocultos com seed/comandos iguais |
| P09 | Save | Recarregar preserva relógio, inventário, necessidades e memórias |
| P10 | Browser | Build abre, controles de toque e teclado funcionam, nenhuma exceção bloqueante |
| P11 | Regressão | Suite completa e relatório real; falha nova vira caso persistente |

Entregáveis: fonte, build estático ou link de preview se disponível, comando de execução, screenshots, gravação das ações e rotina autônoma se suportada, log de testes, seed e diário causal, catálogo de arte e hashes. Commit no repositório dedicado se autorizado. Não declarar aprovação artística, desempenho de aparelho ou execução inexistente. Se não houver navegador, expor bloqueio, executar testes possíveis e deixar script de smoke reproduzível. Não migrar para Godot ainda.

## Continuidade
Após aprovação visual, expandir protagonista alternativo, elenco e animais em lotes compatíveis; avançar agricultura, narrativa e economia em paralelo. Reexecutar P01–P11 a cada entrega e adicionar os testes do novo escopo.
