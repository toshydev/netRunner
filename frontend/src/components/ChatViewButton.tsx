import {Button} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {useSwitchSound} from "../utils/sound.ts";
import ChatIcon from "./icons/ChatIcon.tsx";

export default function ChatViewButton() {
    const navigate = useNavigate();
    const location = useLocation();
    const playSwitch = useSwitchSound()

    const path = location.pathname.split("/")[1]

    return <StyledViewButton onpage={`${path === "chat"}`} onClick={() => {
        playSwitch()
        navigate("/chat")
    }}>
        <ChatIcon/>
    </StyledViewButton>
}

const StyledViewButton = styled(Button)<{onpage: string}>`
  width: 4rem;
  height: 4rem;
  border-radius: 8px;
  background: var(--color-black);
  ${props => props.onpage === "true" ? "border: 3px solid var(--color-primary);" : ""}
  font-family: inherit;
  color: var(--color-primary);
  scale: 0.65;

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
