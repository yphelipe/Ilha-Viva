# QA | Laboratório de sprites 02
[[INICIO]] | [[PROTAGONISTA]] | [[ARQUITETURA_QA]]

## Evidências e limites
- Laboratório 01: o relatório anterior declarou testes de carregamento, recorte e reprodução no Chromium; não há log bruto incluído. Não tratar os 88 quadros reportados como nova verificação independente.
- Laboratório 02: HTML autossuficiente, folhas PNG embutidas. A tentativa anterior de renderização no Chromium expirou; não há captura válida desta versão. Validação no Android pendente.
- Nesta consolidação: arquivos PNG abertos com Pillow, dimensões, canal alfa e hashes registrados em assets/manifesto.json. Isso não comprova limpeza de borda ou fluidez.

## Problemas identificados por inspeção do código/folhas
- A ordem das linhas de corrida, machado, foice e nados é frente, direita, costas, esquerda; o HTML 02 declara frente, esquerda, costas, direita. Corrigir antes de considerar direções aprovadas.
- A enxada v2 mistura orientação no segundo conjunto de poses; revisar e redesenhar a pose incorreta antes da integração final.
- Laboratório 02 atualiza coordenadas de movimento, mas desenha o personagem em posição fixa. Ainda não testa travessia real do rio.
- A grade uniforme pode recortar efeitos, pixels de borda ou ferramentas; verificar cada célula e pivô de contato. Alpha parcial/ruído de borda precisa de inspeção visual.
- Sono/entrada na água têm duas poses cada; falta transição de entrada/saída, nado parado e estados de margem. Água desenhada junto ao sprite requer futura separação em camadas para evitar emendas.
- Zoom atual é inverso ao valor do controle; revisar usabilidade. Controles de direção por botão não substituem joystick funcional.

## Gate de aprovação
- [ ] Abrir HTML 02 no Android.
- [ ] Corrigir mapeamento das quatro direções e testar cada ação.
- [ ] Validar recorte, pivô, escala e contorno de cada quadro.
- [ ] Validar caminhada e corrida em movimento, não apenas no centro.
- [ ] Enxada: antecipação, impacto, recuperação; contato com solo.
- [ ] Machado, foice e regador: efeitos e contato coerentes.
- [ ] Nados: quatro direções, roupas corretas, continuidade e contato com água.
- [ ] Entrada/saída da água e troca de estado por profundidade e roupa; não teletransportar.
- [ ] Testar controles por toque, FPS e erros JS no dispositivo alvo.
- [ ] Registrar regressão completa e aprovação visual do usuário.

Nenhum item acima é aprovado somente por existência de PNG. Manter versões anteriores, não redesenhar identidade aprovada nem ampliar elenco até resolver bloqueios.

