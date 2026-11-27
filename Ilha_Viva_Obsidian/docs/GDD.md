# Game Design Document | Ilha Viva

> **Decisão vigente 27/11/2026:** ambientação continental rural fictícia dos EUA, piloto nos Apalaches, com outras ecorregiões em expansão. Madagascar e Amazônia são históricos e não ativos. Protagonista aprovado preservado; terreno, fauna, flora e dados científicos serão reconstruídos. Ver [[AMBIENTACAO_EUA]] para requisitos e gates. Checkpoint documental; build v0.47 ainda histórico, motor novo não implementado.


> **Vigência v0.29 (26/11/2026):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevalece sobre trechos históricos conflitantes. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.

**v0.29 • YNOVIQ Studios • 26/11/2026 • Documento vivo**

## 1. Visão
RPG de sobrevivência rural de pixel art 2D numa região continental fictícia habitada, sobre reconstruir uma propriedade rural e estabelecer vínculos com uma comunidade que também está se transformando. A terra não é cenário: tem memória. O jogador observa, aprende, decide e colhe consequências. Realismo funcional sem transformar o lazer em trabalho repetitivo.

**Promessa:** cada estação conta uma história diferente porque o clima, a água, a fauna, a economia e as pessoas respondem umas às outras. O ciclo não acaba com o arco principal.

**Público:** fãs de farming/life sims, RPGs sociais e jogos aconchegantes; jogadores casuais e interessados em sistemas profundos. Protótipo HTML5 offline quando instalado/servido localmente; Android horizontal offline como prioridade final proposta; PC secundário. Single-player primeiro; sem serviços obrigatórios, FOMO ou monetização definida.

## 2. Pilares e não objetivos
- Ecossistema causal, compreensível, com recuperação possível.
- Liberdade econômica, social, estética e de rotina; sem caminho obrigatório único.
- Personagens autônomos, escrita natural, escolhas e consequências.
- Arte 100% autoral; sprites humanos proporcionais, não cabeçudos; animações legíveis.
- Mundo persistente, manutenção agradável, descoberta orgânica e progressão por domínio.
- Realismo seletivo: modelar o que cria escolhas, não todas as variáveis científicas.
- Não fazer clone, MMO, mundo infinito procedural, combate obrigatório, arte provisória publicada ou rotina excessivamente punitiva. Nenhum material de referência deve ser importado como asset.

## 3. Mercado e hipótese de diferenciação
| Referência | Aprendizado | Aplicação autoral |
|---|---|---|
| Harvest Moon / Story of Seasons | Afeto, calendário, vida rural | Vínculos e eventos comunitários com memória |
| Stardew Valley | Autonomia, exploração e progressão | Múltiplas especializações e objetivos de longo prazo |
| Fields of Mistria | Identidade, romance, eventos | Conversas em grupo, expressões, continuidade de assuntos |
| Roots of Pacha | Comunidade, ambiente e descobertas | Projetos coletivos, técnicas rurais e cooperação |
| Travellers Rest | Cadeias de produção | Ingredientes locais, processamento e comércio |
| Tiny Glade | Satisfação visual da construção | Paisagismo e composição orgânica, sem copiar sua arte 3D |

Dados de sucesso não garantem viralidade. Hipóteses testáveis: histórias emergentes compartilháveis, comparação visual da fazenda entre anos, animais reconhecíveis por personalidade e eventos ambientais memoráveis. Medir retenção consentida ou playtests locais, não viciar jogadores. Fontes em ../research/FONTES.md.

## 4. Mundo e ambientação
Região continental fictícia inspirada nos EUA; piloto proposto nos Apalaches/Blue Ridge e Ridge and Valley, expansão por ecorregiões. Vale agrícola com floresta temperada, pastos, rios, estradas, comunidades e relevo. Quatro estações regionais; neve, gelo e degelo condicionados ao clima. Espécies por ocorrência e habitat verificados. Consulte [[AMBIENTACAO_EUA]].

## 5. Ciclos de jogo
- Minuto: observar, selecionar ferramenta, agir, receber resposta visual/sonora e informação.
- Dia: planejar segundo previsão e agenda, cuidar dos animais e cultivos, negociar, socializar, explorar, descansar.
- Semana: planejar estoque, visitar mercado, acompanhar projetos, corrigir solo/pasto e compromissos.
- Estação: ajustar variedades e infraestrutura, festivais, clima variável, desafios e oportunidades.
- Ano: investimentos, renovação ecológica, histórias novas, desenvolvimento da comunidade e retrospectiva.

