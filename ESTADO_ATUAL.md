# Estado oficial | base histórica v0.47 e transição continental

> **Decisão vigente 27/11/2026:** ambientação continental rural fictícia dos EUA, piloto nos Apalaches, com outras ecorregiões em expansão. Madagascar e Amazônia são históricos e não ativos. Protagonista aprovado preservado; terreno, fauna, flora e dados científicos serão reconstruídos. Ver [[AMBIENTACAO_EUA]] para requisitos e gates. Checkpoint documental; build v0.47 ainda histórico, motor novo não implementado.


- Campo 05: 1.120 células, 52 vertebrados iniciais, 15 categorias de fauna; 127 quadros do protagonista preservados; lêmure 10 grupos, 181 posições de sequência, escala adulta .17.
- IA: memória 24 registros, percepção local, acompanhamento materno, transporte dorsal, escalada visual, sol, repouso social. Amamentação simulada sem animação adequada. Anatomia etária por escala provisória. Nado para esquerda corrigido.
- Agricultura: três culturas, estoque limitado, colisão de troncos, genética de marcadores; drenagem, adubação, sementes e construção pendentes.
- Próxima missão recomendada: higiene social/alertas, personalidade e aprendizagem; drenagem, sementes, armazenamento e fabricação. Não substituir artes aprovadas. Não afirmar Android físico testado. Equilíbrio plurianual pendente.
- Meta: 210 espécies a longo prazo, ciência documentada, simulação por níveis de detalhe, offline, custo zero. Protagonista original e desenhos do Gemini preservados.
- Cada missão: registrar versão, commit, mudanças, testes realmente executados e falhas, atualizar GDD/ROADMAP/INICIO e gerar HTML jogável. Não migrar motor sem decisão explícita. Evitar microiterações.

## Próximo gate vigente
M48-A: novo piloto de terreno, solo, clima e hidrologia norte-americanos em HTML separado. M48-B/C/D conforme Ilha_Viva_Obsidian/docs/AMBIENTACAO_EUA.md. Não declarar código ou build novo antes de validar.

## Prova técnica inicial do motor continental | 27/11/2026
M48-A parcial, sem alteração do Campo 05. `scientific/us/soil_cell.mjs` implementa uma célula diária isolada com água, neve, degelo, infiltração, escoamento, drenagem, evaporação, estoques de C/N vegetal, detritos, biomassa microbiana e N mineral, decomposição, respiração e crescimento limitado por água/luz/temperatura/N. Coeficientes ilustrativos não calibrados; transpiração explícita, fósforo, pH, grupos microbianos distintos, transporte espacial, terreno visual, fauna, IA, save e interface ainda pendentes. Teste `scientific/us/soil_cell.test.mjs`: 1.095 dias sintéticos, 4.387 verificações de conservação de água/C/N, determinismo, neve/degelo, seca e ausência de luz; aprovadas na execução das mesmas funções em JavaScript nesta sessão. Não foi executado Node CLI, CI, suite antiga, HTML ou Android. Commits c1385aa3bab322dd150939bd12b1e5ecc7bc668e (módulo) e 6422b75fd54700e750ae2249322936140041cb40 (teste). Não declarar a simulação completa ou validada cientificamente. O build v0.47 permanece histórico, não entregar como cenário EUA.
