---
name: qa-build-continuidade
description: Validar missão, regressão, HTML offline, desempenho e continuidade entre chats sem retrabalho.
---

# qa-build-continuidade

Status: procedimento inicial v1; validar e refinar com evidência de cada missão.

1. Conferir HEAD, ESTADO_ATUAL e CHECKPOINT_CONTINUIDADE; ler skills relevantes. Não recomeçar nem substituir base/arte aprovada; preservar builds históricos e hashes.
2. Definir escopo integrado com critérios objetivos, revisar diferenças e riscos. Executar testes do módulo e regressões anteriores no ambiente disponível; registrar comando, saída, falhas e ambiente. Não confundir teste em JS isolado com CI/Node ou Android físico.
3. Gerar HTML offline real quando houver alteração jogável; confirmar tamanho, caminho, abertura, assets, controles táteis, save, console, viewport e offline conforme disponibilidade. Não enviar HTML histórico como novo. Medir desempenho quando possível; 60 FPS S23 e 30 FPS intermediário são metas.
4. Atualizar GDD, Obsidian, decisões, diário, roadmap, estado, checkpoint mestre e snapshot datado. Atualizar VERSION apenas para build real. Registrar hashes, commit, próximos passos, evidências e lacunas.
5. Após solução repetível, atualizar skill correspondente com gatilho, método, teste, falha evitada e commit. Não promover hipótese a procedimento validado; manter status e histórico. Não guardar segredos.
Saída: commit, HTML se aplicável, relatório honesto de testes e checkpoint verificado.

## Decisão de plataforma | HTML primeiro, Godot posteriormente
Decisão explícita do usuário: manter HTML5/JavaScript como plataforma atual de desenvolvimento, visualização e testes no celular; usar Godot somente em etapa posterior. Cada missão que alterar comportamento jogável deve publicar um HTML autônomo e atualizado para download/teste, com link direto ao arquivo, identificação da versão, escopo e limitações. Laboratório diagnóstico não substitui o campo jogável. Priorizar integração do campo, protagonista original, animações e cenário em pixel art sem abandonar o motor científico. Separar simulação determinística, dados, assets, saves e apresentação; manter contratos de unidades, ticks, schema e cenários de regressão independentes da engine para futura portabilidade. A migração só começa após decisão explícita do usuário e validação do gameplay em HTML. Godot 4 é a direção prevista; GDScript é sugestão técnica provisória, não linguagem decidida nem versão da engine fixada. Não criar projeto Godot ou APK agora. Esta revisão apenas registra a decisão, sem alteração de código/build/teste.
