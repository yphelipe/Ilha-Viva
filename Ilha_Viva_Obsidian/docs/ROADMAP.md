# Roadmap e gates de produção

> **Vigência 27/11/2026 | CP-2026-11-27-01:** região continental fictícia dos EUA, piloto Apalaches, expansão por ecorregiões; Madagascar/Amazônia são históricos. Mundo autônomo e ciência integrada, protagonista preservado. M48-A parcial: célula de solo experimental implementada; novo HTML ainda não existe. Retomar por [[CHECKPOINT_CONTINUIDADE]] e [[AMBIENTACAO_EUA]]. As notas anteriores conflitantes são histórico.




> **Histórico v0.29 (26/11/2026, superado):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevaleceu naquela versão. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.


| Missão | Entrega integrada | Gate obrigatório |
|---|---|---|
| M00 Pré-produção | repositório novo, verificação skills, GDD, ADRs, região/escala, CI, esqueleto web e smoke browser | docs consistentes, versões fixadas, build web real |
| M01 Prova visual e técnica | cena rural original, protagonistas, galinha, ferramentas, clima visual, movimento, UI básica, pipeline de arte | review humano de imagens/vídeos, input, câmera, escala e testes |
| M02 Núcleo agrícola | relógio, clima, água/solo, quatro culturas, inventário, rega, colheita, venda, save | cadeia chuva-solo-crescimento testada, 30 dias simulados, build HTML |
| M03 Ecossistema + NPC | galinheiro, alimento/água, pasto básico, polinização, quatro NPCs, IA adaptativa, memória e evento narrativo contextual | cadeia clima-animal-economia, 365 dias simulados, save, review de animações |
| MG Migração | portar núcleo e cena aprovada para Godot, preservar save e arte | replays, paridade funcional, Android smoke, aprovação visual |
| M04 Alpha | quatro fases hidrológicas, 12 culturas, 3 espécies domésticas, pesca, 8 NPCs, floresta, lago, obras | conteúdo rastreável, progressão sem softlock, regressão integral |
| M05 Profundidade | cadeia produtiva, economia regional, projetos, relações, histórias, fauna, clima extremo, balanceamento | playtests de múltiplas rotinas, qualidade de dados e performance |
| M06 Beta | conteúdo alvo, acessibilidade, polimento autoral, áudio, migração save, aparelhos variados | QA de release, auditoria de origem, regressão completa e aprovação visual |
| M07 Lançamento | builds, materiais de divulgação com gameplay real, feedback e atualizações | sem P0/P1, aprovação humana, metas revisadas |

## Regras de execução
Missões devem ter progressão substancial. Não parar em cada microtarefa; paralelizar pesquisa, arte, design, programação e QA quando independentes. Um responsável por área de arquivo, integração em branch com revisão; não sobrescrever progresso aprovado. Evitar fases massivas sem build jogável. Relatório de cada missão: escopo, arquivos alterados, fontes, testes executados e saídas reais, evidência visual/build web ou APK após MG quando aplicável, commit e bloqueios. Se CI falhar, corrigir antes de prosseguir. Se ambiente não permite browser/visual ou Android após MG, relatar impedimento e preservar gate pendente.

## M00 backlog de aceitação
- Verificar instalação e versão do Game Studios no ambiente, mapear comandos/agents locais; não reinstalar se já presente.
- Criar repo novo sem importar código/arte de outros projetos. Versionar docs, decisão técnica e fontes.
- Fixar stack web e criar Canvas, input básico, runner, CI e contratos portáveis; executar build e smoke browser; entregar log e artefato real. Godot e templates no gate MG.
- Definir zona climática de referência e ficha de 4 plantas + galinha + polinizador inicial. Não inventar números científicos.
- Iniciar prova de proporção, paleta e escala em fontes autorais; entregar prancha para gate, não promover placeholders a arte final.
- Criar epics/story IDs e matriz de rastreabilidade requisito -> implementação -> teste -> evidência.

