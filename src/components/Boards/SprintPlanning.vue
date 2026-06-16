<template>
  <div class="sprint-planning kb-panel">
    <div class="toolbar">
      <h2>Sprint planning</h2>
      <a-button type="primary" @click="sprintModal = true">New sprint</a-button>
    </div>

    <a-row :gutter="16">
      <a-col :md="12" :xs="24">
        <a-card title="Backlog (unassigned)">
          <a-list :data-source="unassigned" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <span @click="emit('open-issue', item)" class="issue-link">
                  {{ formatIssueLabel(item) }}
                </span>
                <a-select
                  v-if="activeSprint"
                  placeholder="→ Sprint"
                  size="small"
                  style="width: 140px"
                  :options="[{ value: activeSprint.id, label: activeSprint.name }]"
                  @change="() => assign(item)"
                />
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-card :title="activeSprint ? activeSprint.name : 'No active sprint'">
          <template #extra>
            <a-select
              v-model:value="selectedSprintId"
              style="width: 160px"
              :options="sprintOptions"
              placeholder="Select sprint"
              @change="loadSprintIssues"
            />
            <a-button
              v-if="selectedSprintId"
              type="link"
              @click="handleStartSprint"
            >Start</a-button>
          </template>
          <a-list :data-source="sprintIssues" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <span @click="emit('open-issue', item)" class="issue-link">
                  {{ formatIssueLabel(item) }} · {{ item.listName }}
                </span>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      title="New sprint"
      :visible="sprintModal"
      @ok="createSprint"
      @cancel="sprintModal = false"
    >
      <a-input v-model:value="sprintName" placeholder="Sprint name (e.g. Sprint 1)" class="mb-2" />
      <a-input v-model:value="sprintGoal" placeholder="Sprint goal" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { v4 as uuid } from "uuid";
import { formatIssueLabel } from "../../helpers/jiraDefaults";
import {
  getBacklog,
  getSprints,
  addSprint,
  assignIssuesToSprint,
  startSprint,
  getSprintIssues,
} from "../../helpers/ApiHelper";

const props = defineProps({ boardId: String });
const emit = defineEmits(["open-issue", "board-updated"]);

const loading = ref(false);
const unassigned = ref([]);
const backlogListId = ref(null);
const sprints = ref([]);
const activeSprintId = ref(null);
const selectedSprintId = ref(null);
const sprintIssues = ref([]);
const sprintModal = ref(false);
const sprintName = ref("");
const sprintGoal = ref("");

const sprintOptions = computed(() =>
  sprints.value.map((s) => ({
    value: s.id,
    label: `${s.name} (${s.status})`,
  }))
);

const activeSprint = computed(() =>
  sprints.value.find((s) => s.id === (activeSprintId.value || selectedSprintId.value))
);

const refresh = async () => {
  loading.value = true;
  const [backlog, sprintData] = await Promise.all([
    getBacklog(props.boardId),
    getSprints(props.boardId),
  ]);
  backlogListId.value = backlog?.listId;
  unassigned.value = (backlog?.issues ?? []).filter((i) => !i.sprintId);
  sprints.value = sprintData?.sprints ?? backlog?.sprints ?? [];
  activeSprintId.value = sprintData?.activeSprintId ?? backlog?.activeSprintId;
  if (!selectedSprintId.value && sprints.value.length) {
    selectedSprintId.value = activeSprintId.value || sprints.value[0].id;
    await loadSprintIssues();
  }
  loading.value = false;
};

onMounted(refresh);

const loadSprintIssues = async () => {
  if (!selectedSprintId.value) return;
  const result = await getSprintIssues(props.boardId, selectedSprintId.value);
  sprintIssues.value = result?.issues ?? [];
};

const createSprint = async () => {
  if (!sprintName.value.trim()) return;
  const result = await addSprint(props.boardId, {
    id: uuid(),
    name: sprintName.value.trim(),
    goal: sprintGoal.value.trim(),
  });
  if (result?.board) {
    emit("board-updated", result.board);
    sprintModal.value = false;
    sprintName.value = "";
    sprintGoal.value = "";
    await refresh();
  }
};

const assign = async (issue) => {
  const sprintId = selectedSprintId.value || activeSprintId.value;
  if (!sprintId || !backlogListId.value) return;
  const result = await assignIssuesToSprint(props.boardId, sprintId, [
    { cardId: issue.id, listId: backlogListId.value },
  ]);
  if (result?.board) {
    emit("board-updated", result.board);
    await refresh();
  }
};

const handleStartSprint = async () => {
  if (!selectedSprintId.value) return;
  const result = await startSprint(props.boardId, selectedSprintId.value);
  if (result?.board) {
    emit("board-updated", result.board);
    await refresh();
  }
};

defineExpose({ refresh });
</script>

<style scoped>
.sprint-planning { margin: calc(var(--kb-header-h) + 56px) auto 32px; max-width: 1100px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.issue-link { cursor: pointer; color: var(--kb-accent); }
.issue-link:hover { text-decoration: underline; }
.mb-2 { margin-bottom: 8px; }
</style>