Tempo proposto: 28 dias por fase de calendário de jogo (provisório, independente da fase hidrológica); dia ativo 15–22 min reais, ajustável; simulação em ticks de 10 min de jogo. Menus podem pausar no modo solo, eventos e diálogos pausam quando necessário. Dormir não pula regras; executa a mesma simulação agregada. Não avançar tempo real com app fechado. Implementar antes de balancear.

## 6. Sistemas
| Sistema | Mecânicas e conexões |
|---|---|
| Agricultura | Preparar, semear, irrigar, cobrir solo, fertilizar, podar, colher, guardar sementes, rotação; crescimento depende de espécie, fase, água, temperatura e luz |
| Pecuária | Alimentação específica, água, abrigo, saúde, confiança, pasto, higiene, reprodução e produção; cada animal tem estado próprio |
| Meteorologia | Temperatura, umidade, vento, precipitação, nuvens, friagem, seca, tempestades e previsão probabilística; continuidade temporal |
| Hidrologia | Infiltração, drenagem, escoamento, nível hídrico e qualidade da água por zona; irrigação com capacidade limitada |
| Fauna | Polinizadores, pássaros, pequenos mamíferos, anfíbios, peixes, predadores compatíveis; atividade por hora, clima, habitat e alimento |
| Flora | Árvores, arbustos, gramíneas, flores, plantas aquáticas, fenologia e regeneração; sucessão simplificada |
| Pesca | Espécie, horário, estação, habitat, água, isca e esforço; estoque regenerável |
| Silvicultura | Corte, replantio, madeira, habitat, erosão; sem regeneração instantânea |
| Mineração | Recursos, ferramentas, segurança, suporte, luz, acesso gradual; exploração sem combate obrigatório |
| Produção | Conservas, queijos, pães, mel, tecidos e artesanato; insumos, tempo, qualidade, armazenamento |
| Economia | Oferta/demanda agregadas, sazonalidade, qualidade, contratos e feiras; limites para evitar inflação infinita |
| Construção | Casa, depósitos, galinheiro, curral, cercas, poço, estufa, irrigação e paisagismo; custo, tempo, manutenção |
| Personagem | Customização, energia, habilidades por uso, mochila, descanso, alimentação simplificada; modos assistidos |
| Relações | Confiança, afinidade, compromissos, lembranças, romance consensual entre adultos, família opcional |
| Comunidade | Projetos, reuniões, ofícios, conflitos, ajuda, serviços, celebrações; alterações visíveis |
| Jornal/guia | Previsão, registros, avisos, atlas, diário de cultivo, saúde animal e explicação causal |

## 7. Interações e UX
Joystick virtual com corrida opcional, ação contextual com alvo visível, barra rápida, mochila por categorias, mapa e diário. Controles PC via adaptador de input web; InputMap após migração. Não executar ferramenta no alvo errado; prever área, permitir cancelamento. Ferramenta muda alcance e qualidade, não quebra sem aviso; desgaste opcional a validar. Feedback imediato de sucesso/falha e causa. Ações repetitivas automatizáveis, lotes, alimentação coletiva, aspersores e ajuda contratada em progressão. Interface adaptativa, textos legíveis, vibração opcional, contraste e ícones que não dependam só de cor. Sem telas de diagnóstico na UI final.

## 8. Progressão e economia
Início: propriedade pequena, ferramentas simples, sementes e escolha de objetivos; baixo risco de bloqueio. Meio: especializações em horticultura, pecuária, pesca, apicultura, artesanato e gastronomia; cooperativa, irrigação, infraestrutura. Longo prazo: linhagens de animais, qualidade de produtos, paisagem madura, relações complexas e novas histórias. Sem riqueza automática por exploit de compra/revenda; moeda inteira, preços com limites, custos e estoques. Falhas têm alternativas: trabalhos remunerados, venda de excedente, ajuda de vizinhos, renegociação. Sem morte do jogador por errar uma rega. No perfil sobrevivência, riscos graves exigem avisos e recuperação justa.

