<template>
  <a-drawer
    :title="issue?.issueKey || 'Issue'"
    :open="open"
    width="520"
    @close="emit('close')"
  >
    <a-form v-if="issue" layout="vertical">
      <a-form-item label="Title">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="Type">
        <a-select v-model:value="form.issueType" :options="typeOptions" />
      </a-form-item>
      <a-form-item label="Priority">
        <a-select v-model:value="form.priority" :options="priorityOptions" />
      </a-form-item>
      <a-form-item v-if="form.issueType !== 'epic'" label="Epic">
        <a-select
          v-model:value="form.epicId"
          allow-clear
          placeholder="Link to epic"
          :options="epicOptions"
        />
      </a-form-item>
      <a-form-item v-if="form.parentEpicKey" label="Parent epic">
        <a-input :value="form.parentEpicKey" disabled />
      </a-form-item>
      <a-form-item label="Description">
        <a-textarea v-model:value="form.text" :rows="6" />
      </a-form-item>
      <a-button type="primary" :loading="saving" @click="save">Save changes</a-button>
    </a-form>

    <a-divider v-if="epicChildren.length">Epic children ({{ epicChildren.length }})</a-divider>
    <a-list v-if="epicChildren.length" :data-source="epicChildren" size="small">
      <template #renderItem="{ item }">
        <a-list-item>{{ formatIssueLabel(item) }} · {{ item.listName }}</a-list-item>
      </template>
    </a-list>

    <a-divider>Activity</a-divider>
    <a-list :data-source="activity" size="small">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta
            :title="`${item.username} · ${formatActivity(item)}`"
            :description="formatDate(item.createdAt)"
          />
        </a-list-item>
      </template>
    </a-list>

    <a-divider>Comments</a-divider>
    <a-list :data-source="comments" size="small">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta
            :title="item.username"
            :description="formatDate(item.createdAt)"
          />
          <p>{{ item.text }}</p>
        </a-list-item>
      </template>
    </a-list>
    <a-textarea
      v-model:value="newComment"
      placeholder="Add a comment..."
      :rows="3"
      class="comment-input"
    />
    <a-button type="primary" :loading="commenting" @click="postComment">Comment</a-button>
    <a-button danger class="delete-btn" @click="emit('delete')">Delete issue</a-button>
  </a-drawer>
</template>

<script setup>
import { reactive, watch, ref } from "vue";
import { ISSUE_TYPES, PRIORITIES } from "../../helpers/jiraDefaults";
import {
  editCard,
  getIssueComments,
  addIssueComment,
  getIssueActivity,
  getEpics,
  linkIssueToEpic,
  getEpicChildren,
} from "../../helpers/ApiHelper";
import { formatIssueLabel } from "../../helpers/jiraDefaults";

const props = defineProps({
  open: Boolean,
  boardId: String,
  listId: String,
  issue: Object,
});

const emit = defineEmits(["close", "updated", "delete"]);

const form = reactive({
  title: "",
  text: "",
  issueType: "task",
  priority: "medium",
  epicId: undefined,
  parentEpicKey: "",
});
const comments = ref([]);
const activity = ref([]);
const epicOptions = ref([]);
const epicChildren = ref([]);
const newComment = ref("");
const saving = ref(false);
const commenting = ref(false);

const typeOptions = ISSUE_TYPES.map((t) => ({ value: t.value, label: t.label }));
const priorityOptions = PRIORITIES.map((p) => ({ value: p.value, label: p.label }));

const formatDate = (d) => (d ? new Date(d).toLocaleString() : "");

const formatActivity = (item) => {
  switch (item.type) {
    case "issue_created":
      return "created this issue";
    case "field_changed":
      return `changed ${item.field} from "${item.from ?? "—"}" to "${item.to ?? "—"}"`;
    case "comment_added":
      return "added a comment";
    case "epic_linked":
      return `linked to epic ${item.meta?.epicKey || ""}`.trim();
    default:
      return item.type?.replace(/_/g, " ") || "updated";
  }
};

const loadComments = async () => {
  if (!props.boardId || !props.listId || !props.issue?.id) return;
  const result = await getIssueComments(props.boardId, props.listId, props.issue.id);
  comments.value = result?.comments ?? [];
};

const loadActivity = async () => {
  if (!props.boardId || !props.listId || !props.issue?.id) return;
  const result = await getIssueActivity(props.boardId, props.listId, props.issue.id);
  activity.value = result?.activity ?? [];
};

watch(
  () => props.issue,
  async (issue) => {
    if (!issue) return;
    form.title = issue.title || "";
    form.text = issue.text || "";
    form.issueType = issue.issueType || "task";
    form.priority = issue.priority || "medium";
    form.epicId = issue.epicId || undefined;
    form.parentEpicKey = issue.parentEpicKey || "";
    loadComments();
    loadActivity();
    const epicsResult = await getEpics(props.boardId);
    epicOptions.value = (epicsResult?.epics ?? []).map((e) => ({
      value: e.id,
      label: formatIssueLabel(e),
    }));
    if (issue.issueType === "epic") {
      const childrenResult = await getEpicChildren(props.boardId, issue.id);
      epicChildren.value = childrenResult?.children ?? [];
    } else {
      epicChildren.value = [];
    }
  },
  { immediate: true }
);

const save = async () => {
  saving.value = true;
  const result = await editCard(props.boardId, {
    listId: props.listId,
    id: props.issue.id,
    ...props.issue,
    ...form,
  });
  if (form.epicId && form.issueType !== "epic") {
    const linkResult = await linkIssueToEpic(props.boardId, props.listId, props.issue.id, form.epicId);
    if (linkResult?.board) {
      emit("updated", linkResult.board);
      saving.value = false;
      return;
    }
  }
  if (result?.board) {
    emit("updated", result.board);
    await loadActivity();
  }
  saving.value = false;
};

const postComment = async () => {
  if (!newComment.value.trim()) return;
  commenting.value = true;
  const result = await addIssueComment(
    props.boardId,
    props.listId,
    props.issue.id,
    newComment.value.trim()
  );
  if (result?.board) {
    emit("updated", result.board);
    newComment.value = "";
    comments.value = result.card?.comments ?? comments.value;
    await loadActivity();
  }
  commenting.value = false;
};
</script>

<style scoped>
.comment-input { margin: 12px 0; }
.delete-btn { margin-top: 16px; }
</style>
