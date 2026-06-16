<template>
  <a-modal
    :open="open"
    :footer="null"
    :closable="false"
    width="560"
    class="cmd-palette-modal"
    @cancel="close"
  >
    <div class="cmd-palette">
      <div class="cmd-search-row">
        <SearchOutlined class="cmd-icon" />
        <input
          ref="inputRef"
          v-model="query"
          type="search"
          class="cmd-input"
          placeholder="Search boards, actions…"
          autocomplete="off"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="runSelected"
          @keydown.esc="close"
        />
        <kbd class="cmd-kbd">esc</kbd>
      </div>

      <div v-if="!query.trim()" class="cmd-section">
        <p class="cmd-label">Quick actions</p>
        <button
          v-for="(item, i) in quickActions"
          :key="item.id"
          type="button"
          class="cmd-item"
          :class="{ active: selected === i }"
          @click="run(item)"
        >
          <component :is="item.icon" class="cmd-item-icon" />
          <span>{{ item.label }}</span>
        </button>
      </div>

      <div v-if="favorites.length && !query.trim()" class="cmd-section">
        <p class="cmd-label">Favorites</p>
        <button
          v-for="(board, i) in favorites"
          :key="'fav-' + board.id"
          type="button"
          class="cmd-item"
          :class="{ active: selected === quickActions.length + i }"
          @click="goBoard(board.id)"
        >
          <StarFilled class="cmd-item-icon fav" />
          <span>{{ board.projectKey ? board.projectKey + " · " : "" }}{{ board.name }}</span>
        </button>
      </div>

      <div v-if="recents.length && !query.trim()" class="cmd-section">
        <p class="cmd-label">Recent</p>
        <button
          v-for="(board, i) in recents"
          :key="'rec-' + board.id"
          type="button"
          class="cmd-item"
          :class="{ active: selected === quickActions.length + favorites.length + i }"
          @click="goBoard(board.id)"
        >
          <ClockCircleOutlined class="cmd-item-icon" />
          <span>{{ board.projectKey ? board.projectKey + " · " : "" }}{{ board.name }}</span>
        </button>
      </div>

      <div v-if="query.trim() && filteredBoards.length" class="cmd-section">
        <p class="cmd-label">Projects</p>
        <button
          v-for="(board, i) in filteredBoards"
          :key="board.id"
          type="button"
          class="cmd-item"
          :class="{ active: selected === i }"
          @click="goBoard(board.id)"
        >
          <BorderInnerOutlined class="cmd-item-icon" />
          <span>{{ board.projectKey ? board.projectKey + " · " : "" }}{{ board.name }}</span>
        </button>
      </div>

      <p v-if="query.trim() && !filteredBoards.length" class="cmd-empty">No matches</p>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  SearchOutlined,
  BorderInnerOutlined,
  TeamOutlined,
  ApartmentOutlined,
  SettingOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  StarFilled,
} from "@ant-design/icons-vue";
import { getRecentBoards, getFavoriteBoards } from "../../helpers/workspaceNav";

const props = defineProps({
  open: Boolean,
  boards: { type: Array, default: () => [] },
});

const emit = defineEmits(["close", "new-project"]);

const router = useRouter();
const query = ref("");
const selected = ref(0);
const inputRef = ref(null);

const recents = computed(() => getRecentBoards());
const favorites = computed(() => getFavoriteBoards());

const quickActions = [
  { id: "new", label: "New project", icon: PlusOutlined, run: () => emit("new-project") },
  { id: "projects", label: "Go to Projects", icon: BorderInnerOutlined, path: "/boards" },
  { id: "teams", label: "Go to Teams", icon: TeamOutlined, path: "/teams" },
  { id: "orgs", label: "Go to Organizations", icon: ApartmentOutlined, path: "/organizations" },
  { id: "settings", label: "Settings", icon: SettingOutlined, path: "/settings" },
];

const flatItems = computed(() => {
  if (query.value.trim()) {
    return filteredBoards.value.map((b) => ({ type: "board", id: b.id }));
  }
  return [
    ...quickActions.map((a) => ({ type: "action", item: a })),
    ...favorites.value.map((b) => ({ type: "board", id: b.id })),
    ...recents.value.map((b) => ({ type: "board", id: b.id })),
  ];
});

const filteredBoards = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  return (props.boards || []).filter(
    (b) =>
      (b.name || "").toLowerCase().includes(q) ||
      (b.projectKey || "").toLowerCase().includes(q)
  );
});

watch(
  () => props.open,
  async (v) => {
    if (v) {
      query.value = "";
      selected.value = 0;
      await nextTick();
      inputRef.value?.focus();
    }
  }
);

watch(query, () => {
  selected.value = 0;
});

const close = () => emit("close");

const goBoard = (id) => {
  close();
  router.push(`/boards/${id}`);
};

const run = (action) => {
  close();
  if (action.run) action.run();
  else if (action.path) router.push(action.path);
};

const move = (delta) => {
  const max = flatItems.value.length;
  if (!max) return;
  selected.value = (selected.value + delta + max) % max;
};

const runSelected = () => {
  const item = flatItems.value[selected.value];
  if (!item) return;
  if (item.type === "board") goBoard(item.id);
  else if (item.item) run(item.item);
};
</script>

<style scoped>
.cmd-palette {
  margin: -8px 0 0;
}

.cmd-search-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--kb-border);
  margin-bottom: 8px;
}

.cmd-icon {
  color: var(--kb-muted);
  font-size: 1rem;
}

.cmd-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  color: var(--kb-text);
}

.cmd-kbd {
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--kb-surface-2);
  color: var(--kb-muted);
  border: 1px solid var(--kb-border);
}

.cmd-section {
  padding: 8px 0;
}

.cmd-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--kb-muted);
  margin: 0 0 6px;
  padding: 0 8px;
}

.cmd-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: var(--kb-radius);
  background: transparent;
  text-align: left;
  font-size: 0.9rem;
  color: var(--kb-text);
  cursor: pointer;
}

.cmd-item:hover,
.cmd-item.active {
  background: var(--kb-accent-soft);
  color: var(--kb-accent-dim);
}

.cmd-item-icon {
  font-size: 1rem;
  opacity: 0.75;
}

.cmd-item-icon.fav {
  color: #ca8a04;
}

.cmd-empty {
  padding: 16px;
  text-align: center;
  color: var(--kb-muted);
  font-size: 0.9rem;
}
</style>
