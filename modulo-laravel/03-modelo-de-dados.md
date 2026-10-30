# 03 — Modelo de dados

Convenções: nomes de tabela e campo em inglês (padrão Laravel). Toda tabela de equipe tem `id`, `team_id`, `created_at`, `updated_at` e `deleted_at` (exclusão lógica, RN-03). O filtro por equipe é automático em todos os modelos (RN-01). Arquivos ficam em armazenamento privado (disco local ou compatível com S3, como o MinIO da infraestrutura), nunca em caminho público; o campo guarda o caminho relativo.

Exceção: as tabelas da camada 1 (`motion_catalog_items`, `motion_themes`, `motion_plans`, `motion_flags`) não têm `team_id` e só a Conex Prime as lê por inteiro.

## Camada 1: catálogo, temas, planos e recursos

### motion_catalog_items — efeitos (sincronizados da skill)

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| slug | string único | sim | id do efeito na skill (por exemplo `notify-stack`) |
| name | string | sim | nome (de `move.json`) |
| one_liner | text | sim | uma linha |
| category | enum | sim | `social`, `creator`, `ai`, `dev`, `productivity`, `business`, `data`, `paper`, `system`, `explain` |
| kind | enum | sim | `effect`, `transition`, `sting`, `film` |
| uses | json | sim | `overlay`, `broll`, `transition` |
| formats | json | sim | `9:16`, `16:9`, `1:1`, `4:5` |
| duration | decimal(4,1) | sim | segundos |
| alpha | boolean | sim | tem versão transparente |
| say | text | não | "quando usar" |
| variables | json | sim | variáveis lidas do `index.html` do efeito (`id`, `type`, `label`, `default`) |
| preview_path | string | não | prévia em vídeo ou imagem para a vitrine |
| est_seconds | unsignedSmallInteger | não | tempo de máquina típico, medido (RN-17) |
| enabled | boolean | sim | aparece na vitrine |
| license_cleared | boolean | sim | liberação dos materiais registrada (RN-19) |
| skill_version | string | sim | versão da skill de onde veio |

### motion_themes — temas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| slug | string único | sim | `glass`, `studio` etc. |
| name, one_line, best_for | string | sim | texto da vitrine |
| formats | json | sim | formatos aceitos |
| enabled | boolean | sim | pode ser escolhido em filmes |
| license_cleared | boolean | sim | RN-19 |
| preview_path | string | não | prévia |

### motion_plans — planos

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| name | string | sim | nome do plano |
| render_seconds_month | unsignedInteger | sim | tempo de máquina por mês |
| max_concurrent | unsignedTinyInteger | sim | tarefas simultâneas por equipe |
| max_film_seconds | unsignedTinyInteger | sim | duração máxima de filme |
| max_job_seconds | unsignedSmallInteger | sim | tempo máximo por tarefa (RN-18) |
| draft_threshold_seconds | unsignedSmallInteger | sim | acima disso, rascunho antes do final (RN-20) |
| allowed_formats | json | sim | formatos de saída |
| features | json | sim | recursos permitidos (por exemplo `film`, `alpha`) |
| allowed_networks | json | sim | redes sociais em que o plano permite publicar (RN-26), por exemplo `youtube`, `instagram`, `tiktok` |
| publications_month | unsignedSmallInteger | sim | publicações por mês (RN-26) |

### motion_flags — recursos ligados por equipe

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| team_id | foreignId | sim | equipe |
| key | string | sim | `device_scene`, `theme:<slug>`, `item:<slug>` etc. |
| enabled | boolean | sim | ligado |
| cleared_by | foreignId | não | quem liberou o recurso (RN-19) |
| note | string | não | referência da licença conferida |

Cada equipe tem um plano (`team_motion_settings`: `team_id`, `plan_id`, `approval_policy` com `cliente`, `conex_prime` ou `ambos`, `sector`).

## Camada 2 e 3: equipe

### motion_brands — marcas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| name | string | sim | nome da marca |
| domain | string | não | domínio sem protocolo |
| tagline, headline, handle | string | não | textos da marca |
| colors | json | sim | `ground`, `ink`, `accent`, `accent2`, `surface`, `muted`, `paper` (hex) |
| fonts | json | não | `display` e `body`, cada um com `family` e `files[]` |
| logo_path, mark_path | string | não | arquivos |
| brand_json_path | string | não | o `brand.json` no formato que a skill lê |
| status | enum | sim | `draft`, `approved` |
| authorization_ref | string | não | referência da autorização de uso (RN-15) |
| approved_by / approved_at | foreignId / timestamp | não | aprovação |

