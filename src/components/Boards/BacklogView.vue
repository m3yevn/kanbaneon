<template>
  <div class="backlog-view">
    <div class="toolbar">
      <h2>Backlog</h2>
      <a-button type="primary" @click="emit('create')">Create issue</a-button>
    </div>
    <a-spin :spinning="loading">
      <a-empty v-if="!issues.length" description="No backlog issues yet" />
      <div v-else class="issue-list">
        <div v-for="(issue, index) in issues" :key="issue.id" class="issue-row">
          <div class="rank-btns">
            <a-button size="small" :disabled="index === 0" @click="moveUp(index)">↑</a-button>
            <a-button size="small" :disabled="index === issues.length - 1" @click="moveDown(index)">↓</a-button>
          </div>
          <div class="issue-main" @click="emit('open-issue', issue)">
            <a-tag :color="typeColor(issue.issueType)">{{ issue.issueType }}</a-tag>
            <strong>{{ formatIssueLabel(issue) }}</strong>
            <span class="priority">{{ issue.priority }}</span>
          </div>
          <a-select
            v-if="sprints.length"
            placeholder="Add to sprint"
            style="width: 160px"
            :options="sprintOptions"
            @change="(sprintId) => assignToSprint(issue, sprintId)"
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { formatIssueLabel, ISSUE_TYPES } from "../../helpers/jiraDefaults";
import {
  getBacklog,
  reorderBacklog,
  assignIssuesToSprint,
} from "../../helpers/ApiHelper";

const props = defineProps({ boardId: String });
const emit = defineEmits(["open-issue", "create", "board-updated"]);

const loading = ref(false);
const issues = ref([]);
const listId = ref(null);
const sprints = ref([]);

const sprintOptions = computed(() =>
  sprints.value.map((s) => ({ value: s.id, label: s.name }))
);

const typeColor = (type) => ISSUE_TYPES.find((t) => t.value === type)?.color || "#999";

const refresh = async () => {
  loading.value = true;
  const result = await getBacklog(props.boardId);
  issues.value = result?.issues ?? [];
  listId.value = result?.listId;
  sprints.value = result?.sprints ?? [];
  loading.value = false;
};

onMounted(refresh);

const persistOrder = async () => {
  const result = await reorderBacklog(
    props.boardId,
    issues.value.map((i) => i.id)
  );
  if (result?.board) emit("board-updated", result.board);
};

const moveUp = async (index) => {
  if (index === 0) return;
  const copy = [...issues.value];
  [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
  issues.value = copy;
  await persistOrder();
};

const moveDown = async (index) => {
  if (index >= issues.value.length - 1) return;
  const copy = [...issues.value];
  [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
  issues.value = copy;
  await persistOrder();
};

const assignToSprint = async (issue, sprintId) => {
  if (!sprintId || !listId.value) return;
  const result = await assignIssuesToSprint(props.boardId, sprintId, [
    { cardId: issue.id, listId: listId.value },
  ]);
  if (result?.board) {
    emit("board-updated", result.board);
    await refresh();
  }
};

defineExpose({ refresh });
</script>

<style scoped>
.backlog-view { padding: 16px; margin-top: 180px; max-width: 960px; margin-left: auto; margin-right: auto; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.issue-list { display: flex; flex-direction: column; gap: 8px; }
.issue-row {
  display: flex; align-items: center; gap: 12px;
  background: #fff; padding: 12px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
.issue-main { flex: 1; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.priority { color: #888; font-size: 12px; text-transform: capitalize; }
.rank-btns { display: flex; flex-direction: column; gap: 2px; }
</style>
