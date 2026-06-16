<template>
  <div class="projects-hub">
    <header class="hub-header">
      <div>
        <h1>Projects</h1>
        <p class="hub-sub">Your boards, sprints, and team work — in one place.</p>
      </div>
      <a-button type="primary" size="large" @click="visible = true">
        <PlusIcon /> New project
      </a-button>
    </header>

    <a-spin :spinning="isLoading" tip="Loading projects…">
      <section v-if="boards?.length" class="hub-widgets">
        <article class="widget">
          <h3>{{ boards.length }}</h3>
          <p>Active projects</p>
        </article>
        <article class="widget">
          <h3>{{ recentCount }}</h3>
          <p>Boards this week</p>
        </article>
        <article class="widget accent">
          <h3>Ready</h3>
          <p>Open a board to plan your sprint</p>
        </article>
      </section>

      <a-row v-if="boards?.length" :gutter="[20, 20]" class="board-grid">
        <a-col :xs="24" :sm="12" :lg="8" :xl="6" v-for="board in boards" :key="board.id">
          <a-card class="board-card" hoverable @click="handleDirect(board.id)">
            <template #title>
              <span class="board-key" v-if="board.projectKey">{{ board.projectKey }}</span>
              {{ board.name }}
            </template>
            <div class="board-preview">
              <KanbanImg />
            </div>
            <p class="board-meta">Kanban · Canvas board</p>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="8" :xl="6">
          <button type="button" class="new-board-tile" @click="visible = true">
            <PlusIcon />
            <span>Create project</span>
          </button>
        </a-col>
      </a-row>

      <section v-else-if="!isLoading" class="empty-hub">
        <div class="empty-hero">
          <GetStartedImg />
          <h2>Start your first project</h2>
          <p>Pick a template or create from scratch — you'll be planning sprints in minutes.</p>
        </div>

        <div class="template-grid">
          <button
            v-for="tpl in templates"
            :key="tpl.id"
            type="button"
            class="template-card"
            @click="startFromTemplate(tpl)"
          >
            <span class="template-icon">{{ tpl.icon }}</span>
            <strong>{{ tpl.name }}</strong>
            <span class="template-desc">{{ tpl.description }}</span>
            <span class="template-columns">{{ tpl.columns }}</span>
          </button>
        </div>

        <div class="empty-actions">
          <a-button type="primary" size="large" @click="startEmpty">
            <PlusIcon /> Blank board
          </a-button>
          <a-button size="large" @click="startJiraTemplate">
            Use Jira columns
          </a-button>
        </div>
      </section>
    </a-spin>
  </div>

  <a-modal
    title="New project"
    :open="visible"
    @ok="handleAddNewBoard"
    @cancel="handleCancelDialog"
    ok-text="Create project"
  >
    <a-input
      class="ant-input"
      placeholder="Project name"
      v-model:value="name"
      @change="handleNameChange"
    />
    <label class="error-label">{{ error.name }}</label>
    <a-input
      class="ant-input project-key"
      placeholder="Project key (e.g. KAN)"
      v-model:value="projectKey"
    />

    <a-radio-group class="radio-wrapper" v-model:value="mode" @change="handleModeChange">
      <a-radio value="empty">Create empty board</a-radio>
      <a-radio value="template">Jira columns (Backlog → Done)</a-radio>
    </a-radio-group>
  </a-modal>
</template>

<script>
import PlusIcon from "../../assets/PlusIcon.vue";
import KanbanImg from "../../assets/KanbanImg.vue";
import GetStartedImg from "../../assets/GetStartedImg.vue";
import * as uuid from "uuid";
import { addBoard, getBoards } from "../../helpers/ApiHelper";
import { getJiraDefaultLists } from "../../helpers/jiraDefaults";

const getTemplateList = () => getJiraDefaultLists();

