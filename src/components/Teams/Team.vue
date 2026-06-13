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
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTeam, deleteTeam, removeTeamMember } from "../../helpers/ApiHelper";
import { store } from "../../store";

const route = useRoute();
const router = useRouter();

const state = reactive({
  isLoading: false,
  team: null,
});

const currentUserId = computed(() => String(store.state.user.id));

const isOwner = computed(() =>
  state.team?.members?.some(
    (member) =>
      String(member.userId) === currentUserId.value && member.role === "owner"
  )
);

const refresh = async () => {
  try {
    state.isLoading = true;
    const result = await getTeam(route.params.id);
    if (result?.success) {
      state.team = result.team;
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

const canRemoveMember = (member) => {
  const isOwner = state.team?.members?.some(
    (m) => String(m.userId) === currentUserId.value && m.role === "owner"
  );
  const isSelf = String(member.userId) === currentUserId.value;
  if (member.role === "owner") {
    return false;
  }
  return isOwner || isSelf;
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
  max-width: 720px;
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

.owner-actions {
  margin-top: 16px;
}

.member-name {
  font-weight: 600;
  min-width: 120px;
}
</style>
