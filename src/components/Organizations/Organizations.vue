<template>
  <div class="orgs-hub">
    <header class="hub-header">
      <div>
        <h1>Organizations</h1>
        <p class="hub-sub">Workspaces that group projects and teams.</p>
      </div>
      <a-button type="primary" size="large" @click="openCreate">
        <PlusIcon /> New organization
      </a-button>
    </header>
  <div class="container">
    <a-spin :spinning="state.isLoading" tip="Loading..." size="large">
      <a-row v-if="state.organizations?.length" :gutter="16">
        <a-col :xs="24" :md="6" class="col">
          <a-card class="add-new-btn-card" @click="openCreate">
            <a-button type="primary" size="large"><PlusIcon />New Organization</a-button>
          </a-card>
        </a-col>
        <a-col class="col" :xs="24" :md="6" v-for="org in state.organizations" :key="org.id">
          <a-card class="card" :title="org.name" @click="goTo(org.id)">
            <p class="org-slug">{{ org.slug }}</p>
            <TeamImg />
          </a-card>
        </a-col>
      </a-row>
      <div v-if="!state.organizations?.length && !state.isLoading" class="wrapper">
        <CreateTeamImg />
        <a-button @click="openCreate" class="add-new-btn" type="primary" size="large">
          Create Organization
        </a-button>
      </div>
    </a-spin>
  </div>
  <a-modal title="New organization (Jira workspace)" :visible="state.visible" @ok="create" @cancel="close">
    <a-form layout="vertical">
      <a-form-item label="Name"><a-input v-model:value="state.form.name" /></a-form-item>
      <a-form-item label="Project key prefix"><a-input v-model:value="state.form.slug" placeholder="e.g. KAN" /></a-form-item>
      <a-form-item label="Description"><a-textarea v-model:value="state.form.description" :rows="4" /></a-form-item>
    </a-form>
  </a-modal>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { v4 as uuid } from "uuid";
import TeamImg from "../../assets/Team.vue";
import CreateTeamImg from "../../assets/CreateTeam.vue";
import PlusIcon from "../../assets/PlusIcon.vue";
import { getOrganizations, addOrganization } from "../../helpers/ApiHelper";
import { message } from "ant-design-vue";

const router = useRouter();
const state = reactive({
  isLoading: false,
  organizations: [],
  visible: false,
  form: { name: "", slug: "", description: "" },
});

const refresh = async () => {
  state.isLoading = true;
  const result = await getOrganizations();
  state.organizations = result?.organizations ?? [];
  state.isLoading = false;
};

onMounted(refresh);

const goTo = (id) => router.push(`/organizations/${id}`);
const openCreate = () => { state.visible = true; };
const close = () => { state.visible = false; state.form = { name: "", slug: "", description: "" }; };

const create = async () => {
  if (!state.form.name?.trim()) return message.error("Name required");
  state.isLoading = true;
  const result = await addOrganization({
    id: uuid(),
    name: state.form.name.trim(),
    slug: state.form.slug?.trim() || state.form.name,
    description: state.form.description?.trim() || "",
    members: [],
  });
  if (result?.success) { close(); await refresh(); }
  state.isLoading = false;
};
</script>

<style scoped>
.orgs-hub {
  padding: 24px 24px 0;
}

.hub-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.hub-header h1 {
  margin: 0 0 4px;
  font-size: 1.75rem;
  font-weight: 700;
}

.hub-sub {
  margin: 0;
  color: var(--kb-muted);
}

.col { padding-bottom: 16px; }

.add-new-btn-card {
  min-height: 200px;
  border: 2px dashed var(--kb-border-strong) !important;
  background: var(--kb-surface-2) !important;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--kb-radius-lg);
}

.add-new-btn { font-size: 1rem; }

.container {
  padding: 0 0 32px;
  min-height: 50vh;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: 16px;
  text-align: center;
}

.card {
  cursor: pointer;
  border-radius: var(--kb-radius-lg);
  border: 1px solid var(--kb-border);
  transition: transform 0.15s, box-shadow 0.15s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--kb-shadow);
}

.org-slug {
  color: var(--kb-accent);
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 8px;
}
</style>
