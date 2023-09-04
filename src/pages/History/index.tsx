import { useContext } from "react";
import { HistoryContainer, HistoryList, Tag } from "./styles";
import { CyclesContext } from "../../contexts/CyclesContext";
import { formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export function History() {
  const { cycles } = useContext(CyclesContext);

  return (
    <HistoryContainer>
      <h1>Histórico</h1>
      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles
              .slice()
              .sort((a, b) => Number(b.id) - Number(a.id))
              .map((cycle) => {
                return (
                  <tr key={cycle.id}>
                    <td>{cycle.task}</td>
                    <td>{cycle.minutesAmount} minutos</td>
                    <td>
                      {formatDistanceToNow(new Date(cycle.startDate), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </td>
                    <td>
                      {cycle.finishedDate && (
                        <Tag status="success">Concluído</Tag>
                      )}
                      {cycle.interruptedDate && (
                        <Tag status="failed">Interrompido</Tag>
                      )}
                      {!cycle.finishedDate && !cycle.interruptedDate && (
                        <Tag status="pending">Em andamento</Tag>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
