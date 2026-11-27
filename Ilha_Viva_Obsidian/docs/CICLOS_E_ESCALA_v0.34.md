# v0.34 | Ciclos de vida e geometria

## Regra obrigatória aprovada pelo usuário
- Protagonista aprovado é a referência relativa de escala. Sem redesenho da arte base.
- Perspectiva top-down oblíqua consistente; pessoas e elementos verticais devem parecer em pé, com pés/base no plano de solo, não deitados. Respeitar proporções relativas entre animais, construções, árvores, objetos e cenário.
- Separar posição de solo (x,y), altura z, pegada de colisão, ponto de apoio, sombra e ordem de oclusão. Copas e telhados podem ocultar entidades sem ampliar a colisão física. Rios, rochas, trilhas e clareiras têm contornos orgânicos; a malha interna não determina o contorno visual.
- Régua HTML experimental: sprite original idle do laboratório 15; altura de referência 1,75 m e câmera ortográfica a 45° são hipóteses de produção, ainda não aprovadas. Px/m horizontal = 76,15/(1,75*cos(45°)) = 61,5; altura e profundidade projetadas = 43,5 px/m. Calibrar câmera e anatomia antes de produzir em escala. Dimensões dos volumes são ilustrativas, exceto comprimento aproximado de casco da tartaruga e altura de ombro da fossa. Referências abaixo. Não são sprites finais. Criar pranchas individuais, 4 orientações conforme necessário, transparência e pivô de solo; para fauna pequena, ampliar indicador de seleção, não a colisão.
- Validação futura: portas proporcionais ao jogador, animais ao lado do jogador, escala de filhotes, transição frente/costas, oclusão atrás de paredes/troncos e sob copas, sombras presas ao chão, elevação e rampas, câmera e zoom consistentes. Colisão e ordenação ainda não implementadas na régua.

## Implementação ecológica
- Répteis: postura separada de nascimento; ninho contém carbono e nitrogênio transferidos do organismo materno; incubação condicionada à umidade/enchente, com respiração e perdas devolvidas à serapilheira. Um registro de ninho representa um propágulo experimental; sem tamanho de ninhada real.
- Mamíferos: filhotes associados à mãe; transferência de reservas para simular cuidado/aleitamento; acompanhamento espacial e detecção de orfandade. Modelo simplificado, sem adoção por grupo, toca funcional, crescimento anatômico, lactação hídrica explícita ou comportamentos parentais completos. A hidratação corporal permanece índice, não massa de água.
- Procura de água: busca de vizinhos de canal local, em vez de percorrer toda a bacia por consulta. Nenhum benchmark de FPS executado.
- Versão de salvamento nova, sem migração automática de v0.33. Cenário e protagonista anteriores preservados.

## Evidência e parâmetros
- Lemur catta: sazonalidade, gestação e maturidade, https://lemur.duke.edu/discover/meet-the-lemurs/ring-tailed-lemur/ ; cuidado compartilhado em grupos, https://primate.wisc.edu/primate-info-net/pin-factsheets/pin-factsheet-ring-tailed-lemur/ . Nesta fase apenas mãe.
- Fossa: criação materna, https://www.mnhn.fr/en/the-fossa ; altura de ombro ~35 cm na mesma referência; fontes divergem nos períodos reprodutivos, modelo usa hipótese anterior de 90 dias e um filhote por evento, sem simulação de ninhadas realistas.
- Tartaruga: incubação geralmente cinco a oito meses, casco até 41 cm, https://nationalzoo.si.edu/animals/radiated-tortoise .
- Camaleão-pantera: oviparidade, incubação 7–9 meses, https://www.mnhn.fr/en/the-panther-chameleon .
- Temporização de 240 e 180 dias para incubação e 35 e 45 dias antes da postura são parâmetros experimentais, não medições locais. Limiar de umidade, metabolismo, cap e escala temporal devem ser calibrados.

## QA e riscos
19 testes Node (10 regressões + 9 novos), 11 verificações de interface Chromium; teste separado da régua confirma carregamento do sprite, três modos, ausência de overflow e exceções JS. Testes simulam armazenamento e não comprovam Android físico. Balanço C/N/água dentro de 1e-6 nos testes; três cenários naturais de três anos (13.140 passos no total) terminaram com 0, 5 e 1 vertebrados. Oito categorias vegetais persistiram; forte colapso de insetos e falha de recrutamento. Não houve reposição artificial. Próxima missão: oferta sazonal de recursos, decomposição e nutrientes, reprodução funcional de insetos, refúgios, conectividade e populações multi-habitat; calibrar balanço por diversos seeds, não esconder extinções. Cadeia aquática, fósforo, sprites animais e roupa de frio pendentes.
