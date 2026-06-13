<template>
  <section class="settings-organization">
    <p class="hint">
      Organizations group multiple teams under one workspace. This feature is planned
      for a future release — for now, use Teams to collaborate with members on shared boards.
    </p>
    <a-button type="primary" @click="goToTeams">Manage Teams</a-button>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToTeams = () => {
  router.push("/teams");
};
</script>

<style scoped>
.settings-organization {
  padding: 8px 0;
}

.hint {
  margin-bottom: 16px;
  color: #555;
}
</style>
