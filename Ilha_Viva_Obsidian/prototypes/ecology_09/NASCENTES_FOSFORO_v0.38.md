# v0.38 | Nascentes e fertilidade

## Escopo e decisões
Continuação do laboratório v0.37. Ilha oceânica fictícia inspirada em Madagascar. Escala, geometria orgânica e perspectiva top-down oblíqua de v0.34 obrigatórias. Nenhuma arte do protagonista ou animação alterada. HTML offline antes de Godot. A fauna permanece diagnóstica.

## Implementação
- P terrestre: fração orgânica aproximada por razão fixa P:N de 0,15 sobre N orgânico (plantas, sementes, animais, resíduos); estoques independentes de P disponível, mineral de rocha, adsorvido e microbiano. Absorção no crescimento, frutos, esporos e proxy de proteína dos polinizadores; mineralização da serapilheira; exportação de P orgânico com insetos e detritos. Intervenções terrestres registram entradas e saídas de P. O modelo não representa estequiometria variável por espécie.
- Associação radicular: índice funcional dependente de fungos, umidade, oxigênio e planta presente, aumenta acesso a P adsorvido. Não é uma associação micorrízica específica comprovada para os táxons cadastrados, nem simulação individual de fungos. Orquídea fica fora desse proxy.
- Nascentes: três aquíferos finitos nos trechos 6, 14 e 22, estoque inicial 220 e capacidade 300 unidades de modelo cada. Descarga até 0,50/passo, recarga descontada da água efetivamente presente no solo úmido. Não há aporte ilimitado. Capacidade, posição e taxas são decisões experimentais, não medidas regionais.
- Camadas HTML: fósforo disponível, fósforo microbiano, associação radicular e nascentes profundas. Salva estados v38 separados das versões anteriores.

## Resultados reproduzíveis (semente 42)
| Cenário | Refúgios | Trechos úmidos | Reserva profunda | Peixe adulto | Zooplâncton |
|---|---:|---:|---:|---:|---:|
| Natural 90 dias | 7 | 27 | 900 | 0,691685 | 0,000903 |
| Seca 90 dias | 2 | 2 | 221,949445 | 0,065180 | 0,037711 |
| +30 dias de chuva persistente | 7 | 28 | 900 | 0,044567 | 0,019523 |

O regime de chuva persistente é um ensaio extremo. As unidades são normalizadas, não kg ou m³. A recuperação hídrica não garante recuperação populacional; peixes ainda perderam biomassa após o retorno da chuva e o zooplâncton ficou próximo de zero no cenário natural. Estabilidade plurianual e equilíbrio da cadeia aquática continuam pendentes. Com reserva profunda desativada, os refúgios se esgotam em seca extrema. Sem estoque, chuva e água no solo, a nascente não cria água.

## QA
Executados: node test_soil.js (6), node test_aquatic.js (10), node test_refuges.js (7, dois cenários ajustados para desativar a nascente nova e preservar o teste original de reserva finita), python browser38.py (24). Total 47 verificações agrupadas. Resultados JSON no pacote. Maior resíduo numérico no cenário natural de 90 dias: 4,22e-10. Testes de navegador Chromium em viewport móvel com localStorage simulado; não equivalem a benchmark Android. Não foi executada a bateria plurianual nesta versão. Build: python build.py.

## Referências consultadas
- Nature Reviews Microbiology, Microbial phosphorus cycling in terrestrial ecosystems: https://www.nature.com/articles/s41579-026-01296-w (mineralização, solubilização, imobilização e micorrizas).
- Estudo de inoculação de fungos micorrízicos e rizóbios em feijão em solo tropical de Madagascar: https://www.sciencedirect.com/science/article/pii/S0031405620300743 (evidência experimental específica para feijão, não para toda flora).
- USGS, Base Flow in Rivers: https://www.usgs.gov/water-science-school/science/base-flow-rivers (água subterrânea mantém vazão na seca).
- USGS, Rivers Contain Groundwater: https://www.usgs.gov/water-science-school/science/rivers-contain-groundwater (trocas com aquíferos).

## Próximo gate
Corrigir colapso de zooplâncton e recuperação de presas após estiagem; permitir recolonização por conectividade e reprodução local sem respawn. Testar diversas sementes e anos, depois introduzir anfíbios e aves com dietas específicas. Não migrar para Godot antes de consolidar os protótipos e validar arte. Meta Android 60 FPS Galaxy S23 ainda não aferida. Roupa de frio permanece pendente.
