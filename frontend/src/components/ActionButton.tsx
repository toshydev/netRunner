import {ActionType} from "../models.ts";
import {Button} from "@mui/material";
import styled from "@emotion/styled";

type props = {
    action: ActionType
    onAction: (action: ActionType) => void
    inactive: boolean
}

export default function ActionButton({action, onAction, inactive}: props) {

    return <StyledButton disabled={inactive} onClick={() => onAction(action)} actiontype={action}>{action.toString() === "ABANDON" ? "-" : "+"}</StyledButton>
}

const StyledButton = styled(Button)<{actiontype: ActionType}>`
  width: 4rem;
  height: 4rem;
  scale: 0.6;
  font-family: inherit;
  background: var(--color-black);
  color: ${({actiontype}) => actiontype.toString() === "ABANDON" ? "var(--color-secondary)" : "var(--color-primary)"};
  font-size: 4rem;
  border-radius: 12px;
  border: 4px solid ${({actiontype}) => actiontype.toString() === "ABANDON" ? "var(--color-secondary)" : "var(--color-primary)"};
  transition: all 0.2s ease-in-out;

  &:focus {
    background: var(--color-black);
  }

  &:active {
    scale: 0.5;
  }

  &:disabled {
    color: var(--color-grey);
    border-color: var(--color-grey);
  }

  &:hover {
    background: var(--color-black);
  }
`;