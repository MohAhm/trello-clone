import { createContext, Dispatch, useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { save } from "../api/api";
import { DragItem } from "../components/DragItem";
import { withInitialState } from "../withInitialState";
import { Action } from "./actions";
import { AppState, appStateReducer, List, Task } from "./appStateReducer";

type AppStateContextProps = {
  lists: List[];
  getTaskByListId(id: string): Task[];
  dispatch: Dispatch<Action>;
  draggedItem: DragItem | null;
};

type AppStateProviderProps = {
  children: React.ReactNode;
  initialState: AppState;
};

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

export const AppStateProvider = withInitialState<AppStateProviderProps>(
  ({ children, initialState }) => {
    const [state, dispatch] = useImmerReducer(appStateReducer, initialState);
    const { lists, draggedItem } = state;

    const getTaskByListId = (id: string) => {
      return lists.find((list) => list.id === id)?.tasks || [];
    };

    useEffect(() => {
      save(state);
    }, [state]);

    return (
      <AppStateContext.Provider
        value={{ lists, getTaskByListId, dispatch, draggedItem }}
      >
        {children}
      </AppStateContext.Provider>
    );
  }
);

export const useAppState = () => {
  return useContext(AppStateContext);
};
