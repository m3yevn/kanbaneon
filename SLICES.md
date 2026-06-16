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
| **Search & filters** | Query, type, priority, epic filters |
| **Epic linking** | Link issues to epics, view epic children |
| **Epic board** | Epics tab — rollup of epics + linked issues |
| **Deep links** | `/boards/:id/issues/:issueKey` shareable URLs |
| **Settings** | Organization shortcut, account, notifications |
| **Docs page** | `/docs` — quick start, concepts, API link |
| **Evolution Phase 1** | Lime light theme · `EVOLUTION.md` · canvas palette |
| **Workspace rebirth (2)** | ⌘K palette · card metadata · auth split · mobile shell · legal |

## Next slices

| # | Slice | Scope |
|---|-------|-------|
| 14 | **Board settings** | Edit columns, project key, permissions |
| 15 | **Favorites UI** | Star on project cards |
| 16 | **Assignee picker** | Issue drawer → card face sync |

## Routes

- `/boards`, `/boards/:id`
- `/teams`, `/teams/:id`
- `/organizations`, `/organizations/:id`
