# HTML primeiro, Godot depois | v0.2
## Objetivo
Um slice jogável real no navegador, não mockup. Arte original e simulação testadas antes do port. Reutilizar PNG/atlas, áudio, JSON, IDs, schemas, fixtures e testes de contrato; reimplementar TypeScript em GDScript. Nenhuma conversão automática prometida.

## Núcleo web
TypeScript puro sem DOM no core; comandos explícitos, ticks de tempo de jogo, estado serializável, eventos. Canvas 2D renderiza snapshots e interpola movimento; input converte toque/teclado em comandos. UI adaptável e pixel art com nearest-neighbor. IndexedDB e export/import JSON com backup; distribuição estática por HTTPS, cache offline opcional via service worker, não prometer execução via file://. Worker somente após perfil. Vite e ferramentas de teste fixados por lockfile.

## Contrato de paridade
RNG portátil especificado com algoritmo e vetores de referência (não confiar que Math.random e RNG Godot coincidam). IDs ordenados de modo explícito, tempo inteiro, valores físicos/monetários em unidades inteiras ou tolerâncias definidas. JSON schema versionado. Replays: estado inicial + seed + comandos por tick + resultados esperados. Salvar estado RNG, fila, reservas, memórias e flags. Canonicalizar JSON para comparação; evitar depender de ordem de mapas, locale ou timestamp real.

## Gate MG
Após slice M03 aprovado: congelar contratos, registrar baseline web; instalar versão estável Godot e templates compatíveis; implementar core e adaptadores de render/input/storage; importar arte autoral e testar Android. Manter versão web funcional até aprovação. Não expandir sistemas durante port sem teste equivalente. 

| ID | Aceitação |
|---|---|
| PORT-001 | Vetores de RNG, ordenação e ticks iguais nas duas engines. |
| PORT-002 | Replay de 30/365 dias: estados canônicos iguais ou dentro da tolerância definida. |
| PORT-003 | Importar save web em Godot, sem perder inventário, memórias, relações, RNG e narrativa. |
| PORT-004 | Paridade de input, animação, escala visual, colisão e ações; review humano. |
| PORT-005 | APK em Android real instala, inicia, salva e funciona offline; desempenho medido. |

Nenhum teste ou build foi executado nesta revisão documental.


## Paridade de autonomia v0.3
Incluir cenários MA-001 a MA-010 aplicáveis e fixtures sem entidade jogador no contrato de migração. Preservar a ordem de resolução, recursos, histórico, RNG e eventos entre HTML e Godot; não depender de callbacks de renderização.
