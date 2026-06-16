<template>
  <div class="header" :class="{ compact }">
    <div class="row-container">

      <a-row class="header-body" align="middle" :class="{ 'kb-mobile-pad': mobile }">
        <a-col v-if="!compact" class="icon-container" :md="showNewList ? 14 : 18" :xl="showNewList ? 18 : 21"
          :xxl="showNewList ? 18 : 22">
          <h2 class="title" @click="handleDirectHome">
            KAN<span class="subtitle">BANEON</span>
          </h2>
        </a-col>
        <a-col v-else flex="auto" class="breadcrumb-inline">
          <a-breadcrumb>
            <a-breadcrumb-item><router-link to="/boards">Projects</router-link></a-breadcrumb-item>
            <a-breadcrumb-item v-if="$route.name">{{ $route.name }}</a-breadcrumb-item>
            <a-breadcrumb-item v-if="currentBoard?.name">{{ currentBoard?.name }}</a-breadcrumb-item>
          </a-breadcrumb>
        </a-col>
        <a-col class="icon-btn-wrapper">
          <a-button v-if="compact" type="text" class="search-btn" aria-label="Search" @click="$emit('open-search')">
            <SearchOutlined />
          </a-button>
          <div class="icon-btn" v-if="showNewList" shape="round"
            @click="largeScreen ? (visibleEditBoard = true) : (popupMenu = true)">
            <DotsIcon />
          </div>
        </a-col>
        <a-col v-if="$store.state.user.isLoggedIn" class="user-col">
          <a-popover :title="$store.state.user.username" trigger="click">
            <template #content>
              <span class="name">{{ $store.state.profile?.name }}</span>
              <user-menu />
              <p><a-button block @click="logout">Logout</a-button></p>
            </template>
            <div class="avatar" :size="64">
              <img v-if="!isLite && $store.state.profile.details?.profilePicture?.link"
                :src="$store.state.profile.details?.profilePicture?.link" />
              <UserIcon v-else />
            </div>
          </a-popover>
        </a-col>
      </a-row>

      <a-row v-if="!compact" class="header-breadcrumb">
        <h3>
          <a-breadcrumb>
            <a-breadcrumb-item><router-link to="/boards">Projects</router-link></a-breadcrumb-item>
            <a-breadcrumb-item :key="$route.path">{{ $route.name }}</a-breadcrumb-item>
            <a-breadcrumb-item v-if="currentBoard?.name" :key="currentBoard?.name">
              {{ currentBoard?.name }}</a-breadcrumb-item>
          </a-breadcrumb>
        </h3>
      </a-row>
    </div>
  </div>
  <a-modal title="Edit board" :visible="visibleEditBoard" @ok="handleOkEditBoard" @cancel="handleCancelEditBoard">
    <a-input class="ant-input" placeholder="Name" :value="boardDialog.editingBoard.name"
      @change="handleBoardNameChange" />
    <label class="error-label">{{ boardDialog.error.name }}</label>
    <template v-slot:footer>
      <a-button class="btn-danger" type="danger" @click="handleDeleteBoard">Delete</a-button>
      <a-button key="back" @click="handleCancelEditBoard"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOkEditBoard">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <a-modal title="Save & Exit" :visible="visibleSave" @ok="handleOk" @cancel="handleCancelSave">
    <p>Do you want to save this board and go back to home page?</p>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancelSave"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleSaveData">
        Confirm
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import DotsIcon from "../../assets/DotsIcon.vue";
import UserIcon from "../../assets/UserIcon.vue";
import UserMenu from "./UserMenu.vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { addListOnCanvas } from "../../utils/DrawCanvas";
import { deleteBoard, getBoard } from "../../helpers/ApiHelper";