## 9. Conteúdo e limites
| Etapa | Alvos de escopo (propostas, não promessas) |
|---|---|
| Slice jogável | 2 protagonistas base, 4 NPCs funcionais, propriedade e trecho da vila, 4 cultivos, galinhas, 1 espécie de polinizador, chuva/sol, 1 cadeia de venda, salvamento |
| Alpha | 4 estações, 12 cultivos, 3 animais domésticos, 8 NPCs, floresta e lago, pesca, construção e economia |
| Beta / 1.0 | ~24–36 cultivos, ~6–8 espécies domésticas, ~18–24 NPCs, zonas completas, arcos, festivais, fauna/ecologia rica; números condicionados à qualidade e orçamento |

Fora do slice: multiplayer, gerações completas de filhos, todas as raças, mapa imenso, eventos extremos complexos e automação agrícola avançada. Não anunciar conteúdo que não passou no gate.

## 10. Direção visual e áudio
Pixel art com proporções humanas estilizadas, 32 px por tile como proposta e sprites 32–48 px de altura útil. A grade organiza a lógica, não a aparência. Animar mãos, pés, ferramentas, água, folhas, olhos e animais; paleta controlada, iluminação consistente, sem efeito plástico. Trilha autoral por hora, estação e lugar, transições suaves, ambiência de vento/água/aves; SFX específicos por superfície, animal e ferramenta. Arte e áudio devem ter fonte editável e histórico.

## 11. Narrativa e identidade
Tema: pertencer a um lugar, aprender a cuidar da terra e lidar com mudanças coletivas. O personagem chega ao vale por uma escolha de vida e recebe oportunidade de assumir propriedade antiga da cooperativa; sem copiar a herança narrativa de referências. O conflito principal é a fragilidade do abastecimento e os interesses conflitantes sobre o futuro do vale. Veja NARRATIVA.md. Título público pendente; YNOVIQ Studios é a assinatura de desenvolvimento.

## 12. Potencial de compartilhamento e qualidade
Eventos emergentes com causalidade, composição visual antes/depois, registro de estações e diário de animais, modo foto sem HUD e pequenos relatos de descoberta. Testar se jogadores entendem as consequências e desejam contar suas histórias, sem prometer viralização. Critérios: retorno voluntário, clareza do primeiro dia, diversidade de rotinas, ausência de repetição excessiva, estabilidade e identidade visual. Todo sistema só é considerado pronto após pesquisa, contrato de dados, arte, implementação, testes e revisão manual onde aplicável.

## 13. IA adaptativa e narrativa persistente
O núcleo local combina Utility AI, máquinas de estado/árvores de comportamento, memória limitada, perfil de jogador e diretor narrativo. O perfil é derivado exclusivamente de ações no save e altera ofertas elegíveis, nunca leis naturais ou dificuldade oculta. O arco principal possui capítulos escritos, conclusão e consequências duráveis. Alvo provisório: 2 anos de jogo em ritmo comum, com 12–18 horas de conteúdo narrativo/interações relevantes distribuídas pela rotina (não horas de cutscenes); validar por playtest. Não punir quem avança devagar, nem exigir concluir a história para jogar indefinidamente. Pós-história com projetos e arcos secundários, sem reset do mundo. Atualizações por pacotes de conteúdo versionados. Ver IA_ADAPTATIVA.md e MIGRACAO.md.


## Requisito vinculante v0.3: mundo autônomo
O jogador é integrante e não condição de existência da simulação. NPCs, economia, fauna, flora e comunidade seguem seus próprios objetivos e processos, mesmo fora da câmera e sem input. A campanha preserva decisões do jogador, porém histórias secundárias e eventos mundiais avançam autonomamente. Consulte [MUNDO_AUTONOMO.md](MUNDO_AUTONOMO.md) para contratos, limites e gates MA-001 a MA-010.


## Direção aprovada v0.4
O gênero é sobrevivência rural + farming RPG + mundo autônomo. A ilha é parcialmente habitada, não um cenário de abandono total. Três perfis de severidade (aconchegante, realista e sobrevivência) usam os mesmos contratos de simulação; alteram tolerâncias e recuperação, não a autonomia do mundo. Implementar primeiro perfil realista e parametrizar os demais; ver ILHA_VIVA.md. Nome comercial, geografia de referência e parâmetros seguem provisórios. A versão inicial não exige combate.


