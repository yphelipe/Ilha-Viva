# Ilha Viva v0.42 | Arte em paralelo e recuperação aquática

## Decisão de produção
Separar arte externa (piloto Gemini, sem aprovação automática) de engenharia/ecologia. Protagonista do laboratório 15 preservado. O primeiro animal a testar é Lemur catta. Referências originais, prompt e validador no diretório gemini. Primeiro quatro poses estáticas, depois caminhada; escala e perspectiva v0.34 obrigatórias. Referências zoológicas: Smithsonian, Duke Lemur Center, San Diego Zoo Wildlife Alliance e Wisconsin National Primate Research Center (URLs no prompt). Nenhum sprite Gemini foi recebido nem avaliado.

## Núcleo experimental
Reprodução de peixes com alimento, oxigênio e biomassa adulta conectada suficiente; maturação juvenil mais rápida (parâmetro experimental). A captura adicional de presas é condicionada à água e abundância local. A tentativa de elevar a captura indiscriminadamente e dispersar adultos por gradiente foi rejeitada por agravar as perdas. Mantida a lógica de migração anterior. Todas as transferências usam estoques existentes. Versão de estado 42; saves v41 não são aceitos pela interface. Não é um modelo quantitativo validado de Madagascar.

## Resultados: biomassa adulta normalizada
| Semente | 90 dias de seca | +30 dias chuva | +90 dias chuva |
|---|---:|---:|---:|
| 17 | 0.07589 | 0.05062 | 0.22629 |
| 42 | 0.07555 | 0.05041 | 0.22650 |
| 73 | 0.07532 | 0.05037 | 0.23128 |
| v0.41 (42) | 0.08646 | 0.05036 | 0.06339 |

Os três cenários v42 mostram crescimento de biomassa entre 30 e 90 dias após a seca; sobrevivência ao fim da seca pior que v41 na semente 42. A chuva de recuperação é forçada e contínua, não clima natural. Não comprova equilíbrio plurianual. Biomassa inicial 1,26; recuperação ainda parcial.

## QA
18 verificações de regressão aquática, 12 de comportamento, 7 de recuperação, 25 de interface Chromium e 4 do validador de sprites; logs e dados anexados. Teste adicional de tenreque em tenrec42.log. Teste de não reaparecimento após extinção completa aprovado. Validador foi testado com a referência humana original, não com imagens do Gemini. Android físico, desempenho e arte definitiva ainda pendentes.

## Próximas entregas
Ambiente jogável integrado ao protagonista, terreno e vegetação; ampliar fauna depois de validar a base; equilíbrio plurianual e orçamento de processamento. Sem alterar sprites aprovados, sem reiniciar o projeto. Roupa de frio ainda pendente.
