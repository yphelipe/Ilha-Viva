# Diário de desenvolvimento

> **Vigência 27/11/2026 | CP-2026-11-27-01:** região continental fictícia dos EUA, piloto Apalaches, expansão por ecorregiões; Madagascar/Amazônia são históricos. Mundo autônomo e ciência integrada, protagonista preservado. M48-A parcial: célula de solo experimental implementada; novo HTML ainda não existe. Retomar por [[CHECKPOINT_CONTINUIDADE]] e [[AMBIENTACAO_EUA]]. As notas anteriores conflitantes são histórico.


> **Histórico v0.29 (26/11/2026, superado):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevaleceu naquela versão. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.

[[INICIO]] | [[DECISOES]] | [[QA_SPRITES]]
## 2026-11-26 • Pré-produção e laboratório
- v0.1: GDD inicial de fazenda, ecossistema integrado, arte própria, pesquisa e regressão.
- v0.2: HTML antes de Godot; IA adaptativa; história com final e pós-jogo.
- v0.3: autonomia mundial obrigatória.
- v0.4: conceito de ilha viva aprovado, planejamento inicial para Claude Code; posteriormente usuário determinou validação HTML aqui primeiro.
- Protótipo HTML 01: simulação inicial e arte experimental rejeitada visualmente. Relatório anterior informou 156 colheitas, 333 transações, 60 ovos em 30 dias e 11 verificações; não reexecutado nesta entrega. Salvar/carregar pendente de verificação.
- Arte: base masculina aprovada, caminhada, regador, descanso/água, corrida, machado e foice; versões com chapéu/roupa diferente rejeitadas e excluídas do catálogo. Corrida com fundo não transparente substituída.
- Laboratório 01: primeira revisão visual. Usuário pediu melhoria da enxada e dois nados.
- Laboratório 02: novas folhas integradas no HTML offline, renderização headless não concluída. Aguardando validação visual. Ver [[QA_SPRITES]].
- v0.5: consolidação Obsidian, GDD e catálogo, registro de pendências técnicas, sem alterar sprites ou builds existentes.

## Modelo para cada próxima entrega
Data, versão, objetivo, arquivos alterados, decisões, fontes, testes executados/resultados, evidências, falhas, próxima ação. Diferenciar declarado, reproduzido e aprovado visualmente.

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

## 2026-11-26 | v0.8
M02-A: criado campo experimental e atlas original; 10 testes Node aprovados e testes Chromium executados. Aguardando aprovação visual. [[GRAMA_VIVA]]


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


## 26/11/2026 | v0.20
Auditoria visual solicitada pelo usuário. Comparação de sprites em quatro direções; divergências registradas em [[QA_VISUAL_v0.20]]. Laboratório 10 e artes preservados.


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


## 26/11/2026 — v0.26
Laboratório 13: vestuário automático, sem gelo, 70 testes de navegador aprovados. Ver [[VESTUARIO_FRIAGEM_v0.26]].

## 27/11/2026 | CP-2026-11-27-01
Mudança continental registrada; célula de solo experimental já implementada em commits anteriores c1385aa e 6422b75, 4.387 verificações em 1.095 dias sintéticos na sessão anterior (não reexecutadas). Nesta entrega documental, checkpoint mestre e snapshot, regras de continuidade e GDD alinhados. Sem código, sprites, build ou testes novos. Próximo: M48-A espacial e HTML continental. [[CHECKPOINT_CONTINUIDADE]].

## Biblioteca de skills | CP-2026-11-27-02
Ler `Ilha_Viva_Obsidian/docs/SKILLS_PROJETO.md` e `.agents/skills/` antes de cada missão. Seis skills iniciais versionadas: pixel art rural, animação biomecânica, pesquisa ecológica, motor científico, IA autônoma e QA/build/continuidade. Atualizar procedimentos com aprendizado comprovado e regressões; criar skills novas quando houver necessidade reutilizável. Não assumir descoberta automática. Preservar pixel art autoral, realismo, escala e protagonista. Nesta revisão, somente documentação/procedimentos; M48-A continua parcial, sem novo HTML, arte ou testes executados.

