import styled from "@emotion/styled";

export const StyledInput = styled.input`
  background: var(--color-semiblack);
  outline: 2px solid var(--color-primary);
  color: var(--color-primary);
  font: inherit;
  width: 100%;
  height: 3rem;

  &::placeholder {
    color: var(--color-primary);
  }
`;