MG ocorre após M03 e aprovação do slice HTML, podendo ser antecipado somente mediante decisão explícita e evidência. M01 inicia memória e decisão de NPC; M02 integra clima à decisão; M03 valida adaptação e narrativa. M05 completa o arco principal e pós-história.


## Gate transversal v0.3
M00 inclui runner sem jogador e contratos do relógio; M01 inclui NPC com decisão autônoma; M02 integra autonomia ecológica; M03 testa cadeia social, produtiva e narrativa sem input; M05 valida longevidade pós-história; MG valida paridade. Critérios detalhados e IDs em MUNDO_AUTONOMO.md. A autonomia é requisito de aprovação da fatia jogável e não expansão tardia.


## Sequência executável v0.4
M00 e a parte piloto de M01 podem ser executadas na mesma sessão se os gates forem respeitados. A primeira cena é propriedade ribeirinha em terreno elevado + caminho + pequeno núcleo habitado. Entregar build web, evidências, log da simulação sem jogador e matriz de ações. A expansão de fauna, elenco e mapa ocorre somente após revisão do padrão piloto; frentes de pesquisa, arquitetura e QA seguem em paralelo. Veja MISSAO_01.md.


## Gate atual v0.5
Antes de M01/Claude Code: corrigir e validar o laboratório HTML 02, registrar aprovação visual do protagonista e resultados reproduzíveis em [[QA_SPRITES]]. Progresso por personagem/ação, sem ampliar escopo antes da aprovação. Obsidian e GDD devem acompanhar cada entrega. A transição para Godot permanece bloqueada.

## Checkpoint v0.10 | 26/11/2026
O usuário aceitou a direção geral do conceito de sítio na mata como referência visual aproximada, não como arte final. Reforçou compatibilidade gráfica com o protagonista e registro contínuo no GDD e Obsidian. A aparência do Campo 01 continua rejeitada. Próximo gate: prova de escala e compatibilidade visual em HTML, com assets autorais modulares. Não alterar o protagonista, reaproveitar apenas a lógica de simulação validada e manter IA/autonomia. Nenhum asset novo, build ou teste de jogo executado neste checkpoint. Ver [[COMPATIBILIDADE_VISUAL]].


## Checkpoint v0.11 | Solo de mata
Nova prancha original e laboratório HTML de trilhas curvas, compactação, serapilheira e cobertura vegetal. 10 testes anteriores e 11 verificações Chromium aprovadas. Direção artística e escala ainda pendentes de aprovação; árvores e vegetação alta não integradas. Ver [[SOLO_MATA]].


## Checkpoint v0.12: perspectiva elevada
Ver [[PERSPECTIVA_TOPDOWN]]. Caminhada top-down experimental integrada ao laboratório de mata 02. Identidade visual preservada como objetivo; validação artística pendente. Não ampliar produção até confirmar escala, ângulo e proporções. Corrida e demais ações ainda precisam de revisão no mesmo ângulo. QA de mata: 11 verificações aprovadas em Chromium.

## v0.15 | 26/11/2026 | Regressão de animação
- Usuário rejeitou laboratório 05: recorte, consistência e realismo. Não promover a arte.
- Restaurar laboratório 03 como referência funcional provisória, sem substituir arquivo original. Manter mestre top-down e corrida 690668.png intactos.
- Laboratório 06 experimental reutiliza o renderizador do 03, recorta células RGBA individuais sem remover fundo por cor, usa escala única por folha e apoio fixo nas ferramentas. 112 quadros/referências, 12 ações, 25 combinações ação/direção testadas no Chromium emulado; nenhum erro JS e posição do machado fixa.
- Caminhada e corrida de referência em quatro direções; novos ciclos de frente separados; ferramentas candidatas apenas frente/costas, pois laterais têm direções inconsistentes. Sono/entrada disponíveis no 03.
- Há avisos de pixels opacos perto de divisórias em algumas folhas (src/lab06/report.json); recorte e realismo biomecânico NÃO aprovados. Não substituir sprites ativos, não migrar Godot ou enviar Claude.
- Próximo gate: corrigir individualmente as animações sem alterar identidade, validar alternância e contato, não apenas reprodução técnica.
- [[QA_LAB06]]


