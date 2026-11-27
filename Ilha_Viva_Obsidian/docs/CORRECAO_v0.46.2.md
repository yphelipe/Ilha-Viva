# v0.46.2 | Deslocamento visual dos lêmures

## Diagnóstico
A posição renderizada era calculada diretamente a partir da célula ecológica, atualizada a cada seis horas simuladas (12 segundos reais). Entre atualizações os animais ficavam imóveis e mudanças de célula eram instantâneas.

## Alteração
- Posições visuais individuais, independentes das coordenadas discretas da simulação.
- Deslocamento contínuo até o destino decidido pela IA, via busca em células terrestres adjacentes; se não houver conexão terrestre, reconciliação direta com o destino lógico. Não é navegação física definitiva.
- Pequenos deslocamentos locais durante busca de alimento, água ou fuga, sem alterar recursos ou metabolismo. Repouso não força caminhada.
- Orientação acompanha o vetor de deslocamento; observador usa as mesmas coordenadas do desenho.
- Primeiro avanço automático começa aproximadamente após 2 segundos; intervalo posterior permanece 12 segundos.
- Nascimento, remoção e carregamento reconciliam posições visuais. Partidas v0.46 preservadas.

## QA
45 verificações de regressão e uma verificação adicional de movimento automático no Chromium móvel emulado. Consulte results.json e auto-results.json. Núcleo ecológico e 127 quadros do jogador inalterados. Quatro poses estáticas do lêmure preservadas. Ciclo de patas ainda não implementado, sem confirmação física no Android. Rotas terrestres por célula não garantem desvio de todos os troncos; reconciliação direta é possível entre componentes desconectados.
