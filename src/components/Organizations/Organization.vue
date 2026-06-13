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
          <div class="header-row">
            <h3>Teams</h3>
            <a-button type="primary" @click="state.teamVisible = true">New Team</a-button>
          </div>
          <a-list bordered :data-source="state.teams">
            <template #renderItem="{ item }">
              <a-list-item class="team-item" @click="openTeam(item.id)">
                {{ item.name }}
                <span class="team-desc">{{ item.description }}</span>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </div>
    </a-spin>
    <a-modal title="New project board" :visible="state.boardVisible" @ok="createBoard" @cancel="state.boardVisible = false">
      <a-input v-model:value="state.boardName" placeholder="Project name" class="mb-2" />
      <a-input v-model:value="state.projectKey" :placeholder="`Key (default ${state.organization?.slug || 'KAN'})`" />
    </a-modal>
    <a-modal title="New team in organization" :visible="state.teamVisible" @ok="createTeam" @cancel="state.teamVisible = false">
      <a-input v-model:value="state.teamName" placeholder="Team name" class="mb-2" />
      <a-textarea v-model:value="state.teamDescription" placeholder="Description" :rows="3" />
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
  addOrganizationTeam,
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
  teamVisible: false,
  boardName: "",
  projectKey: "",
  teamName: "",
  teamDescription: "",
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
const openTeam = (id) => router.push(`/teams/${id}`);

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

const createTeam = async () => {
  if (!state.teamName.trim()) return;
  state.isLoading = true;
  const result = await addOrganizationTeam(route.params.id, {
    id: uuid(),
    name: state.teamName.trim(),
    description: state.teamDescription.trim(),
    members: [],
  });
  if (result?.success) {
    state.teamVisible = false;
    state.teamName = "";
    state.teamDescription = "";
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
.team-item { cursor: pointer; }
.team-desc { color: #888; margin-left: 8px; font-size: 12px; }
.mb-2 { margin-bottom: 8px; }
</style>