### motion_brand_assets — telas, pessoas e números

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| brand_id | foreignId | sim | marca |
| kind | enum | sim | `screen`, `person`, `figure` |
| label | string | sim | nome curto |
| file_path | string | não | arquivo (telas e pessoas) |
| contains_personal_data | boolean | sim | RN-14 |
| personal_data_handled | boolean | sim | coberto ou fictício |
| image_authorization | string | não | autorização de uso de imagem (pessoas) |
| value | string | não | número (para `figure`) |
| source | string | não | fonte do número (RN-08) |
| confirmed_by | foreignId | não | quem confirmou o número |

### motion_clips — pedidos de efeito

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| brand_id | foreignId | sim | marca |
| catalog_item_id | foreignId | sim | efeito |
| aspect | enum | sim | `9:16`, `16:9`, `1:1`, `4:5` |
| background | enum | sim | `scene` (cobertura), `none` (transparente) |
| format | enum | sim | `mp4`, `mov`, `webm`, `gif`, `png-sequence` |
| variables | json | não | variáveis preenchidas |
| key_color | string | não | cor de chave (hex), para editor sem transparência |
| status | enum | sim | `queued`, `rendering`, `done`, `failed`, `review` (revisão humana, RN-09) |
| output_path | string | não | arquivo gerado |
| requested_by | foreignId | sim | quem pediu |

### motion_projects — filmes

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| brand_id | foreignId | sim | marca |
| title | string | sim | título |
| aspect | enum | sim | formato |
| briefing | json | sim | respostas da entrevista (finalidade, duração, tema, momento-assinatura) |
| theme_id | foreignId | sim | tema |
| status | enum | sim | `briefing`, `grid_pending`, `grid_approved`, `scoring`, `scripting`, `critique`, `delivered`, `cancelled`, `review` |
| rounds_used | unsignedTinyInteger | sim | de 0 a 3 (RN-10) |
| requested_by | foreignId | sim | quem pediu |
| work_path | string | não | pasta do projeto no armazenamento privado |

### motion_beat_grids — grades de batidas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| project_id | foreignId | sim | filme |
| payload | json | sim | o `beatgrid.json` completo |
| valid | boolean | sim | passou no validador (RN-07) |
| validation_errors | json | não | lista de erros |
| approvals | json | não | quem aprovou e quando, por camada (RN-06) |
| version | unsignedInteger | sim | sobe a cada alteração |

### motion_render_jobs — tarefas de render

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| subject_type / subject_id | morphs | sim | `MotionClip` ou `MotionProject` |
| kind | enum | sim | `clip`, `score`, `round_draft`, `round_final`, `still` |
| input_hash | string | sim | resumo da entrada (idempotência, RN-18) |
| status | enum | sim | `queued`, `running`, `done`, `failed`, `cancelled`, `timeout` |
| est_seconds | unsignedInteger | não | estimativa antes de enfileirar (RN-17) |
| worker | string | não | máquina que executou |
| started_at / finished_at | timestamp | não | tempos |
| seconds | unsignedInteger | não | tempo de máquina real (alimenta o plano e a capacidade) |
| peak_memory_mb | unsignedInteger | não | memória de pico, para dimensionar o servidor |
| log_path | string | não | log do render |
| error | text | não | mensagem de erro legível |

### motion_critiques — rodadas e notas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| project_id | foreignId | sim | filme |
| round | unsignedTinyInteger | sim | 1 a 3 |
| video_path | string | sim | arquivo da rodada |
| sheet_path | string | não | folhas de quadros (`sheet.png`, `phone.png`, `dense.jpg`) |
| metrics | json | não | o `metrics.json` da skill (volume, pico, trechos parados, deixas de som) |
| scores | json | sim | seis eixos de 1 a 10, cada um com notas e correções |
| mean | decimal(3,1) | sim | média |
| approved | boolean | sim | RN-10 |

