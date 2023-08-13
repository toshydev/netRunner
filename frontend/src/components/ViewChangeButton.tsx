import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import NavigationIcon from "./icons/NavigationIcon.tsx";
import ListIcon from "./icons/ListIcon.tsx";
import styled from "@emotion/styled";
import {useSwitchSound} from "../utils/sound.ts";

type Props = {
    view: string;
}

export default function ViewChangeButton({view}: Props) {
    const navigate = useNavigate();
    const playSwitch = useSwitchSound()

    return <StyledViewButton onClick={() => {
        playSwitch()
        navigate(view === "map" ? "/map" : "/")
    }}>
        {view === "map" ? <NavigationIcon/> : <ListIcon/>}
    </StyledViewButton>
}

const StyledViewButton = styled(Button)`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-black);
  border: 3px solid var(--color-primary);
  font-family: inherit;
  color: var(--color-primary);
  position: fixed;
  bottom: 3rem;
  left: 2rem;
  filter: drop-shadow(0 0 0.75rem var(--color-black));
  z-index: 9;

  &:hover {
    background: var(--color-black);
  }

  &:active {
    background: inherit;
    scale: 0.9;
    filter: drop-shadow(0 0 0.5rem var(--color-primary));
  }

  svg {
    width: 2rem;
    height: 2rem;
  }
`;
