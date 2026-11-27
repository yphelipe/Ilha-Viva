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
