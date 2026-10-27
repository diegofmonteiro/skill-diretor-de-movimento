# 03 — Modelo de dados

Convenções: nomes de tabela e campo em inglês (padrão Laravel). Toda tabela tem `id`, `team_id`, `created_at`, `updated_at` e `deleted_at` (exclusão lógica). O filtro por equipe é automático em todos os modelos (RN-01). Arquivos ficam em disco privado, nunca em caminho público; o campo guarda o caminho relativo.

## motion_brands — marcas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| name | string | sim | nome da marca |
| domain | string | não | domínio sem protocolo |
| tagline | string | não | slogan |
| headline | string | não | manchete usada em alguns movimentos |
| handle | string | não | usuário em rede social |
| colors | json | sim | `background`, `ink`, `accent`, `accent2`, `surface`, `muted`, `paper` (hex) |
| fonts | json | não | `title` e `body`, cada um com `family` e `files[]` |
| logo_path | string | não | arquivo do logo |
| symbol_path | string | não | arquivo do símbolo |
| status | enum | sim | `draft`, `approved` |
| approved_by | foreignId | não | quem aprovou |
| approved_at | timestamp | não | quando |

## motion_brand_assets — telas, pessoas e números

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| brand_id | foreignId | sim | marca |
| kind | enum | sim | `screen`, `person`, `figure` |
| label | string | sim | nome curto |
| file_path | string | não | arquivo (telas e pessoas) |
| contains_personal_data | boolean | sim | RN-10 |
| personal_data_handled | boolean | sim | coberto ou fictício |
| value | string | não | número (para `figure`) |
| source | string | não | fonte do número (RN-04) |
| confirmed_by | foreignId | não | quem confirmou o número |

## motion_clips — pedidos de movimento

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| brand_id | foreignId | sim | marca |
| movement_id | string | sim | id do catálogo (por exemplo `contador-inscritos`) |
| aspect | enum | sim | `9:16`, `16:9`, `1:1`, `4:5` |
| background | enum | sim | `scene` (cobertura), `none` (transparente) |
| format | enum | sim | `mp4`, `mov`, `webm`, `gif`, `sequence` |
| variables | json | não | variáveis preenchidas |
| key_color | string | não | cor de chave (hex) |
| status | enum | sim | `queued`, `rendering`, `done`, `failed` |
| output_path | string | não | arquivo gerado |
| requested_by | foreignId | sim | quem pediu |

## motion_projects — filmes

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| brand_id | foreignId | sim | marca |
| title | string | sim | título |
| aspect | enum | sim | formato |
| briefing | json | sim | respostas da entrevista (finalidade, duração, clima, assinatura, fonte dos números) |
| theme | enum | sim | `glass`, `studio`, `editorial` |
| status | enum | sim | `briefing`, `grid_pending`, `grid_approved`, `scoring`, `scripting`, `critique`, `delivered`, `cancelled` |
| rounds_used | unsignedTinyInteger | sim | de 0 a 3 (RN-05) |
| requested_by | foreignId | sim | quem pediu |

## motion_beat_grids — grades de batidas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| project_id | foreignId | sim | filme |
| payload | json | sim | o `grade.json` completo |
| valid | boolean | sim | passou no validador (RN-03) |
| validation_errors | json | não | lista de erros |
| approved_by | foreignId | não | quem aprovou (RN-02) |
| approved_at | timestamp | não | quando |
| version | unsignedInteger | sim | sobe a cada alteração |

## motion_render_jobs — tarefas de render

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| subject_type / subject_id | morphs | sim | `MotionClip` ou `MotionProject` |
| kind | enum | sim | `clip`, `score`, `round_draft`, `round_final`, `still` |
| input_hash | string | sim | resumo da entrada (idempotência, RN-11) |
| status | enum | sim | `queued`, `running`, `done`, `failed`, `cancelled`, `timeout` |
| worker | string | não | máquina que executou |
| started_at / finished_at | timestamp | não | tempos |
| seconds | unsignedInteger | não | tempo de máquina |
| log_path | string | não | log do render |
| error | text | não | mensagem de erro legível |

## motion_critiques — rodadas e notas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| project_id | foreignId | sim | filme |
| round | unsignedTinyInteger | sim | 1 a 3 |
| video_path | string | sim | arquivo da rodada |
| sheet_path | string | não | folha de 24 quadros |
| metrics | json | não | loudness, pico, trechos pretos e parados, cortes por segundo |
| scores | json | sim | seis eixos de 1 a 5 |
| average | decimal(3,2) | sim | média |
| approved | boolean | sim | RN-06 |
| note | text | não | o que mais incomodou |

## motion_deliveries — entregas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| project_id / clip_id | foreignId | um dos dois | origem |
| critique_id | foreignId | não | rodada usada |
| file_path | string | sim | arquivo final |
| width / height | unsignedSmallInteger | sim | resolução |
| duration_seconds | decimal(6,2) | sim | duração |
| has_audio | boolean | sim | RN-07 |
| pending_axes | json | não | eixos abaixo de 4 se entregue na rodada 3 |
| log_path | string | sim | o `LOG.md` da skill |

## Enums

`BrandStatus`, `AssetKind`, `Aspect`, `Background`, `OutputFormat`, `ClipStatus`, `ProjectStatus`, `Theme`, `RenderKind`, `RenderStatus`: um enum de PHP para cada lista acima, com rótulo em português.

## Relações

- `Brand` tem muitos `BrandAsset`, `Clip` e `Project`.
- `Project` tem uma `BeatGrid` atual (e histórico por versão), muitas `Critique` (até 3), muitas `RenderJob` e uma `Delivery`.
- `Clip` tem muitas `RenderJob` e uma `Delivery`.
