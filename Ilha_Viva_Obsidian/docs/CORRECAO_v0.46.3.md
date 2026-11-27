# v0.46.3 | Animação candidata de lêmures

Escala visual adulta .14 → .17 (+21,43%), sem modificar a escala ecológica nem o protagonista. Preserva imagens originais e salvamento v46.

32 quadros de locomoção extraídos do arquivo Gemini `lemur_catta_eat_fruit.png`, que visualmente apresenta passadas, não alimentação. Quatro direções, oito quadros cada. Espelhamento corretivo somente no quinto quadro da terceira linha. Âncora calculada a partir do corpo inferior e último pixel opaco. Sem alteração da anatomia. Ritmo por estado: exploração local 5 fps, caminhada 8 fps, fuga 12 fps (mesmo ciclo de caminhada, não corrida biomecânica definitiva).

Alimentação foliar candidata extraída de `lemur_catta_eat_flowers.png`: frente com duas poses distintas, laterais com cinco poses distintas e reaproveitamento espelhado; sequência de retorno com repetição deliberada. Só ativa em estado `comendo leaf` quando parado e direção disponível. Costas, frutas e outras ações continuam em pose estática. Não usar a prancha com nome incorreto como alimentação de frutas. Nenhum novo comportamento biológico criado.

52 verificações Playwright aprovadas, inclusive regressões agrícolas, natação, movimentação e desenho real de quadro com âncora. Sem erros JS. Armazenamento simulado no teste. Validação visual no Android físico ainda necessária. Equilíbrio da passada, bordas, perspectiva, escala absoluta e variantes etárias permanecem experimentais. Não aprovar corrida independente ou alimentação completa nesta entrega.