## M48-A | Laboratório Continental 01 | CP-2026-11-27-03
Prova espacial em `scientific/us/world.mjs` e HTML autônomo `play/Ilha_Viva_Laboratorio_Continental_01.html` (11.310 bytes, blob Git 170de602406d7b03bcb6578bc974c5f792c7f062). Malha visual de 32×24 células (768) de 10 m de lado, relevo sintético, clima diário determinístico, neve, degelo, infiltração e roteamento de água superficial para vizinhos mais baixos; exportação na fronteira e drenagem profunda explicitadas. Fluxos de C/N e água do módulo de solo anterior preservados; nitrogênio lixiviado sai do domínio, não é transportado entre células nesta versão. Mapas diagnósticos de paisagem, relevo, umidade, N e biomassa microbiana; seleção tátil de célula, avanço diário/semanal/anual, simulação automática, tempestade, nevasca e reset. Sem protagonista e sem arte final: o atlas `assets/runtime/ART.json` (1.737.726 bytes, blob a3dac070adb3400e373232affcd6bbed1a84b1f3) foi localizado, mas o conector retornou conteúdo vazio; clone local falhou por DNS. Não substituímos nem alteramos o protagonista. Campo 05 e VERSION 0.47 históricos preservados. O novo laboratório é independente, não uma build jogável completa.
Fontes consultadas: EPA ecorregiões Blue Ridge/Ridge and Valley https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=91024W05.TXT ; NOAA normais https://www.ncei.noaa.gov/access/us-climate-normals/index.html ; tabela secundária Asheville Regional Airport https://climate-charts.com/usa-stations/nc/usw00003812.html (rótulos 1991–2020 e 2006–2020 conflitantes; valores mensais arredondados apenas ilustrativos; validar dados primários antes de calibrar); USGS grupos hidrológicos https://pubs.usgs.gov/ds/480/HydrologicSoilGroup.htm . Precipitação aleatória diária sintética, temperatura aproximada com gradiente altitudinal, iluminação sazonal heurística. Não é clima observado nem modelo geológico calibrado.
QA: 1.095 dias × 192 células = 210.240 células-dia; 4.423 verificações aprovadas (balanços água/C/N, finitude/não negatividade, ordem reversa de estados, escoamento, neve, degelo, seca e serialização). 15 verificações do HTML recuperado com DOM/canvas simulados; não Chromium, Android, Node CLI nem regressão histórica. Evidência `qa/continental_01.json`. Commits 4c635eee (motor), 3142c0b8 (teste), bd0539ee (HTML), c47e9f98 (QA). Teste reproduzível: `node scientific/us/world.test.mjs`. A interface não implementa save; apenas teste de serialização de estado do motor. Valores agregados de estoque são somas por célula; multiplicar pela área para total físico, e converter mm×m² em m³ dividindo por 1000. Próximo: obter o atlas original integralmente e executar build/QA real, integrar protagonista e arte de terreno orgânica autoral; melhorar hidrologia espacial e validar clima primário, depois M48-B microbiologia e flora. Não declarar M48-A completa.

## CP-2026-11-27-04 | Entrega ao Codex e economia de sessão
Missão vigente: [[MISSAO_CODEX_M48A]], arquivo `Ilha_Viva_Obsidian/docs/MISSAO_CODEX_M48A.md`. Nova skill `.agents/skills/economia-de-sessao/SKILL.md`: leitura seletiva, trabalho agrupado, testes direcionados e regressão no marco integrado, automação, recuperação de bloqueios e atualização por evidências. Sete skills no total. Base técnica permanece CP-03; nesta revisão apenas procedimentos e documentação, sem novo build, código de jogo, arte ou testes. Próxima ação: executar a missão no checkout do Codex, recuperar atlas original e integrar campo continental em HTML. Não afirmar que Codex executou ou que economia foi medida.

## CP-2026-11-27-06 | IA adaptativa diagnóstica
Laboratório Continental 02 e módulo adaptive_agents.mjs publicados. Seis agentes com percepção local, memória, esquecimento, decisão por utilidade e save local. 1.825 dias, 10.950 decisões, 5.508 verificações de motor e 8 de interface em runtime JS/DOM simulado; diagnóstico de perdas C/N. Sem arte final, protagonista, fauna calibrada ou testes reais de navegador/Android. Consultar [[CHECKPOINT_CONTINUIDADE]] e qa/continental_02.json. Próximo: comparar trabalho Codex quando publicado, campo continental integrado e calibração científica. Commits incrementais obrigatórios.

## CP-2026-11-27-07
Laboratório Continental 03 e `scientific/us/food_world.mjs` publicados: fome, consumo de biomassa conservativo, competição proporcional, respiração, retorno de nutrientes, morte por déficit e colheita com exportação C/N. 11.021 verificações do motor e 8 da UI simulada; cinco anos virtuais. Perda líquida C/N continua; coeficientes sintéticos. Sem novo campo com protagonista ou arte definitiva. Ver [[CHECKPOINT_CONTINUIDADE]] e `qa/continental_03.json` para evidências, limitações e próximos passos.
