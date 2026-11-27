---
tags: [ilha-viva, indice]
versao: "CP-2026-11-27-01"
---

> **Vigência 27/11/2026 | CP-2026-11-27-01:** região continental fictícia dos EUA, piloto Apalaches, expansão por ecorregiões; Madagascar/Amazônia são históricos. Mundo autônomo e ciência integrada, protagonista preservado. M48-A parcial: célula de solo experimental implementada; novo HTML ainda não existe. Retomar por [[CHECKPOINT_CONTINUIDADE]] e [[AMBIENTACAO_EUA]]. As notas anteriores conflitantes são histórico.




> **Histórico v0.29 (26/11/2026, superado):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevaleceu naquela versão. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.

# Ilha Viva | Central do projeto
YNOVIQ Studios • 26/11/2026

**Fase atual:** M48-A parcial (transição continental EUA). Base jogável histórica v0.47; célula científica experimental nova, sem HTML continental. **Começar por [[docs/CHECKPOINT_CONTINUIDADE]].**

## Navegação
- [[docs/CHECKPOINT_CONTINUIDADE]] • retomada obrigatória
- [[docs/checkpoints/CP-2026-11-27-01]] • snapshot imutável inicial
- [[docs/AMBIENTACAO_EUA]] • ambientação e ciência vigentes
- [[GDD]] • especificação principal
- [[ARTE]] • direção artística
- [[PROTAGONISTA]] • catálogo de sprites com imagens
- [[QA_SPRITES]] • evidências e pendências
- [[DIARIO]] • histórico de entregas
- [[DECISOES]] • regras aprovadas
- [[ROADMAP]] • fases e gates
- [[MUNDO_AUTONOMO]] • simulação sem jogador
- [[IA_ADAPTATIVA]] • inteligência local
- [[SIMULACAO]] • ecologia e agricultura
- [[NARRATIVA]] • história e pós-jogo
- [[ARQUITETURA_QA]] • engenharia e testes
- [[MIGRACAO]] • transição HTML para Godot
- [[FONTES]] • pesquisa
- [[CLAUDE]] • instruções futuras (envio bloqueado)

## Builds
- [Laboratório 03](builds/Laboratorio_03.html) (base atual preservada)
- [Laboratório 02](builds/Laboratorio_02.html) (histórico)
- [Laboratório 01](builds/Laboratorio_01.html) (histórico)
- [Protótipo 01](builds/Prototype_01.html) (histórico)

Abra os HTMLs no navegador, não no editor Markdown. O manifesto JSON contém dimensões, hashes e situação de cada asset. A pasta archive é histórica, não deve ser importada no jogo.

## Atualização v0.6
Laboratório atual: [Laboratório 03](builds/Laboratorio_03.html). Consulte [[docs/QA_SPRITES]] e [[docs/DIARIO]].

## Checkpoint v0.7 | 26/11/2026
- O usuário decidiu manter o protagonista e as animações do laboratório 03 como estão por enquanto. Aceitação provisória para continuidade do projeto, não certificação final de qualidade.
- Preservar integralmente os sprites, a ancoragem, as quatro direções e as duas variantes de nado já integradas. Nenhuma nova arte ou alteração de código nesta entrega.
- Próximo elemento a criar: ainda não definido; aguardar decisão do usuário, sem iniciar produção por conta própria.
- Pendências técnicas e artísticas continuam registradas em [[QA_SPRITES]], especialmente validação no Android, transições de água e integração com o mundo. Não encaminhar ao Claude Code nem migrar para Godot sem autorização.

## Checkpoint v0.8
[[GRAMA_VIVA]] | [[builds/Ilha_Viva_Campo_01.html|Campo experimental 01]]. Próximo gate: validar terreno.


## Checkpoint 0.9: revisão ambiental
O visual de Campo 01 foi rejeitado. A direção proposta agora é sítio cercado de mata natural, com clareiras e vegetação em camadas. Ver [[DIRECAO_SITIO_MATA]]. Arte conceitual pendente de aprovação; nenhum novo mapa funcional ou teste de regressão executado nesta etapa. A simulação e o protagonista anteriores permanecem preservados.

## Checkpoint v0.10 | 26/11/2026
O usuário aceitou a direção geral do conceito de sítio na mata como referência visual aproximada, não como arte final. Reforçou compatibilidade gráfica com o protagonista e registro contínuo no GDD e Obsidian. A aparência do Campo 01 continua rejeitada. Próximo gate: prova de escala e compatibilidade visual em HTML, com assets autorais modulares. Não alterar o protagonista, reaproveitar apenas a lógica de simulação validada e manter IA/autonomia. Nenhum asset novo, build ou teste de jogo executado neste checkpoint. Ver [[COMPATIBILIDADE_VISUAL]].


## Checkpoint v0.11 | Solo de mata
Nova prancha original e laboratório HTML de trilhas curvas, compactação, serapilheira e cobertura vegetal. 10 testes anteriores e 11 verificações Chromium aprovadas. Direção artística e escala ainda pendentes de aprovação; árvores e vegetação alta não integradas. Ver [[SOLO_MATA]].


## v0.12
[[docs/PERSPECTIVA_TOPDOWN]] · Correção experimental de caminhada, aguardando aprovação.


- [[REFERENCIA_MESTRE_PROTAGONISTA]] — checkpoint v0.13

