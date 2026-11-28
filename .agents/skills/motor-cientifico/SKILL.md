---
name: motor-cientifico
description: Implementar simulação multiescala causal de clima, terreno, água, solo, microbiologia, flora e fauna.
---

# motor-cientifico

Status: procedimento inicial v1; validar e refinar com evidência de cada missão.

1. Ler AMBIENTACAO_EUA, GDD, checkpoint e código atual. Auditar unidades, schema e fronteiras. Separar regras genéricas, perfis de região, apresentação e save.
2. Definir estoques e fluxos de água, carbono, N/P quando implementados, biomassa e energia. Energia é dissipada, matéria transferida. Contabilizar entrada, saída, perdas, respiração, detritos e nutrientes; não duplicar recurso. Reservar consumo concorrente.
3. Implementar ticks determinísticos, RNG seeded quando necessário; passos espaciais simultâneos a partir de snapshot, não depender da ordem de varredura. Resolver limites e validação de valores finitos, não negativos; não esconder violações com clamps.
4. Microrganismos por grupos funcionais, indivíduos próximos e coortes distantes; preservar balanços e identidade ao trocar LOD. Calibrar por região e ficha, não transportar valores malgaxes.
5. Testar seca, chuva, congelamento, degelo, ausência de luz, competição, reprodução, equilíbrio plurianual e execução sem jogador conforme escopo. Relatar tolerância, unidade, seed, número real e limitações; testes sintéticos não são validação de campo.
Saída: módulo integrado, testes, dados versionados e feedback visível no HTML.

## Aprendizado verificado CP-2026-11-27-03
Para roteamento espacial, calcular disponibilidades a partir do estado anterior, registrar transferências separadamente e acumular em ordem canônica. Testar a mesma malha com travessia reversa, além de balanços globais com fronteiras explícitas. Evidência: scientific/us/world.test.mjs, commit 3142c0b8; 4.423 verificações em runtime JS. Estados das células coincidiram; ledger de somas pode diferir por arredondamento. Não confundir teste sintético com calibração física.

## Aprendizado verificado CP-07
Para consumo concorrente, agrupar demandas por célula, limitar ao estoque acessível, distribuir proporcionalmente e retirar massa uma única vez. Converter densidades por área antes de combinar com estoques absolutos dos agentes. Respiração, detritos, exportação por colheita e carcaças devem fechar C/N. Testar competição por estoque insuficiente, morte sem alimento, conservação diária e persistência. Evidência: food_world.test.mjs (732b085c), 11.021 verificações no runtime JS. Parâmetros não calibrados; balanço fechado não implica equilíbrio ecológico.

## Aprendizado verificado CP-08
Separar estoques orgânicos ativos/protegidos por transferências, sem alterar massa inicial total. Contabilizar deposição atmosférica como fluxo de fronteira, converter kg/ha para kg/m² e validar balanços acumulados, incluindo exportação por colheita. Comparar cenários com mesmas seeds e estoques totais; para inferência causal, variar um fator de cada vez e explicitar repartição inicial. Evidência: fertility.test.mjs (4af6c504), 14.674 verificações em JS. Balanço numérico não prova equilíbrio nem calibração. Não ajustar coeficientes apenas para ocultar perda.

## Aprendizado verificado CP-09
Usar ensaio fatorial com mesmas condições iniciais totais, seed, duração e intervenções para distinguir fatores combinados; explicitar quando um fator engloba vários processos ou uma condição inicial. Fixação deve registrar entrada de N e custo de C, não gerar fertilidade gratuita. Testar ausência de hospedeiro, seca, frio, escuro e inibição por N. Se o pool vegetal agregado satura e suprime fixação, separar espécies e demanda antes de ajustar taxas. Evidência microbiology.test.mjs e qa/continental_05.json (29.708 verificações em JS); não confundir conservação com calibração.

## Aprendizado CP-10
Separar grupos funcionais com estoques reais C/N e agregados de compatibilidade que não contam em duplicidade. Resolver competição por N a partir de demanda simultânea; fixação condicionada a hospedeiro, custo de C e disponibilidade ambiental, e testar ausência de hospedeiro. Reconciliar os subestoques depois de consumo/colheita e verificar persistência. Referência flora.test.mjs, 17.683 verificações em runtime JS. Nodulação é índice e não população real. Refatorar orquestração duplicada após integração.
