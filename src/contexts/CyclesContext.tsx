import {
  ReactNode,
  createContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { cyclesReducer } from "../reducers/cycles/reducer";
import { ICycle } from "../reducers/cycles/reducer";
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";
import { getStorageTextToSave } from "../global/storage-name";

interface CreateCycleDate {
  task: string;
  minutesAmount: number;
}

interface ICyclesContext {
  cycles: ICycle[];
  activeCycle: ICycle | undefined;
  activeCycleId: string | null;
  amountSecoundsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecoundsPassed: (secounds: number) => void;
  createNewCycle: (data: CreateCycleDate) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as ICyclesContext);

interface ICyclesContextProviderProps {
  children: ReactNode;
}

export function CyclesContextProvider({
  children,
}: ICyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        getStorageTextToSave("cycles")
      );
      if (storedStateAsJSON) return JSON.parse(storedStateAsJSON);
      return initialState;
    }
  );
  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const [amountSecoundsPassed, setAmountSecoundsPassed] = useState<number>(
    () => {
      if (activeCycle)
        return differenceInSeconds(new Date(), new Date(activeCycle.startDate));

      return 0;
    }
  );

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);
    localStorage.setItem(getStorageTextToSave("cycles"), stateJSON);
  }, [cyclesState]);

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction());
  }

  function setSecoundsPassed(secounds: number) {
    setAmountSecoundsPassed(secounds);
  }

  function createNewCycle(data: CreateCycleDate) {
    const newCycle: ICycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch(addNewCycleAction(newCycle));
    setAmountSecoundsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecoundsPassed,
        markCurrentCycleAsFinished,
        setSecoundsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
