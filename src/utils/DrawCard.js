import Konva from "konva";
import { store } from "../store";
import { CANVAS } from "../theme/canvasTheme.js";

export default function getCard({ x }) {
  const card = new Konva.Rect({
    x: x + 10,
    fill: CANVAS.cardFill,
    stroke: CANVAS.cardStroke,
    strokeWidth: 1,
    height: 180,
    width: 275,
    cornerRadius: 10,
    shadowColor: "#000",
    shadowBlur: 12,
    shadowOpacity: 0.35,
    shadowOffsetY: 4,
    draggable: true,
  });

  card.on("click", (e) => {
    const cardDetails = e?.currentTarget?.attrs?.cardDetails;
    const parentList = e?.currentTarget?.attrs?.parentList;
    if (typeof this.openIssueDrawer === "function") {
      this.openIssueDrawer(cardDetails, parentList?.id);
      return;
    }
    this.cardDialog = {
      ...this.cardDialog,
      visible: true,
      title: "Edit Card",
      editingCard: {
        ...e?.currentTarget?.attrs?.cardDetails,
        parentList: e?.currentTarget?.attrs?.parentList,
        isWatching: e?.currentTarget?.attrs?.cardDetails?.watchers?.includes(store.state.user.id)
      },
    };
  });

  return card;
}