## Adendo v0.5 • Produção e validação de sprites
O gate atual é [[QA_SPRITES]]. O protagonista aprovado consta em [[PROTAGONISTA]]. Não criar novos personagens, não enviar ao Claude Code, nem migrar para Godot antes da validação do personagem em HTML. Arte própria com identidade e pivôs consistentes. Nado com roupa e nado só de calça e descalço, com quatro direções, estados de margem, entrada, nado, saída e retorno ao estado terrestre. Profundidade determina transição; roupa e correnteza poderão afetar velocidade/energia depois de pesquisa e balanceamento. O laboratório atual não implementa essas transições completas. Preservar mundo autônomo e testes anteriores. O vault Obsidian é a fonte documental versionada, com [[DECISOES]], [[DIARIO]] e [[QA_SPRITES]] sincronizados a cada entrega. Decisões e status mais recentes prevalecem sobre missões antigas.

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

## M02-A: grama viva (v0.8)
Implementação experimental disponível em [[GRAMA_VIVA]]. Vegetação autônoma, umidade, corte, rebrota e pastoreio abstrato. Arte original provisória, validação móvel pendente.


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

## v0.15 | 26/11/2026 | Regressão de animação
- Usuário rejeitou laboratório 05: recorte, consistência e realismo. Não promover a arte.
- Restaurar laboratório 03 como referência funcional provisória, sem substituir arquivo original. Manter mestre top-down e corrida 690668.png intactos.
- Laboratório 06 experimental reutiliza o renderizador do 03, recorta células RGBA individuais sem remover fundo por cor, usa escala única por folha e apoio fixo nas ferramentas. 112 quadros/referências, 12 ações, 25 combinações ação/direção testadas no Chromium emulado; nenhum erro JS e posição do machado fixa.
- Caminhada e corrida de referência em quatro direções; novos ciclos de frente separados; ferramentas candidatas apenas frente/costas, pois laterais têm direções inconsistentes. Sono/entrada disponíveis no 03.
- Há avisos de pixels opacos perto de divisórias em algumas folhas (src/lab06/report.json); recorte e realismo biomecânico NÃO aprovados. Não substituir sprites ativos, não migrar Godot ou enviar Claude.
- Próximo gate: corrigir individualmente as animações sem alterar identidade, validar alternância e contato, não apenas reprodução técnica.
- [[QA_LAB06]]


## Checkpoint v0.16
[[CHECKPOINT_v0.16]]: laboratório 07 com base no HTML 02, variantes de arte separadas, apoio fixo durante ferramentas, QA técnico aprovado e validação artística pendente.

## Checkpoint v0.17 | Laboratório 08 (26/11/2026)

Base: HTML 07 enviado pelo usuário. Preservados os atlas Original 02 e Top-down 07 e todas as imagens anteriores. Novas versões candidatas na variante Top-down 08.

- Enxada (capinar), machado e foice: seis poses laterais originais geradas para esta revisão (direita e esquerda espelhada), pivô de apoio e cadência variável. Frente/costas conservam três poses do 07, com ajuste de cadência. A orientação do fio, consistência visual e realismo ainda dependem de aprovação. O machado novo representa golpe descendente, não valida corte de tronco em pé.
- Dormir na mata: pano anterior preservado. Dormir na cama: duas poses de repouso com remoção manual do pano e cama como camada independente, provisória; não há animação completa de deitar na cama.
- Entrada/saída com roupa: cinco poses (inclui pose seca). Sem camisa, calça e descalço: seis poses novas. Saídas usam sequência inversa, provisória; transições param no último quadro e podem ser repetidas. Margem do rio ilustrativa no visor, não sistema físico de água.
- Não foram alteradas as animações de locomoção e natação já existentes. Não foi enviado ao Claude Code nem migrado para Godot.
- QA Chromium: 163 verificações aprovadas de seleção, direção, bloqueio de deslocamento, movimento e conclusão/reinício das transições; sem erros de JavaScript observados. Abertura file:// bloqueada pelo ambiente; teste executado carregando HTML diretamente no navegador em viewport mobile. Android real e avaliação artística pendentes.
- Fonte nova PNG com alfa real, 24 recortes sem divisões cruzando pixels de alfa >128. Recortes e relatório versionados.

[[QA_LAB08]]


