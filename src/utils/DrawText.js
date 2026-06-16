import Konva from "konva";
import { store } from "../store";
import { CANVAS } from "../theme/canvasTheme.js";

export default function getText({ x }) {
  const text = new Konva.Text({
    text: "",
    fontSize: 18,
    fill: CANVAS.cardText,
    x: x + 20,
    width: 265,
    height: 175,
    draggable: true,
  });

  text.on("click", (e) => {
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

  return text;
}
