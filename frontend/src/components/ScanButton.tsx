import {Button, Typography} from "@mui/material";
import styled from "@emotion/styled";
import ScanIcon from "./icons/ScanIcon.tsx";
import {Player} from "../models.ts";
import {useStore} from "../hooks/useStore.ts";
import {useLoadingOsSound, useErrorSound} from "../utils/sound.ts";

type Props = {
    player: Player | null;
}

export default function ScanButton({player}: Props) {
    const scanNodes = useStore(state => state.scanNodes)
    const playLoading = useLoadingOsSound()
    const playError = useErrorSound()

    if (player) {
        return (
            <StyledScanButton disabled={false} onClick={() => {
                scanNodes(player.coordinates, playLoading, playError)
            }}>
                <ScanIcon/><StyledScanCounter variant="h6">test</StyledScanCounter>
            </StyledScanButton>
        )
    }
}

const StyledScanButton = styled(Button)`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-black);
  border: 3px solid var(--color-primary);
  font-family: inherit;
  color: var(--color-primary);
  position: fixed;
  bottom: 3rem;
  right: 2rem;
  filter: drop-shadow(0 0 0.75rem var(--color-black));
  z-index: 9;

  &:hover {
    background: var(--color-black);
  }

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const StyledScanCounter = styled(Typography)`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  background: var(--color-primary);
  color: var(--color-black);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
`;

