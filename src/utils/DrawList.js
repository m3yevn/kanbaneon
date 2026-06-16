import { __konva } from "./DrawCanvas";
import { store } from "../store";
import { CANVAS } from "../theme/canvasTheme.js";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

const kanbanList = () =>
  isLite
    ? store.getters.currentBoards.find(
        (v) => v.id === store.getters.currentBoardID
      )?.kanbanList
    : store.api?.board?.kanbanList;

export function initList() {
  const height = window.innerHeight;

  const calculatedChildren =
    !!kanbanList()?.length &&
    Math.max(...kanbanList().map((v) => v.children?.length));
  const largestChildren = calculatedChildren >= 2 ? calculatedChildren : 2;
  const standardRect = this.drawFns().getTile({ largestChildren, height });

  const standardTitleRect = new Konva.Rect({
    y: 10,
    fill: CANVAS.columnHeader,
    height: 50,
    width: 295,
    cornerRadius: [10, 10, 0, 0],
  });

  const standardText = this.drawFns().getAddText();
  const standardAddButton = this.drawFns().getAddButton();

  let xCount = 10;

  __konva.layer.destroyChildren();

  if (!kanbanList()) {
    return;
  }

  const lists = this.hideBacklogOnBoard
    ? kanbanList().filter((l) => l.name !== "Backlog" && l.id !== "backlog")
    : kanbanList();

  lists.forEach((list, index) => {
    this.drawFns().initListItem(list, xCount);

    const listRect = standardRect.clone();
    listRect.id(`LIST-${list?.id}`);
    listRect.attrs.listDetails = list;

    const addCardButton = standardAddButton.clone();
    addCardButton.id(`LIST-${list?.id}-ADD-MORE-BTN`);
    addCardButton.attrs.parentList = list;

    const titleRect = standardTitleRect.clone();
    const titleText = standardText.clone();

    titleRect.id(`LIST-${list?.id}-TITLE-RECT`);
    titleText.id(`LIST-${list?.id}`);
    titleText.attrs.listDetails = list;
    titleText.text(list?.name);

    addCardButton.x(xCount + 260);
    listRect.x(xCount);
    titleRect.x(xCount);
    titleText.x(xCount + 16);

    __konva.layer.add(listRect);
    __konva.layer.add(titleRect);
    __konva.layer.add(titleText);
    __konva.layer.add(addCardButton);

    addCardButton.moveToBottom();
    titleText.moveToBottom();
    titleRect.moveToBottom();
    listRect.moveToBottom();

    xCount = xCount + 305;
  });

  const addMoreRect = standardRect.clone();
  addMoreRect.height(240);
  addMoreRect.draggable(false);
  addMoreRect.x(xCount);
  addMoreRect.fill(CANVAS.addListFill);
  addMoreRect.stroke(CANVAS.addListStroke);
  addMoreRect.dash([6, 6]);
  addMoreRect.id("ADD-MORE-RECT");

  const addMoreText = standardText.clone();
  addMoreText.draggable(false);
  addMoreText.text(`+ Add column`);
  addMoreText.x(xCount + 10);
  addMoreText.fontSize(14);
  addMoreText.fill(CANVAS.addListText);
  addMoreText.id("ADD-MORE-TEXT");

  __konva.layer.add(addMoreRect);
  __konva.layer.add(addMoreText);

  addMoreText.moveToBottom();
  addMoreRect.moveToBottom();

  __konva.layer.batchDraw();
}
