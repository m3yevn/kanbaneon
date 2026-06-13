# Kanbaneon — Vertical Slices

Vue 3 + Konva kanban frontend, evolving into a lightweight Jira clone.

## Done

| Slice | UI |
|-------|-----|
| **Personal boards** | List, create (Jira columns template), Konva canvas |
| **Teams** | List, detail, members, team project boards |
| **Organizations** | List, detail, org projects, teams list + create team |
| **Jira issues** | Issue type + priority on create/edit; `KAN-1 · title` on cards |
| **Backlog view** | Ranked backlog list, reorder, assign to sprint |
| **Sprint planning** | Create/start sprints, assign backlog issues |
| **Issue drawer** | Right panel with edit + comments |
| **Settings** | Organization shortcut, account, notifications |

## Next slices

| # | Slice | Scope |
|---|-------|-------|
| 9 | **Filters & search** | Quick filters by assignee, type, priority |
| 10 | **Epic board** | Epic linking and rollup view |
| 11 | **Board settings** | Edit columns, project key, permissions |
| 12 | **Deep links** | `/boards/:id/issues/:issueKey` shareable URLs |

## Routes

- `/boards`, `/boards/:id`
- `/teams`, `/teams/:id`
- `/organizations`, `/organizations/:id`
