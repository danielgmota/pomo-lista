import styled from "styled-components";
import { ButtonVariant } from "./Button.types";

interface ButtonContainerProps {
  variant: ButtonVariant;
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;
  border-radius: 4px;
  border: 0;
  margin: 8px;
  background-color: ${(props) => props.theme["green-500"]};
`;

//   ${(props) => {
//     return css`
//       background-color: ${buttonVariants[props.variant]};
//     `;
//   }}
