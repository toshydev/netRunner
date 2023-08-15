import styled from "@emotion/styled";
import {Button, Tooltip} from "@mui/material";
import {useSwitchSound} from "../utils/sound.ts";
import {useStore} from "../hooks/useStore.ts";
import PositionIcon from "./icons/PositionIcon.tsx";

export default function GpsButton() {
    const gps = useStore(state => state.gps);
    const setGps = useStore(state => state.setGps);

    const playSwitchSound = useSwitchSound();

    return (
        <Tooltip title={
            <StyledBadge>Toggle GPS</StyledBadge>
        } placement={"right"}>
            <StyledAddButton onClick={() => {
                playSwitchSound();
                setGps(!gps);
            }} gps={`${gps}`}
            ><PositionIcon/></StyledAddButton>
        </Tooltip>
    )
}

const StyledBadge = styled.div`
  color: var(--color-primary);
  font-size: 1.5rem;
`;

const StyledAddButton = styled(Button)<{gps: string }>`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-black);
  border: 3px solid ${props => props.gps === "true" ? "var(--color-primary)" : "var(--color-secondary)"};
  font-family: inherit;
  font-size: 2rem;
  color: ${props => props.gps === "true" ? "var(--color-primary)" : "var(--color-secondary)"};
  position: fixed;
  bottom: 6.5rem;
  left: 0.5rem;
  filter: drop-shadow(0 0 0.75rem var(--color-black));
  z-index: 5;
  transform: scale(0.6);

  &:hover {
    background: var(--color-black);
  }

  &:active {
    background: var(--color-black);
    scale: 0.9;
    filter: drop-shadow(0 0 0.5rem ${props => props.gps === "true" ? "var(--color-primary)" : "var(--color-secondary)"});
  }
`;
