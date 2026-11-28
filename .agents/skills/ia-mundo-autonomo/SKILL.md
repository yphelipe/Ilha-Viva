---
name: ia-mundo-autonomo
description: Desenvolver IA offline de fauna, NPCs, sociedade e economia com comportamento emergente e agência do jogador.
---

# ia-mundo-autonomo

Status: procedimento inicial v1; validar e refinar com evidência de cada missão.

1. Definir capacidades cognitivas por espécie, necessidades, percepção local, memória limitada e custos reais. Não dar conhecimento global automático.
2. Usar utilidade/estados/planejamento conforme entidade, prioridades, cooldown e histerese. Ações exigem recursos, tempo, posição e precondições. Disputas resolvidas por reservas determinísticas.
3. Fauna: forrageio, descanso, fuga, território, sociabilidade, reprodução/cuidado parental conforme ficha. Humanos: trabalho, renda, relações, objetivos, logística, construção e compromissos. Não confundir ruído aleatório com aprendizagem.
4. Mundo avança sem jogador ou câmera no tempo simulado. Narrativa escrita observa consequências, não inventa decisões do jogador. Não executar tempo real com app fechado.
5. Testar contrafactuais, falta de recursos, mudança de clima, aprendizado persistente, save/reload, conflitos e LOD. Registrar eventos causais com origem/efeito; checar legibilidade ao jogador.
Saída: política de decisão, cenários e resultados; explicar limites da IA, sem alegar inteligência não demonstrada.

## Adendo obrigatório: MCP artístico e inteligência auxiliar de desenvolvimento
Usar MCPs e ferramentas gratuitas disponíveis quando houver ganho demonstrável em desenho pixel art autoral, pesquisa visual, anatomia, animação, paleta, perspectiva, escala, atlas, alfa, pivôs, oclusão, costuras e QA visual. Verificar compatibilidade, licenças, custo e permissões; não instalar serviços pagos nem pedir segredos. Produzir elementos úteis em lotes sem sacrificar acabamento; preservar protagonista aprovado. Revisar no tamanho de jogo e registrar evidência visual. A IA de mundo aprende localmente no save por experiências e memória limitada; agentes adaptam decisões, sem alterar leis naturais ou agência do jogador. Separadamente, desenvolver ferramentas de diagnóstico da simulação, análise de eventos causais, detecção de desequilíbrios, relatórios e sugestões de melhorias para Codex e skills. Nenhuma alteração autônoma irrestrita de código ou regras científicas; propostas passam por validação, testes e versionamento. Não confundir aprendizado persistente com treinamento global do modelo. Priorizar primeiro um comportamento adaptativo demonstrável e um diagnóstico reproduzível. Atualizar skills com resultados reais e economia observada.

## Aprendizado verificado CP-06
Separar decisão de experiência observada; memória por local com decaimento, capacidade e expiração; não transmitir evento fora do alcance. Comparar política com/sem memória no mesmo cenário e após save/reload. Controle: escolha 3 antes da perturbação, escolha 5 depois (risco aprendido 0,585), controle permanece 3. Evidência scientific/us/adaptive_agents.test.mjs, commit 3c7a5166. 5.508 verificações no runtime JS. Agente diagnóstico sem necessidades biológicas; não afirmar fauna final.
