# Protagonista | Catálogo de sprites
[[INICIO]] | [[ARTE]] | [[QA_SPRITES]]
Identidade visual: cabelo castanho, camisa azul de mangas dobradas, calça marrom, botas; sem chapéu. Nado alternativo sem camisa e descalço, mantendo a calça. Arte original para o projeto. Não substituir por outra identidade.
A aprovação visual da folha não equivale à aprovação da animação em execução.

## base
Base visual aprovada. Dimensões: 1086 × 1448 px; RGBA.
![[assets/protagonista/base.png]]

## idle_experimental
Repouso frontal; outras direções pendentes. Dimensões: 1254 × 1254 px; RGBA.
![[assets/protagonista/idle_experimental.png]]

## andar
4 direções, 4 quadros; revisão dinâmica pendente. Dimensões: 1254 × 1254 px; RGBA.
![[assets/protagonista/andar.png]]

## correr
Visual aprovado; 4 direções × 4 quadros. Dimensões: 1254 × 1254 px; RGBA.
![[assets/protagonista/correr.png]]

## enxada_v2
Substitui enxada v1; ação precisa de validação. Dimensões: 1254 × 1254 px; RGBA.
![[assets/protagonista/enxada_v2.png]]

## regador
4 direções × 3 quadros. Dimensões: 1086 × 1448 px; RGBA.
![[assets/protagonista/regador.png]]

## machado
Visual aprovado; 4 direções × 3 quadros. Dimensões: 1254 × 1254 px; RGBA.
![[assets/protagonista/machado.png]]

## foice
Visual aprovado; 4 direções × 3 quadros. Dimensões: 1254 × 1254 px; RGBA.
![[assets/protagonista/foice.png]]

## sono_entrada_agua
Duas poses de cada ação, não ciclos completos. Dimensões: 1254 × 1254 px; RGBA.
![[assets/protagonista/sono_entrada_agua.png]]

## nado_roupa
4 direções × 4 quadros; validar. Dimensões: 1254 × 1254 px; RGBA.
![[assets/protagonista/nado_roupa.png]]

## nado_calca
Sem camisa e descalço; 4 direções × 4 quadros; validar. Dimensões: 1254 × 1254 px; RGBA.
![[assets/protagonista/nado_calca.png]]

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


## v0.23 | Checkpoint e definição ecológica (26/11/2026)
- Protagonista v0.22 considerado terminado de momento pelo usuário; falta variante de roupa automática para o frio.
- Antes da produção de roupas e biodiversidade, escolher região-base. Proposta: Serra Catarinense, alternativas Nagano e Cascades. Neve e geografia não decididas.
- A simulação deve respeitar habitats, clima, dieta e reprodução de cada espécie, com autonomia mundial.
- Ver [[BIODIVERSIDADE_REGIAO_v0.23]]. Nenhuma arte ou código alterado nesta etapa.


## v0.26
117 quadros derivados para friagem. Animações originais intactas; arte de manga pendente de aprovação. [[VESTUARIO_FRIAGEM_v0.26]]
