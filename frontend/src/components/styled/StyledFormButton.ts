import {Button} from "@mui/material";
import styled from "@emotion/styled";

export const StyledFormButton = styled(Button)<{theme: string}>`
  background: var(--color-${props => props.theme === "error" ? "black" : "semiblack"});
  border: 4px solid var(--color-${props => props.theme === "error" ? "secondary" : "primary"});
  border-radius: 12px;
  color: var(--color-${props => props.theme === "error" ? "secondary" : "primary"});
  font: inherit;
  width: 45%;
  filter: drop-shadow(0 0 0.15rem var(--color-${props => props.theme === "error" ? "secondary" : "primary"}));
  text-shadow: 0 0 0.15rem var(--color-${props => props.theme === "error" ? "secondary" : "primary"});

  &:disabled {
    background: var(--color-black);
    border-color: var(--color-semiblack);
    color: var(--color-semiblack);
    filter: none;
    text-shadow: none;
  }

  &:hover {
    background: var(--color-${props => props.theme === "error" ? "black" : "semiblack"});
  }
  
    &:active {
      scale: 0.95;
    }
`;