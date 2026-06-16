# Kanbaneon Design System

> Lime · white · modern SaaS. Ant Design Vue is the foundation; Kanbaneon tokens and overrides make it feel custom-built.

**Last updated:** 2026-06-16 · Workspace Experience Rebirth (Phase 1)

---

## Principles

1. **One product** — Landing and workspace share the same visual language.
2. **Board is hero** — Kanban canvas is the primary surface; chrome stays quiet.
3. **Bright & focused** — White/off-white default; dark mode is not the priority.
4. **Clarity over density** — Jira/Linear-style hierarchy without cloning either product.
5. **Ant Design underneath** — Customize via ConfigProvider tokens + `theme.css` + `override.css`.

---

## Color

### Brand (Lime)

| Token | Value | Usage |
|-------|-------|--------|
| `--kb-accent` | `#65a30d` (lime-600) | Primary actions, links, active nav |
| `--kb-accent-dim` | `#4d7c0f` (lime-700) | Hover/active, emphasis text |
| `--kb-accent-soft` | `rgba(101, 163, 13, 0.12)` | Selected states, badges, widget accents |
| Ant `colorPrimary` | `#84cc16` (lime-500) | Ant Design primary button base |

### Surfaces

| Token | Value |
|-------|-------|
| `--kb-bg` | `#f4f5f7` |
| `--kb-surface` | `#ffffff` |
| `--kb-surface-2` | `#f8fafc` |
| `--kb-surface-glass` | `rgba(255, 255, 255, 0.92)` |

### Text

| Token | Value |
|-------|-------|
| `--kb-text` | `#172b4d` |
| `--kb-muted` | `#5e6c84` |

### Borders & shadows

| Token | Value |
|-------|-------|
| `--kb-border` | `rgba(9, 30, 66, 0.12)` |
| `--kb-border-strong` | `rgba(101, 163, 13, 0.45)` |
| `--kb-shadow` | `0 1px 3px rgba(9, 30, 66, 0.12)` |
| `--kb-shadow-glow` | `0 4px 16px rgba(101, 163, 13, 0.15)` |

### Status (subtle)

| Role | Suggested |
|------|-----------|
| Success | `#36b37e` |
| Warning | `#ffab00` |
| Error | `--kb-danger` `#de350b` |
| Info | `#0065ff` |

---

## Typography

- **Family:** `Inter`, system-ui (`--kb-font`)
- **Page title:** 1.75rem / 700 / `-0.02em` letter-spacing
- **Section title:** 1.25rem / 600
- **Body:** 14–15px / 400–500
- **Meta / captions:** 0.8–0.85rem / `--kb-muted`

---

## Spacing

| Scale | px |
|-------|-----|
| xs | 4 |
| sm | 8 |
| md | 16 |
| lg | 24 |
| xl | 32 |
| 2xl | 48 |

**Layout constants**

| Token | Value |
|-------|-------|
| `--kb-sidebar-w` | `260px` |
| `--kb-workspace-top` | `56px` |
| `--kb-radius` | `8px` |
| `--kb-radius-lg` | `12px` |

---

## Layout

### Workspace shell

```
┌─────────────┬──────────────────────────────────┐
│  Sidebar    │  Top bar (breadcrumb + user)       │
│  260px      ├──────────────────────────────────┤
│  fixed      │  Page content / board canvas     │
│             │                                  │
└─────────────┴──────────────────────────────────┘
```

- **Component:** `src/components/Shared/WorkspaceShell.vue`
- **Top chrome:** `Header.vue` with `compact` prop (breadcrumb inline, no duplicate logo)

### Board view

- View tabs: `position: sticky` under top bar
- Canvas: full-width within main column, light column backgrounds via `canvasTheme.js`

---

## Components (Ant + overrides)

| Component | Customization |
|-----------|----------------|
| **Button** | 600 weight, 8px radius, lime primary, visible focus ring |
| **Input / Select** | 36px min-height, lime focus ring (`override.css`) |
| **Card** | White surface, soft shadow, 12px radius; board cards hover glow |
| **Modal / Drawer** | White surface, 12px radius, stronger shadow on modal |
| **Tag** | 6px radius, no harsh borders |
| **Menu / Nav** | Sidebar items: 10px padding, active = accent-soft background |
| **Breadcrumb** | Muted links; hover → accent |
| **Tooltip** | 8px radius, compact type |

---

## Interaction rules

1. **Hover:** Subtle border/shadow shift; max `translateY(-2px)` on cards.
2. **Focus:** `outline: 2px solid var(--kb-accent)` — never remove focus styles.
3. **Loading:** Prefer spin text + skeletons over blank screens.
4. **Motion:** 150–200ms transitions; no decorative animation on data surfaces.
5. **Empty states:** Always offer templates + primary CTA (see `Boards.vue`).

---

## File map

| File | Role |
|------|------|
| `src/theme.css` | CSS variables, global surfaces, Ant base overrides |
| `src/override.css` | Component-level Ant polish |
| `src/App.vue` | Ant ConfigProvider token theme |
| `src/theme/canvasTheme.js` | Konva board column colors |
| `src/components/Shared/WorkspaceShell.vue` | Sidebar + main layout |
| `src/components/Shared/Header.vue` | Top bar (full or compact) |

---

## 2026 quality gate

Before marking workspace rebirth complete:

- [x] Shared lime/white tokens landing ↔ workspace
- [x] Workspace sidebar navigation
- [x] Projects hub with templates empty state
- [x] Ant button/input focus and hover polish
- [ ] Board task cards — priority, assignee, due date at a glance ✅ Konva card face
- [ ] Global search / quick actions
- [ ] Rich project dashboard widgets (activity, due soon)
- [ ] Mobile workspace layouts verified
- [ ] WCAG contrast audit on status colors
- [ ] Legal pages off boilerplate generator
