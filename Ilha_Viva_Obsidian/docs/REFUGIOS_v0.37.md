# Ilha Viva v0.37 | Refúgios, reprodução aquática e subsídios terrestres

## Entrega
Continuação da v0.36, Madagascar fictícia. Laboratório 08 HTML offline, 1.120 células, 28 trechos e 7 poças profundas. Protagonista, sprites e escala/geometria anteriores preservados. Sem migração para Godot.

## Mudanças implementadas
- Hidrologia: cada trecho contém reserva subterrânea finita inicial, contabilizada no total de água, e os sete refúgios têm poças com armazenamento e evaporação. Recarga captura água superficial existente; vazão de base transfere a reserva para a superfície antes do passo terrestre. A distribuição das reservas é uma hipótese de gameplay, não dado medido. Poças isoladas não permitem migração entre trechos secos. Não há criação de água nem reposição automática de animais.
- Peixe de referência: *Pachypanchax sparksorum*, espécie de águas rasas e abrigos marginais/rochosos da bacia do Ankofia/Anjingo. Incubação de aproximadamente 14 dias (56 passos de 6h); na natureza os ovos são depositados em plantas aquáticas e raízes. O modelo usa coortes de ovos, juvenis e adultos como biomassa, com sobrevivência dependente da água e oxigênio, alimentação juvenil e maturação gradual. A janela reprodutiva, taxas de postura e maturação são experimentais; substrato de postura ainda não modelado. Não representa contagem de indivíduos, sexos ou genética.
- Camarões: grupo funcional inspirado em *Caridina* spp., sem atribuição de dieta ou reprodução a uma espécie específica. Competição por detritos e algas limita crescimento; ingestão de invertebrados por peixe foi recalibrada. Estudos regionais registram diversidade de camarões, mas espécie e ciclo de vida ainda precisam de ficha específica.
- Insetos terrestres podem cair na água perto do rio, principalmente durante tempestades. A biomassa e o N do agente real são transferidos à reserva de presas terrestres, sem duplicação. P terrestre ainda não é modelado nesses agentes; a transferência não inventa fósforo. Peixes podem consumir esse recurso.
- Migração de biomassa adulta entre trechos vizinhos com fluxo e qualidade superior, sem teletransporte. Taxas experimentais. As duas novas visualizações mostram refúgios e estágios jovens, e o painel exibe reserva hídrica, postura/eclosão e migração.
- Conservação de C/N/P e água revalidada. Não foi completado o ciclo terrestre de P: absorção vegetal, transferência trófica e fósforo orgânico ainda pendentes. Chave de save v0.37 independente.

## QA executado
- `node test_aquatic.js`: 10 testes do núcleo da v0.36 reexecutados.
- `node test_refuges.js`: 7 testes de reserva finita, incubação, transferência de insetos, migração, isolamento e perdas de ovos. O teste de 90 dias de seca é um cenário de estresse, não previsão.
- `python browser37.py`: 20 verificações Chromium, viewport 412x915, com armazenamento simulado. Sem erros JS. `python build.py` recompõe HTML usando `ui_base.html` e os módulos locais.
- Maior resíduo dos cenários comparados: 8,30e-10 em unidades do modelo.

## Resultados (biomassa do modelo, seed 42, 30 dias)
| Medida | Inicial | Natural | Seca | Tempestade |
|---|---:|---:|---:|---:|
| Peixes adultos | 1,26 | 0,77873 | 0,46140 | 0,73381 |
| Juvenis | 0 | 0,18493 | 0,07769 | 0,15311 |
| Ovos | 0 | 0,13071 | 0,07951 | 0,11770 |
| Larvas | 0,98 | 1,31879 | 0,11797 | 0,91335 |
| Camarões | 0,728 | 0,63046 | 0,07796 | 0,88053 |
| Refúgios com água | 7 | 7 | 7 | 7 |

Na v0.36, seca de 30 dias deixava biomassa adulta de 0,00091; aqui 0,46140. A comparação inclui mudança de hidrologia e taxas tróficas, não isola efeito causal dos refúgios. Na seca extrema de 90 dias, as poças secaram e a biomassa de peixes adultos ficou em 0,00002696: equilíbrio plurianual não comprovado. Sem spawn de reposição. A próxima etapa deve priorizar vazão perene calibrada por microbacias, diferenças de habitat entre peixes e camarões, substrato de postura e recuperação após seca. Benchmark Android físico pendente, arte diagnóstica; não há novos sprites.

## Referências consultadas
- Royal Museum for Central Africa: *P. sparksorum*, distribuição, habitat, dieta, reprodução: https://faunafri.africamuseum.be/cloffa/table/taxon2/view?idtaxon%3Aint=11609
- Loiselle (2006), revisão de *Pachypanchax*: https://www.biotaxa.org/Zootaxa/article/view/zootaxa.1366.1.1
- FishBase: https://fishbase.se/summary/Pachypanchax-sparksorum.html
- Refúgios de seca em sistemas fluviais: https://doi.org/10.1007/s10750-008-9326-z e https://doi.org/10.1111/faf.12860
- Steward et al., interações entre invertebrados terrestres e rios intermitentes: https://doi.org/10.1111/brv.12848
- Revisão da distribuição de *Caridina typus* (inclui Madagascar): https://pmc.ncbi.nlm.nih.gov/articles/PMC13598490/