## v0.23 | Checkpoint e definição ecológica (26/11/2026)
- Protagonista v0.22 considerado terminado de momento pelo usuário; falta variante de roupa automática para o frio.
- Antes da produção de roupas e biodiversidade, escolher região-base. Proposta: Serra Catarinense, alternativas Nagano e Cascades. Neve e geografia não decididas.
- A simulação deve respeitar habitats, clima, dieta e reprodução de cada espécie, com autonomia mundial.
- Ver [[BIODIVERSIDADE_REGIAO_v0.23]]. Nenhuma arte ou código alterado nesta etapa.


## v0.25 | Cenário oficial (26/11/2026)
Ilha fluvial amazônica fictícia aprovada pelo usuário; sem neve, friagem episódica, diversidade regional e simulação causal com desempenho Android. Purus/Juruá são referência técnica proposta; localização exata, mapa e limites populacionais permanecem em estudo. A decisão substitui o perfil marítimo temperado e as opções anteriores. Protagonista v0.22 preservado; roupa leve de frio automática pendente. HTML primeiro; sem migração ou envio ao Claude nesta etapa. Ver [[ILHA_AMAZONICA_v0.25]] para arquitetura, metas, testes e próxima missão. Nenhum código ou arte alterado.


## Checkpoint v0.26
Vestuário automático implementado; aprovação artística pendente. Próxima etapa: solo de terra firme e várzea amazônica.


## v0.36 | Próximo gate vigente
Completar fósforo terrestre, hidrologia perene, refúgios e ciclos de vida aquáticos; integrar insetos terrestres à alimentação de peixes. Validar estabilidade plurianual e desempenho Android. Madagascar e regra de escala v0.34 vigentes. Ver [[RIOS_NUTRIENTES_v0.36]].


## v0.38 | Gate vigente
Madagascar é a referência oficial, substitui decisões históricas amazônicas. Melhorar zooplâncton, presas e recolonização aquática pós-seca; testar múltiplos anos e sementes. Depois, anfíbios e aves. Manter arte aprovada e escala v0.34. Ver [[NASCENTES_FOSFORO_v0.38]].


## Marco v0.39
Concluído: recuperação por ovos e dispersão, rãs e aves funcionais. Próximo: calibrar presas e testar equilíbrio, detalhar comportamento e sprites.


## Gate v0.41
Ver [[COMPORTAMENTO_v0.41]]. Próximo: sprites animais individuais, escala, recuperação aquática e equilíbrio plurianual.


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


## Roteiro ativo continental (substitui gates de conteúdo malgaxe)
M48-A parcial: auditar base, calibrar recorte piloto, terreno espacial, clima/água/solo e HTML novo com protagonista. M48-B: microbiologia e flora. M48-C: fauna e pecuária. M48-D: sociedade, IA e economia. Cada gate exige evidência, regressão, HTML funcional quando aplicável e checkpoint conforme [[CHECKPOINT_CONTINUIDADE]].

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

## CP-2026-11-27-08 | Fertilidade experimental
Laboratório 04 e módulo fertility.mjs publicados. Deposição atmosférica inspirada em Coweeta (6,7 kg N/ha/ano) e estoque orgânico protegido com taxas sintéticas. Dois cenários de 5 anos, 14.674 verificações do motor e 7 da UI simulada. C/N finais maiores na combinação experimental, mas perdas persistem e C colhido menor. Não é calibração de campo nem prova isolada de eficácia. Ver [[CHECKPOINT_CONTINUIDADE]] e qa/continental_04.json. Protagonista e arte final ainda pendentes; preservar históricos. Próximo: teste fatorial, fontes e sumidouros específicos, microbiologia.

