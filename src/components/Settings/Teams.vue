<template>
  <section class="settings-teams">
    <p class="hint">
      Manage your teams from the teams page. You can create teams, invite members, and
      collaborate on boards.
    </p>
    <a-button type="primary" @click="goToTeams">Go to Your Teams</a-button>
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
.settings-teams {
  padding: 8px 0;
}

.hint {
  margin-bottom: 16px;
  color: #555;
}
</style>
