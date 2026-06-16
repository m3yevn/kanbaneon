<template>
  <a-config-provider :theme="antTheme">
    <WorkspaceShell v-if="showWorkspace" :mobile="isMobile">
      <router-view />
    </WorkspaceShell>
    <template v-else>
      <router-view />
    </template>
  </a-config-provider>
</template>

<script>
import { theme } from "ant-design-vue";
import WorkspaceShell from "./components/Shared/WorkspaceShell.vue";

const antTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#84cc16",
    colorPrimaryHover: "#65a30d",
    colorPrimaryActive: "#4d7c0f",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#f4f5f7",
    colorBorder: "#dfe1e6",
    colorBorderSecondary: "#ebecf0",
    colorText: "#172b4d",
    colorTextSecondary: "#5e6c84",
    colorTextTertiary: "#97a0af",
    borderRadius: 8,
    borderRadiusLG: 12,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 14,
    controlHeight: 36,
    controlHeightLG: 44,
    boxShadow: "0 1px 2px rgba(9, 30, 66, 0.08)",
    boxShadowSecondary: "0 4px 12px rgba(9, 30, 66, 0.1)",
  },
  components: {
    Button: {
      primaryShadow: "0 1px 2px rgba(101, 163, 13, 0.25)",
      fontWeight: 600,
    },
    Card: {
      paddingLG: 20,
    },
    Menu: {
      itemBorderRadius: 8,
    },
  },
};

export default {
  data() {
    return {
      isMobile: window.matchMedia("(max-width: 767px)").matches,
      resizeListener: null,
      antTheme,
    };
  },
  components: {
    WorkspaceShell,
  },
  computed: {
    showWorkspace() {
      if (!this.$store.state.user.isLoggedIn) return false;
      const publicPaths = ["/", "/login", "/signup", "/docs", "/privacy-policy", "/terms-and-conditions", "/forgot", "/recovery"];
      return !publicPaths.some((p) => this.$route.path === p || this.$route.path.startsWith(p + "?"));
    },
  },
  methods: {
    handleListenScreen() {
      const mq = window.matchMedia("(max-width: 767px)");
      const update = () => {
        this.isMobile = mq.matches;
      };
      this.resizeListener = update;
      mq.addEventListener("change", update);
      update();
    },
    handleUnlistenScreen() {
      const mq = window.matchMedia("(max-width: 767px)");
      if (this.resizeListener) mq.removeEventListener("change", this.resizeListener);
      this.resizeListener = null;
    },
  },
  mounted() {
    this.handleListenScreen();
  },
  beforeUnmount() {
    this.handleUnlistenScreen();
  },
};
</script>
