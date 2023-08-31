import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "../../styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../..";

export function Countdown() {
  const ONE_MINUTE_IN_SECONDS = 60;
  const {
    activeCycle,
    activeCycleId,
    amountSecoundsPassed,
    markCurrentCycleAsFinished,
    setSecoundsPassed,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle
    ? activeCycle.minutesAmount * ONE_MINUTE_IN_SECONDS
    : 0;

  const currentSeconds = activeCycle ? totalSeconds - amountSecoundsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / ONE_MINUTE_IN_SECONDS);
  const secoundsAmount = currentSeconds % ONE_MINUTE_IN_SECONDS;

  const minutes = String(minutesAmount).padStart(2, "0");
  const secounds = String(secoundsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) document.title = `${minutes}:${secounds}`;
  }, [activeCycle, minutes, secounds]);

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secoundsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );
        if (secoundsDifference >= totalSeconds) {
          markCurrentCycleAsFinished();
          setSecoundsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setSecoundsPassed(secoundsDifference);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecoundsPassed,
  ]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{secounds[0]}</span>
      <span>{secounds[1]}</span>
    </CountdownContainer>
  );
}
