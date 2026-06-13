# Kanbaneon

**A canvas-based Kanban board** — drag-and-drop cards rendered on Konva canvas, not DOM.

Version 1.0.0 · by m3yevn · [Deployed on Netlify](https://app.netlify.com/sites/kanbaneon/deploys)

## Features

- Canvas-based 2D Scrum board (Konva)
- Personal and **team boards** with shared access
- Teams: create, invite members, collaborate on boards
- User profiles, notifications, JWT auth
- Lite mode: offline IndexedDB (no API)

## Tech stack

| Layer | Stack |
|-------|-------|
| Frontend | Vue 3, Vite, Vuex, Vue Router, Ant Design Vue, Konva |
| API | [kanbaneon-api](../kanbaneon-api) — Hapi.js, MongoDB, JWT |
| Deploy | Netlify (frontend) |

## Scripts

```sh
npm run dev      # Vite dev server
npm run build    # Production build
npm run serve    # Preview build
```

## Environment

```env
VITE_KANBANEON_API_URL=https://your-api.example.com/api/v1
VITE_LITE_VERSION=OFF   # set ON for offline lite mode
```

## Public URL

https://kanbaneon.netlify.app (or your Netlify deploy)

## License

No license specified.
