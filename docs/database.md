# Database

The Site Operations Dashboard stores its data in PostgreSQL. Three normalized tables hold the business data: `users`, `sites` and `installations`. Four more hold the assets: `equipment`, `service_records`, `spare_parts` and `part_requests`. `activity_log` keeps the history of every change, and `idempotency_keys` supports the API. Neither of those two has relationships.

## Entity relationship diagram

```mermaid
erDiagram
    SITES ||--o{ INSTALLATIONS : "has"
    USERS |o--o{ INSTALLATIONS : "is assigned"
    SITES |o--o{ EQUIPMENT : "holds"
    EQUIPMENT ||--o{ SERVICE_RECORDS : "is checked in"
    USERS |o--o{ SERVICE_RECORDS : "does"
    SPARE_PARTS ||--o{ PART_REQUESTS : "is asked for in"
    EQUIPMENT |o--o{ PART_REQUESTS : "needs"
    USERS |o--o{ PART_REQUESTS : "asks"

    SITES {
        serial id PK
        varchar name UK "NOT NULL, max 150"
        varchar city "NOT NULL, max 100"
        varchar region "North | South | East | West"
        varchar status "active | inactive, default active"
        timestamptz created_at "default NOW()"
        timestamptz updated_at "set by trigger on update"
    }

    INSTALLATIONS {
        serial id PK
        integer site_id FK "NOT NULL, sites.id, ON DELETE CASCADE"
        integer technician_id FK "NULL, users.id, ON DELETE SET NULL"
        varchar equipment "NOT NULL, max 150"
        varchar status "pending | in_progress | completed, default pending"
        date installed_on "NOT NULL"
        timestamptz created_at "default NOW()"
        timestamptz updated_at "set by trigger on update"
    }

    USERS {
        serial id PK
        varchar full_name "NOT NULL, max 100"
        varchar email UK "NOT NULL, max 150"
        varchar phone "NULL, max 20"
        varchar role "admin | technician, default technician"
        timestamptz created_at "default NOW()"
    }

    IDEMPOTENCY_KEYS {
        uuid key PK
        char request_hash "NOT NULL, SHA-256"
        smallint status_code "NULL while processing"
        jsonb response_body "stored response"
        timestamptz created_at "default NOW(), expires after 24 hours"
    }

    EQUIPMENT {
        serial id PK
        varchar serial UK "NOT NULL, max 40"
        varchar type "blade_yoke | tower_gripper | tagline_system | mobile_robot"
        varchar status "deployed | in_service | in_stock, default in_stock"
        integer site_id FK "NULL, sites.id, ON DELETE SET NULL"
        date next_service_on "NOT NULL"
        timestamptz created_at "default NOW()"
        timestamptz updated_at "set by trigger on update"
    }

    SERVICE_RECORDS {
        serial id PK
        integer equipment_id FK "NOT NULL, equipment.id, ON DELETE RESTRICT"
        integer technician_id FK "NULL, users.id, ON DELETE SET NULL"
        date done_on "NOT NULL"
        varchar notes "NULL, max 500"
        timestamptz created_at "default NOW()"
    }

    SPARE_PARTS {
        serial id PK
        varchar name UK "NOT NULL, max 120"
        integer stock "0 or more, default 0"
        integer reorder_at "0 or more, default 0"
        integer capacity "more than 0"
        timestamptz created_at "default NOW()"
        timestamptz updated_at "set by trigger on update"
    }

    PART_REQUESTS {
        serial id PK
        integer part_id FK "NOT NULL, spare_parts.id, ON DELETE RESTRICT"
        integer equipment_id FK "NULL, equipment.id, ON DELETE SET NULL"
        integer requested_by FK "NULL, users.id, ON DELETE SET NULL"
        integer quantity "more than 0"
        varchar status "requested | ordered | delivered, default requested"
        date requested_on "default CURRENT_DATE"
        timestamptz created_at "default NOW()"
        timestamptz updated_at "set by trigger on update"
    }

    ACTIVITY_LOG {
        bigserial id PK
        varchar kind "installation | service | part | site | user"
        timestamptz occurred_at "default NOW()"
        varchar actor_name "NULL, max 100"
        varchar verb "NOT NULL, max 100"
        varchar target_label "NOT NULL, max 200"
        varchar target_path "NOT NULL, max 200"
        varchar after_text "NULL, max 200"
        jsonb change "NULL, before and after values"
        varchar note "NULL, max 500"
    }
```

