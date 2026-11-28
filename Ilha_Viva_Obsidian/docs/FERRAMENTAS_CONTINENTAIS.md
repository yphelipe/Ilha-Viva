# Oficina de arte continental

## Inspeção executada no CP-06

O cliente opcional `tools/inspect_sprite_mcp.py` invoca `inspect_file` via MCP stdio sobre uma cópia temporária. Ele cruza dimensões e contagem de pixels com alfa parcial com uma segunda leitura, feita pelo Pillow, e interrompe se os dois resultados divergirem. O teste usa Node 24.22.3, cliente Python MCP 1.29.0 e Pillow 13.0.0. O checkout de CP-05 continha orientações para usar MCPs, sem configuração de servidor gráfico.

| Entrada | Resultado verificável | Decisão |
| --- | --- | --- |
| Primeiro quadro de marcha de frente, id `158d1b4de1e3b6361b` | 41 × 80 px, 2.442 pixels com alfa intermediário. [Relatório](../../qa/CP06/pixel_mcp.json) | O editor indexado só preserva transparência binária. Manter o PNG RGBA original e os pivôs do manifesto. |
| Atlas candidato de arquitetura e vegetação do campo | As duas leituras conferem em dimensões e alfa. O MCP descreve cores e estima recortes. [Relatório](../../qa/CP06/paisagem_mcp.json) | Para posicionar e recortar copas e edifícios, usar os retângulos autorais de `src/continental/paisagem.json`. Distâncias entre pixels opacos variam dentro de uma mesma silhueta. |

A revisão MIT do servidor foi compilada com o lockfile original em diretório temporário. O pacote se identifica como 0.2.0 e o handshake como 0.1.0. O primeiro ensaio falhou ao gravar o cache npm da conta. A instalação com cache temporário e scripts de instalação desativados compilou com sucesso. A rede foi necessária para baixar código e dependências. O cliente se comunica pelo processo local. O campo HTML roda independentemente dessas ferramentas. [Revisão auditada](https://github.com/davidkim9/pixel-art-mcp/tree/b99835bb76041c2364933a6ab7724f0c90f44fd0)

## Reproduzir a inspeção

Em uma pasta de ferramentas fora dos assets, com Node ≥20 e os pacotes Python opcionais `mcp` e `Pillow`, executar o preparo uma vez.

```sh
git clone https://github.com/davidkim9/pixel-art-mcp.git pixel-art-mcp
git -C pixel-art-mcp checkout b99835bb76041c2364933a6ab7724f0c90f44fd0
(cd pixel-art-mcp && npm ci --cache "$(mktemp -d)" --ignore-scripts --no-audit --no-fund && npm run build)
```

Na raiz do Ilha Viva, use o caminho absoluto do servidor compilado.

```sh
python tools/inspect_sprite_mcp.py src/continental/paisagem.png /caminho/pixel-art-mcp/dist/index.js
```

O cliente usa somente a operação de leitura. Revisar novamente a licença, as dependências e o escopo das ferramentas se o commit mudar. O servidor também oferece escrita e exportação sobre arquivos de origem.

## Ferramentas da estação remota

| Ferramenta | Aplicação e disponibilidade verificada |
| --- | --- |
| Blender 4.3.2 | Inicialização headless com `--background --factory-startup --disable-autoexec` via CPU. A API local expôs `Armature` e `KinematicConstraint`. Esse ensaio verifica a disponibilidade da API. O laboratório do rig tem validação própria. [Licença](https://www.blender.org/about/license/) |
| Pixelorama | Editor pixel art com timeline, camadas e revisão de quadros. MIT, executável ausente do PATH. Candidato a revisão artística em editor instalado. [Projeto](https://github.com/Orama-Interactive/Pixelorama) |
| Krita | Pintura e animação tradicional por camadas. GPLv3, executável ausente do PATH. [Projeto](https://github.com/KDE/krita) |
| LibreSprite | Editor de pixels e sequência de quadros, GPLv2. Executável ausente do PATH. [Projeto](https://github.com/LibreSprite/LibreSprite) |
| Synfig Studio | Editor esquelético 2D com deformação e animação por cut-out. GPLv3, executável ausente do PATH. O resultado interpolado requer revisão quando o destino é pixel art nativa. [Projeto](https://github.com/synfig/synfig) |

A disponibilidade dos editores foi conferida por `command -v`. Somente o servidor de inspeção e suas dependências foram instalados para esta avaliação, em pasta temporária. O checkout e o build do jogo dispensam instalação global e credenciais novas.
