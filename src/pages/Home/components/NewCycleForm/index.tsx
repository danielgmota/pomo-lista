import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../contexts/CyclesContext";

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext);
  const { register, watch, setValue } = useFormContext();
  const minutes = watch("minutesAmount");

  useEffect(() => {
    dontAllowNegativeMinutes();
  }, [minutes]);

  function dontAllowNegativeMinutes() {
    if (minutes <= 0) setValue("minutesAmount", 1);
  }

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        placeholder="Dê um nome para sua tarefa"
        list="task-suggestion"
        disabled={!!activeCycle}
        {...register("task")}
      />

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        id="minutesAmount"
        type="number"
        step={1}
        disabled={!!activeCycle}
        {...register("minutesAmount", { valueAsNumber: true })}
      />
      <span>minuto{minutes > 1 ? "s." : ". "}</span>
    </FormContainer>
  );
}