## 2026-11-26 | v0.14 | Laboratório 04
- Referência-mestre: segunda imagem escolhida pelo usuário (`690668.png`). A primeira define a lista de ações, não a identidade gráfica.
- Requisitos: alternância contralateral das pernas e braços em caminhada/corrida; natação bilateral, com roupa e sem camisa, de calça e descalço; machado com fio orientado ao alvo; fundo PNG transparente.
- Teste frontal de 9 ações: 8 andar, 12 correr, 8 descalço, 12 nado vestido, 12 nado sem camisa, 11 machado, 11 enxada, 8 foice, 8 regador. Machado/enxada têm 11 poses observadas, não 12.
- Prancha opaca experimental: remoção de fundo por GrabCut pode cortar botas e contornos. Quatro folhas individuais transparentes disponíveis para comparação. Nenhuma pose inventada; recorte e redimensionamento apenas. A alternância ainda não é consistente em todos os quadros; nado sem camisa na prancha não permite verificar pés/calça submersos.
- QA Chromium mobile via set_content: 18 combinações ação/versão, avanço/retorno manual, contagem de miniaturas, reprodução automática; sem erros JS. Navegação file:// bloqueada no ambiente, teste Android físico pendente.
- Status: candidato experimental, NÃO substituir sprites ativos. Somente frente; outras direções, validação biomecânica e arte pendentes. Sem envio ao Claude ou migração Godot. Preservar arte anterior.
- [[docs/QA_LAB04|Registro completo]] · `builds/Ilha_Viva_Laboratorio_04.html`

- [[QA_LAB06|v0.15: restauração e regressão]]


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

## v0.19 | Laboratório 10 | 26/11/2026
- Enxada aprovada em seis poses por direção, mantida sem alteração.
- Machado: edição localizada da cabeça metálica nas poses de impacto lateral e de costas; 6 quadros laterais/de costas e 7 frontais anteriores. Não houve redesenho do protagonista. A orientação frontal e a biomecânica completa ainda exigem validação visual.
- Água líquida: entrada automática sem camisa e descalço, saída restaura camisa e botas; versões manuais mantidas para revisão. Gelo no laboratório bloqueia entrada e natação; não representa espessura ou resistência do gelo.
- Neve é opção em avaliação, não aprovada. Se escolhida, roupa térmica automática por condições ambientais; reutilizar identidade e animações, não redesenhar personagem. Neve e congelamento de rios são fenômenos distintos; a simulação final deverá considerar temperatura persistente e correnteza. Nenhum traje de inverno criado nesta versão.
- QA Chromium via conteúdo HTML: 212 verificações de ação/direção, travessia, gelo e bloqueio de deslocamento; nenhum erro JavaScript observado. Não valida naturalidade do desenho nem execução no Android real.
- Próximo: aprovação visual do laboratório pelo usuário antes de avançar aos assets do ambiente.


## v0.21 | Laboratório 11 | 26/11/2026
- Caminhada mantida byte a byte como referência-mestre. 83 quadros de corrida, enxada, machado e foice ajustados diretamente: aproximação cromática seletiva por direção à caminhada; escala constante por direção; correção de pivôs por medição visual. Corrida lateral: alcance horizontal das pernas reduzido gradualmente em até 12%, sem novas poses.
- Enxada mantém seis poses em quatro direções e a cadência da v10. Machado e foice mantêm poses e cadências anteriores. Nenhum redesenho de rosto/cabelo; diferenças de desenho anatômico ainda podem existir. Não houve validação biomecânica completa.
- Demais animações, arquivos de origem e versões antigas preservados. V10 selecionável no HTML com travessia automática. Neve permanece em avaliação, sem roupa de inverno nova.
- QA: 581 verificações estáticas (incluindo comparação de bytes, contagens, transparência e pivôs) e 289 no Chromium em viewport móvel. Seleção, avanço de quadros, bloqueio de deslocamento nas ferramentas, entrada automática sem camisa, restauração da roupa e bloqueio pelo gelo. Sem erros JS. Aprovação visual e Android físico pendentes.
- Status: candidato, não promover a arte final nem migrar para Godot/Claude Code até aprovação. Ver [[QA_VISUAL_v0.21]].


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


## Atualização v0.26
[[docs/VESTUARIO_FRIAGEM_v0.26]] • Laboratório 13 e relatório QA.


## Marco atual v0.41
Madagascar oficial desde v0.29. [[docs/COMPORTAMENTO_v0.41]]; laboratório 12 em prototypes/ecology_12.


## v0.43 | Campo integrado
Protótipo de exploração integrado ao núcleo v0.42. Ver [[CAMPO_INTEGRADO_v0.43]] para implementação, QA e limites. Madagascar permanece oficial; sprites aprovados preservados.

## Prova técnica inicial do motor continental | 27/11/2026
M48-A parcial, sem alteração do Campo 05. `scientific/us/soil_cell.mjs` implementa uma célula diária isolada com água, neve, degelo, infiltração, escoamento, drenagem, evaporação, estoques de C/N vegetal, detritos, biomassa microbiana e N mineral, decomposição, respiração e crescimento limitado por água/luz/temperatura/N. Coeficientes ilustrativos não calibrados; transpiração explícita, fósforo, pH, grupos microbianos distintos, transporte espacial, terreno visual, fauna, IA, save e interface ainda pendentes. Teste `scientific/us/soil_cell.test.mjs`: 1.095 dias sintéticos, 4.387 verificações de conservação de água/C/N, determinismo, neve/degelo, seca e ausência de luz; aprovadas na execução das mesmas funções em JavaScript nesta sessão. Não foi executado Node CLI, CI, suite antiga, HTML ou Android. Commits c1385aa3bab322dd150939bd12b1e5ecc7bc668e (módulo) e 6422b75fd54700e750ae2249322936140041cb40 (teste). Não declarar a simulação completa ou validada cientificamente. O build v0.47 permanece histórico, não entregar como cenário EUA.
