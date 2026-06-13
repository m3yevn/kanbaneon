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
      <a-form-item label="Description">
        <a-textarea v-model:value="form.text" :rows="6" />
      </a-form-item>
      <a-button type="primary" :loading="saving" @click="save">Save changes</a-button>
    </a-form>

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
} from "../../helpers/ApiHelper";

const props = defineProps({
  open: Boolean,
  boardId: String,
  listId: String,
  issue: Object,
});

const emit = defineEmits(["close", "updated", "delete"]);

const form = reactive({ title: "", text: "", issueType: "task", priority: "medium" });
const comments = ref([]);
const newComment = ref("");
const saving = ref(false);
const commenting = ref(false);

const typeOptions = ISSUE_TYPES.map((t) => ({ value: t.value, label: t.label }));
const priorityOptions = PRIORITIES.map((p) => ({ value: p.value, label: p.label }));

const formatDate = (d) => (d ? new Date(d).toLocaleString() : "");

const loadComments = async () => {
  if (!props.boardId || !props.listId || !props.issue?.id) return;
  const result = await getIssueComments(props.boardId, props.listId, props.issue.id);
  comments.value = result?.comments ?? [];
};

watch(
  () => props.issue,
  (issue) => {
    if (!issue) return;
    form.title = issue.title || "";
    form.text = issue.text || "";
    form.issueType = issue.issueType || "task";
    form.priority = issue.priority || "medium";
    loadComments();
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
  if (result?.board) {
    emit("updated", result.board);
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
  }
  commenting.value = false;
};
</script>

<style scoped>
.comment-input { margin: 12px 0; }
.delete-btn { margin-top: 16px; }
</style>
