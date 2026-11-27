# Bíblia de arte | v0.2

> **Vigência v0.29 (26/11/2026):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevalece sobre trechos históricos conflitantes. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.


## Identidade e direção
Pixel art 2D exclusivamente, desenhada para resolução nativa e não reduzida de ilustrações. Rural, calorosa, legível e natural. Personagens estilizados com anatomia humanoide, aproximadamente 4,5–5,5 cabeças de altura no sprite proposto, sem exagero chibi. Proporções, mãos, pés, roupas e silhuetas consistentes. Expressão na pose e movimento, não excesso de detalhe. Arte não depende de efeitos que escondam defeitos.

Proposta técnica para piloto: tiles 32×32, viewport 640×360, escala inteira e nearest, pivô no pé, Y-sort; sprites humanos com altura útil 40–48 px e canvas padronizado conforme ação. Validar legibilidade real no celular antes de congelar métrica; proporções relativas de portas, ferramentas, móveis e animais em prancha de escala. Usar paleta-mestra original, rampas de sombra/luz e variantes sazonais; iluminação global coerente, contraste útil entre chão e entidades. Não usar anti-aliasing interpolado ou outline aleatório. Pixel snapping e câmera sem jitter após prova visual.

## Produção original
1. Pesquisa visual e anatômica com fontes registradas; não copiar nem importar material de referência.
2. Silhuetas e paleta, thumbnails, proporções, frame-chave e testes de leitura.
3. Sprite individual aprovado em quatro direções; não mudar identidade durante animação.
4. Animações por poses-chave e revisão quadro a quadro. Ferramenta segue empunhadura, pé de apoio e centro de massa. Objetos equipados têm oclusão correta.
5. Exportar PNG transparente sem bordas, folhas por personagem/animal, metadados de frame e âncora, fontes editáveis autorais e licença interna. Ferramentas de desenho permitidas; assets externos, recolors de terceiros ou imagens copiadas proibidos.
6. Integrar no Canvas primeiro e validar novamente no Godot; renderizar prova em escala 1x e no dispositivo, revisar ciclos e interações. Rejeitar faces inconsistentes, anatomia deformada, sombras incompatíveis, pés deslizando, ferramentas atravessando corpo, repetição mecânica e aparência genérica.

| Categoria | Animações e critérios |
|---|---|
| Protagonistas | parado/respiração, andar, correr, carregar, interagir, usar ferramentas, colher, pescar, comer, sentar, dormir; 4 direções; gestos e expressões coerentes |
| NPC | andar, idle, profissão e gestos específicos; sentar/comer/expressar emoções quando necessário; sem animações irrelevantes |
| Galinha | andar, ciscar, bicar, beber, limpar penas, banho de poeira, repousar, aninhar, reagir a ameaça |
| Vaca | andar, pastar, beber, ruminar, levantar/deitar, balançar cauda e orelhas; ordenha interativa |
| Ovelha/cabra/porco | locomoção, alimentação, repouso e comportamentos específicos pesquisados |
| Plantas | fases por espécie, variação sutil de crescimento, vento e sinais de estresse; sem tremer em bloco |
| Água | corrente conforme direção, reflexos, ondas, círculos de chuva e poças; congelamento quando plausível |
| Atmosfera | vento, folhas, nuvens, chuva oblíqua, neve, neblina e relâmpagos legíveis; redução de efeitos acessível |
| Construção | portas e janelas funcionais, fumaça contextual, materiais e desgaste coerentes; transição de interior sem cortes confusos |

Frame counts são faixas de partida: idle 4–6, andar 6–8, correr 8, ferramenta 8–12; ajustar timing por referência de movimento, não por quantidade fixa. Sem espelhar assimetrias críticas (roupa, ferramentas, ferimentos). Ação tem antecipação, contato, follow-through, recuperação, janela cancelável. Evento de impacto é emitido uma vez no frame de contato e validado pela simulação. Áudio acompanha contato. Ciclos ambientes têm offsets e frequência conforme estado.

## Primeira prova artística
Uma pequena cena rural autoral com caminho curvo, água, grama, árvore, cerca, casa e galinheiro, protagonistas em 4 vistas, uma galinha em atividade e planta em estágios. Mostrar sol e chuva no mesmo lugar, PNG nativo e vídeo no Godot. Gate: coerência de escala/paleta, leitura, ausência de cintilação, continuidade das animações e aprovação humana. Não produzir 20 NPCs antes de validar o sistema visual, mas avançar pesquisa e infraestrutura em paralelo. Nenhuma arte foi produzida nesta versão do GDD.


