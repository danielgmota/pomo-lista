import { ButtonContainer } from "./Button.styles";
import { ButtonVariant } from "./Button.types";

interface ButtonProps {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary" }: ButtonProps) {
  return <ButtonContainer variant={variant}>Enviar</ButtonContainer>;
}
