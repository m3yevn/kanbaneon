<template>
  <div class="container">
    <a-spin :spinning="state.isLoading">
      <div v-if="state.organization" class="detail">
        <a-button class="back" @click="router.push('/organizations')">← Organizations</a-button>
        <a-card :title="state.organization.name">
          <p><strong>Key:</strong> {{ state.organization.slug }}</p>
          <p>{{ state.organization.description || "No description." }}</p>
          <a-divider />
          <div class="header-row">
            <h3>Projects (Jira boards)</h3>
            <a-button type="primary" @click="state.boardVisible = true">New Project</a-button>
          </div>
          <a-row :gutter="16" class="boards">
            <a-col v-for="board in state.boards" :key="board.id" :md="8" :xs="24">
              <a-card class="board-card" :title="`${board.projectKey || 'PRJ'} — ${board.name}`" @click="openBoard(board.id)" />
            </a-col>
          </a-row>
          <a-divider />
          <h3>Teams</h3>
          <a-list bordered :data-source="state.teams">
            <template #renderItem="{ item }">
              <a-list-item>{{ item.name }}</a-list-item>
            </template>
          </a-list>
        </a-card>
      </div>
    </a-spin>
    <a-modal title="New project board" :visible="state.boardVisible" @ok="createBoard" @cancel="state.boardVisible = false">
      <a-input v-model:value="state.boardName" placeholder="Project name" class="mb-2" />
      <a-input v-model:value="state.projectKey" :placeholder="`Key (default ${state.organization?.slug || 'KAN'})`" />
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { v4 as uuid } from "uuid";
import {
  getOrganization,
  getOrganizationBoards,
  getOrganizationTeams,
  addOrganizationBoard,
} from "../../helpers/ApiHelper";
import { getJiraDefaultLists } from "../../helpers/jiraDefaults";

const route = useRoute();
const router = useRouter();
const state = reactive({
  isLoading: false,
  organization: null,
  boards: [],
  teams: [],
  boardVisible: false,
  boardName: "",
  projectKey: "",
});

const refresh = async () => {
  state.isLoading = true;
  const [org, boards, teams] = await Promise.all([
    getOrganization(route.params.id),
    getOrganizationBoards(route.params.id),
    getOrganizationTeams(route.params.id),
  ]);
  if (org?.success) state.organization = org.organization;
  state.boards = boards?.boards ?? [];
  state.teams = teams?.teams ?? [];
  state.isLoading = false;
};

onMounted(refresh);

const openBoard = (id) => router.push(`/boards/${id}`);

const createBoard = async () => {
  if (!state.boardName.trim()) return;
  state.isLoading = true;
  const result = await addOrganizationBoard(route.params.id, {
    id: uuid(),
    name: state.boardName.trim(),
    projectKey: state.projectKey.trim() || state.organization?.slug,
    kanbanList: getJiraDefaultLists(),
  });
  if (result?.success) {
    state.boardVisible = false;
    state.boardName = "";
    state.projectKey = "";
    await refresh();
  }
  state.isLoading = false;
};
</script>

<style scoped>
.container { padding: 16px; margin-top: 140px; min-height: 70vh; background: #1a237e; }
.detail { max-width: 960px; margin: 0 auto; }
.back { margin-bottom: 16px; }
.header-row { display: flex; justify-content: space-between; align-items: center; }
.board-card { margin-bottom: 12px; cursor: pointer; }
.mb-2 { margin-bottom: 8px; }
</style>