## Gate incremental v0.4
Cada personagem possui folha individual, pivô dos pés, metadados por direção/ação/frame, arquivo-fonte e demonstração na cena. Aprovar marcha, corrida, idle, interação e contato da ferramenta com alvo antes de multiplicar o elenco. Em paralelo, validar terreno orgânico, água, casa e galinha. Mostrar lado a lado frames e vídeo do Canvas, sem usar imagem de referência como asset. Prova visual é indispensável.


## Adendo v0.5
Identidade visual aprovada do protagonista: [[PROTAGONISTA]]. As folhas têm resolução de origem superior ao tamanho final ainda não definido. Padronizar pivôs, grade, direção, escala e alfa sem sacrificar a arte. Não reutilizar versões rejeitadas. Validar em movimento com usuário antes de novos personagens. [[QA_SPRITES]].

## v0.6 | Ancoragem de animações e deslocamento
- Ações estacionárias (enxada, machado, foice, regador, repouso, sono, entrada na água de teste) não alteram a posição lógica do personagem durante a reprodução. Os movimentos de tronco e membros devem preservar o apoio dos pés, sem centralizar pela ferramenta ou partículas.
- Andar, correr e nadar permitem deslocamento por comando. Nado usa referência no tronco.
- Pivôs por quadro foram revisados manualmente; originais artísticos preservados. Uma pose inicial da enxada à direita foi espelhada para corrigir orientação.
- Laboratório HTML 03 contém 124 quadros (incluindo poses reutilizadas), com controles táteis, marca de apoio e inspeção quadro a quadro.
- Validação Chromium via carregamento do conteúdo HTML (file:// bloqueado pela política do ambiente): sete ações estacionárias mantiveram x/y sob comando de movimento; quatro ações móveis deslocaram-se; imagens carregadas e zero erros JavaScript.
- Pendente: aprovação visual no Android, refinamento de contato individual dos pés e integração das transições de água e ferramentas no mundo jogável. Não encaminhar ao Claude Code antes da aprovação.

## M02-A
[[GRAMA_VIVA]]: 48 tiles 32×32 e 24 tufos transparentes originais, paleta e escala provisórias.


## Checkpoint 0.9: revisão ambiental
O visual de Campo 01 foi rejeitado. A direção proposta agora é sítio cercado de mata natural, com clareiras e vegetação em camadas. Ver [[DIRECAO_SITIO_MATA]]. Arte conceitual pendente de aprovação; nenhum novo mapa funcional ou teste de regressão executado nesta etapa. A simulação e o protagonista anteriores permanecem preservados.

## Checkpoint v0.10 | 26/11/2026
O usuário aceitou a direção geral do conceito de sítio na mata como referência visual aproximada, não como arte final. Reforçou compatibilidade gráfica com o protagonista e registro contínuo no GDD e Obsidian. A aparência do Campo 01 continua rejeitada. Próximo gate: prova de escala e compatibilidade visual em HTML, com assets autorais modulares. Não alterar o protagonista, reaproveitar apenas a lógica de simulação validada e manter IA/autonomia. Nenhum asset novo, build ou teste de jogo executado neste checkpoint. Ver [[COMPATIBILIDADE_VISUAL]].


## Checkpoint v0.11 | Solo de mata
Nova prancha original e laboratório HTML de trilhas curvas, compactação, serapilheira e cobertura vegetal. 10 testes anteriores e 11 verificações Chromium aprovadas. Direção artística e escala ainda pendentes de aprovação; árvores e vegetação alta não integradas. Ver [[SOLO_MATA]].


## Checkpoint v0.12: perspectiva elevada
Ver [[PERSPECTIVA_TOPDOWN]]. Caminhada top-down experimental integrada ao laboratório de mata 02. Identidade visual preservada como objetivo; validação artística pendente. Não ampliar produção até confirmar escala, ângulo e proporções. Corrida e demais ações ainda precisam de revisão no mesmo ângulo. QA de mata: 11 verificações aprovadas em Chromium.


## Checkpoint v0.13 (26/11/2026)
A referência-mestre do protagonista top-down foi fixada em [[REFERENCIA_MESTRE_PROTAGONISTA]]. Fundo PNG transparente obrigatório. Machado e ambos os nados permanecem pendentes; gerações que mudaram a identidade foram rejeitadas. Nenhuma arte anterior foi substituída.

## 2026-11-26 | v0.14 | Laboratório 04
- Referência-mestre: segunda imagem escolhida pelo usuário (`690668.png`). A primeira define a lista de ações, não a identidade gráfica.
- Requisitos: alternância contralateral das pernas e braços em caminhada/corrida; natação bilateral, com roupa e sem camisa, de calça e descalço; machado com fio orientado ao alvo; fundo PNG transparente.
- Teste frontal de 9 ações: 8 andar, 12 correr, 8 descalço, 12 nado vestido, 12 nado sem camisa, 11 machado, 11 enxada, 8 foice, 8 regador. Machado/enxada têm 11 poses observadas, não 12.
- Prancha opaca experimental: remoção de fundo por GrabCut pode cortar botas e contornos. Quatro folhas individuais transparentes disponíveis para comparação. Nenhuma pose inventada; recorte e redimensionamento apenas. A alternância ainda não é consistente em todos os quadros; nado sem camisa na prancha não permite verificar pés/calça submersos.
- QA Chromium mobile via set_content: 18 combinações ação/versão, avanço/retorno manual, contagem de miniaturas, reprodução automática; sem erros JS. Navegação file:// bloqueada no ambiente, teste Android físico pendente.
- Status: candidato experimental, NÃO substituir sprites ativos. Somente frente; outras direções, validação biomecânica e arte pendentes. Sem envio ao Claude ou migração Godot. Preservar arte anterior.
- [[docs/QA_LAB04|Registro completo]] · `builds/Ilha_Viva_Laboratorio_04.html`


## v0.21 | Laboratório 11 | 26/11/2026
- Caminhada mantida byte a byte como referência-mestre. 83 quadros de corrida, enxada, machado e foice ajustados diretamente: aproximação cromática seletiva por direção à caminhada; escala constante por direção; correção de pivôs por medição visual. Corrida lateral: alcance horizontal das pernas reduzido gradualmente em até 12%, sem novas poses.
- Enxada mantém seis poses em quatro direções e a cadência da v10. Machado e foice mantêm poses e cadências anteriores. Nenhum redesenho de rosto/cabelo; diferenças de desenho anatômico ainda podem existir. Não houve validação biomecânica completa.
- Demais animações, arquivos de origem e versões antigas preservados. V10 selecionável no HTML com travessia automática. Neve permanece em avaliação, sem roupa de inverno nova.
- QA: 581 verificações estáticas (incluindo comparação de bytes, contagens, transparência e pivôs) e 289 no Chromium em viewport móvel. Seleção, avanço de quadros, bloqueio de deslocamento nas ferramentas, entrada automática sem camisa, restauração da roupa e bloqueio pelo gelo. Sem erros JS. Aprovação visual e Android físico pendentes.
- Status: candidato, não promover a arte final nem migrar para Godot/Claude Code até aprovação. Ver [[QA_VISUAL_v0.21]].


## v0.22 | Ferramentas na mesma prancha
- Referência artística direta: foice da v0.21, preservada integralmente no laboratório.
- Prancha compartilhada: 67 quadros (18 foice, 24 enxada, 25 machado), células 128 × 128, pivô (64,101), transparência alfa e quatro direções.
- 49 quadros de enxada/machado ajustados a partir dos desenhos existentes: proporção por direção, cores quentes e azuis aproximadas à paleta da foice, pivôs uniformizados. Cadência e ordem preservadas.
- Candidata gerada descartada por inconsistência de orientações e lâmina. Sem substituir o personagem-mestre.
- A prancha exportada inclui as três ferramentas; o laboratório preserva a renderização anterior exata da foice e usa os novos quadros normalizados nas duas outras ferramentas.
- 187 verificações no Chromium, via conteúdo HTML carregado na página (acesso file:// bloqueado no ambiente). Posição fixa, todas as poses, versões 11/12, rio, roupa e gelo. Sem erros de JavaScript.
- Aprovação visual pendente: identidade anatômica não é necessariamente idêntica entre as folhas de origem. Nenhuma migração Godot/Claude Code.