## v0.6 | Ancoragem de animações e deslocamento
- Ações estacionárias (enxada, machado, foice, regador, repouso, sono, entrada na água de teste) não alteram a posição lógica do personagem durante a reprodução. Os movimentos de tronco e membros devem preservar o apoio dos pés, sem centralizar pela ferramenta ou partículas.
- Andar, correr e nadar permitem deslocamento por comando. Nado usa referência no tronco.
- Pivôs por quadro foram revisados manualmente; originais artísticos preservados. Uma pose inicial da enxada à direita foi espelhada para corrigir orientação.
- Laboratório HTML 03 contém 124 quadros (incluindo poses reutilizadas), com controles táteis, marca de apoio e inspeção quadro a quadro.
- Validação Chromium via carregamento do conteúdo HTML (file:// bloqueado pela política do ambiente): sete ações estacionárias mantiveram x/y sob comando de movimento; quatro ações móveis deslocaram-se; imagens carregadas e zero erros JavaScript.
- Pendente: aprovação visual no Android, refinamento de contato individual dos pés e integração das transições de água e ferramentas no mundo jogável. Não encaminhar ao Claude Code antes da aprovação.

## Checkpoint v0.7 | 26/11/2026
- O usuário decidiu manter o protagonista e as animações do laboratório 03 como estão por enquanto. Aceitação provisória para continuidade do projeto, não certificação final de qualidade.
- Preservar integralmente os sprites, a ancoragem, as quatro direções e as duas variantes de nado já integradas. Nenhuma nova arte ou alteração de código nesta entrega.
- Próximo elemento a criar: ainda não definido; aguardar decisão do usuário, sem iniciar produção por conta própria.
- Pendências técnicas e artísticas continuam registradas em [[QA_SPRITES]], especialmente validação no Android, transições de água e integração com o mundo. Não encaminhar ao Claude Code nem migrar para Godot sem autorização.


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

## v0.15 | 26/11/2026 | Regressão de animação
- Usuário rejeitou laboratório 05: recorte, consistência e realismo. Não promover a arte.
- Restaurar laboratório 03 como referência funcional provisória, sem substituir arquivo original. Manter mestre top-down e corrida 690668.png intactos.
- Laboratório 06 experimental reutiliza o renderizador do 03, recorta células RGBA individuais sem remover fundo por cor, usa escala única por folha e apoio fixo nas ferramentas. 112 quadros/referências, 12 ações, 25 combinações ação/direção testadas no Chromium emulado; nenhum erro JS e posição do machado fixa.
- Caminhada e corrida de referência em quatro direções; novos ciclos de frente separados; ferramentas candidatas apenas frente/costas, pois laterais têm direções inconsistentes. Sono/entrada disponíveis no 03.
- Há avisos de pixels opacos perto de divisórias em algumas folhas (src/lab06/report.json); recorte e realismo biomecânico NÃO aprovados. Não substituir sprites ativos, não migrar Godot ou enviar Claude.
- Próximo gate: corrigir individualmente as animações sem alterar identidade, validar alternância e contato, não apenas reprodução técnica.
- [[QA_LAB06]]

## Checkpoint v0.17 | Laboratório 08 (26/11/2026)

Base: HTML 07 enviado pelo usuário. Preservados os atlas Original 02 e Top-down 07 e todas as imagens anteriores. Novas versões candidatas na variante Top-down 08.

- Enxada (capinar), machado e foice: seis poses laterais originais geradas para esta revisão (direita e esquerda espelhada), pivô de apoio e cadência variável. Frente/costas conservam três poses do 07, com ajuste de cadência. A orientação do fio, consistência visual e realismo ainda dependem de aprovação. O machado novo representa golpe descendente, não valida corte de tronco em pé.
- Dormir na mata: pano anterior preservado. Dormir na cama: duas poses de repouso com remoção manual do pano e cama como camada independente, provisória; não há animação completa de deitar na cama.
- Entrada/saída com roupa: cinco poses (inclui pose seca). Sem camisa, calça e descalço: seis poses novas. Saídas usam sequência inversa, provisória; transições param no último quadro e podem ser repetidas. Margem do rio ilustrativa no visor, não sistema físico de água.
- Não foram alteradas as animações de locomoção e natação já existentes. Não foi enviado ao Claude Code nem migrado para Godot.
- QA Chromium: 163 verificações aprovadas de seleção, direção, bloqueio de deslocamento, movimento e conclusão/reinício das transições; sem erros de JavaScript observados. Abertura file:// bloqueada pelo ambiente; teste executado carregando HTML diretamente no navegador em viewport mobile. Android real e avaliação artística pendentes.
- Fonte nova PNG com alfa real, 24 recortes sem divisões cruzando pixels de alfa >128. Recortes e relatório versionados.

[[QA_LAB08]]

## v0.19 | Laboratório 10 | 26/11/2026
- Enxada aprovada em seis poses por direção, mantida sem alteração.
- Machado: edição localizada da cabeça metálica nas poses de impacto lateral e de costas; 6 quadros laterais/de costas e 7 frontais anteriores. Não houve redesenho do protagonista. A orientação frontal e a biomecânica completa ainda exigem validação visual.
- Água líquida: entrada automática sem camisa e descalço, saída restaura camisa e botas; versões manuais mantidas para revisão. Gelo no laboratório bloqueia entrada e natação; não representa espessura ou resistência do gelo.
- Neve é opção em avaliação, não aprovada. Se escolhida, roupa térmica automática por condições ambientais; reutilizar identidade e animações, não redesenhar personagem. Neve e congelamento de rios são fenômenos distintos; a simulação final deverá considerar temperatura persistente e correnteza. Nenhum traje de inverno criado nesta versão.
- QA Chromium via conteúdo HTML: 212 verificações de ação/direção, travessia, gelo e bloqueio de deslocamento; nenhum erro JavaScript observado. Não valida naturalidade do desenho nem execução no Android real.
- Próximo: aprovação visual do laboratório pelo usuário antes de avançar aos assets do ambiente.


## v0.22 | Ferramentas na mesma prancha
- Referência artística direta: foice da v0.21, preservada integralmente no laboratório.
- Prancha compartilhada: 67 quadros (18 foice, 24 enxada, 25 machado), células 128 × 128, pivô (64,101), transparência alfa e quatro direções.
- 49 quadros de enxada/machado ajustados a partir dos desenhos existentes: proporção por direção, cores quentes e azuis aproximadas à paleta da foice, pivôs uniformizados. Cadência e ordem preservadas.
- Candidata gerada descartada por inconsistência de orientações e lâmina. Sem substituir o personagem-mestre.
- A prancha exportada inclui as três ferramentas; o laboratório preserva a renderização anterior exata da foice e usa os novos quadros normalizados nas duas outras ferramentas.
- 187 verificações no Chromium, via conteúdo HTML carregado na página (acesso file:// bloqueado no ambiente). Posição fixa, todas as poses, versões 11/12, rio, roupa e gelo. Sem erros de JavaScript.
- Aprovação visual pendente: identidade anatômica não é necessariamente idêntica entre as folhas de origem. Nenhuma migração Godot/Claude Code.
