import { useDrag } from "react-dnd";
import { DragItem } from "../components/DragItem";
import { useAppState } from "../state/AppSateContext";
import { setDraggedItem } from './../state/actions';

export const useItemDrag = (item: DragItem) => {
  const { dispatch } = useAppState()

  const [, drag] = useDrag({
    type: item.type,
    item: () => {
      dispatch(setDraggedItem(item))
      return item
    },
    end: () => dispatch(setDraggedItem(null))
  }) 

  return { drag }
}