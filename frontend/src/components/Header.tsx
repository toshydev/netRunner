import styled from "@emotion/styled";
import {keyframes} from "@emotion/react";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from "use-sound";
import click from "../assets/sounds/click.mp3";
import {useStore} from "../hooks/useStore.ts";

type Props = {
    user?: string
}

export default function Header({user}: Props) {
    const isAuthenticated = user !== "" && user !== undefined && user !== "anonymousUser"
    const navigate = useNavigate()
    const volume = useStore(state => state.volume);
    const [playClick] = useSound(click, {volume: volume});

    return (
        <StyledHeader>
            <h1>NetRunner</h1>
            {!isAuthenticated
                ? <StyledButton onClick={() => {
                    playClick()
                    navigate("/login")
                }}>Login</StyledButton>
                : <StyledButton onClick={() => {
                    playClick()
                    navigate(`/player/${user}`)
                }}>{user}</StyledButton>}
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
  border-bottom: 0.5px solid var(--color-secondary);
  filter: drop-shadow(0 0 0.1rem var(--color-secondary));
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 1rem 0 1rem;


  h1 {
    color: var(--color-primary);
    text-shadow: -1px -1px 1px var(--color-secondary);
    animation: ${blink} 3s infinite;
    margin-right: auto;
    filter: drop-shadow(0 0 0.1rem var(--color-primary));
  }
`;

const StyledButton = styled(Button)`
  color: var(--color-primary);
  text-decoration: none;
  font-size: 1.5rem;
  font-family: inherit;
`;