## Checkpoint v0.18 | 26/11/2026
- Enxada: nova folha de 6 poses por direção aprovada visualmente pelo usuário; integração final ainda depende de QA.
- Machado: usuário rejeitou a orientação da lâmina. A tentativa seguinte também mantém o fio orientado para baixo no impacto lateral. Não promover nenhuma dessas folhas a arte oficial. O fio deve tocar a face do tronco, não a lateral cega da cabeça do machado. Validar com alvo visível e pés estáveis.
- Água: entrada automática sem camisa e descalço, mantendo calça; roupa normal restaurada em terra firme. No gelo, natação e troca de roupa bloqueadas. Roupa de frio ainda pendente.
- Laboratório 09 é experimental e não é uma entrega aprovada. Preservar a versão 08 e demais artes sem alteração.

## v0.19 | Laboratório 10 | 26/11/2026
- Enxada aprovada em seis poses por direção, mantida sem alteração.
- Machado: edição localizada da cabeça metálica nas poses de impacto lateral e de costas; 6 quadros laterais/de costas e 7 frontais anteriores. Não houve redesenho do protagonista. A orientação frontal e a biomecânica completa ainda exigem validação visual.
- Água líquida: entrada automática sem camisa e descalço, saída restaura camisa e botas; versões manuais mantidas para revisão. Gelo no laboratório bloqueia entrada e natação; não representa espessura ou resistência do gelo.
- Neve é opção em avaliação, não aprovada. Se escolhida, roupa térmica automática por condições ambientais; reutilizar identidade e animações, não redesenhar personagem. Neve e congelamento de rios são fenômenos distintos; a simulação final deverá considerar temperatura persistente e correnteza. Nenhum traje de inverno criado nesta versão.
- QA Chromium via conteúdo HTML: 212 verificações de ação/direção, travessia, gelo e bloqueio de deslocamento; nenhum erro JavaScript observado. Não valida naturalidade do desenho nem execução no Android real.
- Próximo: aprovação visual do laboratório pelo usuário antes de avançar aos assets do ambiente.


## v0.20: consistência artística do protagonista
Auditoria visual do laboratório 10 registrada em [[QA_VISUAL_v0.20]]. Manter caminhada e referência-mestre como padrão; revisar corrida, enxada, machado e foice sem alterar ações aprovadas. Nenhuma alteração de código ou arte nesta etapa.


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


## v0.23 | Checkpoint e definição ecológica (26/11/2026)
- Protagonista v0.22 considerado terminado de momento pelo usuário; falta variante de roupa automática para o frio.
- Antes da produção de roupas e biodiversidade, escolher região-base. Proposta: Serra Catarinense, alternativas Nagano e Cascades. Neve e geografia não decididas.
- A simulação deve respeitar habitats, clima, dieta e reprodução de cada espécie, com autonomia mundial.
- Ver [[BIODIVERSIDADE_REGIAO_v0.23]]. Nenhuma arte ou código alterado nesta etapa.


## v0.24 | Proposta amazônica (26/11/2026)
- Usuário propôs ambientação na floresta amazônica, destacando biodiversidade e dispensando neve; região específica ainda em avaliação.
- Candidata recomendada: território fluvial fictício inspirado no sudoeste amazônico, bacia do Purus, com referências complementares do Juruá.
- Clima tropical, chuva, vazante/cheia, estiagem e episódios de friagem. Sem neve ou congelamento sazonal dos rios nesta proposta.
- Vestuário automático: preservar roupa-base; variante de frio leve, condicionada à temperatura; natação sem camisa e descalço apenas em água e condições adequadas, com restauração do vestuário ao sair.
- Mundo autônomo, agrofloresta, fauna regional e ecologia interligada. Espécies precisam de confirmação local e ficha científica antes de produção.
- Proposta, não implementação: nenhum sprite, código ou teste de jogo alterado. Ver [[BIOMA_AMAZONICO_v0.24]].


## v0.25 | Cenário oficial (26/11/2026)
Ilha fluvial amazônica fictícia aprovada pelo usuário; sem neve, friagem episódica, diversidade regional e simulação causal com desempenho Android. Purus/Juruá são referência técnica proposta; localização exata, mapa e limites populacionais permanecem em estudo. A decisão substitui o perfil marítimo temperado e as opções anteriores. Protagonista v0.22 preservado; roupa leve de frio automática pendente. HTML primeiro; sem migração ou envio ao Claude nesta etapa. Ver [[ILHA_AMAZONICA_v0.25]] para arquitetura, metas, testes e próxima missão. Nenhum código ou arte alterado.


