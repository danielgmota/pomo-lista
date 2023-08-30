import { HistoryContainer, HistoryList, Tag } from "./styles";

export function History() {
  return (
    <HistoryContainer>
      <h1>History</h1>
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
            <tr>
              <td>Tarefa</td>
              <td>20 minutos</td>
              <td>2 meses</td>
              <td>
                <Tag status="pending">Em andamento</Tag>
              </td>
            </tr>
            <tr>
              <td>Tarefa</td>
              <td>20 minutos</td>
              <td>2 meses</td>
              <td>
                <Tag status="success">Concluido</Tag>
              </td>
            </tr>
            <tr>
              <td>Tarefa</td>
              <td>20 minutos</td>
              <td>2 meses</td>
              <td>
                <Tag status="failed">Não concluido</Tag>
              </td>
            </tr>
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
