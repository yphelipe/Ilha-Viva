> **HISTÓRICO — substituído pela decisão v0.29 Madagascar. Não usar como especificação ativa.**

# Ilha amazônica oficial | v0.25

Data: 26/11/2026. Cenário aprovado pelo usuário: ilha fluvial amazônica fictícia, biodiversidade regional, sem neve, realismo e complexidade com fluidez Android. Referência técnica proposta (não localização literal): sudoeste amazônico, bacia do Purus, comparação com Juruá. Nome e dimensões da ilha ainda em aberto. Não reproduzir terras indígenas ou unidades de conservação reais.

## Geografia e biodiversidade
- Núcleo habitável em terreno elevado, comunidade ribeirinha fictícia, sítio agroflorestal; várzea, igarapés, lagoas sazonais, praias fluviais e corredores naturais. Incluir igapó apenas onde hidrologia e espécies forem coerentes. Terra firme na ilha depende da topografia; validar antes de fixar o mapa.
- Fases hidrológicas enchente, cheia, vazante e seca, não equivalentes automaticamente às quatro estações meteorológicas. Rio responde a precipitação local e a montante, com atraso. Sem neve ou gelo sazonal. Friagens episódicas; roupa leve de frio automática com histerese, sem alterar identidade ou animação original. Nado em condições seguras; troca para calça sem camisa/descalço e restauração ao sair. Traje ainda não produzido.
- Fichar espécies por ocorrência local, habitat, dieta, atividade, reprodução, mortalidade, dispersão, relações e fontes. Candidatos iniciais, não inventário validado: castanheira, palmeiras regionais, samambaias, mandioca, banana, cutia, paca, anta, aves frugívoras, abelhas, peixes e predadores locais. Animais domésticos e cultivos não nativos devidamente distinguidos. Sem introdução arbitrária de fauna de outros biomas.
- Cadeia piloto: fruto/semente -> consumo e dispersão -> germinação condicionada a luz, água e solo -> alimento e abrigo -> reprodução. Cheias deslocam fauna, alteram pesca, acesso e produção. Predadores dependem de presas e território; não impor populações estáveis artificialmente. Migração externa contabilizada como fluxo; sem reposição mágica.

## Arquitetura de detalhe adaptativo
Uma fonte de verdade independente da câmera e do render. IDs persistentes para animais relevantes, NPCs e plantas interativas; reservas de indivíduos distantes/coortes contabilizadas sem duplicar estoques. Chunks iniciais de 32x32 células, parâmetro ajustável; índice espacial para consultas. Não gerar um Node por planta ou célula. Usar atlas autorais, batching, culling, cache de caminhos, atualizações de navegação somente em regiões alteradas. Godot Compatibility inicialmente, comparar Mobile no hardware alvo; HTML Canvas antes do port. IA local determinística por estados/utilidade, sem API de IA externa obrigatória.

| Nível | Frequência inicial proposta | O que processa |
|---|---|---|
| Render/input | 60 Hz alvo | câmera, movimento, animação e feedback |
| Agentes próximos | decisão 2 a 5 Hz, movimento interpolado | percepção, rota, necessidades, interação |
| Agentes intermediários | a cada 10 a 30 segundos reais, ou evento relevante | destinos, alimentação e eventos, sem animação fora da tela |
| Ecologia distante | tick de 10 min de jogo e agregação diária quando válida | demografia, estoques, água, germinação, migração |

Frequências experimentais, não desempenho comprovado. Eventos urgentes (cheia, bloqueio de rota) invalidam caches e antecipam decisões. Transferências entre chunks são transações de retirada/entrada; registrar migração, morte, consumo e nascimentos. RNG por sistema e estado salvo; resultados próximos/distantes não precisam ser idênticos em trajetórias, mas precisam conservar recursos e cumprir tolerâncias estatísticas definidas por cenário. Processar trabalho pesado em fatias com orçamento; backlog não perde ticks. Qualidade gráfica pode reduzir partículas e sombras, nunca mudar causalidade ou RNG ecológico. Sem progressão obrigatória quando o aplicativo está fechado; enquanto aberto, mundo continua mesmo sem intervenção. Replays e saves versionados.

## Orçamento e gates propostos
- Android: alvo 60 FPS (16,67 ms/frame) no Galaxy S23 e 30 FPS (33,33 ms/frame) em aparelho intermediário de referência ainda a definir, medidos em build real. Meta de 95% dos frames dentro do orçamento após aquecimento, sessão de 30 minutos, incluir cheia, chuva, NPCs e fauna. Registrar p50/p95/p99, memória PSS, temperatura, consumo e travamentos. Não prometer FPS antes de medir. Orçamento CPU de simulação por frame inicialmente 2 ms, ajustável por profiling; tarefas longas fracionadas. Meta inicial PSS <= 600 MB no S23, calibrar por dispositivo.
- Piloto de estresse: 128 agentes ativos, 2.000 indivíduos contabilizados fora da tela, 10.000 células de vegetação/solo; números de teste, não escala final ou capacidade comprovada. Aumentar somente após perfil e testes. Evitar simular cada inseto individualmente; colônias/coortes com biomassa e função ecológica.
- QA: determinismo em replay e save/load, 1 e 10 anos de simulação sem jogador, recursos não negativos, mortalidade e nascimentos contabilizados, troca de chunk sem duplicação, equivalência estatística LOD, chuva/cheia sem atravessar barreiras, recuperação de seca, regressões de sprites/roupa e controles. Android físico é gate obrigatório de desempenho, não substituído por Chromium.

## Próxima missão
1. Fechar ficha de habitats e hidrologia piloto (fontes); desenho do mapa modular de sítio e mata amazônica.
2. Criar roupa de friagem sobre personagem aprovado v0.22, testar alinhamento e troca automática; nada de roupa de neve.
3. Produzir assets originais de solo, folhas, raízes, capim e samambaias; integrar árvore e rio em vertical slice HTML.
4. Provar fluxo ecológico mínimo com planta, dispersor e solo, expandir a fauna depois do gate técnico/artístico.

## Fontes de base
- INPA, áreas alagáveis e pulso de inundação: https://www.gov.br/inpa/pt-br/Pesquisa/projetos/grupo-maua/conheca-mais-sobre-o-grupo-maua/sobre-o-projeto
- ICMBio, conectividade ecológica do Purus: https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/amazonia/lista-de-ucs/rebio-do-abufari/arquivos/reserva-biologica-do-abufari/reserva-biologica-do-abufari-5
- INMET, frentes frias e friagem: https://portal.inmet.gov.br/noticias/o-que-%C3%A9-e-como-se-forma-uma-frente-fria
- Godot, renderizadores: https://docs.godotengine.org/en/stable/tutorials/rendering/renderers.html

Status: decisão de cenário e especificação técnica. Nenhum asset, código de jogo ou benchmark novo nesta etapa. Todos os números são metas iniciais de engenharia.