## v0.26: vestuário por temperatura
Roupa fria experimental <=18 °C, normal >=22 °C, sem neve. Nado sem camisa e descalço e retorno automático ao traje térmico apropriado. [[VESTUARIO_FRIAGEM_v0.26]]


## Atualização v0.27 — roupa de friagem
A versão 13 foi rejeitada. Laboratório 14 usa colete de campo candidato sobre o personagem original, sem alterações no atlas ou nos movimentos. Consulte [[VESTUARIO_FRIAGEM_v0.27]].


## v0.30 | Núcleo ecológico
Laboratório HTML experimental de clima, água, solo, fotossíntese e decomposição. Ver [[LAB_ECOLOGICO_v0.30]]. 10 cenários Node e 11 verificações de interface aprovados; parâmetros não calibrados, sem fauna ou benchmark Android.


## v0.31 | Flora experimental
Ver [[FLORA_v0.31]]: seis perfis vegetais, recrutamento, fenologia, polinizacao e dispersao integrados ao motor ecologico. Calibracao e arte final pendentes. Madagascar continua vigente.


## v0.32 - Insetos e interacoes troficas
Ver [[INSETOS_v0.32]] para implementacao experimental, fontes, QA e pendencias.


## v0.33 | Teia ecológica
Ver [[TEIA_ECOLOGICA_v0.33]] para a integração experimental de quatro vertebrados, oito categorias vegetais, quatro grupos de insetos, transferência de matéria e QA. Madagascar vigente.


## v0.34 | Ciclos de vida e escala
Regra obrigatória do usuário: escala relativa, perspectiva top-down oblíqua, pés e bases no solo, volumes coerentes e geometria orgânica. Ver [[CICLOS_E_ESCALA_v0.34]]. Répteis com incubação, mamíferos com cuidado materno experimental; equilíbrio de três anos falhou, corrigir antes de expansão.


## v0.35 | Equilíbrio ecológico experimental
Ver [[EQUILIBRIO_v0.35]]. Dieta, clima regional, decomposição, carcaças e diagnósticos atualizados. QA anual concluído; estabilidade plurianual pendente.


## v0.36 | Rios e nutrientes
Ver [[RIOS_NUTRIENTES_v0.36]]: 28 trechos fluviais, teia aquática agregada e transporte de C/N/P. Modelo experimental; equilíbrio e arte final pendentes.


## v0.37 | Refúgios e reprodução aquática
Ver [[REFUGIOS_v0.37]]. Sete refúgios com reserva hídrica finita, ovos e juvenis de peixe, migração e transferência de insetos terrestres. Equilíbrio de 30 dias melhorado; seca de 90 dias ainda causa colapso. Madagascar vigente; arte aprovada preservada.


## v0.38 | Nascentes e fertilidade
Ver [[NASCENTES_FOSFORO_v0.38]]. Fósforo terrestre com estoques independentes e P orgânico aproximado por N, associação radicular funcional, três nascentes finitas recarregadas pelo solo. 47 verificações aprovadas; recuperação da fauna aquática ainda insuficiente. Madagascar e escala v0.34 vigentes.


## v0.39 : Fauna ribeirinha e recolonização
Ver [[RECOLONIZACAO_v0.39]]. Novos estoques e interações funcionais; equilíbrio ainda pendente. Arte anterior preservada.


## v0.40 | Fauna e nidificacao
Ver [[FAUNA_NINHOS_v0.40]]. Tenreque, nidificacao funcional, ajustes de dieta aquatica. Equilibrio e arte final pendentes.


## v0.41 | Comportamento e busca espacial
Ver [[COMPORTAMENTO_v0.41]]. Abrigos, torpor, evitação territorial e índice local; 62 verificações. Madagascar e escala v0.34 vigentes.


## v0.42 | Arte em paralelo e recuperacao aquatica
Ver [[ARTE_E_RECUPERACAO_v0.42]]. Piloto Gemini e validador independente; recuperacao parcial dos peixes. Protagonista e escala preservados.


