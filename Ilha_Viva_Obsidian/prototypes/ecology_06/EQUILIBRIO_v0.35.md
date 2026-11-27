# Ilha Viva v0.35 | Equilíbrio ecológico experimental

## Escopo e decisões
Madagascar oceânica fictícia permanece oficial. A geometria e os sprites aprovados da v0.34 não foram alterados. Escala, pivôs no solo, perspectiva top-down oblíqua e oclusão continuam critérios obrigatórios.

- Chuva de fundo regional no modo automático, diferenciando floresta úmida, vale e floresta seca. Valores de teste, não climatologia observada.
- Atividade bacteriana e fúngica separada em índices; mineralização ainda agregada, sem biomassa microbiana explícita ou fósforo.
- Parcela experimental de perda vegetal lenhosa transferida de serapilheira para madeira morta, preservando C/N.
- Lêmure passa a buscar folhas de Alluaudia procera além do tamarindo. Busca mais ampla; hidratação alimentar como proxy com retirada contabilizada de água do solo. Não é modelo fisiológico calibrado.
- Carcaças de presas parcialmente consumidas persistem e se decompõem, oferecendo refeições adicionais. Alterados custos metabólicos, intervalos de caça e parâmetros de reprodução/insetos para calibração exploratória.
- Registro de causas de morte e camadas de atividade bacteriana/fúngica. Novo slot de salvamento independente da v0.34.

## QA efetivamente concluído
10 testes Node de regressão (incluindo três cenários de 365 dias e conservação) e 11 verificações Chromium em viewport móvel. No cenário natural seed 42, vertebrados finais [27,9,10,2], insetos [60,60,60,60], riqueza vegetal 8. Sem vertebrados, besouros finais 0. Limite de 60 por grupo de insetos atingido, sinal de calibração pendente. Resíduo máximo C/N/água no cenário natural 4,37e-10 unidades. Teste de três anos em três sementes excedeu limite de execução e não gerou relatório completo; script preservado para repetição. Não há aprovação de estabilidade plurianual, FPS no Android físico, arte final ou validação científica quantitativa.

## Referências científicas
- Duke Lemur Center, dieta: https://lemur.duke.edu/discover/meet-the-lemurs/ring-tailed-lemur/
- Wisconsin National Primate Research Center, tamarindo e dieta: https://primate.wisc.edu/primate-info-net/pin-factsheets/pin-fact-sheet-ring-tailed-lemur/ (consultar também https://primate.wisc.edu/primate-info-net/pin-factsheets/pin-factsheet-ring-tailed-lemur/)
- Crowley et al., Didiereoideae e lêmures: https://scielo.org.za/scielo.php?pid=S0038-23532013000100016&script=sci_arttext
- Smithsonian, dieta tartaruga: https://nationalzoo.si.edu/animals/radiated-tortoise
- Wildlife Madagascar, umidade dos alimentos: https://www.wildlifemadagascar.org/animals/radiated-tortoise/
- World Bank, sazonalidade regional: https://documents1.worldbank.org/curated/en/599641468054534317/pdf/779930WP0MDG0C00Box377320B00PUBLIC0.pdf

## Próxima missão
Estabilizar múltiplas sementes e estações sem reposição artificial; analisar causas de extinção e saturação dos insetos. Introduzir fósforo e grupos microbianos com fluxos explícitos antes da expansão aquática. Preservar escala e arte do jogador. Benchmark de dispositivo permanece necessário.
