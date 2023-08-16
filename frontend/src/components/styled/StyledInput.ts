import styled from "@emotion/styled";

export const StyledInput = styled.input`
  background: var(--color-semiblack);
  outline: 2px solid var(--color-primary);
  border: none;
  color: var(--color-secondary);
  font: inherit;
  height: 3rem;
  font-size: 1.5rem;
  text-align: center;
  text-shadow: 0 0 5px var(--color-secondary);

  &::placeholder {
    color: var(--color-secondary);
  }
  
  @media (min-width: 768px) {
    width: 50%;
  }
  
    @media (min-width: 1024px) {
    width: 30%;
    }
`;