## v0.43 | Campo integrado
Protótipo de exploração integrado ao núcleo v0.42. Ver [[CAMPO_INTEGRADO_v0.43]] para implementação, QA e limites. Madagascar permanece oficial; sprites aprovados preservados.


## v0.44 | Auditoria de sprites Lemur catta
Recebidas 35 pranchas. Integracao em espera: 24 candidatas transparentes, 11 quadriculadas, nenhuma animacao aprovada automaticamente. Ver [[AUDITORIA_LEMUR_v0.44]]. Campo v0.43 e simulacao preservados.


## v0.45
# v0.45 | Integração visual experimental do lêmure
Quatro poses candidatas da v0.44, recortadas pela caixa alfa e incorporadas no HTML sem redesenhar. Escala provisória de 0,14 pixel de tela por pixel de origem; não validada biologicamente. Posição e identidade derivadas dos animais existentes no núcleo v0.42; direção inferida por deslocamento entre células a cada tick de seis horas. Sem interpolação ou ciclo de caminhada. Demais espécies continuam marcadores. Botão Localizar lêmure reposiciona o jogador explicitamente para diagnóstico; não é mecânica final. Estado e idade exibidos pelo animal mais próximo. Salvamento isolado v45; sem migração de v43. 19 testes Chromium viewport móvel com armazenamento simulado, zero erros JS. Não é teste físico Android. Nenhum módulo ecológico ou arte humana modificado. Pendências: 11 pranchas quadriculadas, revisão anatômica, animações, oclusão, colisão e escala definitiva.


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


## v0.46.2
Deslocamento visual continuo dos lemures, orientacao e repouso. Animacoes de patas pendentes. Ver CORRECAO_v0.46.2.md.


# v0.46.3 | Animação candidata de lêmures

Escala visual adulta .14 → .17 (+21,43%), sem modificar a escala ecológica nem o protagonista. Preserva imagens originais e salvamento v46.

32 quadros de locomoção extraídos do arquivo Gemini `lemur_catta_eat_fruit.png`, que visualmente apresenta passadas, não alimentação. Quatro direções, oito quadros cada. Espelhamento corretivo somente no quinto quadro da terceira linha. Âncora calculada a partir do corpo inferior e último pixel opaco. Sem alteração da anatomia. Ritmo por estado: exploração local 5 fps, caminhada 8 fps, fuga 12 fps (mesmo ciclo de caminhada, não corrida biomecânica definitiva).

Alimentação foliar candidata extraída de `lemur_catta_eat_flowers.png`: frente com duas poses distintas, laterais com cinco poses distintas e reaproveitamento espelhado; sequência de retorno com repetição deliberada. Só ativa em estado `comendo leaf` quando parado e direção disponível. Costas, frutas e outras ações continuam em pose estática. Não usar a prancha com nome incorreto como alimentação de frutas. Nenhum novo comportamento biológico criado.

52 verificações Playwright aprovadas, inclusive regressões agrícolas, natação, movimentação e desenho real de quadro com âncora. Sem erros JS. Armazenamento simulado no teste. Validação visual no Android físico ainda necessária. Equilíbrio da passada, bordas, perspectiva, escala absoluta e variantes etárias permanecem experimentais. Não aprovar corrida independente ou alimentação completa nesta entrega.


# v0.46.4 | Lêmure, integração comportamental

Base: Campo 04.3, 127 quadros do protagonista e núcleo ecológico v0.42 preservados. Fonte artística: ZIP original do Gemini, 35 pranchas; reutilização de sete grupos de ações. Nomes de arquivos não correspondem sempre ao conteúdo: idle contém fruta, eat_leaves contém hidratação, drink contém repouso deitado, lie_down contém repouso sentado, eat_insects contém corrida/salto lateral. eat_fruit é a caminhada já integrada. eat_flowers contém folhagem. Seleção manual dos quadros e espelhamento direcional; manifesto de proveniência acompanha o código. Nenhuma imagem original modificada. Os candidatos de fundo transparente da v0.44 foram reutilizados, não houve aprovação definitiva das bordas ou biomecânica.

