import {Button} from "@mui/material";
import styled from "@emotion/styled";

export const StyledFormButton = styled(Button)<{theme: string}>`
  background: var(--color-semiblack);
  border: 4px solid var(--color-${props => props.theme === "error" ? "secondary" : "primary"});
  border-radius: 12px;
  color: var(--color-${props => props.theme === "error" ? "secondary" : "primary"});
  font: inherit;
  width: 45%;

  &:disabled {
    background: var(--color-black);
    border-color: var(--color-semiblack);
    color: var(--color-semiblack);
  }
`;