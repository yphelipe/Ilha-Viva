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

## Ronda com memória persistente de um hortelão

Para testar se a experiência muda uma decisão local, prepare dois talhões com perdas diferentes em um dia seco. Na ronda seguinte, iguale a umidade presente e compare o agente experiente com um agente recém-inicializado na mesma cópia do mundo. Registre o destino da rega, o débito na cisterna e o crédito no solo. A unidade do estoque é mm equivalentes sobre uma célula de 100 m², portanto 1 mm representa 100 litros. Simule também falta de água, geada, talhão sem vegetação e dias chuvosos. Evite atribuir a mudança líquida observada a uma única causa, como transpiração. A memória contém somente quatro estimativas, mantidas por talhão, com decaimento diário e leitura após a própria rega.

Execute `node --test --test-isolation=none scientific/us/steward.test.mjs`. O teste inclui retomada de JSON, rejeição de memória corrompida e 1.095 dias sem jogador. Os parâmetros da cisterna e da política de trabalho são experimentais. O piloto representa a decisão diária de um trabalhador em uma horta fixa. Para identificar o commit desta implementação no checkout, use `git log -1 --format=%H --diff-filter=A -- scientific/us/steward.mjs`.
