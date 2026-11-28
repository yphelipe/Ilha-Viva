# Vale dos Apalaches — clima e cobertura vegetal

**Recorte do CP-06.** O perfil `blue-ridge-asheville-1991-2020` usa Asheville Regional Airport (Carolina do Norte, 35,4319° N, 82,5375° O, altitude 645,3 m) como referência de um vale fictício. A estação oferece 30 anos de dados para os doze valores mensais de temperatura e precipitação. O mesmo tempo atmosférico cobre a malha e a temperatura local recebe um gradiente experimental de −0,0065 °C por metro em relação ao aeroporto. Não há resolução de microclimas de encosta.

## Dados e unidades

No arquivo original da estação, o motor usa `MLY-TAVG-NORMAL` (°F), `MLY-PRCP-NORMAL` (polegadas/mês) e `MLY-PRCP-AVGNDS-GE001HI` (dias/mês com pelo menos 0,01 polegada). As conversões são (°F − 32) × 5/9 e polegadas × 25,4. Exemplo de janeiro: 38,7 °F, 4,13 polegadas e 10,5 dias, ou 3,72 °C e 104,90 mm. A fonte primária foi recuperada em 27/11/2026, SHA-256 do CSV integral `0041c0bdd253456848e98a66285f4aabb8d1a826d5ebd4cd2937ff1f4b310998`. As séries numéricas estão embutidas em `scientific/us/world.mjs` para uso offline. [NOAA NCEI, CSV da estação](https://www.ncei.noaa.gov/data/normals-monthly/1991-2020/access/USW00003812.csv)

O gerador diário sorteia chuva com probabilidade igual aos dias úmidos normais divididos pelos dias do mês. A média condicional de precipitação corresponde ao total mensal dividido pelos dias úmidos. Um hash da seed e do dia modula os pulsos (0,3 a 1,7 vezes a média) e uma anomalia térmica sintética de ±7 °C. Expectativas mensais são preservadas em muitas repetições. O passo mensal da temperatura de referência, a independência temporal dos pulsos e a falta de extremos calibrados limitam as inferências sobre tempestades, estiagens e congelamento. O calendário jogável repete 365 dias.

O fotoperíodo geométrico usa latitude, dia ordinal, declinação solar e ângulo horário do pôr do sol. A duração dividida por 24 alimenta o índice de luz do solo. Comprimento do dia, radiação incidente em MJ/m² e energia química armazenada são grandezas distintas. O piloto implementa apenas a primeira e seu índice adimensional. [FAO Irrigation and Drainage Paper 56, capítulo 3, equações 21, 25 e 34](https://www.fao.org/4/X0490E/x0490e07.htm)

## Acoplamento diário

| Componente | Implementação e limite |
| --- | --- |
| Cobertura | Fração de sombra = C vegetal / (C vegetal + 0,12 kg C/m²). Curva experimental de saturação para uma vegetação agregada. |
| Saídas para a atmosfera | Demanda potencial = 0,18 × temperatura positiva × índice de luz, em mm/dia. Solo exposto evapora e a copa transpira de acordo com sua fração. Abaixo de 45 mm no reservatório radicular, a transpiração potencial cai linearmente. Escuridão, congelamento ou reservatório vazio interrompem o fluxo. Coeficientes experimentais. |
| Contrato contábil | `flux.evap` soma `soilEvap` e `transpiration`. Apenas o total entra na equação de fechamento. O reservatório do hortelão integra a água interna. Multiplicar somas de mm por 100 m²/célula e dividir por 1.000 produz m³ no vale. |
| Biota e limites | A água remanescente e a temperatura regulam a atividade microbiana agregada, decomposição, respiração e fixação de carbono vegetal. Reservas C/N e drenagem profunda têm lançamentos explícitos. Textura, micorrizas, P, diferenças entre espécies, capilaridade, radiação absoluta e balanço energético exigem novas fichas/parametrização. |

## Evidência sem jogador

`node tools/diagnose_us.mjs 1825 4801` executa 350.400 células-dia em 1,92 ha. O diagnóstico testa a cada dia os três balanços globais, margens de fronteira e estoques não negativos. A precipitação total simulada de 127.035,45 m³ equivale a cerca de 1.323 mm/ano. A vegetação transpirou 27.507,27 m³ e o solo evaporou 18.473,69 m³. O hortelão irrigou em 49 dias. A perda de 6.738,25 kg C decorreu do saldo entre respiração e fixação; os 72,51 kg de N exportados coincidiram com a lixiviação. Essa trajetória exige calibrar estoques, reposição regional e sazonalidade vegetal antes de avaliar produtividade. [Diagnóstico reproduzível](../../../qa/CP06/diagnostico_5_anos.json)
