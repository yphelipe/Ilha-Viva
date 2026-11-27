# Solo de mata | v0.11

## Direção e estado
Primeira prova de solo orgânico inspirada no conceito de sítio na mata v0.9, aceito aproximadamente na v0.10. O campo aberto v0.8 não é padrão artístico. Protagonista e sprites aprovados preservados. Produção de arte própria assistida por geração de imagem; a prancha original foi recortada em 16 amostras de 64 px, compostas em quatro texturas sem grade aparente. A grade lógica de 32 px é independente da composição visual. A resolução é experimental. Árvores, arbustos individuais, rios, copas, colisões naturais e construções ainda não integrados. Não é mapa final.

## Simulação
A trilha inicial tem traçado curvo. Pisoteio ao entrar em célula e tráfego autônomo opcional (agente abstrato) aumentam compactação e reduzem serapilheira e cobertura. Sem tráfego há recuperação gradual; clima modifica umidade, biomassa e decomposição aproximada. Preservados corte, rega, pastoreio abstrato e crescimento. Estados normalizados, não calibração científica, não há hidráulica nem erosão explícita. O mapa interpola estados de solo entre células, mantém a textura original e reage a mudanças. A geometria inicial da trilha permanece como tendência visual; não é um sistema de trilhas emergentes completo.

## QA
10 testes Node da grama preservados e repetidos. 11 verificações no Chromium, viewport móvel 390x844, sem erros JS. Após 30 dias de chuva: compactação média do corredor sem tráfego 0,571, com tráfego 0,996; biomassa 0,838 e 0,592, respectivamente. Mais 3650 dias de simulação com estados finitos e limitados. Regador foi acionado, não foi medida a variação de umidade por esse teste específico. Resultados artificiais e parâmetros a calibrar. Aguardando avaliação artística do usuário e execução no Android. Teste: `src/solo_mata/teste_browser.py`; relatório `src/solo_mata/qa.json`. Scripts usam caminhos do laboratório de desenvolvimento e requerem adaptação se executados fora dele.

## Evidência
[HTML](../builds/Ilha_Viva_Solo_Mata_01.html) | [Captura](../builds/Ilha_Viva_Solo_Mata_01_preview.png) | [Atlas](../assets/terreno/solo_mata/solo_atlas_64.png)

## Fontes
- USDA Forest Service, Forest and rangeland soils of the United States under changing conditions: https://www.fs.usda.gov/rm/pubs_journals/2020/rmrs_2020_pouyat_r001.pdf (pisoteio, compactação, infiltração, erosão).
- Forest-floor litter and deadwood: https://doi.org/10.1002/eco.2493 (retenção de água e dinâmica de umidade).
- Review of litter decomposition: https://doi.org/10.1186/s41610-020-0151-2 (temperatura, umidade e decomposição).

## Próximo gate
Validar textura e escala com o protagonista; depois criar capim alto e vegetação rasteira independentes, e posteriormente árvores em camadas com oclusão. Continuar HTML; nenhum envio ao Claude Code.
