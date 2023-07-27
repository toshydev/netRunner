import styled from "@emotion/styled";

export default function Header() {
    return (
        <StyledHeader>
            <h1>NetRunner</h1>
        </StyledHeader>
    );
}

const StyledHeader = styled.header`
  width: 100%;
  border: 1px solid var(--color-secondary);
  text-align: center;

  h1 {
    color: var(--color-primary);
    text-shadow: -1px -1px 1px var(--color-secondary);
  }
`;