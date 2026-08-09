## Project

TypeSpec API definition for a **Booking Calendar API** — single source of truth is `main.tsp`. Emits OpenAPI 3.1 to `tsp-output/schema/openapi.v1.yaml`.

## Commands

No npm scripts defined. Run TypeSpec via npx:

```
npx tsp compile main.tsp          # compile, emit OpenAPI
npx tsp validate main.tsp         # validate without emitting
```

Output dir configured in `tspconfig.yaml` → `{output-dir}/schema`.

## Architecture

- `main.tsp` — all types, routes, and interfaces (Public + Admin APIs, v1)
- `tspconfig.yaml` — emits `@typespec/openapi3`, OpenAPI 3.1
- `tsp-output/schema/` — generated artifacts (do not edit)
- `frontend/` — empty scaffold (`src/features/slots/pages/` exists but has no files yet)
- CI: `.github/workflows/hexlet-check.yml` — Hexlet platform checks (do not modify)

## Conventions

- Domain models live in `main.tsp` (Owner, EventType, Slot, Booking, Schedule)
- Two API surfaces: **Public** (guest-facing: list event-types, list slots, create booking) and **Admin** (owner-facing: CRUD event-types, slots, schedules, bookings)
- `frontend/` is a future concern — no build config or package.json there yet
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) — enforced by `husky` + `commitlint` locally and CI workflow
- See `CONTRIBUTING.md` for full commit message format and rules

## Agent skills

### Issue tracker

GitHub Issues on `Vamproical/ai-for-developers-project-386`, using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical roles: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
