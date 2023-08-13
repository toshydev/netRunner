import useCooldown from "../hooks/useCooldown.ts";
import styled from "@emotion/styled";
import {Button} from "@mui/material";
import ScanIcon from "./icons/ScanIcon.tsx";
import {Player} from "../models.ts";
import {useStore} from "../hooks/useStore.ts";
import {useLoadingOsSound, useErrorSound} from "../utils/sound.ts";
import {useEffect, useState} from "react";

type Props = {
    player: Player;
}
export default function RechargingButton({player}: Props) {
    const {isOnCooldown, counter} = useCooldown(player.lastScan, 300);
    const [isUpdating, setIsUpdating] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const scanNodes = useStore(state => state.scanNodes);
    const playLoading = useLoadingOsSound();
    const playError = useErrorSound();

    useEffect(() => {
        if (isOnCooldown) {
        setIsUpdating(isOnCooldown)
            setPercentage(100 - counter / 300 * 100)
        }
    }, [counter, isOnCooldown, scanNodes, player]);

    function handleScan() {
        scanNodes(player.coordinates, playLoading, playError);
        setIsUpdating(true);
    }

    return <StyledButton disabled={isUpdating} onClick={handleScan} isupdating={String(isUpdating)}>
        <StyledBackgroundContainer>
            {isUpdating && <StyledRechargingBackground percentage={percentage}/>}
            <ScanIcon/>
        </StyledBackgroundContainer>
    </StyledButton>
}

const StyledButton = styled(Button)<{isupdating: string}>`
  position: absolute;
  bottom: 3rem;
  right: 2rem;
  background: var(--color-black);
  border: 3px solid ${({isupdating}) => isupdating === "false" ? "var(--color-primary)" : "var(--color-semiblack)"};
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  z-index: 9;
  padding: 0;
  color: ${({isupdating}) => isupdating === "false" ? "var(--color-primary)" : "var(--color-semiblack)"};
  filter: drop-shadow(0 0 0.25rem ${({isupdating}) => isupdating === "false" ? "var(--color-primary)" : "var(--color-black)"});

  &:hover {
    background: inherit;
  }

  &:active {
    background: inherit;
    scale: 0.9;
    filter: drop-shadow(0 0 1rem var(--color-primary));
  }
`;

const StyledBackgroundContainer = styled.div`
  position: relative;
    width: 100%;
    height: 100%;
  clip-path: circle(50% at 50% 50%);
  
    svg {
      position: relative;
      top: 20%;
      width: 2rem;
      height: 2rem;
    }
`;

const StyledRechargingBackground = styled.div<{percentage: number}>`
    position: absolute;
    bottom: 0;
    left: 0;
    background: var(--color-primary);
    width: 100%;
    height: ${({percentage}) => percentage}%;
  opacity: 0.8;
  filter: drop-shadow(0 0 0.25rem var(--color-primary));
`;
