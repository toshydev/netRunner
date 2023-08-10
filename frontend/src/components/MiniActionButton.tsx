import {ActionType} from "../models.ts";
import {Button} from "@mui/material";
import styled from "@emotion/styled";
import React from "react";

type props = {
    action: ActionType
    onAction: (action: ActionType) => void
    inactive: boolean
    children?: React.ReactNode
}

export default function MiniActionButton({action, onAction, inactive, children}: props) {

    return <StyledButton disabled={inactive} onClick={() => onAction(action)} actiontype={action}>{children}</StyledButton>
}

const StyledButton = styled(Button)<{actiontype: ActionType}>`
  font-family: inherit;
  background: var(--color-black);
  color: ${({actiontype}) => actiontype.toString() === "ABANDON" ? "var(--color-secondary)" : "var(--color-primary)"};
  border-radius: 5px;
  border: 2px solid ${({actiontype}) => actiontype.toString() === "ABANDON" ? "var(--color-secondary)" : "var(--color-primary)"};
  transition: all 0.2s ease-in-out;
  min-width: 1rem;
  min-height: 1rem;
  width: 1.5rem;
    height: 1.5rem;
  
  svg {
    scale: 4
  }

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