export default {
  name: "AppHeader",
  props: {
    compact: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
  },
  emits: ["open-search"],
  data() {
    return {
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      smallScreen: window.matchMedia("(max-width:456px)").matches,
      largeScreen: window.matchMedia("(min-width:456px)").matches,
      showNewList: /^\/boards\/[^/]+/.test(this.$route.path),
      visible: false,
      visibleSave: false,
      visibleEditBoard: false,
      name: "",
      error: {
        name: "",
      },
      currentBoard: {},
      boardDialog: {
        editingBoard: {
          name: "",
        },
        error: {
          name: "",
        },
      },
    };
  },
  components: {
    UserIcon,
    DotsIcon,
    UserMenu,
    SearchOutlined,
  },
  watch: {
    async $route(to, from) {
      await this.handleCheckRoute();
    },
  },
  mounted() {
    this.handleCheckRoute();
  },
  computed: {
    parentRoute() {
      const parent = this.$route.matched[this.$route.matched.length - 2];
      return parent;
    }
  },
  methods: {
    async logout() {
      this.$store.commit("setUser", {
        isLoggedIn: false,
        username: "",
        id: undefined,
      });
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    async handleSaveData() {
      this.visibleSave = false;
      this.$router.push("/");
    },
    handleDirectHome() {
      this.$router.push("/");
    },
    async handleOkEditBoard() {
      this.currentBoard.name = this.boardDialog.editingBoard.name;
      this.$store.commit("editKanbanBoard", this.boardDialog.editingBoard);
      this.handleCancelEditBoard();
    },
    async handleDeleteBoard() {
      await deleteBoard(this.$store.getters.currentBoardID);
      this.currentBoard.name = null;
      await this.$store.commit("setCurrentBoardID", null);
      this.$router.push("/");
      this.handleCancelEditBoard();
    },
    handleOk() {
      if (!this.name) {
        return (this.error.name = !this.name ? "*required" : "");
      }

      const addingList = { name: this.name };
      addListOnCanvas(addingList);
      this.handleCancel();
    },
    handleNameChange(e) {
      this.name = e.target.value;
      this.error.name = !this.name ? "*required" : "";
    },
    handleBoardNameChange(e) {
      this.boardDialog.editingBoard.name = e.target.value;
      this.boardDialog.error.name = !this.boardDialog.editingBoard.name
        ? "*required"
        : "";
    },
    handleCancelSave() {
      this.visibleSave = false;
    },
    handleCancelEditBoard() {
      this.visibleEditBoard = false;
      this.boardDialog = {
        editingBoard: {
          name: this.currentBoard.name,
        },
        error: {
          name: "",
        },
      };
    },
    handleCancel() {
      this.name = "";
      this.error.name = "";
      this.visible = false;
    },
    async handleCheckRoute() {
      if (/^\/boards\/[^/]+/.test(this.$route.path)) {
        this.showNewList = true;
        this.$store.commit("setCurrentBoardID", this.$route?.params?.id);
        let result;
        if (!this.isLite) {
          result = await getBoard(this.$route?.params?.id)
        }
        this.currentBoard = this.isLite ? (this.$store.getters.currentBoards ?? []).find(
          (v) => v.id === this.$store.state.currentBoardID
        ) : result.board;

        this.boardDialog.editingBoard = {
          name: this.currentBoard?.name,
        };
      } else {
        this.showNewList = false;
        this.currentBoard = {};
        this.$store.commit("setCurrentBoardID", null);
      }
    },
  },
};
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
  background: var(--kb-surface);
  border-bottom: 1px solid var(--kb-border);
  box-shadow: var(--kb-shadow);
}

.header.compact .header-body {
  padding: 12px 24px;
}

.header.compact .header-body.kb-mobile-pad {
  padding-left: 56px;
}

.search-btn {
  margin-right: 8px;
  color: var(--kb-muted);
}

.header-breadcrumb {
  padding: 8px 24px 12px;
  border-top: 1px solid var(--kb-border);
  background: var(--kb-surface-2);
}

.row-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.header-body {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  gap: 12px;
}

.header.compact .header-breadcrumb {
  display: none;
}

.header.compact .title {
  display: none;
}

.header-breadcrumb h3 {
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.icon-container {
  display: flex;
  align-items: center;
}

.icon-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-btn {
  border-radius: 10px;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--kb-border);
  background: var(--kb-surface-2);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.icon-btn:hover {
  border-color: var(--kb-border-strong);
  box-shadow: var(--kb-shadow-glow);
}

.title {
  display: inline;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  cursor: pointer;
  margin: 0;
}

.title .kb-brand,
.title {
  color: var(--kb-accent);
}

.subtitle {
  color: var(--kb-accent-dim);
}

.name {
  color: var(--kb-muted);
  font-size: 0.85rem;
}
</style>
