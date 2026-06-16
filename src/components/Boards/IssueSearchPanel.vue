<template>
  <div class="issue-search">
    <a-input-search
      v-model:value="query"
      placeholder="Search issues (key, title, assignee)..."
      enter-button="Search"
      @search="runSearch"
    />
    <div class="filters">
      <a-select
        v-model:value="filters.issueType"
        placeholder="Type"
        allow-clear
        :options="typeOptions"
        @change="runSearch"
      />
      <a-select
        v-model:value="filters.priority"
        placeholder="Priority"
        allow-clear
        :options="priorityOptions"
        @change="runSearch"
      />
      <a-select
        v-model:value="filters.epicId"
        placeholder="Epic"
        allow-clear
        :options="epicOptions"
        @change="runSearch"
      />
      <a-button @click="clearFilters">Clear</a-button>
    </div>
    <a-list v-if="results.length" :data-source="results" size="small" class="results">
      <template #renderItem="{ item }">
        <a-list-item class="result-row" @click="emit('open-issue', item)">
          <a-tag :color="typeColor(item.issueType)">{{ item.issueType }}</a-tag>
          <span>{{ formatIssueLabel(item) }}</span>
          <span class="list-badge">{{ item.listName }}</span>
          <span v-if="item.parentEpicKey" class="epic-badge">{{ item.parentEpicKey }}</span>
        </a-list-item>
      </template>
    </a-list>
    <p v-else-if="searched" class="empty">No issues match your filters.</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ISSUE_TYPES, PRIORITIES, formatIssueLabel } from "../../helpers/jiraDefaults";
import { searchIssues, getEpics } from "../../helpers/ApiHelper";

const props = defineProps({ boardId: String });
const emit = defineEmits(["open-issue"]);

const query = ref("");
const searched = ref(false);
const results = ref([]);
const epics = ref([]);
const filters = reactive({
  issueType: undefined,
  priority: undefined,
  epicId: undefined,
});

const typeOptions = ISSUE_TYPES.map((t) => ({ value: t.value, label: t.label }));
const priorityOptions = PRIORITIES.map((p) => ({ value: p.value, label: p.label }));
const epicOptions = ref([]);

const typeColor = (type) => ISSUE_TYPES.find((t) => t.value === type)?.color || "#999";

const runSearch = async () => {
  searched.value = true;
  const result = await searchIssues(props.boardId, {
    q: query.value,
    issueType: filters.issueType,
    priority: filters.priority,
    epicId: filters.epicId,
  });
  results.value = result?.issues ?? [];
};

const clearFilters = () => {
  query.value = "";
  filters.issueType = undefined;
  filters.priority = undefined;
  filters.epicId = undefined;
  results.value = [];
  searched.value = false;
};

onMounted(async () => {
  const result = await getEpics(props.boardId);
  epics.value = result?.epics ?? [];
  epicOptions.value = epics.value.map((e) => ({
    value: e.id,
    label: formatIssueLabel(e),
  }));
});
</script>

<style scoped>
.issue-search {
  background: var(--kb-surface-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--kb-border);
  padding: 14px 18px;
  border-radius: var(--kb-radius-lg);
  margin: 8px 24px 12px;
  max-width: 900px;
  box-shadow: var(--kb-shadow);
}
.filters {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.filters .ant-select { min-width: 120px; }
.results { margin-top: 12px; max-height: 200px; overflow-y: auto; }
.result-row { cursor: pointer; gap: 8px; }
.list-badge { color: var(--kb-muted); font-size: 12px; margin-left: auto; }
.epic-badge { color: var(--kb-violet); font-size: 12px; }
.empty { color: var(--kb-muted); margin-top: 8px; }
.result-row { cursor: pointer; gap: 8px; border-radius: 8px; }
.result-row:hover { background: var(--kb-accent-soft); }
</style>
