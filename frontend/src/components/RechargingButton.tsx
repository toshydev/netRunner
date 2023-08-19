import useCooldown from "../hooks/useCooldown.ts";
import styled from "@emotion/styled";
import {Button} from "@mui/material";
import ScanIcon from "./icons/ScanIcon.tsx";
import {Player} from "../models.ts";
import {useStore} from "../hooks/useStore.ts";
import {useLoadingOsSound, useErrorSound} from "../utils/sound.ts";
import {useEffect, useState} from "react";
import {keyframes} from "@emotion/react";

type Props = {
    player: Player;
}
export default function RechargingButton({player}: Props) {
    const [timestamp, setTimestamp] = useState<number>(0);
    const [percentage, setPercentage] = useState(0);
    const {isOnCooldown, counter} = useCooldown(timestamp, 300);
    const scanNodes = useStore(state => state.scanNodes);
    const playLoading = useLoadingOsSound();
    const playError = useErrorSound();

    useEffect(() => {
        setTimestamp(player.lastScan)
        if (isOnCooldown) {
            setPercentage(Math.ceil(100 - counter / 300 * 100))
        }
    }, [counter, isOnCooldown, scanNodes, player]);

    function handleScan() {
        setTimestamp(Date.now());
        scanNodes(player.coordinates, playLoading, playError);
    }

    return <StyledButton disabled={isOnCooldown} onClick={handleScan} isupdating={String(isOnCooldown)}>
        <StyledBackgroundContainer>
            {isOnCooldown && <StyledRechargingBackground percentage={percentage}/>}
            <ScanIcon/>
        </StyledBackgroundContainer>
    </StyledButton>
}

const blink = keyframes`
    0% {
      filter: drop-shadow(0 0 0.25rem var(--color-black));
    }
  
    50% {
        filter: drop-shadow(0 0 0.25rem var(--color-secondary));
    }

    100% {
        filter: drop-shadow(0 0 0.25rem var(--color-black));
    }
`;

const StyledButton = styled(Button)<{isupdating: string}>`
  position: fixed;
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
    animation: ${({isupdating}) => isupdating === "true" ? blink : "none"} 1s infinite;

  &:hover {
    background: var(--color-black);
  }

  &:active {
    background: var(--color-black);
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
      top: 15%;
      width: 1.5rem;
      height: 2.5rem;
    }
`;

const StyledRechargingBackground = styled.div<{percentage: number}>`
    position: absolute;
    bottom: 0;
    left: 0;
    background: var(--color-primary);
    width: 100%;
    height: ${({percentage}) => percentage < 100 ? percentage : 0}%;
  opacity: 0.8;
  filter: drop-shadow(0 0 0.25rem var(--color-primary));
`;
