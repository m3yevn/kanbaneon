<template>
  <div class="board-shell">
    <div v-if="!isLite" class="view-tabs">
      <a-radio-group v-model:value="viewMode" button-style="solid" @change="onViewChange">
        <a-radio-button value="board">Board</a-radio-button>
        <a-radio-button value="backlog">Backlog</a-radio-button>
        <a-radio-button value="sprints">Sprints</a-radio-button>
        <a-radio-button value="epics">Epics</a-radio-button>
      </a-radio-group>
      <span v-if="projectKey" class="project-key">{{ projectKey }}</span>
      <a-button type="link" class="search-toggle" @click="showSearch = !showSearch">
        {{ showSearch ? "Hide search" : "Search & filter" }}
      </a-button>
    </div>

    <IssueSearchPanel
      v-if="showSearch && !isLite"
      :board-id="boardId"
      @open-issue="openIssueFromSearch"
    />

    <BacklogView
      v-if="viewMode === 'backlog' && !isLite"
      ref="backlogRef"
      :board-id="boardId"
      @open-issue="openIssueDrawer"
      @create="openCreateInBacklog"
      @board-updated="onBoardUpdated"
    />
    <SprintPlanning
      v-if="viewMode === 'sprints' && !isLite"
      ref="sprintRef"
      :board-id="boardId"
      @open-issue="openIssueFromSprint"
      @board-updated="onBoardUpdated"
    />
    <EpicBoardView
      v-if="viewMode === 'epics' && !isLite"
      ref="epicRef"
      :board-id="boardId"
      @open-issue="openIssueDrawer"
      @board-updated="onBoardUpdated"
    />

    <a-spin v-show="viewMode === 'board'" :spinning="isLoading" tip="Loading..." size="large">
      <div class="canvas-wrapper">
        <div id="kanbaneon-canvas"></div>
      </div>
    </a-spin>
  </div>
  <a-modal title="Create issue" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="cardDialog.newCard">
      <a-form-item label="Title" :rules="[{ required: true, message: 'Title is required' }]" name="title"> <a-input
          v-model:value="cardDialog.newCard.title"></a-input></a-form-item>
      <a-form-item label="Type">
        <a-select v-model:value="cardDialog.newCard.issueType" :options="issueTypeOptions" />
      </a-form-item>
      <a-form-item label="Priority">
        <a-select v-model:value="cardDialog.newCard.priority" :options="priorityOptions" />
      </a-form-item>
      <a-form-item label="Description">
        <a-textarea rows="8" class="ant-input edit-card-textarea" placeholder="Type here..."
          v-model:value="cardDialog.newCard.text" />
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model:checked="cardDialog.newCard.isWatching">Watch this card</a-checkbox>
      </a-form-item>
    </a-form>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancel"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <a-modal :title="listDialog.title" :visible="listDialog.visible" @ok="handleOkListDialog"
    @cancel="handleCancelListDialog">
    <a-input class="ant-input" placeholder="Name" v-model:value="listDialog.editingList.name"
      @change="handleNameChange" />
    <label class="error-label">{{ listDialog.error.name }}</label>
    <template v-slot:footer>
      <a-button v-if="!listDialog.creating" class="btn-danger" type="danger" @click="handleDeleteList">Delete</a-button>
      <a-button key="back" @click="handleCancelListDialog"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOkListDialog">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <a-modal :title="cardDialog.title" :visible="cardDialog.visible" @ok="handleOkCardDialog"
    @cancel="handleCancelCardDialog">
    <a-form layout="vertical" :model="cardDialog.editingCard">
      <a-form-item v-if="cardDialog.editingCard.issueKey" label="Issue key">
        <a-input :value="cardDialog.editingCard.issueKey" disabled />
      </a-form-item>
      <a-form-item label="Title"> <a-input v-model:value="cardDialog.editingCard.title"></a-input></a-form-item>
      <a-form-item label="Type">
        <a-select v-model:value="cardDialog.editingCard.issueType" :options="issueTypeOptions" />
      </a-form-item>
      <a-form-item label="Priority">
        <a-select v-model:value="cardDialog.editingCard.priority" :options="priorityOptions" />
      </a-form-item>
      <a-form-item label="Description">
        <a-textarea rows="8" class="ant-input edit-card-textarea" placeholder="Type here..."
          v-model:value="cardDialog.editingCard.text" />
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model:checked="cardDialog.editingCard.isWatching">Watch this card</a-checkbox>
      </a-form-item>
      <a-popover v-model:open="watcherOpen" trigger="click">
        <template #content>
          <Watchers :watchers="watcherDetails" />
        </template>
        <div class="watchers" @click="handleWatcherData(cardDialog.editingCard.watchers)">
          {{ cardDialog.editingCard.watchers?.length === 1 ? "1 person is watching this card." :
            `${cardDialog.editingCard.watchers?.length} are watching this card.` }}
        </div>
      </a-popover>
    </a-form>
    <template v-slot:footer>
      <a-button class="btn-danger" type="danger" @click="handleDeleteCard">Delete</a-button>
      <a-button key="back" @click="handleCancelCardDialog"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOkCardDialog">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <IssueDrawer
    :open="issueDrawer.visible"
    :board-id="boardId"
    :list-id="issueDrawer.listId"
    :issue="issueDrawer.issue"
    @close="closeIssueDrawer"
    @updated="onBoardUpdated"
    @delete="handleDeleteFromDrawer"
  />
