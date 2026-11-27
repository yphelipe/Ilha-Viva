# Simulação ecológica | Especificação inicial

> **Vigência v0.29 (26/11/2026):** Madagascar substitui a ambientação amazônica e qualquer perfil climático anterior. A ilha oceânica fictícia terá biomas regionais, mapa gigantesco expansível e simulação científica offline. A especificação [[docs/MADAGASCAR_v0.29]] prevalece sobre trechos históricos conflitantes. Protagonista aprovado preservado; traje de frio pendente (versões rejeitadas não usar). Nenhum código ou arte alterado nesta revisão.


## Modelo e limites
Usar uma ilha fluvial amazônica fictícia, sem neve, com friagem episódica. Fontes científicas sustentam relações qualitativas; valores em dias, unidades e taxas de jogo são abstrações calibradas, jamais apresentados como recomendações agronômicas ou veterinárias. Cada espécie terá ficha com origem, habitat, ciclo, alimentação, comportamento, temperatura, limitações, fonte e nível de evidência. Nenhuma espécie entra em produção sem ficha. Dependência entre sistemas via contratos, sem recursão imediata.

## Estados e ordem de atualização
Tempo/agenda -> meteorologia -> água/solo -> vegetação/cultivos -> habitat/pasto -> animais/polinizadores -> produção/estoques -> economia -> NPCs/eventos. Estado do tick anterior para dependências circulares; efeitos de ações são transações enfileiradas e aplicadas em ordem estável. Feedback visual não altera estado. RNG separado por sistema com seed persistida. Eventos não dependem da câmera.

| Entidade | Campos iniciais |
|---|---|
| Clima | temperatura, umidade, vento, chuva, nebulosidade, radiação proxy, risco de friagem, previsão |
| Solo | água disponível, capacidade, drenagem, matéria orgânica, fertilidade simplificada, compactação, histórico de família cultivada |
| Planta | espécie, fase, progresso térmico, estresses, saúde, polinização quando aplicável, rendimento potencial |
| Pasto | biomassa, altura proxy, taxa de recuperação, cobertura, pressão de pastejo |
| Animal | espécie, idade, sexo, fase reprodutiva, fome, sede, condição, saúde, estresse térmico, confiança, rotina |
| Habitat | cobertura, alimento, refúgio, conectividade, perturbação, abundância por espécie |
| Água | volume, nível, temperatura, qualidade proxy, oxigênio proxy em lagoas |
| Estoque | item, quantidade, lote, idade, qualidade, local, validade opcional |

## Clima e água
Gerar sequência de dias por estados persistentes (seco, nublado, chuvoso, frente fria etc.) condicionados à estação e histórico; transições com probabilidades, não sorteio independente por minuto. Temperatura diária entre mínima/máxima com ciclo suave, nuvens/vento modulam evaporação. Previsão mostra confiança e pode errar; fornecer avisos de risco antes de impactos graves. Friagem depende de frente fria e histórico, não apenas do calendário. Não simular gelo sazonal. Tempestade pode elevar rio, gerar barro e adiar feira.

Balanço conceitual por célula: água_nova = limitar(água + infiltração( chuva + irrigação ) - evapotranspiração - drenagem, 0, capacidade). Excedente vai para escoamento, não desaparece; armazenamento e drenagem são contabilizados. Água retirada do poço/reservatório deve ser debitada. Vegetação, cobertura, relevo e solo influenciam os fluxos. Evapotranspiração depende de clima e fase de cultivo (FAO). Simular por zona quando distante.

## Cultivos
Temperatura e umidade do solo, janela climática, luz e saúde determinam germinação e avanço. Usar função de adequação por espécie, crescimento térmico simplificado e modificadores de água/saúde; aplicar dano progressivo sob estresse prolongado. Água insuficiente ou saturação são prejudiciais em graus diferentes; regar não é obrigatório se a chuva supriu a necessidade. Mudança de estação não mata tudo: culturas resistentes permanecem e sensíveis reagem a eventos reais. Calcular rendimento por fase e estresse acumulado. Plantas perenes têm dormência e retorno sazonal onde apropriado.

