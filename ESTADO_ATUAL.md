# Estado oficial | base histórica v0.47 e transição continental

> **Vigência 27/11/2026 | CP-2026-11-27-01:** região continental fictícia dos EUA, piloto Apalaches, expansão por ecorregiões; Madagascar/Amazônia são históricos. Mundo autônomo e ciência integrada, protagonista preservado. M48-A parcial: célula de solo experimental implementada; novo HTML ainda não existe. Retomar por [[CHECKPOINT_CONTINUIDADE]] e [[AMBIENTACAO_EUA]]. As notas anteriores conflitantes são histórico.




## Base histórica v0.47 (não é o novo cenário)
- Campo 05: 1.120 células, 52 vertebrados iniciais, 15 categorias de fauna; 127 quadros do protagonista preservados; lêmure 10 grupos, 181 posições de sequência, escala adulta .17.
- IA: memória 24 registros, percepção local, acompanhamento materno, transporte dorsal, escalada visual, sol, repouso social. Amamentação simulada sem animação adequada. Anatomia etária por escala provisória. Nado para esquerda corrigido.
- Agricultura: três culturas, estoque limitado, colisão de troncos, genética de marcadores; drenagem, adubação, sementes e construção pendentes.
- Próxima missão histórica (superada): higiene social/alertas, personalidade e aprendizagem; drenagem, sementes, armazenamento e fabricação. Não substituir artes aprovadas. Não afirmar Android físico testado. Equilíbrio plurianual pendente.
- Meta: 210 espécies a longo prazo, ciência documentada, simulação por níveis de detalhe, offline, custo zero. Protagonista original e desenhos do Gemini preservados.
- Cada missão: registrar versão, commit, mudanças, testes realmente executados e falhas, atualizar GDD/ROADMAP/INICIO e gerar HTML jogável. Não migrar motor sem decisão explícita. Evitar microiterações.

## Próximo gate vigente
M48-A: novo piloto de terreno, solo, clima e hidrologia norte-americanos em HTML separado. M48-B/C/D conforme Ilha_Viva_Obsidian/docs/AMBIENTACAO_EUA.md. Não declarar código ou build novo antes de validar.

## Prova técnica inicial do motor continental | 27/11/2026
M48-A parcial, sem alteração do Campo 05. `scientific/us/soil_cell.mjs` implementa uma célula diária isolada com água, neve, degelo, infiltração, escoamento, drenagem, evaporação, estoques de C/N vegetal, detritos, biomassa microbiana e N mineral, decomposição, respiração e crescimento limitado por água/luz/temperatura/N. Coeficientes ilustrativos não calibrados; transpiração explícita, fósforo, pH, grupos microbianos distintos, transporte espacial, terreno visual, fauna, IA, save e interface ainda pendentes. Teste `scientific/us/soil_cell.test.mjs`: 1.095 dias sintéticos, 4.387 verificações de conservação de água/C/N, determinismo, neve/degelo, seca e ausência de luz; aprovadas na execução das mesmas funções em JavaScript nesta sessão. Não foi executado Node CLI, CI, suite antiga, HTML ou Android. Commits c1385aa3bab322dd150939bd12b1e5ecc7bc668e (módulo) e 6422b75fd54700e750ae2249322936140041cb40 (teste). Não declarar a simulação completa ou validada cientificamente. O build v0.47 permanece histórico, não entregar como cenário EUA.

## Retomada obrigatória
Abrir `Ilha_Viva_Obsidian/docs/CHECKPOINT_CONTINUIDADE.md` e verificar HEAD. Snapshot `Ilha_Viva_Obsidian/docs/checkpoints/CP-2026-11-27-01.md`. A entrega atual é documental; VERSION do build preservada.

## Biblioteca de skills | CP-2026-11-27-02
Ler `Ilha_Viva_Obsidian/docs/SKILLS_PROJETO.md` e `.agents/skills/` antes de cada missão. Seis skills iniciais versionadas: pixel art rural, animação biomecânica, pesquisa ecológica, motor científico, IA autônoma e QA/build/continuidade. Atualizar procedimentos com aprendizado comprovado e regressões; criar skills novas quando houver necessidade reutilizável. Não assumir descoberta automática. Preservar pixel art autoral, realismo, escala e protagonista. Nesta revisão, somente documentação/procedimentos; M48-A continua parcial, sem novo HTML, arte ou testes executados.
