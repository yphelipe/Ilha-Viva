# QA Laboratório 06

## v0.15 | 26/11/2026 | Regressão de animação
- Usuário rejeitou laboratório 05: recorte, consistência e realismo. Não promover a arte.
- Restaurar laboratório 03 como referência funcional provisória, sem substituir arquivo original. Manter mestre top-down e corrida 690668.png intactos.
- Laboratório 06 experimental reutiliza o renderizador do 03, recorta células RGBA individuais sem remover fundo por cor, usa escala única por folha e apoio fixo nas ferramentas. 112 quadros/referências, 12 ações, 25 combinações ação/direção testadas no Chromium emulado; nenhum erro JS e posição do machado fixa.
- Caminhada e corrida de referência em quatro direções; novos ciclos de frente separados; ferramentas candidatas apenas frente/costas, pois laterais têm direções inconsistentes. Sono/entrada disponíveis no 03.
- Há avisos de pixels opacos perto de divisórias em algumas folhas (src/lab06/report.json); recorte e realismo biomecânico NÃO aprovados. Não substituir sprites ativos, não migrar Godot ou enviar Claude.
- Próximo gate: corrigir individualmente as animações sem alterar identidade, validar alternância e contato, não apenas reprodução técnica.
- [[QA_LAB06]]
