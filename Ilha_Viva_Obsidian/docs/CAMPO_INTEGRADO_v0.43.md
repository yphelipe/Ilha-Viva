# v0.43 | Campo jogável integrado

## Entrega
Campo 02 conecta o protagonista aprovado (laboratório 15, atlas topdown) ao mesmo núcleo ecológico v0.42, sem alterar seus cinco módulos. 103 imagens PNG são reutilizadas sem alteração de bytes; solo experimental anterior reutilizado. Nenhuma arte animal do Gemini incorporada. Produção artística permanece paralela.

## Mecânicas
- Câmera segue o personagem; exploração dos 40 × 28 compartimentos ecológicos, controles por toque e teclado, caminhada e corrida.
- Machado e foice removem a coorte vegetal pelo mesmo método experimental; regador altera a água superficial; sementes alimentam o banco local; colheita transfere frutos ao inventário de teste. Ação aplica uma vez e bloqueia deslocamento durante execução.
- A água do canal ativa sprite de natação sem camisa; as ações de terra são bloqueadas. Ao sair volta ao sprite normal; transições animadas não estão integradas.
- O tempo avança 6 horas por 12 segundos no modo automático; botão +1 dia, pausa e seleção de clima. Cada passo chama Aquatic.tick. Energia, fome, sede e repouso experimentais. Beber água não tratada bloqueado; abastecimento potável pendente.
- Salvamento local via JSON (ecossistema e jogador). Interface de teste informa espécie vegetal, fase, umidade, fósforo, recursos e populações.

## QA
15 verificações no Chromium em viewport móvel 390 × 844, carregamento do HTML em memória devido ao bloqueio de navegação local no ambiente. Armazenamento simulado por Map; persistência real do navegador Android não comprovada. Sem erros JavaScript observados. Testes incluem carregamento de 103 imagens, 1.120 células, 52 vertebrados, movimento, rega, ação estacionária e única, avanço temporal, resíduos de balanço, repouso, colheita, alimentação, save/load simulado, restrição de ferramentas na água, ausência de overflow. O núcleo anterior não foi alterado; não houve nova bateria plurianual.

## Limitações / decisões provisórias
Mapa é bacia diagnóstica, não ilha definitiva. Compartimento visual 72 × 50 pixels e escala de desenho 0,79 são ajustes experimentais, não métricas finais. Árvores geométricas e marcadores de fauna apenas para depuração; arte ambiental e composição não aprovadas. Malha ecológica ainda visível; árvores sem colisão de tronco e oclusão simplificada, podem encobrir jogador. Sem construções, NPCs, pesca jogável ou agricultura de lavoura; sem enxada integrada (necessita modelo de preparo de solo). Foice e machado compartilham remoção genérica, sementes e água são recursos externos de laboratório. Frutos em biomassa, não unidades reais. Necessidades ainda sem consequências finais. Equilíbrio plurianual e Android físico pendentes. Não promover arte diagnóstica a definitiva. Não alterar protagonista nem gerar novamente sprites do lêmure aprovado no Gemini. Próxima missão: colisão, geometria, terreno orgânico, parcela agrícola, fontes finitas de água e inventário; importar pranchas do Gemini após aprovação.
