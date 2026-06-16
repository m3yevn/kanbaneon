<template>
  <div class="epic-board kb-panel">
    <div class="toolbar">
      <h2>Epics</h2>
      <span class="count">{{ epics.length }} epic{{ epics.length === 1 ? "" : "s" }}</span>
    </div>
    <a-spin :spinning="loading">
      <a-empty v-if="!epics.length" description="No epics yet — create an issue with type Epic" />
      <div v-else class="epic-list">
        <div v-for="epic in epics" :key="epic.id" class="epic-card">
          <div class="epic-header" @click="emit('open-issue', epic, epic.listId)">
            <a-tag color="#9c27b0">epic</a-tag>
            <strong>{{ formatIssueLabel(epic) }}</strong>
            <span class="child-count">{{ childrenFor(epic.id).length }} issues</span>
          </div>
          <div v-if="childrenFor(epic.id).length" class="child-list">
            <div
              v-for="child in childrenFor(epic.id)"
              :key="child.id"
              class="child-row"
              @click="emit('open-issue', child, child.listId)"
            >
              <a-tag :color="typeColor(child.issueType)">{{ child.issueType }}</a-tag>
              <span>{{ formatIssueLabel(child) }}</span>
              <span class="list-name">{{ child.listName }}</span>
            </div>
          </div>
          <p v-else class="no-children">No linked issues</p>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { formatIssueLabel, ISSUE_TYPES } from "../../helpers/jiraDefaults";
import { getEpics, getEpicChildren } from "../../helpers/ApiHelper";

const props = defineProps({ boardId: String });
const emit = defineEmits(["open-issue", "board-updated"]);

const loading = ref(false);
const epics = ref([]);
const childrenByEpic = ref({});

const typeColor = (type) => ISSUE_TYPES.find((t) => t.value === type)?.color || "#999";
const childrenFor = (epicId) => childrenByEpic.value[epicId] || [];

const refresh = async () => {
  loading.value = true;
  const result = await getEpics(props.boardId);
  epics.value = result?.epics ?? [];
  const map = {};
  await Promise.all(
    epics.value.map(async (epic) => {
      const childResult = await getEpicChildren(props.boardId, epic.id);
      map[epic.id] = childResult?.children ?? [];
    })
  );
  childrenByEpic.value = map;
  loading.value = false;
};

onMounted(refresh);
defineExpose({ refresh });
</script>

<style scoped>
.epic-board { margin: calc(var(--kb-header-h) + 56px) auto 32px; max-width: 960px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.count { color: var(--kb-muted); font-size: 14px; }
.epic-list { display: flex; flex-direction: column; gap: 16px; }
.epic-card {
  background: var(--kb-surface-2);
  border: 1px solid var(--kb-border);
  border-radius: var(--kb-radius-lg);
  padding: 16px;
  transition: border-color 0.2s;
}
.epic-card:hover { border-color: var(--kb-border-strong); }
.epic-header {
  display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 12px;
}
.child-count { margin-left: auto; color: var(--kb-muted); font-size: 12px; }
.child-list { display: flex; flex-direction: column; gap: 6px; padding-left: 8px; }
.child-row {
  display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: var(--kb-radius);
  cursor: pointer; background: rgba(0,0,0,0.2); border: 1px solid transparent;
  transition: border-color 0.2s, background 0.2s;
}
.child-row:hover { border-color: var(--kb-border-strong); background: var(--kb-accent-soft); }
.list-name { margin-left: auto; color: var(--kb-muted); font-size: 12px; }
.no-children { color: var(--kb-muted); font-size: 13px; margin: 0; padding-left: 8px; }
</style>
