import styled from "@emotion/styled";
import {useStore} from "../hooks/useStore.ts";
import {Player} from "../models.ts";

type Props = {
    player: Player | null
}
export default function PlayerInfoBar({player}: Props) {
    const gps = useStore(state => state.gps)
    const setGps = useStore(state => state.setGps)

    return <StyledContainer>
        {player && <StyledBar theme={"primary"} bg={"semiblack"}>
            <StyledText color={"primary"}>{player.name}</StyledText>
            <StyledInfoContainer>
                <StyledText color={"primary"}>LVL {player.level}</StyledText>
                <StyledText color={"secondary"}>{player.health}HP</StyledText>
                <StyledText color={"secondary"}>{player.attack}AP</StyledText>
                <StyledText color={"primary"}>{player.credits}$</StyledText>
            </StyledInfoContainer>
        </StyledBar>}
        <StyledBar bg={"black"} theme={gps ? "secondary" : "grey"} onClick={() => setGps(!gps)}>
            <StyledText color={gps ? "secondary" : "grey"}>Lat: {player?.coordinates?.latitude}</StyledText>
            <StyledText color={gps ? "secondary" : "grey"}>Lon: {player?.coordinates?.longitude}</StyledText>
        </StyledBar>
    </StyledContainer>

}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%;
  height: 5rem;
  gap: 0.5rem;
  position: sticky;
  top: 3.3rem;
  z-index: 6;
  background: linear-gradient(var(--color-black) 0%, var(--color-black) 85%, transparent 95%);
`;

const StyledBar = styled.div<{ theme: string, bg: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid var(--color-${props => props.theme});
  border-radius: 8px;
  color: var(--color-${props => props.theme});
  width: 100%;
  background: var(--color-${props => props.bg});
  padding: 0 1rem 0 1rem;
`;

const StyledText = styled.p<{ color: string }>`
  color: var(--color-${props => props.color});
`;

const StyledInfoContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 1rem;
`;
