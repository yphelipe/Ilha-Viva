# v0.33 | Teia ecológica terrestre experimental

## Decisão vigente
Ilha oceânica fictícia inspirada em Madagascar, mapa expansível, ecologia causal offline e visualização Android. Protagonista aprovado e roupa de frio pendente; nenhum sprite modificado. Esta entrega amplia a bacia v0.32; não representa o mapa definitivo.

## Matriz de dependências
| Origem | Receptor | Efeito / implementação |
|---|---|---|
| Luz, água, N mineral | plantas | Fotossíntese, respiração, crescimento (núcleo v0.30) |
| Tamarindeiro, folhas e frutos | Lemur catta | Remoção de biomassa e N; assimilação, fezes, sementes no trato digestivo |
| Gramíneas (grupo funcional) | Astrochelys radiata | Pastejo com redução da biomassa, retorno de resíduos |
| Insetos não cupins (proxy) | Furcifer pardalis | Predação com retirada de agente e transferência de C e N |
| Lêmures | Cryptoprocta ferox | Busca, fuga, predação, carcaça e resíduos |
| Fezes de vertebrados | besouros coprófagos | Consumo explícito, transporte de matéria para serapilheira |
| Madeira morta | cupins | Consumo explícito e decomposição |
| Flores e néctar | abelhas e mariposas | Visitas e polinização; orquídea exige mariposa |
| Sementes de tamarindo ingeridas | banco de propágulos | Deposição posterior em habitat compatível |
| Resíduos, umidade, oxigênio | decompositores microbianos | Mineralização de N; C retorna à atmosfera |
| Chuva e temperatura | todos | Modificam recursos, stress, hidratação e atividade |

## Evidência científica e decisões de modelagem
- Duke Lemur Center, Lemur catta: dieta variada, reprodução sazonal, gestação ~135 dias. https://lemur.duke.edu/discover/meet-the-lemurs/ring-tailed-lemur/
- Tamarindo e dispersão por lêmures: https://pubmed.ncbi.nlm.nih.gov/21629992/ . A presença de sementes viáveis nas fezes é documentada; proporção de sementes no protótipo não é medida real.
- MNHN, fossa: predador de lêmures e pequenos vertebrados. https://www.mnhn.fr/en/the-fossa
- MNHN, camaleão-pantera: insetivoria; florestas e planícies costeiras. https://www.mnhn.fr/en/the-panther-chameleon
- Smithsonian, tartaruga-radiada: pastejo, frutas e suculentas, habitat seco. https://nationalzoo.si.edu/animals/radiated-tortoise
- Evidência de relações coprófago-lêmure por metabarcoding: https://pmc.ncbi.nlm.nih.gov/articles/PMC11342379/ . Não implica que qualquer besouro coma fezes de qualquer espécie; grupo funcional temporário.
- Na v0.33, tamarindeiro e gramíneas são novas categorias vegetais. Frutos maduros iniciais são transferidos das reservas vegetais, não criados durante a simulação. Gramíneas têm polinização pelo vento. Fossa caça apenas lêmure no modelo; outras presas ainda ausentes. A alimentação real é mais diversa que o conjunto atual. Os quatro grupos animais têm necessidades, sexo, maturidade, reprodução simplificada e limites experimentais. Ovos de répteis ainda são representados por atraso reprodutivo, não entidades físicas. Hidratação de alimento é índice, não balanço hídrico corporal. A água bebida é retirada do ambiente e contabilizada como saída. Clima não calibrado regionalmente. Nectar de fundo e proteína de pólen ainda são aproximações herdadas. Sementes/frutos são unidades abstratas de C e N. Não confundir balanço numérico com validação científica.

## QA e resultados
10 testes Node (inclui três anos-modelo independentes de 365 dias, conservação e serialização) e 11 verificações Chromium em viewport móvel, com armazenamento simulado. Resultados integrais no JSON. Clima natural, seed 42: 12 lêmures, 12 camaleões, 13 tartarugas, 2 fossas, 49 besouros. Sem vertebrados: 0 besouros. Sem fossa: 23 lêmures. 14 deposições de sementes; 108 insetos e 10 lêmures predados; 9 nascimentos de vertebrados. 8 categorias vegetais presentes ao final. Não é garantia de equilíbrio plurianual ou em outras sementes. Predação, reprodução, polinização e dieta precisam de calibração por espécie. Sem benchmark físico Android, arte diagnóstica.

## Próximos gates
1. Matriz quantitativa de dietas, ciclo de vida e fontes por espécie; ampliar recursos de cada consumidor, reduzir dependências de proxies.
2. Simulações multianuais com várias sementes, eventos climáticos regionais, capacidade de suporte, água superficial e corredores; testar extinções e recuperação sem respawn arbitrário.
3. Modelar estágios ovíparos, fauna aquática, microrganismos funcionais, P, ciclagem de carbono e nitrogênio mais realista; acrescentar predadores e presas regionais.
4. Sprites autorais individuais e comportamentos visíveis, com aprovação visual. Otimizar busca espacial; medir Android físico antes da expansão da ilha. Não migrar para Godot nem enviar ao Claude sem autorização.
