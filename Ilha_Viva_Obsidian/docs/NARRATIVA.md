# Bíblia narrativa | v0.2

> **Decisão vigente 27/11/2026:** ambientação continental rural fictícia dos EUA, piloto nos Apalaches, com outras ecorregiões em expansão. Madagascar e Amazônia são históricos e não ativos. Protagonista aprovado preservado; terreno, fauna, flora e dados científicos serão reconstruídos. Ver [[AMBIENTACAO_EUA]] para requisitos e gates. Checkpoint documental; build v0.47 ainda histórico, motor novo não implementado.


> **Vigência v0.29 (26/11/2026):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevalece sobre trechos históricos conflitantes. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.


## Premissa proposta
O jogador muda de vida e assume uma pequena propriedade ligada à cooperativa do vale, numa época em que o abastecimento e os serviços rurais se tornaram frágeis. A vila não é unanimidade: moradores divergem sobre como crescer, proteger a terra e repartir oportunidades. Não existe vilão unidimensional. A propriedade se torna parte dessa rede; o modo como é conduzida abre alianças, tensões e alternativas. O título e nomes são provisórios.

## Arco principal
- Chegada: aprender a ler a terra, encontrar vizinhos, receber tarefas com objetivos úteis, escolher estilo de produção. Primeiro dia ensina por interação, não exposição extensa.
- Pertencimento: problemas pequenos revelam a história dos moradores. Uma temporada difícil cria necessidade de decisões sobre irrigação e estoque compartilhado.
- Conflito: recuperação econômica versus preservação de margens, água e acesso comum. O jogador pode participar de projetos cooperativos ou priorizar sua propriedade, com resultados diferentes, não um único final moralmente perfeito.
- Transformação: serviços, feiras e infraestrutura evoluem; relações anteriores afetam quem oferece ajuda. O conflito central se resolve em estados possíveis, não em encerramento obrigatório.
- Continuidade: novos projetos, vínculos, amadurecimento de personagens, festivais e crises sazonais. Não repetir o arco principal a cada ano.

## Elenco inicial candidato
| NPC | Papel | Desejo / conflito | Comportamento |
|---|---|---|---|
| Helena | agrônoma/cooperativa | recuperar confiança após projeto que falhou | observa solo, orienta sem dar respostas prontas, discorda de monocultura |
| Augusto | pecuarista | manter a propriedade viável sem perder o vínculo com a terra | cuida do rebanho ao amanhecer, oferece feno quando há confiança |
| Nara | comerciante | evitar desabastecimento e manter preços acessíveis | revê pedidos conforme oferta; tem humor e opiniões próprias |
| Bento | marceneiro | ensinar o ofício e preservar a autonomia | trabalha em oficina, conserta cercas; respeita compromissos |
| Elisa | veterinária | expandir acesso ao cuidado animal | visita propriedades, dá alertas contextuais, respeita horários |
| Tomás | cozinheiro | construir identidade gastronômica local | receitas mudam conforme ingredientes e estação |
| Inês | guardiã de trilhas e pesquisadora | recuperar margens e habitats | acompanha fauna, chuva e qualidade da água |
| Raul | pescador | equilibrar renda e conservação | muda ponto de pesca por clima/estoque, compartilha experiências |

Todos terão biografia, voz, idade, vínculos, gostos, aversões, rotina, objetivos e segredos proporcionais. Candidatos de romance adultos, consentimento e recusa respeitados; não reduzir vínculo a presentes. Escopo inicial prioriza quatro NPCs completos, não muitos bonecos vazios. Elenco final e opções de romance são decisões a aprovar.

## Motor de narrativa
Eventos escritos e condicionais, sem dependência de geração de texto por API durante o jogo. O diretor seleciona variantes por memória, conhecimento, personalidade, situação e cooldown. Cada fala tem ID, personagem, assunto, contexto, prioridade, cooldown, flags, requisitos e efeitos. Memória de fatos relevantes (promessa cumprida, entrega, discussão, ajuda, evento ambiental), com prazo e intensidade. NPCs conversam entre si, têm relações próprias e não sabem automaticamente tudo o que ocorreu. Informação chega por observação ou cadeia de comunicação. Agenda diária adapta-se a trabalho, clima, feriados, relacionamentos e impedimentos físicos. Planejador de trajetos com fallback: se ponte fecha, procurar rota válida ou remarcar.

## Exemplo de evento sistêmico
Após dias de seca, o reservatório cai. Helena propõe revisar irrigação, Augusto busca feno, Nara alerta que algumas entregas podem atrasar. Se o jogador guardou água e ajudou vizinhos, surgem falas de reconhecimento e opção de projeto comunitário; se não, ainda tem alternativas de recuperação. Nenhum NPC recebe uma fala incompatível com o que sabe ou com sua localização. Uma segunda estiagem produz variações, sem repetir a mesma cutscene.

## Escrita e revisão
Tom natural, regionalidade moderada após escolha de ambientação, frases com subtexto e voz distinta; evitar monólogos explicativos, texto genérico, elogios repetidos ao jogador, exposição desnecessária e decisões falsas. Diálogos por tema e contexto com revisões editoriais. Testes: branches alcançáveis, sem flags contraditórias, eventos únicos não repetem, localização não contradiz cena, relações e compromissos persistem, texto cabe na interface.

## Cadência proposta e conclusão
| Capítulo | Janela orientativa | Transformação |
|---|---|---|
| Chegada | primavera do ano 1 | integração e autonomia inicial |
| Pertencimento | verão/outono do ano 1 | laços, serviços e problemas coletivos |
| Conflito | inverno do ano 1 até verão do ano 2 | água, economia e escolhas de cooperação |
| Resolução | segunda metade do ano 2 ou depois | acordo, obras e consequências verificáveis |
| Pós-história | indefinido | continuidade de relações, projetos, ciclos e novos arcos |
Janelas não são prazos rígidos; gates por pré-requisitos, ritmo do jogador, sazonalidade e disponibilidade. Atrasar capítulo não bloqueia atividades normais; disponibilizar caminhos alternativos após janelas perdidas. Final fixa resultado e flags, nunca encerra o save. O diretor não reabre conflito principal sem conteúdo autoral de continuação.


## Autonomia v0.3
Histórias secundárias, relações entre NPCs e acontecimentos públicos evoluem sem participação do jogador. O diretor narra consequências de eventos válidos e não cria falas ou escolhas do jogador retroativamente. A campanha mantém pontos de reentrada coerentes; o desfecho pessoal não é escolhido pela IA.


## Contexto insular v0.4
A fragilidade logística regional sustenta o conflito de abastecimento, conservação e autonomia; não depende de catástrofe constante. Estradas, comércio e ofícios locais conectam histórias. A comunidade pode resolver problemas sozinha, mas o jogador tem escolhas pessoais exclusivas no arco principal. Sem final obrigatório da simulação.
