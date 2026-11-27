# Ilha Viva v0.39 | Recolonização e fauna ribeirinha

Base: v0.38. Ilha oceânica fictícia inspirada em Madagascar. Protagonista, artes aprovadas, escala relativa, top-down oblíquo e geometria orgânica preservados. Nenhuma arte nova.

## Implementação
- Banco finito de ovos dormentes de zooplâncton: débito dos adultos, eclosão condicionada a água e oxigenação, mortalidade residual. Representa grupos capazes de diapausa, não todos os táxons.
- Camarões funcionais: estoque de ovos debitado dos adultos, incubação experimental de 21 dias; mortalidade por seca e hipóxia. Não pressupõe ovos resistentes à dessecação de Caridina.
- Recolonização adjacente bidirecional por gradiente de biomassa (plâncton, larvas, camarões, juvenis), apenas com conexão hídrica. Aproximação de dispersão, não comportamento individual.
- Rã-tomate: adultos ripários, consumo noturno de insetos terrestres existentes, postura em poças após chuva, incubação aproximada de dois dias, girinos filtradores representados por consumo de algas e metamorfose por taxa média. Sem idade individual ou maturação sexual explícita. Habitat experimental por poça, não mapa real de distribuição.
- Martim-pescador-malgaxe: estoque regional de adultos, consumo diurno de peixes, respiração e retorno de resíduos. Reprodução, nidificação, voo e território individuais pendentes.
- Novos estoques incluídos na contabilidade C/N/P. Saldo de água, carbono, nitrogênio e fósforo verificado por passo; P terrestre continua representado parcialmente por proporção de N, não modelo elementar completo.
- Interface: camada fauna ribeirinha, indicadores de ovos, girinos, adultos, dispersão e alimentação. Save v39 separado; migração de save antigo não implementada.

## Referências consultadas
- Diapausa: https://academic.oup.com/plankt/article/44/2/273/6533513 (copepoda, mecanismo geral, não estudo específico de Madagascar).
- Rã-tomate: https://animaldiversity.org/accounts/Dyscophus_antongilii/ ; https://oaj.fupress.net/index.php/ah/article/view/1668 ; https://dwazoo.com/animal/tomato-frog/ ; https://www.wildlifemadagascar.org/animals/madagascar-tomato-frog/
- Martim-pescador: https://www.nathab.com/know-before-you-go/african-safaris/madagascar/wildlife-guide/birds/malagasy-kingfisher ; https://itis.gov/servlet/SingleRpt/SingleRpt?search_topic=TSN&search_value=1174528

## QA
14 verificações do núcleo e 25 verificações Chromium (viewport móvel, armazenamento simulado). 616 passos de simulação ao todo nos novos testes. Resultados detalhados em results39.json e browser39-results.json. A população de peixes caiu de 0,03920 para 0,02246 após retorno da chuva; não declarar equilíbrio. Zooplâncton 0,03267 para 0,29299; camarões 0,01032 para 0,03724. Captura de insetos por rãs ocorreu no cenário de seca, mas não no natural de 30 dias. Necessidade de calibrar dieta, condições de captura, reprodução de aves e distribuição. Android físico e equilíbrio plurianual pendentes.

## Próxima etapa
Melhorar disponibilidade de presas e condições de refúgio; testar remoção de predadores, secas e recuperação em sementes múltiplas; ampliar espécies e individualização só após critérios funcionais. Sprites autorais por espécie, escala relativa e projeção coerente antes de incorporar ao cenário.
