import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, MessageError } from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import {
  StartCountdownButton,
  StopCountdownButton,
} from "./components/Countdown/styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationScheme = zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "O ciclo precisa ser de no mínimo 5 minutos")
    .max(60, "O ciclo precisa ser de no maximo 60 minutos"),
  startDate: zod.date(),
});
export type NewCycleFormData = zod.infer<typeof newCycleFormValidationScheme>;

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext);
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
    reset,
    formState: { errors },
  } = newCycleForm;
  const task = watch("task");
  const isSubmitDisabled = !task;

  function handleCrateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCrateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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