The same diagram in plain text:

```
┌─────────────────────────────┐           ┌────────────────────────────────┐           ┌─────────────────────────────┐
│ sites                       │           │ installations                  │           │ users                       │
├─────────────────────────────┤           ├────────────────────────────────┤           ├─────────────────────────────┤
│ PK id          serial       │ 1       * │ PK id             serial       │           │ PK id          serial       │
│ UQ name        varchar(150) ├───────────┤ FK site_id        integer      │ *    0..1 │    full_name   varchar(100) │
│    city        varchar(100) │           │ FK technician_id  integer      ├───────────┤ UQ email       varchar(150) │
│    region      varchar(10)  │           │    equipment      varchar(150) │           │    phone       varchar(20)  │
│    status      varchar(10)  │           │    status         varchar(20)  │           │    role        varchar(20)  │
│    created_at  timestamptz  │           │    installed_on   date         │           │    created_at  timestamptz  │
│    updated_at  timestamptz  │           │    created_at     timestamptz  │           └─────────────────────────────┘
└─────────────────────────────┘           │    updated_at     timestamptz  │
                                          └────────────────────────────────┘

┌───────────────────────────────┐
│ idempotency_keys              │
├───────────────────────────────┤
│ PK key            uuid        │
│    request_hash   char(64)    │
│    status_code    smallint    │
│    response_body  jsonb       │
│    created_at     timestamptz │
└───────────────────────────────┘
```

The asset tables in plain text:

```
┌──────────────────────────────────┐                ┌──────────────────────────────────┐                ┌──────────────────────────────────┐
│ sites                            │                │ equipment                        │                │ service_records                  │
├──────────────────────────────────┤ 0..1         * ├──────────────────────────────────┤                ├──────────────────────────────────┤
│ PK id               serial       ├────────────────┤ PK id               serial       │ 1            * │ PK id               serial       │
│    ...                           │ site_id        │ UQ serial           varchar(40)  ├────────────────┤ FK equipment_id     integer      │
└──────────────────────────────────┘                │    type             varchar(20)  │ equipment_id   │ FK technician_id    integer      │
                                                    │    status           varchar(20)  │                │    done_on          date         │
                                                    │ FK site_id          integer      │                │    notes            varchar(500) │
                                                    │    next_service_on  date         │                │    created_at       timestamptz  │
                                                    │    created_at       timestamptz  │                └─────────────────┬────────────────┘
                                                    │    updated_at       timestamptz  │                                  │ *
                                                    └─────────────────┬────────────────┘                                  │ technician_id
                                                                      │ 0..1                                              │
                                                                      │ equipment_id                                      │
                                                                      │ *                                                 │ 0..1
┌──────────────────────────────────┐                ┌─────────────────┴────────────────┐                ┌─────────────────┴────────────────┐
│ spare_parts                      │                │ part_requests                    │                │ users                            │
├──────────────────────────────────┤                ├──────────────────────────────────┤ *         0..1 ├──────────────────────────────────┤
│ PK id               serial       │ 1            * │ PK id               serial       ├────────────────┤ PK id               serial       │
│ UQ name             varchar(120) ├────────────────┤ FK part_id          integer      │ requested_by   │    ...                           │
│    stock            integer      │ part_id        │ FK equipment_id     integer      │                └──────────────────────────────────┘
│    reorder_at       integer      │                │ FK requested_by     integer      │
│    capacity         integer      │                │    quantity         integer      │
│    created_at       timestamptz  │                │    status           varchar(20)  │
│    updated_at       timestamptz  │                │    requested_on     date         │
└──────────────────────────────────┘                │    created_at       timestamptz  │
                                                    │    updated_at       timestamptz  │
                                                    └──────────────────────────────────┘

┌────────────────────────────────┐
│ activity_log                   │
├────────────────────────────────┤
│ PK id            bigserial     │
│    kind          varchar(20)   │
│    occurred_at   timestamptz   │
│    actor_name    varchar(100)  │
│    verb          varchar(100)  │
│    target_label  varchar(200)  │
│    target_path   varchar(200)  │
│    after_text    varchar(200)  │
│    change        jsonb         │
│    note          varchar(500)  │
└────────────────────────────────┘
```