## CP-2026-11-27-09 | Simbiose e experimento fatorial
Módulo microbiology.mjs e Laboratório Continental 05 publicados. Nove cenários de 3 anos, 29.708 verificações do motor e 7 de UI simulada. Separados fatores de deposição, dinâmica do estoque protegido e repartição inicial; teste adicional de fixação simbiótica limitada por hospedeiro agregado, C, N, luz, água e temperatura. Fixação total pequena (0,016396 kg N, custo 0,131166 kg C), apenas no primeiro ano. Não representa microbiologia completa nem calibração. Próximo: gramíneas/leguminosas em pools separados, nodulação e fungos/micorrizas/P; campo integrado quando atlas acessível. Ver [[CHECKPOINT_CONTINUIDADE]] e qa/continental_05.json.

## Decisão de plataforma | HTML primeiro, Godot posteriormente
Decisão explícita do usuário: manter HTML5/JavaScript como plataforma atual de desenvolvimento, visualização e testes no celular; usar Godot somente em etapa posterior. Cada missão que alterar comportamento jogável deve publicar um HTML autônomo e atualizado para download/teste, com link direto ao arquivo, identificação da versão, escopo e limitações. Laboratório diagnóstico não substitui o campo jogável. Priorizar integração do campo, protagonista original, animações e cenário em pixel art sem abandonar o motor científico. Separar simulação determinística, dados, assets, saves e apresentação; manter contratos de unidades, ticks, schema e cenários de regressão independentes da engine para futura portabilidade. A migração só começa após decisão explícita do usuário e validação do gameplay em HTML. Godot 4 é a direção prevista; GDScript é sugestão técnica provisória, não linguagem decidida nem versão da engine fixada. Não criar projeto Godot ou APK agora. Esta revisão apenas registra a decisão, sem alteração de código/build/teste.

## CP-2026-11-27-10 | Flora funcional
Laboratório Continental 06 e flora.mjs publicados. Gramíneas/leguminosas possuem C/N próprios, competição, nodulação funcional e crescimento com fixação de N/custo C. 17.683 verificações do motor e 7 da interface simulada; 4 cenários de 3 anos. Mistura fixou 6,184 kg N continuamente nos três anos; sem hospedeiro, zero. Parâmetros sintéticos e agentes abstratos. Atlas original inacessível pelo conector, preservado. Campo jogável e arte final ainda pendentes. Ver [[CHECKPOINT_CONTINUIDADE]] e qa/continental_06.json. HTML primeiro, Godot posterior.

## CP-2026-11-28-11
Branch missao/campo-continental: Campo 02 preservado e código Campo 03 com rega conservativa, corrida tátil e proteção durante animações. 29 verificações de modelo aprovadas (runtime JS); build/Chromium pendentes por bloqueio de acesso ao atlas/HTML grande. Pipeline CI criado, sem execução confirmada. Consultar [[CHECKPOINT_CONTINUIDADE]]. Não afirmar que Campo 03 foi empacotado; continuar na branch ativa e validar antes de merge.

CP-11 confirmado: Campo 03 compilado e entregue como HTML/artefato CI; run 46151967224, SHA-256 77fc75da07e8cb05c8a0a282b54184d9b1f60ccd85cfcd2cfce49ccd4dd9752a. 20 testes Chromium e testes Node/atlas aprovados. Sem teste Android físico. Ver checkpoint mestre para evidências e limites.

## CP-2026-11-28-12
Campo 04: coleta de água conservativa, cobertura orgânica, colheita condicionada a 14 dias/biomassa, analógico tátil, zoom, destaque e progresso do canteiro. 64 verificações de modelo; QA real/artefato pendentes de confirmação CI. Preserva artes e Campo 03. Ver checkpoint mestre.

CP-12 confirmado: Campo 04 compilado e entregue; CI 46154034962, 26 testes Chromium, 64 verificações agrícolas e 17.683 de flora. Ver checkpoint mestre; Android físico pendente.