| Cultivo candidato | Direção científica | Adaptação de jogo a validar |
|---|---|---|
| Alface | cultura de clima fresco | calor prolongado reduz qualidade e pode antecipar florescimento |
| Tomate | clima quente, sensível à geada | estufa prolonga janela; frutos em colheitas sucessivas |
| Cenoura | germinação depende de temperatura e umidade | compactação reduz qualidade da raiz |
| Abóbora | cultivo sensível à geada, polinização relevante | florada e visita de polinizadores afetam frutificação |
| Feijão | espécie/família específica, fixação biológica condicionada | rotação pode melhorar sistema, nunca fertilidade infinita |
| Trigo | variedade e calendário regional a pesquisar | grãos, palha, armazenamento e moagem |

Incluir rotação por famílias e risco de doença de solo; compostagem tem tempo, insumos e maturidade, não converter esterco cru instantaneamente em fertilizante seguro. Pragas e doenças por condições e histórico, prevenção e controle não determinísticos. Polinização afeta culturas dependentes em vez de todos os vegetais. Valores por espécie pendentes de pesquisa detalhada (RHS, extensão universitária, FAO).

## Pecuária e bem-estar
Animais não são máquinas de produção. IA de utilidade com prioridades: emergência/segurança > sede > alimentação > conforto > descanso > interação/exploração. Rotina circadiana, sociabilidade, preferências individuais, cooldown e variabilidade. Reservar recursos para evitar disputa entre agentes; verificar alcance do bebedouro e comedouro. Comer/drink consome estoque real; alimento incorreto não satisfaz. Sem coleta instantânea a qualquer hora.

| Espécie | Dieta e necessidades (resumo) | Comportamento / retorno |
|---|---|---|
| Galinha | ração equilibrada por fase, água, fonte de cálcio e grit quando aplicável; forrageio não substitui dieta | ciscar, bicar, banho de poeira, poleiro, ninho; ovos dependem de maturidade, luz e condição; não exige galo para ovos inférteis |
| Vaca | volumoso/pasto/feno e suplementação adequada, água, sombra, conforto | pastejo, ruminação, descanso; lactação após parto, períodos secos; estresse térmico reduz desempenho |
| Ovelha | volumoso/pasto, água e minerais próprios da espécie | rebanho, pastejo, descanso, lã em raças apropriadas |
| Cabra | forrageio seletivo, arbustos e volumoso, dieta adequada | exploração, busca de folhas, sociabilidade; leite após parto |
| Porco | onívoro com dieta balanceada, água, sombra e área de conforto | fuçar, explorar, buscar resfriamento; não alimentar com lixo arbitrário |
| Pato | ração adequada, água para beber e limpar bico, abrigo | nadar quando seguro, forragear, limpar penas; ovos conforme condição |
| Cavalo | forragem, água e manejo apropriado | locomoção, repouso, pastejo; montaria futura |
| Cão/gato | alimento adequado à espécie, água e abrigo | vínculo, brincadeira, companhia e comportamento próprio |

Somente galinha é candidata ao primeiro slice. As demais exigem fichas específicas antes da implementação, inclusive maturidade, reprodução, lactação, espécies/raças, doenças, alimentação, frio/calor e comportamento. Doença e negligência apresentam alertas e recuperação; evitar sofrimento gráfico e punição precoce irreversível. Morte/velhice como opção de design a testar, não estabelecida. Saúde veterinária fictícia, não prescrição real.