| Notation | Meaning |
|---|---|
| `PK` | Primary key |
| `FK` | Foreign key |
| `UQ` | Unique |
| `1` / `*` | Exactly one / zero or more |
| `0..1` | Zero or one |
| `\|\|--o{` | Mermaid: exactly one to zero or more |
| `\|o--o{` | Mermaid: zero or one to zero or more |

## Relationships

| Type | Tables | Implemented by | Meaning |
|---|---|---|---|
| One-to-many | `sites` → `installations` | `installations.site_id` (`NOT NULL`) | A site has zero or more installations. Every installation belongs to exactly one site. |
| One-to-many | `users` → `installations` | `installations.technician_id` (nullable) | A technician is assigned zero or more installations. An installation has zero or one technician. |
| Many-to-many | `sites` ↔ `users` | `installations` as the associative table | A technician works at many sites, and a site is served by many technicians. Each link also records the equipment, status and date. |
| One-to-many | `sites` → `equipment` | `equipment.site_id` (nullable) | A site holds zero or more machines. A machine is at one site or in the warehouse. |
| One-to-many | `equipment` → `service_records` | `service_records.equipment_id` (`NOT NULL`) | A machine has zero or more check-ups. Every check-up is of exactly one machine. |
| One-to-many | `users` → `service_records` | `service_records.technician_id` (nullable) | A technician does zero or more check-ups. A check-up has zero or one technician. |
| One-to-many | `spare_parts` → `part_requests` | `part_requests.part_id` (`NOT NULL`) | A part is asked for in zero or more requests. Every request is for exactly one part. |
| One-to-many | `equipment` → `part_requests` | `part_requests.equipment_id` (nullable) | A machine needs zero or more requests. A request may be for no machine, such as restocking the shelf. |
| One-to-many | `users` → `part_requests` | `part_requests.requested_by` (nullable) | A user asks for zero or more parts. A request has zero or one requester. |
| Many-to-many | `equipment` ↔ `users` | `service_records` as the associative table | A machine is checked by many technicians, and a technician checks many machines. |
| None | `activity_log`, `idempotency_keys` | — | No foreign keys. The history keeps its name and link after a record is deleted. |
| One-to-one | — | — | Not used. No entity belongs to exactly one other entity, so a one-to-one table would add a join with no benefit. |

The many-to-many relationship between sites and technicians, resolved by `installations`:

```mermaid
erDiagram
    SITES ||--o{ INSTALLATIONS : "site_id"
    INSTALLATIONS }o--o| USERS : "technician_id"
```

### Delete behaviour

