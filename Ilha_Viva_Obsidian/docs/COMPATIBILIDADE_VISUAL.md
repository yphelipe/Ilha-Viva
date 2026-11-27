# Contrato de compatibilidade visual | v0.10
[[GDD]] | [[ARTE]] | [[DIRECAO_SITIO_MATA]] | [[PROTAGONISTA]] | [[QA_SPRITES]]

## Decisão D11
26/11/2026. Direção de sítio em mata densa aceita como referência aproximada. O conceito não é um mapa jogável; não aprovar automaticamente seus detalhes nem recortá-lo como cenário definitivo.

## Critérios de produção (propostos para teste)
- Preservar sprites do protagonista de camisa azul, identidade, proporções e âncoras já registradas. Conservar os PNGs originais sem sobrescrever.
- Unificar densidade de pixels, paleta de sombras e luz, contornos, perspectiva top-down 2D e escala relativa. A ilustração conceitual tem detalhes e perspectiva que ainda precisam ser adaptados ao jogo; não misturá-la diretamente com sprites existentes.
- Montar uma prancha de escala lado a lado: protagonista, tronco e copa, arbusto, capim, rocha e porta. Tiles 32×32 e altura humana útil 40–48 px são hipóteses do GDD, não métricas finais; revisar se necessário sem mudar identidade.
- Solo orgânico, trilhas irregulares, serrapilheira, capim alto, raízes, rochas e clareiras; variar manchas e densidade, evitar tabuleiro e repetição visível. Não definir espécies ou clima final antes de pesquisa.
- Separar chão, objetos, troncos/copas e água; transparência real em objetos, pivôs e colisões coerentes, ordenação por profundidade, renderização nearest em escala inteira quando possível.
- Testar o protagonista andando, correndo e usando ferramentas em ambiente real; verificar leitura no celular, apoio dos pés, oclusão, proporção e transições. Não usar arte de terceiros nem promover o campo rejeitado a padrão final.

## Contrato ecológico
Preservar o modelo experimental de grama e seus testes; arte e simulação são independentes. Cada novo objeto natural precisa de pesquisa e ficha de comportamento antes de integração: água, luz, temperatura, competição, crescimento, regeneração e relação com fauna quando pertinente. O mundo evolui sem o jogador; a IA local toma decisões de agentes e os modelos ambientais calculam processos físicos/biológicos. Não exigir IA generativa para cada planta.

## Ordem sugerida de produção
1. Chão de mata e trilhas com transições.
2. Vegetação rasteira, arbustos e árvores modulares.
3. Prancha de escala e prova HTML com protagonista existente.
4. Riacho, margens e profundidade; integrar nado em etapa própria.
5. Construções rurais e demais conteúdos após gate visual.

## Gate de aprovação
Pesquisa registrada, PNGs e metadados catalogados, demonstração HTML e testes de regressão executados, comparação visual com protagonista, pendências explícitas e aprovação do usuário. Atualizar GDD, diário, decisões e manifesto antes de avançar. Prova ainda pendente; este checkpoint é documental.


## Checkpoint v0.11 | Solo de mata
Nova prancha original e laboratório HTML de trilhas curvas, compactação, serapilheira e cobertura vegetal. 10 testes anteriores e 11 verificações Chromium aprovadas. Direção artística e escala ainda pendentes de aprovação; árvores e vegetação alta não integradas. Ver [[SOLO_MATA]].


## Checkpoint v0.12: perspectiva elevada
Ver [[PERSPECTIVA_TOPDOWN]]. Caminhada top-down experimental integrada ao laboratório de mata 02. Identidade visual preservada como objetivo; validação artística pendente. Não ampliar produção até confirmar escala, ângulo e proporções. Corrida e demais ações ainda precisam de revisão no mesmo ângulo. QA de mata: 11 verificações aprovadas em Chromium.


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
