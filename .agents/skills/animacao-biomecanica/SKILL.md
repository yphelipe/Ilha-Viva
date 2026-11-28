---
name: animacao-biomecanica
description: Criar sprites e animações de humanos e animais com anatomia, movimento, apoio e escala plausíveis.
---

# animacao-biomecanica

Status: procedimento inicial v1; validar e refinar com evidência de cada missão.

1. Identifique espécie, idade, anatomia, marcha e ação; consulte referência verificável de movimento. Use protagonista aprovado como régua.
2. Liste ações necessárias, quatro direções quando aplicável, poses-chave, contatos dos pés e cadência. Respeite alternância contralateral quando apropriada à marcha, distribuição de peso, orientação de ferramenta e contato com alvo.
3. Defina pivô de solo e posição lógica; ação estacionária não desloca entidade; locomoção sincroniza velocidade e ciclo. Em natação, escalada e repouso, ancoragem por estado e suporte anatômico.
4. Produza folha individual por entidade, alfa real, sequência e duração por quadro; não alterar sprites aprovados. Valide transições, continuidade visual, ausência de recortes de membros, deslizamento e espelhamento indevido de assimetrias.
5. Renderize em HTML com inspeção quadro a quadro, direções e ações no cenário. Teste automático valida contratos, não naturalidade. Revisão humana decide promoção.
Saída: folha, manifesto, visualizador/prova, resultados e pendências.

## Requisito aprovado: rigging híbrido 2D
Planejar rigs por família anatômica, hierarquia de ossos, FK/IK, limites articulares, contatos de mãos e pés, pivô de chão e ferramentas. Exportar quadros pixel art sem interpolação borrada; comparar com poses manuais e preservar animações aprovadas. Usar piloto separado e validação visual antes de substituir qualquer sprite. Este procedimento ainda não foi validado nesta sessão; Codex relatou um rig humano não publicado.
