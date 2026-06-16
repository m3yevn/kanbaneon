<template>
  <div class="kb-workspace" :class="{ 'kb-mobile': mobile, 'kb-sidebar-open': sidebarOpen }">
    <button
      v-if="mobile"
      type="button"
      class="kb-mobile-toggle"
      aria-label="Toggle navigation"
      @click="sidebarOpen = !sidebarOpen"
    >
      ☰
    </button>

    <aside class="kb-sidebar" aria-label="Workspace navigation">
      <div class="kb-sidebar-brand" @click="goHome">
        <span class="kb-brand">KAN</span><span class="kb-brand-sub">BANEON</span>
      </div>

      <nav class="kb-sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="kb-nav-item"
          :class="{ active: isActive(item.path) }"
          @click="sidebarOpen = false"
        >
          <component :is="item.icon" class="kb-nav-icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <button type="button" class="kb-cmd-trigger" @click="openPalette">
        <SearchOutlined />
        <span>Search</span>
        <kbd>{{ modKey }}K</kbd>
      </button>

      <div class="kb-sidebar-footer">
        <router-link to="/docs" class="kb-nav-item subtle">Documentation</router-link>
        <router-link to="/privacy-policy" class="kb-nav-item subtle">Privacy</router-link>
        <router-link to="/terms-and-conditions" class="kb-nav-item subtle">Terms</router-link>
      </div>
    </aside>

    <div v-if="mobile && sidebarOpen" class="kb-sidebar-backdrop" @click="sidebarOpen = false" />

    <div class="kb-main">
      <AppHeader compact :mobile="mobile" @open-search="openPalette" />
      <div class="kb-main-scroll">
        <slot />
      </div>
    </div>

    <CommandPalette
      :open="paletteOpen"
      :boards="boards"
      @close="paletteOpen = false"
      @new-project="goNewProject"
    />
  </div>
</template>

<script>
import {
  BorderInnerOutlined,
  TeamOutlined,
  ApartmentOutlined,
  SettingOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import AppHeader from "./Header.vue";
import CommandPalette from "./CommandPalette.vue";
import { getBoards } from "../../helpers/ApiHelper";

export default {
  name: "WorkspaceShell",
  components: { AppHeader, CommandPalette, SearchOutlined },
  props: {
    mobile: { type: Boolean, default: false },
  },
  data() {
    return {
      paletteOpen: false,
      sidebarOpen: false,
      boards: [],
      keyHandler: null,
      modKey: navigator.platform?.includes("Mac") ? "⌘" : "Ctrl+",
    };
  },
  computed: {
    isLite() {
      return import.meta.env.VITE_LITE_VERSION === "ON";
    },
    navItems() {
      const boards = { path: "/boards", label: "Projects", icon: BorderInnerOutlined };
      if (this.isLite) return [boards];
      return [
        boards,
        { path: "/teams", label: "Teams", icon: TeamOutlined },
        { path: "/organizations", label: "Organizations", icon: ApartmentOutlined },
        { path: "/profile", label: "Profile", icon: UserOutlined },
        { path: "/settings", label: "Settings", icon: SettingOutlined },
      ];
    },
  },
  methods: {
    goHome() {
      this.$router.push("/boards");
    },
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + "/");
    },
    openPalette() {
      this.paletteOpen = true;
      this.loadBoards();
    },
    goNewProject() {
      this.paletteOpen = false;
      this.$router.push("/boards");
      this.$nextTick(() => window.dispatchEvent(new CustomEvent("kanbaneon:new-project")));
    },
    async loadBoards() {
      if (this.isLite) {
        this.boards = this.$store.getters.currentBoards || [];
        return;
      }
      const result = await getBoards();
      this.boards = result?.boards ?? [];
    },
    onKeydown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.openPalette();
      }
    },
  },
  mounted() {
    this.keyHandler = (e) => this.onKeydown(e);
    window.addEventListener("keydown", this.keyHandler);
    this.loadBoards();
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.keyHandler);
  },
};
</script>

<style scoped>
.kb-workspace {
  display: flex;
  min-height: 100vh;
  background: var(--kb-bg);
}

.kb-sidebar {
  width: var(--kb-sidebar-w);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--kb-surface);
  border-right: 1px solid var(--kb-border);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
}

.kb-mobile .kb-sidebar {
  transform: translateX(-100%);
  transition: transform 0.2s ease;
  box-shadow: none;
}

.kb-mobile.kb-sidebar-open .kb-sidebar {
  transform: translateX(0);
  box-shadow: 4px 0 24px rgba(9, 30, 66, 0.15);
}

.kb-sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(9, 30, 66, 0.35);
  z-index: 199;
}

.kb-mobile-toggle {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 210;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--kb-border);
  background: var(--kb-surface);
  font-size: 1.1rem;
  cursor: pointer;
}

.kb-sidebar-brand {
  padding: 20px 20px 16px;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  cursor: pointer;
  user-select: none;
}

.kb-mobile .kb-sidebar-brand {
  padding-top: 56px;
}

.kb-sidebar-nav {
  flex: 1;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kb-cmd-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px 12px;
  padding: 10px 12px;
  border-radius: var(--kb-radius);
  border: 1px solid var(--kb-border);
  background: var(--kb-surface-2);
  color: var(--kb-muted);
  font-size: 0.85rem;
  cursor: pointer;
  text-align: left;
}

.kb-cmd-trigger kbd {
  margin-left: auto;
  font-size: 0.65rem;
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--kb-surface);
  border: 1px solid var(--kb-border);
}

.kb-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--kb-radius);
  color: var(--kb-muted);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}

.kb-nav-item:hover {
  background: var(--kb-surface-2);
  color: var(--kb-text);
  text-decoration: none;
}

.kb-nav-item.active {
  background: var(--kb-accent-soft);
  color: var(--kb-accent-dim);
  font-weight: 600;
}

.kb-nav-item.subtle {
  font-size: 0.8rem;
  padding: 8px 12px;
}

.kb-nav-icon {
  font-size: 1rem;
  opacity: 0.85;
}

.kb-sidebar-footer {
  padding: 12px 12px 20px;
  border-top: 1px solid var(--kb-border);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kb-main {
  flex: 1;
  margin-left: var(--kb-sidebar-w);
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.kb-mobile .kb-main {
  margin-left: 0;
}

.kb-main-scroll {
  flex: 1;
}
</style>
