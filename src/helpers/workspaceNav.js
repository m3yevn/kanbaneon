const RECENT_KEY = "kanbaneon-recent-boards";
const FAVORITES_KEY = "kanbaneon-favorite-boards";
const MAX_RECENT = 8;

export function getRecentBoards() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function pushRecentBoard(board) {
  if (!board?.id) return;
  const entry = {
    id: board.id,
    name: board.name,
    projectKey: board.projectKey || "",
    visitedAt: Date.now(),
  };
  const list = getRecentBoards().filter((b) => b.id !== board.id);
  list.unshift(entry);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
}

export function getFavoriteBoards() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavoriteBoard(board) {
  if (!board?.id) return getFavoriteBoards();
  const favs = getFavoriteBoards();
  const idx = favs.findIndex((b) => b.id === board.id);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.unshift({
      id: board.id,
      name: board.name,
      projectKey: board.projectKey || "",
    });
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs.slice(0, MAX_RECENT)));
  return favs;
}

export function isFavoriteBoard(boardId) {
  return getFavoriteBoards().some((b) => b.id === boardId);
}