| Action | Rule | Reason |
|---|---|---|
| Delete a site | `ON DELETE CASCADE` removes its installations | An installation cannot exist without its site. The app asks for the site name before deleting a site that has installations, and suggests setting it to Inactive instead to keep the history. |
| Delete a user | `ON DELETE SET NULL` keeps the installations as unassigned | Installation history is kept when a technician leaves. |
| Delete a site with machines | `equipment.site_id` `ON DELETE SET NULL` | The machine still exists; it shows as "In the warehouse". |
| Delete a machine with check-ups | `service_records.equipment_id` `ON DELETE RESTRICT` | Check-up history cannot be lost by accident. The API answers `409`. |
| Delete a machine with part requests | `part_requests.equipment_id` `ON DELETE SET NULL` | The request stays, for the store. |
| Delete a part with requests | `part_requests.part_id` `ON DELETE RESTRICT` | A request must always say which part. The API answers `409`. |
| Delete a user who did check-ups or asked for parts | `ON DELETE SET NULL` | The records stay without a name. |
| Delete anything | `activity_log` has no foreign keys | The history keeps the name and link it had, even after the record is gone. |

## Tables

### `sites`

| Column | Type | Rules |
|---|---|---|
| `id` | `SERIAL` | Primary key |
| `name` | `VARCHAR(150)` | Required, unique |
| `city` | `VARCHAR(100)` | Required |
| `region` | `VARCHAR(10)` | `North`, `South`, `East` or `West` |
| `status` | `VARCHAR(10)` | `active` or `inactive`, defaults to `active` |
| `created_at` | `TIMESTAMPTZ` | Defaults to `NOW()` |
| `updated_at` | `TIMESTAMPTZ` | Refreshed on every update by a trigger |

### `installations`

| Column | Type | Rules |
|---|---|---|
| `id` | `SERIAL` | Primary key |
| `site_id` | `INTEGER` | Required, references `sites.id`, deleted with the site |
| `technician_id` | `INTEGER` | Optional, references `users.id`, set to `NULL` when the user is deleted |
| `equipment` | `VARCHAR(150)` | Required |
| `status` | `VARCHAR(20)` | `pending`, `in_progress` or `completed`, defaults to `pending` |
| `installed_on` | `DATE` | Required |
| `created_at` | `TIMESTAMPTZ` | Defaults to `NOW()` |
| `updated_at` | `TIMESTAMPTZ` | Refreshed on every update by a trigger |

### `users`

| Column | Type | Rules |
|---|---|---|
| `id` | `SERIAL` | Primary key |
| `full_name` | `VARCHAR(100)` | Required |
| `email` | `VARCHAR(150)` | Required, unique |
| `phone` | `VARCHAR(20)` | Optional; digits, spaces, `+` and `-`, checked by the API |
| `role` | `VARCHAR(20)` | `admin` or `technician`, defaults to `technician` |
| `created_at` | `TIMESTAMPTZ` | Defaults to `NOW()` |

### `idempotency_keys`

| Column | Type | Rules |
|---|---|---|
| `key` | `UUID` | Primary key, the `Idempotency-Key` header value |
| `request_hash` | `CHAR(64)` | Required, SHA-256 of the method, path and body |
| `status_code` | `SMALLINT` | `NULL` while the request runs, then the response status |
| `response_body` | `JSONB` | The stored response returned on a retry |
| `created_at` | `TIMESTAMPTZ` | Defaults to `NOW()`; rows older than 24 hours are deleted |

### `equipment`

| Column | Type | Rules |
|---|---|---|
| `id` | `SERIAL` | Primary key |
| `serial` | `VARCHAR(40)` | Required, unique |
| `type` | `VARCHAR(20)` | `blade_yoke`, `tower_gripper`, `tagline_system` or `mobile_robot` |
| `status` | `VARCHAR(20)` | `deployed`, `in_service` or `in_stock`, defaults to `in_stock` |
| `site_id` | `INTEGER` | Optional, references `sites.id`, set to `NULL` when the site is deleted |
| `next_service_on` | `DATE` | Required. Set to the check-up date + 90 days when a check-up is recorded |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | `updated_at` refreshed by a trigger |

### `service_records`

| Column | Type | Rules |
|---|---|---|
| `id` | `SERIAL` | Primary key |
| `equipment_id` | `INTEGER` | Required, references `equipment.id`, `RESTRICT` on delete |
| `technician_id` | `INTEGER` | Optional, references `users.id`, set to `NULL` when the user is deleted |
| `done_on` | `DATE` | Required |
| `notes` | `VARCHAR(500)` | Optional |
| `created_at` | `TIMESTAMPTZ` | Defaults to `NOW()` |

