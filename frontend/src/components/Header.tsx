import styled from "@emotion/styled";
import {keyframes} from "@emotion/react";
import {Button} from "@mui/material";
import {useStore} from "../hooks/useStore.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

type Props = {
    user?: string
}

export default function Header({user}: Props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const logout = useStore(state => state.logout)
    const setGps = useStore(state => state.setGps)
    const navigate = useNavigate()

    useEffect(() => {
        setIsAuthenticated(user !== "anonymousUser")

    }, [user, logout])

    function handleLogout() {
        logout()
        setGps(false)
        setIsAuthenticated(false)
        navigate("/login")
    }
    if(user === undefined) return "loading...";

    return (
        <StyledHeader>
            <h1>NetRunner</h1>
            {!isAuthenticated
                ? <StyledButton onClick={() => navigate("/login")}>Login</StyledButton>
                : <StyledButton onClick={handleLogout}>Logout</StyledButton>}
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
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 1rem 0 1rem;


  h1 {
    color: var(--color-primary);
    text-shadow: -1px -1px 1px var(--color-secondary);
    animation: ${blink} 3s infinite;
    margin-right: auto;
  }
`;

const StyledButton = styled(Button)`
    color: var(--color-primary);
    text-decoration: none;
    font-size: 1.5rem;
  font-family: inherit;
`;
