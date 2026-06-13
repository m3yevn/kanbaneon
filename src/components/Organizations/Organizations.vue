<template>
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
.col { padding-bottom: 16px; }
.add-new-btn-card { height: 307px; border: 2px dashed #dbdbdb; background: rgba(73,73,73,0.5); display: flex; justify-content: center; align-items: center; }
.add-new-btn { font-size: 18px; height: 46px; padding: 20px; }
.container { padding: 16px; min-height: 70vh; margin-top: 140px; background: #1a237e; }
.wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 70vh; }
.card { cursor: pointer; font-weight: bold; }
.org-slug { color: #90caf9; font-size: 12px; margin-bottom: 8px; }
</style>