### `spare_parts`

| Column | Type | Rules |
|---|---|---|
| `id` | `SERIAL` | Primary key |
| `name` | `VARCHAR(120)` | Required, unique |
| `stock` | `INTEGER` | 0 or more (`spare_parts_stock_check`) |
| `reorder_at` | `INTEGER` | 0 or more; at or below this the part is "Running low" |
| `capacity` | `INTEGER` | More than 0; a delivery never fills the shelf past it |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | `updated_at` refreshed by a trigger |

### `part_requests`

| Column | Type | Rules |
|---|---|---|
| `id` | `SERIAL` | Primary key |
| `part_id` | `INTEGER` | Required, references `spare_parts.id`, `RESTRICT` on delete |
| `equipment_id` | `INTEGER` | Optional, references `equipment.id`, set to `NULL` when the machine is deleted |
| `requested_by` | `INTEGER` | Optional, references `users.id`, set to `NULL` when the user is deleted |
| `quantity` | `INTEGER` | More than 0 |
| `status` | `VARCHAR(20)` | `requested`, `ordered` or `delivered`, defaults to `requested` |
| `requested_on` | `DATE` | Defaults to today |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | `updated_at` refreshed by a trigger |

### `activity_log`

| Column | Type | Rules |
|---|---|---|
| `id` | `BIGSERIAL` | Primary key |
| `kind` | `VARCHAR(20)` | `installation`, `service`, `part`, `site` or `user` |
| `occurred_at` | `TIMESTAMPTZ` | Defaults to `NOW()` |
| `actor_name` | `VARCHAR(100)` | Who did it, copied as text |
| `verb`, `target_label`, `target_path`, `after_text` | `VARCHAR` | The sentence and the link, copied as text so they survive deletes |
| `change` | `JSONB` | The status before and after, such as `["active", "inactive"]` |
| `note` | `VARCHAR(500)` | Optional, such as the check-up notes |

Indexes on the asset tables: `equipment (site_id)`, `equipment (next_service_on, id)`, `service_records (equipment_id, done_on DESC)`, `part_requests (status, requested_on DESC)` and each foreign key, `activity_log (occurred_at DESC, id DESC)` and `activity_log (target_path, occurred_at DESC)`. Row Level Security is on for every new table, as for the others.

### Constraints and indexes

| Name | Table | Type | Purpose |
|---|---|---|---|
| `sites_name_key` | `sites` | Unique | No two sites share a name |
| `users_email_key` | `users` | Unique | No two users share an email |
| `installations_site_id_fkey` | `installations` | Foreign key | Links each installation to its site |
| `installations_technician_id_fkey` | `installations` | Foreign key | Links each installation to its technician |
| `CHECK` constraints | all tables | Check | Restrict `region`, `status` and `role` to their allowed values |
| `idx_installations_site_id_installed_on` | `installations` | Index | One site's installations, newest first |
| `idx_installations_installed_on` | `installations` | Index | Latest installations and date ranges |
| `idx_installations_status` | `installations` | Index | Status filter |
| `idx_installations_technician_id` | `installations` | Index | Joins to `users` |
| `idx_sites_status`, `idx_sites_region` | `sites` | Index | Status and region filters |
| `sites_set_updated_at`, `installations_set_updated_at` | `sites`, `installations` | Trigger | Refresh `updated_at` on every update |

## Normalization

The schema is in third normal form.

| Form | How the schema meets it |
|---|---|
| 1NF | Every column holds a single value. There are no lists or repeating groups. |
| 2NF | Every table has a single-column primary key, so no column depends on part of a key. |
| 3NF | Site and technician details live only in their own tables. `installations` stores their ids, not copies of their names, cities or emails. |

