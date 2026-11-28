---
name: pixel-art-rural
description: Produzir e revisar pixel art autoral de cenário rural, arquitetura, flora, fauna e objetos, coerente com o protagonista aprovado.
---

# pixel-art-rural

Status: procedimento inicial v1; validar e refinar com evidência de cada missão.

1. Leia ARTE, PROTAGONISTA, QA_SPRITES e AMBIENTACAO_EUA; localize atlas real e compare em escala de runtime. Nunca redesenhe protagonista sem autorização.
2. Pesquise fotografias e anatomia/arquitetura regionais como referência, sem copiar assets. Escolha silhueta, proporções métricas relativas, paleta, direção de luz e material. Pixel art desenhada, volumes claros, clusters de pixels intencionais, sem ruído fotográfico, plástico, contorno inconsistente ou visual genérico.
3. Use perspectiva top-down oblíqua fixa, bases no chão, altura projetada distinta da pegada, oclusão por profundidade, caminhos orgânicos e transições naturais. Não confunda grade lógica com geometria visível.
4. Produza PNG com transparência real quando necessário, resolução nativa consistente, atlas e manifesto com dimensões, pivôs, origem, hash e status. Evite reescalar com filtro borrado; nearest-neighbor na exibição apropriada.
5. Compare lado a lado com protagonista, terreno, árvores, portas e animais; verificar silhueta no tamanho real em tela móvel, luz, colisão e profundidade. Arte gerada ou desenhada é candidata até inspeção visual humana. Se rejeitada, registrar motivo e preservar versão aprovada.
Saída: asset original, fonte editável quando disponível, manifesto, prova visual em HTML e resultado de aprovação. Não afirmar qualidade artística com teste automático.

## Adendo obrigatório: MCP artístico e inteligência auxiliar de desenvolvimento
Usar MCPs e ferramentas gratuitas disponíveis quando houver ganho demonstrável em desenho pixel art autoral, pesquisa visual, anatomia, animação, paleta, perspectiva, escala, atlas, alfa, pivôs, oclusão, costuras e QA visual. Verificar compatibilidade, licenças, custo e permissões; não instalar serviços pagos nem pedir segredos. Produzir elementos úteis em lotes sem sacrificar acabamento; preservar protagonista aprovado. Revisar no tamanho de jogo e registrar evidência visual. A IA de mundo aprende localmente no save por experiências e memória limitada; agentes adaptam decisões, sem alterar leis naturais ou agência do jogador. Separadamente, desenvolver ferramentas de diagnóstico da simulação, análise de eventos causais, detecção de desequilíbrios, relatórios e sugestões de melhorias para Codex e skills. Nenhuma alteração autônoma irrestrita de código ou regras científicas; propostas passam por validação, testes e versionamento. Não confundir aprendizado persistente com treinamento global do modelo. Priorizar primeiro um comportamento adaptativo demonstrável e um diagnóstico reproduzível. Atualizar skills com resultados reais e economia observada.

## Inspeção de PNG por leitura independente

No CP-06 o cruzamento entre `inspect_file` do servidor MCP local e Pillow detectou 2.442 pixels semitransparentes em um único quadro aprovado do protagonista. Para decidir se um PNG admite reexportação com paleta indexada, executar `tools/inspect_sprite_mcp.py` sobre uma cópia. Conferir o hash, as dimensões, as contagens de alfa e a paleta. Preservar o original RGBA quando a conversão reduz a cobertura. Usar o manifesto da arte para pivôs e recortes. O verificador informa propriedades de pixels. Aprovação de silhueta, movimento e perspectiva continua visual.

Procedimento, revisão fixada, instalação temporária e evidências em [Ferramentas continentais](../../../Ilha_Viva_Obsidian/docs/FERRAMENTAS_CONTINENTAIS.md). Localizar o commit de introdução com `git log -1 --diff-filter=A --format=%H -- tools/inspect_sprite_mcp.py`.

## Aprendizado CP-13: curadoria de prancha gerada externamente
Preferir PNG original transparente; screenshots JPEG introduzem contaminação de chroma key, reamostragem e sobreposição de UI. Quando só houver captura, selecionar objetos completos e tratar recorte como candidato, não arte final. Não eliminar verdes legítimos; ajustar alfa e spill com inspeção visual. Conservar atlas anterior e oferecer comparação no render real, preservar pivôs e proporções; estação não deve trocar identidade da árvore. Registrar a origem e os bloqueios de sincronização. Não declarar sprites decorativos como indivíduos simulados.

## Aprendizado CP-14
Usar imagem integral enviada em vez de screenshot. Recortar na resolução fonte, conservar proporções, determinar escala pela altura do protagonista e elementos arquitetônicos, alinhar base e colisão à geometria projetada. Redimensionar uma vez na escala lógica e testar zoom inteiro. Preservar identidade sazonal e distinguir decoração de simulação. Registrar limitações de perspectiva, compressão e QA visual. Não promover arte candidata sem revisão.
