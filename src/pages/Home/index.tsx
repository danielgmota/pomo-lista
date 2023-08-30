import { HandPalm, Play } from "phosphor-react";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MessageError,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

interface ICycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const newCycleFormValidationScheme = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod
      .number()
      .min(1, "O ciclo precisa ser de no mínimo 5 minutos")
      .max(60, "O ciclo precisa ser de no maximo 60 minutos"),
    startDate: zod.date(),
  });
  type NewCycleFormData = zod.infer<typeof newCycleFormValidationScheme>;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationScheme),
    defaultValues: {
      task: "",
      minutesAmount: 0,
      startDate: new Date(),
    },
  });
  const task = watch("task");
  const isSubmitDisabled = !task;
  const ONE_MINUTE_IN_SECONDS = 60;

  const [cycles, setCycles] = useState<ICycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecoundsPassed, setAmountSecoundsPassed] = useState<number>(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const totalSeconds = activeCycle
    ? activeCycle.minutesAmount * ONE_MINUTE_IN_SECONDS
    : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecoundsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / ONE_MINUTE_IN_SECONDS);
  const secoundsAmount = currentSeconds % ONE_MINUTE_IN_SECONDS;

  const minutes = String(minutesAmount).padStart(2, "0");
  const secounds = String(secoundsAmount).padStart(2, "0");

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secoundsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );
        if (secoundsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              } else {
                return cycle;
              }
            })
          );
          setAmountSecoundsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setAmountSecoundsPassed(secoundsDifference);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [activeCycle, totalSeconds, activeCycleId]);

  useEffect(() => {
    if (activeCycle) document.title = `${minutes}:${secounds}`;
  }, [activeCycle, minutes, secounds]);

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

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestion"
            disabled={!!activeCycle}
            {...register("task")}
          />

          <datalist id="task-suggestion">
            <option value="Hello world" />
            <option value="Project discovery" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="0"
            step={5}
            disabled={!!activeCycle}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{secounds[0]}</span>
          <span>{secounds[1]}</span>
        </CountdownContainer>

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