Region and status values are a short, fixed list, so they are enforced with `CHECK` constraints instead of lookup tables.

## Folder structure

```
database/
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_sites.sql
│   ├── 003_create_installations.sql
│   ├── 004_create_updated_at_trigger.sql
│   ├── 005_create_foreign_key_indexes.sql
│   ├── 006_create_idempotency_keys.sql
│   ├── 007_enable_row_level_security.sql
│   ├── 008_create_query_indexes.sql
│   └── 009_add_user_phone.sql
├── seeds/
│   ├── 000_reset.sql
│   ├── 001_users.sql
│   ├── 002_sites.sql
│   └── 003_installations.sql
└── queries/
    ├── joins/
    │   ├── installation_details.sql
    │   └── technician_sites.sql
    └── aggregations/
        ├── dashboard_totals.sql
        ├── installations_per_site.sql
        ├── status_breakdown.sql
        ├── monthly_installations.sql
        ├── completion_rate_by_region.sql
        └── technician_workload.sql
```

- **Migrations** create the schema. They are numbered so they run in order, and use `IF NOT EXISTS` / `CREATE OR REPLACE` so they can be run again safely.
- **Seeds** load a small, hand-written sample: 5 users (1 admin, 4 technicians), 5 sites (one inactive, one with no installations) and 5 installations across all three statuses, spread over the last five months, with one unassigned. Installations refer to sites by name and to technicians by email, not by id. `000_reset.sql` empties the tables first.
- **Queries** are standalone examples of joins and aggregations to run by hand. Each file holds one query and is named after what it returns. The SQL the application runs lives in `backend/src/services`; where an example matches an API query, it uses the same structure and column names in snake_case, while the API returns them in camelCase.

`007_enable_row_level_security.sql` turns on Row Level Security for every table. Supabase exposes tables through its automatic REST API; with Row Level Security on and no policies, that API returns nothing, while the backend, which connects as the table owner, keeps full access. On a local PostgreSQL server it has no visible effect.

## Queries

| File | Demonstrates | Returns |
|---|---|---|
| `joins/installation_details.sql` | `INNER JOIN` + `LEFT JOIN` across all three tables | The ten latest installations with site and technician names |
| `joins/technician_sites.sql` | The many-to-many relationship, `STRING_AGG` | Each technician with the sites they have worked at |
| `aggregations/dashboard_totals.sql` | `WITH` (common table expressions), `COUNT ... FILTER`, `CROSS JOIN` | Site and installation totals for the summary cards |
| `aggregations/installations_per_site.sql` | `LEFT JOIN` + `GROUP BY` + `COUNT ... FILTER` | Installations per site split by status, busiest first, including sites with none |
| `aggregations/status_breakdown.sql` | Window function `SUM(...) OVER ()` | Installations per status with a percentage |
| `aggregations/monthly_installations.sql` | `generate_series`, `LEFT JOIN` on a date range, `COUNT ... FILTER` | Installations per month for the last six months split by status, including empty months |
| `aggregations/completion_rate_by_region.sql` | `FILTER`, `NULLIF` | Completion rate per region |
| `aggregations/technician_workload.sql` | `LEFT JOIN`, `UNION ALL`, `COUNT ... FILTER` | Installations per technician split by status, busiest first, with unassigned work as its own row |

## Query optimization

### Techniques used

| Technique | Where | Effect |
|---|---|---|
| Indexes on filtered and sorted columns | `005`, `008` migrations | PostgreSQL finds matching rows without reading the whole table |
| Aggregation in SQL | Summary queries | `COUNT`, `FILTER` and `GROUP BY` return a handful of numbers instead of every row |
| Joins instead of one query per row | Installation and site lists | Site and technician names arrive in the same query as the installations |
| Pagination in SQL | List queries | `LIMIT` and `OFFSET` send one page, not the whole table |
| Filtering in SQL | List queries | Search and filters are `WHERE` conditions, not done in the browser |
| Named columns | All queries | Only the columns the API needs are read and sent |
| Parallel queries | Lists and summary | The page and its total count, and the four summary queries, run at the same time |
| Range conditions on raw columns | Monthly installations | `installed_on >= start AND installed_on < next_month` can use an index; `DATE_TRUNC('month', installed_on) = month` cannot |
| Connection pooling | Backend `pg.Pool` and the Supabase session pooler | Connections are reused instead of opened for every request |
| Parameterized queries | All backend queries | Values travel as `$1`, `$2`, which prevents SQL injection and lets PostgreSQL reuse query plans |

