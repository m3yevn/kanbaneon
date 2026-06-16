# Kanbaneon UX Audit

> Workspace Experience Rebirth — audit snapshot as of 2026-06-16.

**Scope:** Landing, auth, projects hub, board, teams, orgs, profile, settings.

---

## Summary

| Area | Status | Priority |
|------|--------|----------|
| Landing ↔ workspace consistency | 🟡 Improved | P0 |
| Navigation | 🟡 Sidebar added | P0 |
| Projects hub | 🟢 Rebuilt | P1 |
| Board (hero) | 🟢 Card metadata on canvas | P0 |
| Forms | 🟡 Token polish | P1 |
| Empty states | 🟢 Templates on projects | P1 |
| Mobile | 🟡 Responsive shell (768px+) | P2 |
| Accessibility | 🟡 Needs pass | P1 |
| Legal pages | 🟢 Kanbaneon-specific · vercel.app | P2 |

---

## `/` Landing

| | |
|---|---|
| **Current problems** | Previously felt more polished than post-login app; accent mixed violet + lime. |
| **Usability** | Clear CTAs; good feature grid. |
| **Visual** | Lime accent aligned in rebirth; hero matches workspace tokens. |
| **A11y** | Nav links lack skip-to-content; contrast on badge OK. |
| **Recommendations** | Add product screenshots; unify CTA copy with workspace “New project”. |
| **Priority** | P2 |

---

## `/login` · `/signup`

| | |
|---|---|
| **Current problems** | Default Ant form layout; feels generic vs landing. |
| **Usability** | Functional; error states basic. |
| **Visual** | White card on gray bg — acceptable; needs branded panel layout. |
| **A11y** | Label association OK; focus rings improved globally. |
| **Recommendations** | Split auth layout: brand panel left, form right (Linear-style). |
| **Priority** | P1 |

---

## `/boards` Projects hub

| | |
|---|---|
| **Current problems** | Was empty image + single button; no hierarchy. |
| **Usability** | ✅ Template picker, widgets, grid layout. |
| **Visual** | ✅ Cards, project keys, dashed “create” tile. |
| **A11y** | Template cards are `<button>` — keyboard OK. |
| **Recommendations** | Wire “recent activity” to real API; assigned work widget. |
| **Priority** | P1 (data), P2 (widgets) |

---

## `/boards/:id` Board (hero)

| | |
|---|---|
| **Current problems** | Fixed chrome stacked awkwardly; task cards lack metadata density. |
| **Usability** | Canvas drag works; view tabs (Board / Backlog / Sprints) present. |
| **Visual** | Light canvas theme; sticky view tabs under shell. |
| **A11y** | Canvas is pointer-heavy; keyboard path for issues incomplete. |
| **Recommendations** | ✅ Card faces: priority stripe, type badge, assignee, labels, due date. |
| **Priority** | **P0** |

---

## Teams · Organizations · Profile · Settings

| | |
|---|---|
| **Current problems** | CRUD tables; default Ant table styling; weak page headers. |
| **Usability** | Feature-complete for power users; no quick actions. |
| **Visual** | Inherit shell — still table-forward admin feel. |
| **A11y** | Table headers present; row actions need aria-labels. |
| **Recommendations** | Page headers like projects hub; empty states per entity; card list option for teams. |
| **Priority** | P1 |

---

## Navigation (global)

| | |
|---|---|
| **Current problems** | Was header-only + popover menu; no persistent IA. |
| **Usability** | ✅ Sidebar: Projects, Teams, Orgs, Profile, Settings. |
| **Visual** | Active state lime-soft; logo in sidebar only. |
| **A11y** | `aria-label` on sidebar; needs skip link. |
| **Recommendations** | ✅ ⌘K palette — quick actions, recent, favorites, project search. |
| **Priority** | P0 (search), P1 (switcher) |

---

## Header / chrome

| | |
|---|---|
| **Current problems** | Dark breadcrumb bar (`rgba(6,10,18,0.4)`) broke white theme. |
| **Usability** | Board edit via dots menu; user popover OK. |
| **Visual** | ✅ Fixed: light breadcrumb; compact mode in shell. |
| **A11y** | Avatar popover needs escape handling review. |
| **Recommendations** | Board actions in view tab bar; reduce duplicate nav in popover. |
| **Priority** | P2 |

---

## Forms (modals, drawers, filters)

| | |
|---|---|
| **Current problems** | Enterprise-default spacing; mixed `:visible` / `:open` APIs. |
| **Usability** | Create board modal improved copy; issue drawer functional. |
| **Visual** | Focus rings + button weights updated in `override.css`. |
| **A11y** | Modal focus trap — verify on IssueDrawer. |
| **Recommendations** | Standardize Ant v4 `open` prop; inline validation messages; filter chips on board. |
| **Priority** | P1 |

---

## Mobile

| | |
|---|---|
| **Current problems** | `MobileMessage` blocks workspace entirely below 1024px. |
| **Usability** | No mobile workspace — intentional but limits reach. |
| **Visual** | N/A |
| **A11y** | N/A |
| **Recommendations** | Responsive shell: collapsible sidebar; read-only board view later. |
| **Priority** | P2 |

---

## Legal · docs

| | |
|---|---|
| **Current problems** | Privacy policy generator boilerplate; references `kanbaneon.netlify.app`. |
| **Usability** | Links work but content not trustworthy. |
| **Visual** | Unstyled vs product. |
| **A11y** | Heading structure OK. |
| **Recommendations** | Wire `LEGAL/` templates; canonical `kanbaneon.vercel.app`. |
| **Priority** | P2 |

---

## Non-half-ass gate checklist

| Criterion | Done |
|-----------|------|
| Landing + workspace feel like one product | 🟢 |
| Ant Design fully customized | 🟡 |
| White theme polished | 🟢 |
| Board experience premium | 🟡 Card metadata shipped |
| Navigation modern | 🟢 Sidebar + ⌘K |
| Empty states useful | ✅ Projects hub |
| Forms intentional | 🟡 Auth split layout |
| Mobile verified | 🟡 Collapsible shell |
| Accessibility improved | 🟡 |
| Visual hierarchy consistent | 🟢 |
| Production-ready feel | 🟡 |

---

## Recommended next slices

1. **P0** — Board task card metadata + column density + scroll
2. **P0** — Command palette / search
3. **P1** — Auth layout rebirth
4. **P1** — Teams/Orgs page headers + empty states
5. **P2** — Legal pages + mobile responsive shell
