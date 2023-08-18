import styled from "@emotion/styled";

export const StyledStatusBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
    background-color: var(--color-black);
  opacity: 0.8;
  z-index: 10;
  display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
`;