### Indexes

| Index | Columns | Serves |
|---|---|---|
| `idx_installations_site_id_installed_on` | `site_id, installed_on DESC` | Installations of one site, newest first; the per-site installation count |
| `idx_installations_installed_on` | `installed_on DESC, id DESC` | The installations list and recent installations, ordered newest first; the monthly date ranges |
| `idx_installations_status` | `status` | The installation status filter |
| `idx_installations_technician_id` | `technician_id` | Joins from installations to users |
| `idx_sites_status` | `status` | The site status filter |
| `idx_sites_region` | `region` | The site region filter |
| `sites_name_key` | `name` | Created by the `UNIQUE` constraint; also serves `ORDER BY name` on the sites list |

`008_create_query_indexes.sql` removes the single-column `idx_installations_site_id` from migration `005`: an index on `(site_id, installed_on)` also serves lookups by `site_id` alone, so keeping both would only slow down writes.

### Not indexed

| Query | Reason |
|---|---|
| Summary totals | They count every row, so the whole table is read regardless of indexes |
| Search with `ILIKE '%text%'` | A normal index only matches from the start of a value. A trigram index (`pg_trgm`) would be needed and is not worth the extension at this data size |
| `users.role` | The table is tiny; PostgreSQL reads it directly |

Indexes speed up reads but every insert and update must also maintain them, so only columns the application filters, sorts or joins on are indexed. On very small tables PostgreSQL may still choose to read the whole table, because that is cheaper than using an index; the indexes take effect as the data grows.

## SQL conventions

- Keywords in upper case, table and column names in `snake_case`
- One clause per line: `SELECT`, `FROM`, `JOIN`, `WHERE`, `GROUP BY`, `ORDER BY`
- Short, consistent aliases: `s` for sites, `i` for installations, `u` for users
- Columns listed by name; no `SELECT *`
- Multi-step queries split into named `WITH` parts instead of nested subqueries
- Constraints on their own indented line under the column they protect
- Seed data refers to related rows by natural keys such as site name and email, not by id
- One statement or one object per file, with the file named after what it creates or returns
- Values from users always passed as parameters, never concatenated into SQL

## Local setup

Requires PostgreSQL 14 or later.

### 1. Create the database

With a local PostgreSQL server:

```bash
psql -U postgres -c "CREATE DATABASE site_operations;"
```

With Supabase, the project's `postgres` database is used as is.

### 2. Point the backend at it

In `backend/.env`:

```
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/site_operations
DATABASE_SSL=false
```

For Supabase use the session pooler connection string, `DATABASE_SSL=true` and `DATABASE_SSL_CA=certs/supabase-ca.crt`.

### 3. Create the tables and load sample data

From the `backend` folder:

```bash
npm run db:migrate
npm run db:seed
```

Each script prints one line per file it runs and stops at the first error. `db:migrate` is safe to run again. `db:seed` empties the tables and reloads the sample data every time, so it is for a local database only.

To add the sample machines, parts and activity without touching anything else, for example on the live database:

```bash
npm run db:seed:assets
```

### 4. Run a query

```bash
psql "postgresql://postgres:<password>@localhost:5432/site_operations" -f ../database/queries/aggregations/status_breakdown.sql
```

Any file in `database/queries` can be run the same way, or pasted into pgAdmin or the Supabase SQL Editor.
