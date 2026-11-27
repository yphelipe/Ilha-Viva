# Vestuário de friagem v0.27 — laboratório 14

## Decisão e escopo
O usuário rejeitou a versão 13 e solicitou alterar apenas o vestuário do mesmo sprite, sem redesenhar o corpo ou alterar animações. A edição generativa de referência não foi importada, porque alterava a identidade. O colete de campo verde-oliva sobre a camisa azul original é uma opção experimental para friagem moderada, escolhida para proteger rosto, mãos e proporções. As mangas curtas originais permanecem. Uma jaqueta de manga comprida não está finalizada. A aprovação artística do colete está pendente.

## Implementação
117 variantes de quadros compostas a partir da base aprovada v0.22/lab 12, com máscara da camisa e painel de colete, bordas, zíper e detalhes frontais onde há espaço. Nenhum PNG original substituído. Atlas, escala, pivôs, tempos, código de movimento, controles e regras de temperatura/natação mantidos. A regra usa entrada no frio a 18 °C e saída a 22 °C; valores experimentais. Sem neve ou gelo. A água continua líquida e o vestuário normal/frio retorna após a natação. A máscara foi inferida por cor e forma, portanto a verificação artística de cada pose continua necessária.

## QA
70 verificações do navegador Chromium em viewport móvel aprovadas. 236 verificações estáticas aprovadas (atlas e PNG originais, dimensões/alfa e restrição dos pixels modificados em 117 quadros). Não houve medição de FPS nem execução em Android físico. Não declarar aprovação visual antes da avaliação do usuário.

## Próxima etapa
Aprovar a roupa ou realizar pintura manual das mangas, sem alterar os demais elementos. Só então avançar ao terreno amazônico.