136 posições de quadros (inclui repetições/espelhamento), sete grupos: caminhada, corrida lateral, fruta, folhas, água, repouso sentado e deitado. Máquina de estados visual separada da ecologia. Caminhada prevalece enquanto deslocando; alimentação/repouso só após rota concluída. Corrida lateral usa sequência com extensão corporal; frente e costas ainda usam caminhada acelerada. Fruta/água/folhas sem direção disponível usam lateral correspondente ao id; não há garantia da orientação do recurso. Repouso deitado corresponde a abrigado, não a uma nova fisiologia do sono. Escala adulta .17 preservada; crescimento linear em duas faixas experimentais até maturidade, sem alteração de metabolismo. Não representa anatomia própria dos filhotes.

QA: 55 verificações do campo, 7 seleções de clipes no visualizador, teste de 16 passos ecológicos com 320 amostras de estados visuais (160 repouso deitado, 124 folhas, 32 fruta, 4 caminhada); zero erros JS nos testes finais. Salvamento com localStorage simulado. Android físico não medido. Pendentes: ciclo completo de corrida frontal/traseira, escalada, flores, interação social, cuidados maternos, anatomia de variantes etárias e validação visual de todas as sequências. Os outros sprites não foram descartados. Não usar movimentos fora de contexto apenas para preencher lacunas.


# Ilha Viva v0.47 | Cognição, escalada e família

Base Campo 04.4; 127 quadros do protagonista e sete grupos de animação preservados. Fonte: output_Lemur_Catta_Completo.zip, 35 pranchas originais. A prancha nurse_infant contém transporte dorsal, não amamentação; selecionados quadros de contorno completo após remoção candidata de checkerboard por máscara de contorno, com risco residual de bordas/pequenas lacunas. jump contém poses de agarrar; climb contém postura sentada de exposição solar. Manifesto registra seleção. 181 posições de sequência, incluindo reutilização e espelhamento, 10 grupos. Escala adulta .17 preservada.

IA: memória individual de até 24 registros, expiração após 30 dias e ameaça penalizada até 3 dias na exploração. Percepção local e retorno a locais conhecidos; nenhum conhecimento exato de alimento distante. Memória de abrigo registrada, seleção atual continua por qualidade local. Co-repouso de pares reais na mesma célula (não é ainda higiene social ou formação de grupos). Acompanhamento materno sincronizado após movimento dos adultos; leite já contabilizado no núcleo; alimentação vegetal complementar experimental após 56 dias; órfão com pelo menos 56 dias pode procurar alimento. Fase ventral <14 dias, dorsal 14–83 dias (um filhote por mãe), acompanhamento 84–149 dias; parâmetros aproximados, não prescrição científica. Transporte dorsal usa arte composta mãe/filhote, suprime renderização duplicada do filhote, mantém agente vivo e metabolismo. Sem sprite ventral ou amamentação visual validado. Variantes etárias continuam por escala, não anatomia definitiva. Sem grupos de escalada para filhotes transportados. Escalada visual até altura proporcional do tronco durante abrigo; descida antes de deslocamento; sem colisão arbórea 3D ou navegação entre galhos. Exposição solar condicional a manhã fria, repouso e terreno aberto; não houve ocorrência no cenário natural de 8 dias. Sem simulação de termorregulação específica nova.

QA: 55 regressões anteriores +17 testes adicionais (14 campo/IA e 3 visualizador). Cenário natural 32 passos/8 dias: 640 amostras: 316 deitado, 2 escalada, 279 folhas, 35 frutas, 1 caminhada, 7 idle; 2660 soma de tamanhos de memórias ao longo das amostras (não são registros únicos). C/N/P/água conservados dentro da tolerância 1e-6; testes maternos induzidos, não evidência de nascimento natural nessa janela. 0 erros JS. Salvamento simulado, Android físico pendente. Ainda precisam revisão visual e biomecânica, amamentação ventral, higiene social, hierarquia, variantes etárias, corrida frontal/traseira, escalada contínua entre árvores, equilíbrio plurianual.

Referências biológicas: Wisconsin National Primate Research Center, https://primate.wisc.edu/primate-info-net/pin-factsheets/pin-factsheet-ring-tailed-lemur/ ; San Diego Zoo Wildlife Alliance https://ielc.libguides.com/sdzg/factsheets/ringtailedlemur/reproduction ; Holding-on: co-evolution between infant carrying and grasping behaviour in strepsirrhines https://pmc.ncbi.nlm.nih.gov/articles/PMC5121892/ ; Duke Lemur Center https://lemur.duke.edu/discover/meet-the-lemurs/ring-tailed-lemur/ .

