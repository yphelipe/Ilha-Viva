# Plano de produção e testes científicos
## Sequência
A. Base de dados e revisão de ocorrência local. B. Laboratório HTML de clima/solo/vegetação com parâmetros observáveis e aceleração de tempo; primeiro sem arte nova final. C. Piloto de animais e sprites individuais com ambiente compatível, revisão visual. D. Cadeia integrada, 365 dias e vários anos simulados, calibração. E. Mapa por regiões, migração/saves, benchmark Android, só então expansão em escala. F. Godot após paridade aprovada. Preservar protagonista e animações, roupas de frio rejeitadas arquivadas.

## Testes propostos (não executados)
- Sem luz: assimilação zero; reservas podem diminuir. Seca reduz crescimento; excesso de água também pode limitar espécies sensíveis. Nutrientes não surgem sem entrada. Polinização obrigatória sem polinizador/ação não gera frutos. Regeneração depende de semente e microsítio.
- Decomposição consome estoque, conserva contabilidade de elementos dentro da tolerância; nenhuma massa negativa; frio/seca alteram taxas; chuva extrema altera oxigenação e transporte.
- Animal só ingere recursos compatíveis; fome reduz reservas; predador não caça continuamente; nascimentos exigem condições; filhote depende de cuidado quando espécie exige; sem teletransporte ou duplicação ao cruzar chunks.
- Comparar simulação detalhada/agregada com sementes e cenários iguais, tolerâncias definidas antes de medir; verificar balanço de população/biomassa, tempo e eventos; save/load determinístico e migração de esquema.
- Eventos de chuva/ciclone persistem regionalmente; balanço hídrico, salinidade e erosão coerentes; água não congela na configuração de jogo.
- Cenários longo prazo: seca, excesso de chuva, perda de polinizador, desmatamento, restauração, ausência do jogador, colheita intensa, predadores escassos. Avaliar robustez, não forçar equilíbrio artificial. Identificar quando modelo diverge por erro numérico ou parâmetro.
- Android físico: frame time p50/p95/p99, 1% lows, RAM, bateria e temperatura em 30 minutos, cenas com fauna e clima intenso, travessia de chunks, saves. Meta 60 FPS S23, 30 FPS intermediário; nenhuma alegação de desempenho até teste real.

## Metas de conteúdo (propostas, não compromisso)
Primeira região: cadeia pequena funcional, 3–5 espécies animais + grupos funcionais de insetos e micróbios, 5–10 plantas, cultivos e água. Depois ampliar por habitat. Registrar evidência, comportamento e arte de cada espécie. Quantidade final depende de diversidade funcional, espaço e orçamento; não representar todas as espécies reais. Critério de sucesso: jogador percebe mudanças causadas por fatores reais sem menus obrigatórios de ciência.
