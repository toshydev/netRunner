import {useStore} from "../hooks/useStore.ts";
import styled from "@emotion/styled";
import {Button} from "@mui/material";
import SoundIcon from "./icons/SoundIcon.tsx";
import {useEffect, useState} from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from "use-sound";
import click from "../assets/sounds/click.mp3";

export default function VolumeBar() {
    const [previousVolume, setPreviousVolume] = useState<number>(0)
    const volume = useStore(state => state.volume)
    const setVolume = useStore(state => state.setVolume)
    const [playClick] = useSound(click, {volume: volume});

    useEffect(() => {
        setPreviousVolume(volume)
    }, []);

    function handleVolumeToggle() {
        playClick()
        if (volume === 0) {
            setVolume(previousVolume)
        } else {
            setPreviousVolume(volume)
            setVolume(0)
        }
    }

    function handleVolumeChange(newVolume: number) {
        setVolume(newVolume)
        playClick()
    }

    return <StyledVolumeBar>
        <StyledOnOffButton isvolume={`${volume > 0}`} onClick={handleVolumeToggle} variant={"contained"}>
            <SoundIcon />
        </StyledOnOffButton>
        <StyledButtonContainer>
            <StyledSoundButton onClick={() => handleVolumeChange(0.25)} isvolume={`${volume >= 0.25}`}> </StyledSoundButton>
            <StyledSoundButton onClick={() => handleVolumeChange(0.5)} isvolume={`${volume >= 0.5}`}/>
            <StyledSoundButton onClick={() => handleVolumeChange(0.75)} isvolume={`${volume >= 0.75}`}/>
            <StyledSoundButton onClick={() => handleVolumeChange(1)} isvolume={`${volume === 1}`}/>
        </StyledButtonContainer>
    </StyledVolumeBar>

}

const StyledVolumeBar = styled.div`
  margin-top: 1rem;
  margin-left: auto;
  width: 10rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButtonContainer = styled.div`
  height: 90%;
  display: flex;
    justify-content: center;
    align-items: center;
  gap: 0.25rem;
`;

const StyledSoundButton = styled.button<{isvolume: string}>`
  width: 0.15rem;
  height: 100%;
  background: var(--color-${({isvolume}) => isvolume === "true" ? "primary" : "grey"});
  ${({isvolume}) => isvolume === "true" ? "box-shadow: 0 0 0.5rem var(--color-primary);" : ""}
    border: none;
`;

const StyledOnOffButton = styled(Button)<{isvolume: string}>`
  width: 5rem;
    height: 5rem;
  scale: 0.6;
  color: var(--color-${({isvolume}) => isvolume === "true" ? "primary" : "grey"});
  border: 0.25rem solid var(--color-${({isvolume}) => isvolume === "true" ? "primary" : "grey"});
  background: var(--color-${({isvolume}) => isvolume === "true" ? "semiblack" : "black"});
  border-radius: 12px;
`;
