import Konva from "konva";
import { CANVAS } from "../theme/canvasTheme.js";
import { ISSUE_TYPES, priorityColor } from "../helpers/jiraDefaults";

export const CARD_HEIGHT = 200;
export const CARD_WIDTH = 275;
export const CARD_GAP = 210;

function typeMeta(issueType) {
  return ISSUE_TYPES.find((t) => t.value === issueType) || ISSUE_TYPES[1];
}

function formatDue(dueDate) {
  if (!dueDate) return "";
  const d = new Date(dueDate);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function assigneeInitial(username) {
  if (!username) return "?";
  return username.charAt(0).toUpperCase();
}

/**
 * Rich task card face — priority, type, title, assignee, labels at a glance.
 */
export function createCardGroup({ list, card, x, y, vm }) {
  const group = new Konva.Group({
    x: x + 10,
    y,
    draggable: true,
    id: `LIST-${list?.id}-CARD-${card?.id}`,
  });
  group.attrs.cardDetails = card;
  group.attrs.parentList = list;

  const type = typeMeta(card?.issueType);
  const priority = card?.priority || "medium";

  const bg = new Konva.Rect({
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fill: CANVAS.cardFill,
    stroke: CANVAS.cardStroke,
    strokeWidth: 1,
    cornerRadius: 10,
    shadowColor: "#091e42",
    shadowBlur: 8,
    shadowOpacity: 0.08,
    shadowOffsetY: 2,
  });

  const stripe = new Konva.Rect({
    width: 4,
    height: CARD_HEIGHT,
    fill: priorityColor(priority),
    cornerRadius: [10, 0, 0, 10],
  });

  const typeBadge = new Konva.Rect({
    x: 12,
    y: 10,
    width: 52,
    height: 20,
    fill: type.color,
    cornerRadius: 4,
  });

  const typeText = new Konva.Text({
    x: 12,
    y: 13,
    width: 52,
    text: type.label.toUpperCase(),
    fontSize: 9,
    fontStyle: "bold",
    fill: "#ffffff",
    align: "center",
  });

  const keyText = new Konva.Text({
    x: 72,
    y: 12,
    text: card?.issueKey || "",
    fontSize: 11,
    fill: "#97a0af",
    width: 180,
  });

  const titleText = new Konva.Text({
    x: 12,
    y: 38,
    text: card?.title || "Untitled",
    fontSize: 14,
    fontStyle: "600",
    fill: CANVAS.cardText,
    width: CARD_WIDTH - 24,
    height: 72,
    wrap: "word",
    ellipsis: true,
  });

  const labels = [];
  if (card?.parentEpicKey) labels.push(card.parentEpicKey);
  if (card?.labels?.length) labels.push(...card.labels.slice(0, 2));
  else if (card?.priority) labels.push(card.priority);

  let labelX = 12;
  labels.slice(0, 3).forEach((label) => {
    const w = Math.min(80, label.length * 6 + 16);
    group.add(
      new Konva.Rect({
        x: labelX,
        y: 118,
        width: w,
        height: 18,
        fill: "rgba(101, 163, 13, 0.12)",
        stroke: "rgba(101, 163, 13, 0.35)",
        strokeWidth: 1,
        cornerRadius: 4,
      })
    );
    group.add(
      new Konva.Text({
        x: labelX + 6,
        y: 121,
        text: String(label).slice(0, 12),
        fontSize: 10,
        fill: "#5e6c84",
      })
    );
    labelX += w + 6;
  });

  const avatar = new Konva.Circle({
    x: 24,
    y: CARD_HEIGHT - 22,
    radius: 12,
    fill: "#ebecf0",
    stroke: "#dfe1e6",
    strokeWidth: 1,
  });

  const avatarText = new Konva.Text({
    x: 12,
    y: CARD_HEIGHT - 29,
    width: 24,
    text: assigneeInitial(card?.assigneeUsername),
    fontSize: 11,
    fontStyle: "bold",
    fill: "#5e6c84",
    align: "center",
  });

  const assigneeName = new Konva.Text({
    x: 42,
    y: CARD_HEIGHT - 28,
    text: card?.assigneeUsername || "Unassigned",
    fontSize: 11,
    fill: "#5e6c84",
    width: 120,
    ellipsis: true,
  });

  const due = formatDue(card?.dueDate);
  const dueText = new Konva.Text({
    x: CARD_WIDTH - 12,
    y: CARD_HEIGHT - 28,
    text: due,
    fontSize: 11,
    fill: due ? "#de350b" : "transparent",
    width: 80,
    align: "right",
  });

  group.add(bg, stripe, typeBadge, typeText, keyText, titleText, avatar, avatarText, assigneeName, dueText);

  const openCard = () => {
    if (typeof vm.openIssueDrawer === "function") {
      vm.openIssueDrawer(card, list?.id);
      return;
    }
    vm.cardDialog = {
      ...vm.cardDialog,
      visible: true,
      title: "Edit Card",
      editingCard: {
        ...card,
        parentList: list,
        isWatching: card?.watchers?.includes(vm.$store?.state?.user?.id),
      },
    };
  };

  group.on("click tap", openCard);

  return group;
}
