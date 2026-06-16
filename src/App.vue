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
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#65a30d",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBorder: "rgba(9, 30, 66, 0.12)",
    colorText: "#172b4d",
    colorTextSecondary: "#5e6c84",
    borderRadius: 8,
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
