import { useEffect } from 'react';
import { useDrag } from "react-dnd";
import { getEmptyImage } from 'react-dnd-html5-backend';
import { DragItem } from "../components/DragItem";
import { useAppState } from "../state/AppSateContext";
import { setDraggedItem } from './../state/actions';

export const useItemDrag = (item: DragItem) => {
  const { dispatch } = useAppState()

  const [, drag, preview ] = useDrag({
    type: item.type,
    item: () => {
      dispatch(setDraggedItem(item))
      return item
    },
    end: () => dispatch(setDraggedItem(null))
  }) 

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  return { drag }
}