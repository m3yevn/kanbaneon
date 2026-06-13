# Kanbaneon — Vertical Slices

Vue 3 + Konva kanban frontend, evolving into a lightweight Jira clone.

## Done

| Slice | UI |
|-------|-----|
| **Personal boards** | List, create (Jira columns template), Konva canvas |
| **Teams** | List, detail, members, team project boards |
| **Organizations** | List, detail, org projects, teams list |
| **Jira issues** | Issue type + priority on create/edit; `KAN-1 · title` on cards |
| **Settings** | Organization shortcut, account, notifications |

## Next slices

| # | Slice | Scope |
|---|-------|-------|
| 4 | **Backlog view** | Separate backlog column UI, rank issues |
| 5 | **Sprint planning** | Drag backlog → sprint, sprint header |
| 6 | **Issue detail drawer** | Full-page issue like Jira (comments, history) |
| 7 | **Filters & search** | Quick filters by assignee, type, priority |
| 8 | **Org team management** | Create teams inside org from org detail page |
| 9 | **Board settings** | Edit columns, project key, permissions |

## Routes

- `/boards`, `/boards/:id`
- `/teams`, `/teams/:id`
- `/organizations`, `/organizations/:id`
