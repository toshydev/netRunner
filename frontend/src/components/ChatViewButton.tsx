import {Button} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {useClickSound} from "../utils/sound.ts";
import ChatIcon from "./icons/ChatIcon.tsx";
import {useStore} from "../hooks/useStore.ts";
import {useEffect} from "react";

export default function ChatViewButton() {
    const unreadMessages = useStore(state => state.unreadMessages)
    const resetUnreadMessages = useStore(state => state.resetUnreadMessages)
    const navigate = useNavigate();
    const location = useLocation();
    const playClick = useClickSound()

    const path = location.pathname.split("/")[1]

    useEffect(() => {
        if (path === "chat") {
            resetUnreadMessages()
        }
    }, [path, resetUnreadMessages, unreadMessages]);

    return <StyledViewButton ispage={`${path === "chat"}`} onClick={() => {
        playClick()
        navigate("/chat")
    }}>
        <ChatIcon/>
        {unreadMessages > 0 && <StyledMessageBadge>{unreadMessages}</StyledMessageBadge>}
    </StyledViewButton>
}

const StyledViewButton = styled(Button)<{ispage: string}>`
  width: 4rem;
  height: 4rem;
  border-radius: 8px;
  background: var(--color-black);
  ${props => props.ispage === "true" ? "border: 3px solid var(--color-primary);" : ""}
  font-family: inherit;
  color: var(--color-primary);
  scale: 0.65;
  position: relative;

  &:hover {
    background: var(--color-black);
  }

  &:active {
    background: inherit;
    scale: 0.6;
    filter: drop-shadow(0 0 0.5rem var(--color-primary));
  }

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const StyledMessageBadge = styled.div`
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--color-secondary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    filter: drop-shadow(0 0 0.5rem var(--color-black));
  
`;
