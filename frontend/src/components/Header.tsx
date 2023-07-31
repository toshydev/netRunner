import styled from "@emotion/styled";
import {keyframes} from "@emotion/react";

export default function Header() {
    return (
        <StyledHeader>
            <h1>NetRunner</h1>
        </StyledHeader>
    );
}

const blink = keyframes`
    0% {
      color: var(--color-primary);
      text-shadow: 1px 1px 1px var(--color-secondary);
    }
    2% {
      color: transparent;
      text-shadow: 1px 1px 1px var(--color-secondary);
    }
    4% {
      color: var(--color-primary);
      text-shadow: -1px -1px 1px var(--color-secondary);
    }
    90% {
        color: var(--color-primary);
    }
    92% {
        color: transparent;
        text-shadow: -1px -1px 1px var(--color-secondary);
    }
    94% {
        color: var(--color-primary);
      text-shadow: 1px 1px 1px var(--color-secondary);
    }
    100% {
        color: var(--color-primary);
        text-shadow: 1px 1px 1px var(--color-secondary);
    }
`;

const StyledHeader = styled.header`
  width: 100%;
  background: var(--color-black);
  border: 1px solid var(--color-secondary);
  filter: drop-shadow(0 0 0.25rem var(--color-secondary));
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;


  h1 {
    color: var(--color-primary);
    text-shadow: -1px -1px 1px var(--color-secondary);
    animation: ${blink} 3s infinite;
  }
`;