export default {
  data() {
    return {
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      isLoading: false,
      boards: [],
      visible: false,
      mode: "template",
      name: "",
      projectKey: "",
      error: { name: "" },
      templates: [
        {
          id: "software",
          icon: "🚀",
          name: "Software delivery",
          description: "Backlog through Done — ideal for product teams.",
          columns: "Backlog · To Do · In Progress · Review · Done",
          mode: "template",
          key: "SW",
        },
        {
          id: "bug",
          icon: "🐛",
          name: "Bug triage",
          description: "Prioritize and resolve issues fast.",
          columns: "Triage · In Progress · QA · Done",
          mode: "template",
          key: "BUG",
        },
        {
          id: "personal",
          icon: "✨",
          name: "Personal tasks",
          description: "Lightweight board for solo work.",
          columns: "To Do · Doing · Done",
          mode: "empty",
          key: "ME",
        },
      ],
    };
  },
  computed: {
    recentCount() {
      return Math.min(this.boards.length, 3);
    },
  },
  watch: {
    "$store.state.user"() {
      this.boards = this.$store.getters.currentBoards;
    },
    "$store.state.kanbanBoards"() {
      this.boards = this.$store.getters.currentBoards;
    },
  },
  components: { KanbanImg, GetStartedImg, PlusIcon },
  async mounted() {
    this._onNewProject = () => { this.visible = true; };
    window.addEventListener("kanbaneon:new-project", this._onNewProject);
    await this.refresh();
  },
  beforeUnmount() {
    window.removeEventListener("kanbaneon:new-project", this._onNewProject);
  },
  methods: {
    async refresh() {
      if (this.isLite) {
        this.boards = this.$store.getters.currentBoards;
        return;
      }
      try {
        this.isLoading = true;
        const { boards } = await getBoards();
        this.boards = boards ?? this.$store.getters.currentBoards;
      } catch (ex) {
        console.error(ex);
      } finally {
        this.isLoading = false;
      }
    },
    handleModeChange(e) {
      this.mode = e.target.value;
    },
    handleDirect(id) {
      this.$router.push(`/boards/${id}`);
    },
    handleNameChange(e) {
      this.name = e.target.value;
      this.error.name = !this.name ? "*required" : "";
    },
    handleCancelDialog() {
      this.name = "";
      this.projectKey = "";
      this.visible = false;
      this.error.name = "";
      this.mode = "template";
    },
    startEmpty() {
      this.mode = "empty";
      this.visible = true;
    },
    startJiraTemplate() {
      this.mode = "template";
      this.visible = true;
    },
    startFromTemplate(tpl) {
      this.mode = tpl.mode;
      this.name = tpl.name;
      this.projectKey = tpl.key;
      this.visible = true;
    },
    async handleAddNewBoard() {
      if (!this.name) {
        this.error.name = "*required";
        return;
      }

      const newBoard = {
        id: uuid.v4(),
        name: this.name,
        projectKey: this.projectKey?.trim() || undefined,
        kanbanList: this.mode === "template" ? getTemplateList() : [],
      };

      if (this.isLite) {
        this.$store.commit("addKanbanBoard", newBoard);
      } else {
        await addBoard(newBoard);
      }
      this.handleCancelDialog();
      await this.refresh();
    },
  },
};
</script>

<style scoped>
.projects-hub {
  padding: 28px 32px 48px;
  max-width: 1280px;
  margin: 0 auto;
}

.hub-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.hub-header h1 {
  margin: 0 0 6px;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.hub-sub {
  margin: 0;
  color: var(--kb-muted);
  font-size: 0.95rem;
}

.hub-widgets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.widget {
  background: var(--kb-surface);
  border: 1px solid var(--kb-border);
  border-radius: var(--kb-radius-lg);
  padding: 18px 20px;
  box-shadow: var(--kb-shadow);
}

.widget h3 {
  margin: 0 0 4px;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--kb-text);
}

.widget p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--kb-muted);
}

.widget.accent {
  background: var(--kb-accent-soft);
  border-color: var(--kb-border-strong);
}

.widget.accent h3 {
  color: var(--kb-accent-dim);
}

.board-card :deep(.ant-card-head-title) {
  font-weight: 600;
}

.board-key {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--kb-accent-soft);
  color: var(--kb-accent-dim);
}

.board-preview {
  opacity: 0.9;
  margin-bottom: 8px;
}

.board-meta {
  margin: 0;
  font-size: 0.8rem;
  color: var(--kb-muted);
}

.new-board-tile {
  width: 100%;
  min-height: 220px;
  border: 2px dashed var(--kb-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-surface-2);
  color: var(--kb-muted);
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
}

.new-board-tile:hover {
  border-color: var(--kb-accent);
  color: var(--kb-accent-dim);
  box-shadow: var(--kb-shadow-glow);
}

.empty-hub {
  padding: 24px 0 48px;
}

.empty-hero {
  text-align: center;
  max-width: 520px;
  margin: 0 auto 40px;
}

.empty-hero h2 {
  margin: 16px 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
}

.empty-hero p {
  margin: 0;
  color: var(--kb-muted);
  line-height: 1.6;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.template-card {
  text-align: left;
  padding: 20px;
  border: 1px solid var(--kb-border);
  border-radius: var(--kb-radius-lg);
  background: var(--kb-surface);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
}

.template-card:hover {
  border-color: var(--kb-border-strong);
  box-shadow: var(--kb-shadow-glow);
  transform: translateY(-2px);
}

.template-icon {
  font-size: 1.5rem;
}

.template-card strong {
  font-size: 1rem;
  color: var(--kb-text);
}

.template-desc {
  font-size: 0.85rem;
  color: var(--kb-muted);
  line-height: 1.5;
}

.template-columns {
  margin-top: 8px;
  font-size: 0.75rem;
  color: var(--kb-accent-dim);
  font-weight: 500;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.radio-wrapper {
  display: block;
  margin-top: 12px;
}

.project-key {
  margin-top: 8px;
}
</style>
