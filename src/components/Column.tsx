import { useRef } from "react";
import { useDrop } from "react-dnd";
import { throttle } from "throttle-debounce-ts";
import { addTask, moveList } from "../state/actions";
import { useAppState } from "../state/AppSateContext";
import { ColumnContainer, ColumnTitle } from "../styles";
import { isHidden } from "../utils/isHidden";
import { useItemDrag } from "../utils/useItemDrag";
import { AddNewItem } from "./AddNewItem";
import { Card } from "./Card";

type ColumnProps = {
  id: string;
  text: string;
  isPreview?: boolean;
};

export const Column = ({ text, id, isPreview }: ColumnProps) => {
  const { draggedItem, getTaskByListId, dispatch } = useAppState();
  const tasks = getTaskByListId(id);
  const ref = useRef<HTMLDivElement>(null);
  const { drag } = useItemDrag({ type: "COLUMN", id, text });
  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: throttle(200, () => {
      if (!draggedItem) {
        return;
      }
      if (draggedItem.type === "COLUMN") {
        if (draggedItem.id === id) {
          return;
        }
        dispatch(moveList(draggedItem.id, id));
      }
    }),
  });

  drag(drop(ref));

  return (
    <ColumnContainer
      ref={ref}
      isPreview={isPreview}
      isHidden={isHidden(draggedItem, "COLUMN", id, isPreview)}
    >
      <ColumnTitle>{text}</ColumnTitle>
      {tasks.map((task) => (
        <Card key={task.id} id={task.id} text={task.text} />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another card"
        onAdd={(text) => dispatch(addTask(text, id))}
        dark
      />
    </ColumnContainer>
  );
};
