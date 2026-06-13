<template>
  <section class="settings-organization">
    <p class="hint">
      Organizations are Jira-style workspaces — group teams and projects under one company account.
    </p>
    <a-button type="primary" @click="goToOrganizations">Manage Organizations</a-button>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goToOrganizations = () => router.push("/organizations");
</script>

<style scoped>
.settings-organization { padding: 8px 0; }
.hint { margin-bottom: 16px; color: #555; }
</style>