</template>

<script>
import {
  initCanvas,
  addCardOnCanvas,
  addListOnCanvas,
  editCardOnCanvas,
  deleteCardOnCanvas,
  editListOnCanvas,
  deleteListOnCanvas,
} from "../../utils/DrawCanvas";
import { initList } from "../../utils/DrawList";
import { initListItem } from "../../utils/DrawListItem";
import getAddButton from "../../utils/DrawAddButton";
import getAddText from "../../utils/DrawAddText";
import getCard from "../../utils/DrawCard";
import getTile from "../../utils/DrawTile";
import getText from "../../utils/DrawText";
import {
  addList, addCard,
  editList, editCard,
  deleteList, deleteCard,
  getBoard,
  getProfiles
} from '../../helpers/ApiHelper';
import { ISSUE_TYPES, PRIORITIES } from '../../helpers/jiraDefaults';
import * as uuid from "uuid";
import { message } from "ant-design-vue";
import Watchers from "./Watchers.vue";
import IssueDrawer from "./IssueDrawer.vue";
import BacklogView from "./BacklogView.vue";
import SprintPlanning from "./SprintPlanning.vue";
import EpicBoardView from "./EpicBoardView.vue";
import IssueSearchPanel from "./IssueSearchPanel.vue";

export default {
  data() {
    return {
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      isLoading: false,
      viewMode: "board",
      hideBacklogOnBoard: true,
      showSearch: false,
      visible: false,
      addingList: null,
      watcherDetails: [],
      watcherOpen: false,
      cardDialog: {
        newCard: {
          title: "",
          text: "",
          issueType: "task",
          priority: "medium",
          isWatching: false
        },
        editingCard: {
          title: "",
          text: "",
          issueType: "task",
          priority: "medium",
          issueKey: "",
          isWatching: false,
          watchers: []
        },
      },
      listDialog: {
        editingList: {
          name: "",
        },
        error: {
          name: "",
        },
      },
      issueDrawer: {
        visible: false,
        issue: null,
        listId: null,
      },
    };
  },
  components: {
    Watchers,
    IssueDrawer,
    BacklogView,
    SprintPlanning,
    EpicBoardView,
    IssueSearchPanel,
  },
  computed: {
    boardId() {
      return this.$route.params.id || this.$store.state.currentBoardID;
    },
    projectKey() {
      return this.$store.api?.board?.projectKey;
    },
    issueTypeOptions() {
      return ISSUE_TYPES.map((t) => ({ value: t.value, label: t.label }));
    },
    priorityOptions() {
      return PRIORITIES.map((p) => ({ value: p.value, label: p.label }));
    },
  },
  methods: {
    onViewChange() {
      if (this.viewMode === "board") {
        this.$nextTick(() => this.drawFns().initCanvas());
      }
    },
    onBoardUpdated(board) {
      this.$store.api = { board };
      if (this.viewMode === "board") {
        this.drawFns().initCanvas();
      }
    },
    findBacklogList() {
      const lists = this.$store.api?.board?.kanbanList || [];
      return lists.find((l) => l.name === "Backlog" || l.id === "backlog");
    },
    openCreateInBacklog() {
      const backlog = this.findBacklogList();
      if (backlog) {
        this.addingList = backlog;
        this.visible = true;
      }
    },
    openIssueDrawer(issue, listId) {
      this.issueDrawer = {
        visible: true,
        issue,
        listId: listId || issue?.listId,
      };
      if (!this.isLite && issue?.issueKey) {
        const target = `/boards/${this.boardId}/issues/${issue.issueKey}`;
        if (this.$route.path !== target) {
          this.$router.push(target);
        }
      }
    },
    openIssueFromSprint(issue) {
      this.openIssueDrawer(issue, issue.listId);
    },
    openIssueFromSearch(issue) {
      this.openIssueDrawer(issue, issue.listId);
    },
    closeIssueDrawer() {
      this.issueDrawer = { visible: false, issue: null, listId: null };
      if (!this.isLite && this.$route.params.issueKey) {
        this.$router.replace(`/boards/${this.boardId}`);
      }
    },
    findIssueByKey(issueKey) {
      const lists = this.$store.api?.board?.kanbanList || [];
      for (const list of lists) {
        const issue = list.children.find((c) => c.issueKey === issueKey);
        if (issue) {
          return { issue: { ...issue, listId: list.id }, listId: list.id };
        }
      }
      return null;
    },
    openIssueFromRoute() {
      const issueKey = this.$route.params.issueKey;
      if (!issueKey) return;
      const found = this.findIssueByKey(issueKey);
      if (found) {
        this.issueDrawer = {
          visible: true,
          issue: found.issue,
          listId: found.listId,
        };
      } else {
        message.warning(`Issue ${issueKey} not found`);
        this.$router.replace(`/boards/${this.boardId}`);
      }
    },
    async handleDeleteFromDrawer() {
      const { issue, listId } = this.issueDrawer;
      if (!issue) return;
      const deletedResult = this.isLite
        ? this.deleteCardOnCanvas({ id: issue.id, listId })
        : await deleteCard(this.boardId, { id: issue.id, listId });
      if (deletedResult?.board) {
        this.onBoardUpdated(deletedResult.board);
      }
      this.closeIssueDrawer();
      if (this.viewMode === "board") {
        this.drawFns().initCanvas();
      }
    },
    drawFns() {
      return {
        initCanvas: initCanvas.bind(this),
        initList: initList.bind(this),
        initListItem: initListItem.bind(this),
        getAddButton: getAddButton.bind(this),
        getAddText: getAddText.bind(this),
        getCard: getCard.bind(this),
        getTile: getTile.bind(this),
        getText: getText.bind(this),
      };
    },
    addCardOnCanvas,
    addListOnCanvas,
    editCardOnCanvas,
    deleteCardOnCanvas,
    editListOnCanvas,
    deleteListOnCanvas,
    async handleWatcherData(ids) {
      if (this.watcherOpen) {
        this.watcherOpen = false;
        return;
      }
      const result = await getProfiles(ids);
      if (result.success) {
        this.watcherDetails = result.users;
        this.watcherOpen = true;
      }
    },
    handleCancel() {
      this.visible = false;
      this.cardDialog.newCard = {
        title: "",
        text: "",
        issueType: "task",
        priority: "medium",
        isWatching: false
      }
    },
    handleCancelCardDialog() {
      this.cardDialog = {
        ...this.cardDialog,
        visible: false,
        editingCard: {
          text: "",
          title: "",
          issueType: "task",
          priority: "medium",
          issueKey: "",
          isWatching: false,
          watchers: []
        },
      };
    },
    handleCancelListDialog() {
      this.listDialog = {
        ...this.listDialog,
        visible: false,
        editingList: {
          name: "",
        },
        error: {
          name: "",
        },
      };
    },
    async handleOk() {
      try {
        const newCard = {
          id: uuid.v4(),
          ...this.cardDialog.newCard,
        };
        const listId = this.addingList?.id;
        const addedResult = this.isLite ? this.addCardOnCanvas({ listId, newCard }) : await addCard(this.$store.state.currentBoardID, listId, newCard);
        if (addedResult?.board) {
          this.$store.api = {
            board: addedResult.board
          };
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancel();
      }
    },
    async handleOkCardDialog() {
      try {
        const { parentList, ...cardDetails } = this.cardDialog.editingCard;
        const editingCard = {
          listId: this.cardDialog.editingCard.parentList.id,
          ...cardDetails
        };
        const editedResult = this.isLite ? this.editCardOnCanvas(editingCard) : await editCard(this.$store.state.currentBoardID, editingCard);
        if (editedResult?.board) {
          this.$store.api = {
            board: editedResult.board
          };
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancelCardDialog();
      }
    },
    async handleOkListDialog() {
      try {
        if (!this.listDialog.editingList.name) {
          return this.listDialog.error.name = !this.listDialog?.editingList?.name
            ? "*required"
            : "";
        }

        if (!!this.listDialog?.creating) {
          const newList = {
            id: uuid.v4(),
            name: this.listDialog?.editingList?.name,
            children: [],
          };
          const addedResult = this.isLite ? this.addListOnCanvas(newList) : await addList(this.$store.state.currentBoardID, newList);
          if (addedResult?.board) {
            this.$store.api = {
              board: addedResult.board
            };
          }
        } else {
          const editingList = {
            listId: this.listDialog.editingList.id,
            name: this.listDialog.editingList.name,
          };
          const editedResult = this.isLite ? this.editListOnCanvas(editingList) : await editList(this.$store.state.currentBoardID, editingList);
          if (editedResult?.board) {
            this.$store.api = {
              board: editedResult.board
            };
          }
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancelListDialog();
      }
    },
    async handleDeleteList() {
      try {
        const deletingList = {
          listId: this.listDialog.editingList.id,
        };
        const deletedResult = this.isLite ? this.deleteListOnCanvas(deletingList) : await deleteList(this.$store.state.currentBoardID, deletingList);
        if (deletedResult?.board) {
          this.$store.api = {
            board: deletedResult.board
          };
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancelListDialog();
      }
    },
    async handleDeleteCard() {
      try {
        const deletingCard = {
          id: this.cardDialog.editingCard.id,
          listId: this.cardDialog.editingCard.parentList.id,
        };
        const deletedResult = this.isLite ? this.deleteCardOnCanvas(deletingCard) : await deleteCard(this.$store.state.currentBoardID, deletingCard);
        if (deletedResult?.board) {
          this.$store.api = {
            board: deletedResult.board
          };
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancelCardDialog();
      }
    },
    handleNameChange(e) {
      this.listDialog.editingList.name = e.target.value;
      this.listDialog.error.name = !this.listDialog?.editingList?.name
        ? "*required"
        : "";
    },
    async fetchData() {
      try {
        this.isLoading = true;
        const id = this.$route.params.id;
        const data = await getBoard(id);
        if (!data?.board) {
          return this.$router.push("/");
        }


        if (data.board) {
          this.$store.api = {
            board: data?.board
          };
        }
        this.openIssueFromRoute();
      } catch (ex) {
        console.error(ex);
        return this.$router.push("/");
      } finally {
        this.drawFns().initCanvas();
        this.isLoading = false;
      }
    }
  },
  watch: {
    "$route.params.issueKey"(key) {
      if (!key) {
        this.issueDrawer = { visible: false, issue: null, listId: null };
        return;
      }
      if (this.$store.api?.board) {
        this.openIssueFromRoute();
      }
    },
  },
  async mounted() {
    this.drawFns().initCanvas();
    if (this.isLite) {
      const currentList = this.$store.getters.currentBoards.find(
        (v) => v.id === this.$store.state.currentBoardID
      );
      if (!currentList) {
        this.$router.push("/");
      }
    }
    else {
      await this.fetchData();
    }
  },
};
</script>

<style scoped>
.canvas-wrapper {
  margin-top: calc(var(--kb-header-h) + 56px);
  width: 100%;
  padding: 0 16px 32px;
}

.view-tabs {
  position: fixed;
  top: var(--kb-header-h);
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 24px;
  background: var(--kb-surface-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--kb-border);
}

.project-key {
  color: var(--kb-accent);
  font-weight: 600;
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--kb-accent-soft);
  border: 1px solid var(--kb-border-strong);
}

.search-toggle {
  color: var(--kb-muted) !important;
  margin-left: auto;
}

.search-toggle:hover {
  color: var(--kb-accent) !important;
}

.edit-card-textarea {
  margin-bottom: 10px;
}

.watchers {
  text-decoration: none;
  cursor: pointer;
  color: var(--kb-accent);
  width: fit-content;
  font-size: 0.9rem;
}

.watchers:hover {
  text-decoration: underline;
}
</style>
