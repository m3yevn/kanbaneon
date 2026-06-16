<template>
  <a-config-provider :theme="antTheme">
    <AppHeader v-if="$store.state.user.isLoggedIn && largeScreen && $route.path !== '/'" />
    <router-view v-if="largeScreen" />
    <MobileMessage v-if="!largeScreen" />
  </a-config-provider>
</template>

<script>
import { theme } from "ant-design-vue";
import AppHeader from "./components/Shared/Header.vue";
import MobileMessage from "./components/Views/MobileMessage.vue";

const antTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#22d3ee",
    colorBgContainer: "#111827",
    colorBgElevated: "#1a2332",
    colorBorder: "rgba(148, 163, 184, 0.14)",
    colorText: "#f1f5f9",
    colorTextSecondary: "#94a3b8",
    borderRadius: 10,
    fontFamily: "'Inter', system-ui, sans-serif",
  },
};

export default {
  data() {
    return {
      largeScreen: window.matchMedia("(min-width:1024px)").matches,
      resizeListener: null,
      antTheme,
    };
  },
  components: {
    AppHeader,
    MobileMessage,
  },
  methods: {
    handleListenScreen() {
      this.resizeListener = window.addEventListener("resize", () => {
        this.largeScreen = window.matchMedia("(min-width:1024px)").matches;
      });
    },
    handleUnlistenScreen() {
      window.removeEventListener(this.resizeListener);
      this.resizeListener = null;
    },
  },
  watch: {
    "$store.state.user"() {
      return this.$store.state.user;
    },
  },
  async mounted() {
    this.handleListenScreen();
  },
  beforeUnmount() {
    this.handleUnlistenScreen();
  },
};
</script>
