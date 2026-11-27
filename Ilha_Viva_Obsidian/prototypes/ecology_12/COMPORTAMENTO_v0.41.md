# v0.41 | Abrigos, território e busca espacial
Continuação direta da v0.40. Madagascar permanece cenário oficial. Protagonista, escala e geometria da v0.34 preservados.

## Implementação
- Índice por célula para busca local de presas e parceiros; mapa por ID para vínculo materno. Atualizado durante movimentos; insetos consumidos deixam de ser candidatos. Ainda há buscas globais em outros caminhos e nenhuma medição de ganho de FPS.
- Repouso em áreas com cobertura vegetal ou serapilheira. Para tenreques, proxy de abrigo seco (não uma toca física); rejeita encharcamento. Torpor sazonal experimental reduz metabolismo e perda hídrica em adultos com reservas, sem gestação nem filhotes dependentes.
- Fossa: preferência por áreas sem adultos do mesmo sexo próximos; fome extrema pode superar a preferência na caça. Não é um território permanente nem uma área de vida calibrada.
- Tenreque: fruto existente como alimento alternativo quando não encontra presa local; uso do tamarindo é hipótese de gameplay, não dieta específica comprovada. Sem criação de recursos.
- Painel apresenta contadores das novas ações. As 15 categorias de fauna continuam as mesmas; nenhum sprite criado nesta missão.

## Referências
- https://animaldiversity.org/accounts/Tenrec_ecaudatus/ (dieta onívora oportunista, toca e torpor).
- https://afrotheria.net/tenrecs/ (diversidade de dietas e ecologia dos tenrecos).
- https://pubmed.ncbi.nlm.nih.gov/21629992/ (alimentação e repouso de lêmures em tamarindeiros).
- https://primate.wisc.edu/primate-info-net/pin-factsheets/pin-factsheet-ring-tailed-lemur/ (dietas e competição por recursos).
Parâmetros numéricos e territórios são aproximações experimentais, não medições reais.

## QA
62 verificações aprovadas: 18 regressões núcleo, 7 tenreque, 25 Chromium móvel, 12 comportamento. Após 30 dias naturais: 51 vertebrados, 2934 eventos de repouso e 1268 consultas locais. Torpor e frutos alternativos confirmados em cenários controlados, não registrados no cenário natural de 30 dias; competição territorial verificada diretamente no avaliador. Após seca 90 dias biomassa adulta de peixe 0,08646; após 30 dias de chuva 0,05036. Ainda há redução. Sem prova de equilíbrio plurianual ou FPS no S23.

## Próximo gate
Sprites autorais individuais de fauna e régua de escala usando protagonista aprovado; continuar correção da recuperação aquática. Meta de longo prazo: 210 espécies, não 210 já implementadas. Evitar produzir fauna sem função ecológica.
