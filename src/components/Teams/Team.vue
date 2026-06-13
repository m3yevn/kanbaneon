<template>
  <div class="container">
    <a-spin :spinning="state.isLoading" tip="Loading..." size="large">
      <div v-if="state.team" class="team-detail">
        <a-button class="back-btn" @click="handleBack">← Back to teams</a-button>

        <a-card :title="state.team.name">
          <p class="description">{{ state.team.description || "No description yet." }}</p>

          <a-divider />

          <h3>Members</h3>
          <a-list
            bordered
            item-layout="horizontal"
            :data-source="state.team.members"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <span class="member-name">{{ item.username }}</span>
                <a-tag :color="item.role === 'owner' ? 'gold' : 'blue'">
                  {{ item.role }}
                </a-tag>
                <a-button
                  v-if="canRemoveMember(item)"
                  danger
                  size="small"
                  @click="handleRemoveMember(item.userId)"
                >
                  Remove
                </a-button>
              </a-list-item>
            </template>
          </a-list>

          <a-divider />

          <div class="boards-header">
            <h3>Team Boards</h3>
            <a-button type="primary" @click="state.boardVisible = true">
              New Board
            </a-button>
          </div>

          <a-row v-if="state.boards.length" :gutter="16" class="boards-grid">
            <a-col
              v-for="board in state.boards"
              :key="board.id"
              :xs="24"
              :md="8"
            >
              <a-card class="board-card" :title="board.name" @click="openBoard(board.id)">
                Shared kanban board
              </a-card>
            </a-col>
          </a-row>
          <p v-else class="empty-boards">No team boards yet. Create one to collaborate.</p>

          <div v-if="isOwner" class="owner-actions">
            <a-divider />
            <a-popconfirm
              title="Delete this team permanently?"
              ok-text="Delete"
              cancel-text="Cancel"
              @confirm="handleDeleteTeam"
            >
              <a-button danger>Delete Team</a-button>
            </a-popconfirm>
          </div>
        </a-card>
      </div>
    </a-spin>

    <a-modal
      title="Create team board"
      :visible="state.boardVisible"
      @ok="handleAddBoard"
      @cancel="state.boardVisible = false"
    >
      <a-input
        v-model:value="state.boardName"
        placeholder="Board name"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { v4 as uuid } from "uuid";
import {
  getTeam,
  deleteTeam,
  removeTeamMember,
  getTeamBoards,
  addTeamBoard,
} from "../../helpers/ApiHelper";
import { store } from "../../store";
import { message } from "ant-design-vue";

const route = useRoute();
const router = useRouter();

const getTemplateList = () => [
  { id: uuid(), name: "To-Do", children: [] },
  { id: uuid(), name: "Doing", children: [] },
  { id: uuid(), name: "Done", children: [] },
];

const state = reactive({
  isLoading: false,
  team: null,
  boards: [],
  boardVisible: false,
  boardName: "",
});

const currentUserId = computed(() => String(store.state.user.id));

const isOwner = computed(() =>
  state.team?.members?.some(
    (member) =>
      String(member.userId) === currentUserId.value && member.role === "owner"
  )
);

const refreshBoards = async () => {
  const result = await getTeamBoards(route.params.id);
  state.boards = result?.boards ?? [];
};

const refresh = async () => {
  try {
    state.isLoading = true;
    const result = await getTeam(route.params.id);
    if (result?.success) {
      state.team = result.team;
      await refreshBoards();
    }
  } catch (ex) {
    console.error(ex);
  } finally {
    state.isLoading = false;
  }
};

onMounted(() => {
  refresh();
});

const handleBack = () => {
  router.push("/teams");
};

const openBoard = (boardId) => {
  router.push(`/boards/${boardId}`);
};

const handleAddBoard = async () => {
  if (!state.boardName.trim()) {
    message.error("Board name is required.");
    return;
  }

  try {
    state.isLoading = true;
    const result = await addTeamBoard(route.params.id, {
      id: uuid(),
      name: state.boardName.trim(),
      kanbanList: getTemplateList(),
    });

    if (result?.success) {
      state.boardVisible = false;
      state.boardName = "";
      await refreshBoards();
    }
  } catch (ex) {
    console.error(ex);
  } finally {
    state.isLoading = false;
  }
};

const canRemoveMember = (member) => {
  const owner = state.team?.members?.some(
    (m) => String(m.userId) === currentUserId.value && m.role === "owner"
  );
  const isSelf = String(member.userId) === currentUserId.value;
  if (member.role === "owner") {
    return false;
  }
  return owner || isSelf;
};

const handleRemoveMember = async (userId) => {
  try {
    state.isLoading = true;
    const result = await removeTeamMember(route.params.id, userId);
    if (result?.success) {
      if (String(userId) === currentUserId.value) {
        router.push("/teams");
        return;
      }
      await refresh();
    }
  } catch (ex) {
    console.error(ex);
  } finally {
    state.isLoading = false;
  }
};

const handleDeleteTeam = async () => {
  try {
    state.isLoading = true;
    const result = await deleteTeam(route.params.id);
    if (result?.success) {
      router.push("/teams");
    }
  } catch (ex) {
    console.error(ex);
  } finally {
    state.isLoading = false;
  }
};
</script>

<style scoped>
.container {
  padding: 16px;
  min-height: 70vh;
  margin-top: 140px;
  background: #42b883;
}

.team-detail {
  max-width: 900px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  color: #444;
  white-space: pre-wrap;
}

.boards-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.boards-grid {
  margin-top: 8px;
}

.board-card {
  cursor: pointer;
  margin-bottom: 12px;
}

.board-card:hover {
  transform: scale(1.02);
}

.empty-boards {
  color: #666;
}

.owner-actions {
  margin-top: 16px;
}

.member-name {
  font-weight: 600;
  min-width: 120px;
}
</style>
