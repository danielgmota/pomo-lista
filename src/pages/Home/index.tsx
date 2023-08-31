import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, MessageError } from "./styles";
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import {
  StartCountdownButton,
  StopCountdownButton,
} from "./components/Countdown/styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface ICyclesContext {
  activeCycle: ICycle | undefined;
  activeCycleId: string | null;
  amountSecoundsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecoundsPassed: (secounds: number) => void;
}

const newCycleFormValidationScheme = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "O ciclo precisa ser de no mínimo 5 minutos")
    .max(60, "O ciclo precisa ser de no maximo 60 minutos"),
  startDate: zod.date(),
});
type NewCycleFormData = zod.infer<typeof newCycleFormValidationScheme>;

export const CyclesContext = createContext({} as ICyclesContext);

export function Home() {
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationScheme),
    defaultValues: {
      task: "",
      minutesAmount: 0,
      startDate: new Date(),
    },
  });
  const {
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = newCycleForm;
  const task = watch("task");
  const isSubmitDisabled = !task;
  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecoundsPassed, setAmountSecoundsPassed] = useState<number>(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: ICycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((currCycles) => [...currCycles, newCycle]);
    setActiveCycleId(newCycle.id);
    setAmountSecoundsPassed(0);
    reset();
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  function setSecoundsPassed(secounds: number) {
    setAmountSecoundsPassed(secounds);
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            amountSecoundsPassed,
            markCurrentCycleAsFinished,
            setSecoundsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Parar
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
      <MessageError>
        {errors.task && errors.task.message}
        <br />
        {errors.minutesAmount && errors.minutesAmount.message}
      </MessageError>
    </HomeContainer>
  );
}
