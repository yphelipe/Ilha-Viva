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
