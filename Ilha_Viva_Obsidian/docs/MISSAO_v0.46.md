# Ilha Viva v0.46: Campo 04

## Implementado
- Farm: três culturas experimentais (feijão, arroz de sequeiro, batata-doce); parcelas, preparo condicionado à vegetação, sementes finitas, maturação, biomassa, consumo de N, P e água do solo, fotossíntese e respiração contabilizadas separadamente. Morte transfere carbono e N à serapilheira; P implícito no N do núcleo (0,15). Valores normalizados, não calibração agronômica.
- Mochila: 12 slots, pilhas por item, estoque inicial de teste, bloqueio de colheita sem espaço, comida e água potável consumíveis; regador de 10 cargas, 20 unidades de água por carga, recarga a partir do rio contabilizada como saída do núcleo e rega como entrada. Não há sistema de tratamento de água ou produção de sementes agrícolas ainda. Alimentos consumidos sem receitas; conversão biomassa/itens provisória.
- Colisão elíptica nos troncos, teste por células vizinhas e deslizamento por eixo; oclusão parcial do protagonista e contornos orgânicos nas parcelas. Fundo e plantas provisórios. Não são colisões completas do mundo.
- Genética: quatro pares de marcadores neutros por indivíduo, fundadores determinísticos; registro de pai e mãe e transmissão de um marcador por pai por par quando há pais conhecidos. Não há mutação, seleção, fenótipo ou calibração genética. Classificação etária por parâmetros do núcleo, ainda não calibrada. Reprodução pré-existente conservada; teste direto da função de herança, não de todas as linhagens plurianuais.
- Protagonista original (103 sprites) e quatro poses estáticas do lêmure mantidos. Fauna 15 categorias, 52 vertebrados iniciais. Núcleo ecológico v0.42, quatro módulos idênticos, vertebrates.js recebe metadados de parentesco, sem alteração dos parâmetros de reprodução. Save próprio v46; sem migração anterior.

## QA
31 verificações Chromium em viewport móvel, localStorage simulado; 9 verificações Node em clima natural e 9 em chuva contínua. Semente 42. Clima natural: colheita feijão 27,5 dias, 6 itens; batata-doce 35 dias, 8 itens; arroz 44,5 dias, 9 itens. Chuva contínua por 180 dias: 3 falhas, sem colheitas. Erros de balanço dos ticks: máximo agrícola 5,45e-14, núcleo 1,20e-9. Não medimos FPS Android, nem ciclo ecológico plurianual nesta missão.

## Pendências
Drenagem, adubação e rotação, pragas, sementes produzidas e armazenamento, receitas, mapa maior com chunks e LOD ecológico; otimização por regiões ainda não implementada (índice espacial pré-existente preservado). Melhorar terreno e arte, colisões completas; animações do Gemini aguardam correção. Validar reprodução real e crescimento visual por idade, estabilidade plurianual, desempenho em S23 físico. Não declarar arte provisória aprovada.