### motion_deliveries — entregas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| project_id / clip_id | foreignId | um dos dois | origem |
| critique_id | foreignId | não | rodada usada |
| file_path | string | sim | arquivo final |
| width / height | unsignedSmallInteger | sim | resolução |
| duration_seconds | decimal(6,2) | sim | duração |
| has_audio | boolean | sim | RN-11 |
| pending_axes | json | não | eixos abaixo de 8 se entregue na rodada 3 |
| log_path | string | sim | o `LOG.md` da skill (só a camada 1 acessa, RN-25) |
| preview_path | string | sim | versão de visualização em baixa resolução, com marca d'água, para o reprodutor da plataforma (RN-25) |
| approved_by / approved_at | foreignId / timestamp | não | aprovação para publicar (RN-27) |

O arquivo final (`file_path`) nunca é entregue às camadas 2 e 3: só sai do servidor pela publicação (RN-27) ou por download da camada 1.
### motion_social_accounts — redes sociais conectadas

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| team_id | foreignId | sim | equipe dona da conta |
| network | string | sim | `youtube`, `instagram`, `facebook`, `tiktok`, `linkedin` |
| account_name | string | sim | nome da conta, para mostrar |
| external_id | string | sim | identificador da conta na rede |
| access_token / refresh_token | text (criptografado) | sim | chaves da autorização (RN-26); nunca saem em resposta nem em log |
| scopes | json | sim | permissões concedidas |
| expires_at | timestamp | não | validade da chave |
| status | enum | sim | `connected`, `expired`, `revoked` |
| connected_by | foreignId | sim | quem conectou |

### motion_publications — publicações

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| delivery_id | foreignId | sim | entrega publicada (aprovada, RN-27) |
| social_account_id | foreignId | sim | conta de destino |
| request_key | string | sim | chave única que impede duplicar (RN-27) |
| caption | text | não | legenda escrita pelo cliente (dado, RN-13) |
| scheduled_at | timestamp | não | vazio = publicar agora |
| status | enum | sim | `PublicationStatus` |
| external_post_id / external_url | string | não | onde ficou na rede |
| attempts | unsignedTinyInteger | sim | tentativas feitas |
| error | text | não | motivo da falha |
| requested_by | foreignId | sim | quem pediu |

### motion_deletion_requests — pedidos de exclusão

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| target_type / target_id | morphs | sim | o que se quer apagar |
| requested_by | foreignId | sim | quem pediu |
| reason | text | não | motivo |
| status | enum | sim | `requested`, `authorized`, `refused`, `executed` |
| decided_by / decided_at | foreignId / timestamp | não | decisão da Conex Prime (RN-03) |
| retention_until | date | não | até quando o arquivo é guardado |

### motion_audit_log — registro de tudo

| Campo | Tipo | Obrig. | Descrição |
|---|---|---|---|
| team_id | foreignId | não | equipe (vazio em ações da camada 1) |
| actor_id | foreignId | não | quem |
| action | string | sim | por exemplo `clip.requested`, `delivery.publish_requested`, `delivery.download_blocked`, `deletion.requested` |
| target_type / target_id | morphs | não | alvo |
| result | string | sim | `ok`, `blocked`, `failed` |
| context | json | não | detalhes (sem dado pessoal desnecessário) |
| created_at | timestamp | sim | quando |

Sem `updated_at` nem `deleted_at`: o registro só recebe inclusão (RN-04).

## Enums

`BrandStatus`, `AssetKind`, `Aspect`, `Background`, `OutputFormat`, `ClipStatus`, `ProjectStatus`, `CatalogCategory`, `RenderKind`, `RenderStatus`, `ApprovalPolicy`, `DeletionStatus`, `PublicationStatus`, `SocialNetwork`: um enum de PHP para cada lista acima, com rótulo em português.

## Relações

- `Brand` tem muitos `BrandAsset`, `Clip` e `Project`.
- `Project` tem uma `BeatGrid` atual (e histórico por versão), muitas `Critique` (até 3), muitas `RenderJob` e uma `Delivery`.
- `Clip` tem muitas `RenderJob` e uma `Delivery`, e pertence a um `CatalogItem`.
- `Team` tem muitas `SocialAccount`; `Delivery` tem muitas `Publication`, cada uma numa `SocialAccount`.
- `Team` tem um plano, muitos `Flag` e todo o resto acima.