## Fauna, floresta e pesca
Representar população por habitat e espécie, com limite de capacidade, reprodução sazonal e migração plausível. Animais visíveis são amostras dessa população; capturar ou remover altera estoque quando relevante. Polinizadores precisam de flores e abrigo; pesticidas (se incluídos), perda de habitat e clima desfavorável podem reduzir atividade. Árvores recuperam biomassa lentamente; margens vegetadas reduzem escoamento em modelo simplificado. Predadores e presas com relações pesquisadas; sem gerar uma espécie apenas para uma função decorativa contraditória.

Peixes dependem de temperatura, qualidade, oxigênio e estoque local; água mais quente pode comportar menos oxigênio dissolvido; excesso de matéria orgânica pode aumentar consumo de oxigênio. Usar espécies compatíveis com a região, não tabela universal. Pesca excessiva reduz disponibilidade, com regeneração gradual e limites. Não simular cada peixe fora da cena.

## Cadeias causais obrigatórias para validar
1. Chuva suficiente -> umidade adequada -> irrigação manual dispensável -> crescimento; excesso -> saturação/drenagem.
2. Seca -> água/pasto reduzidos -> custo de alimento maior -> produção afetada se não houver manejo.
3. Calor -> maior demanda hídrica e risco térmico -> sombra/água mitigam -> produtividade responde com atraso.
4. Pasto consumido -> biomassa reduzida -> rotação e repouso permitem recuperação -> estoque de feno como alternativa.
5. Flores e habitat -> atividade de polinizadores -> maior frutificação em plantas dependentes -> colheita.
6. Esterco -> compostagem madura -> fertilidade; excesso ou escoamento -> qualidade hídrica reduzida -> impacto aquático.
7. Safra baixa -> oferta regional menor -> preço pode subir dentro de limites -> NPCs adaptam compras/receitas.
8. Tempestade -> caminho afetado -> agenda de NPC recalculada -> entrega remarcada -> conversa contextual.

## Informação ao jogador
Exibir estado em faixas, diário com histórico e causas prováveis, sinais visuais (folhas murchas, poças, animal buscando sombra), soluções factíveis e tendência. Não esconder regra essencial nem atribuir culpa ao jogador por clima imprevisível. Modos relaxado/normal ajustam tolerâncias, não desligam coerência. Testar se cinco jogadores conseguem explicar três cadeias sem ler fórmulas.


## Autonomia v0.3
A simulação ambiental avança pelo relógio global, independentemente de inputs e chunks renderizados. Vincular agentes, produtores e consumidores com fluxos verificáveis de recursos; eventos ecológicos não dependem de gatilhos de proximidade. Aplicar contratos e gates de MUNDO_AUTONOMO.md.


## Extensões insulares
Água doce fluvial; diferenciar águas brancas, claras ou pretas conforme habitat validado. Transporte fluvial e estoques externos têm capacidade e custos; interrupções geram recuperação. Não confundir ausência do jogador com fechamento do aplicativo.

## Campo experimental
[[GRAMA_VIVA]] especifica modelo diário determinístico de biomassa, umidade, reservas e pastoreio.


## Checkpoint v0.11 | Solo de mata
Nova prancha original e laboratório HTML de trilhas curvas, compactação, serapilheira e cobertura vegetal. 10 testes anteriores e 11 verificações Chromium aprovadas. Direção artística e escala ainda pendentes de aprovação; árvores e vegetação alta não integradas. Ver [[SOLO_MATA]].


## v0.25 | Cenário oficial (26/11/2026)
Ilha fluvial amazônica fictícia aprovada pelo usuário; sem neve, friagem episódica, diversidade regional e simulação causal com desempenho Android. Purus/Juruá são referência técnica proposta; localização exata, mapa e limites populacionais permanecem em estudo. A decisão substitui o perfil marítimo temperado e as opções anteriores. Protagonista v0.22 preservado; roupa leve de frio automática pendente. HTML primeiro; sem migração ou envio ao Claude nesta etapa. Ver [[ILHA_AMAZONICA_v0.25]] para arquitetura, metas, testes e próxima missão. Nenhum código ou arte alterado.
