import styled from "@emotion/styled";
import {Player} from "../models.ts";
import CpuIcon from "./icons/CpuIcon.tsx";

type Props = {
    player: Player | null
}
export default function PlayerInfoBar({player}: Props) {

    return <StyledContainer>
        {player && <StyledBar theme={"primary"} bg={"black"}>
            <StyledText color={"primary"}>{player.name}</StyledText>
            <StyledInfoContainer>
                <StyledText color={"primary"}>LVL {player.level}</StyledText>
                <StyledText color={"secondary"}>{player.health}HP</StyledText>
                <StyledDaemonsContainer>
                    <StyledText color={"secondary"}>{player.attack}</StyledText>
                    <CpuIcon/>
                </StyledDaemonsContainer>
                <StyledText color={"primary"}>{player.credits}$</StyledText>
            </StyledInfoContainer>
        </StyledBar>}
    </StyledContainer>

}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%;
  height: 3rem;
  gap: 0.5rem;
  position: sticky;
  top: 3.5rem;
  z-index: 6;
  background: linear-gradient(var(--color-black) 0%, var(--color-black) 90%, transparent);
`;

const StyledBar = styled.div<{ theme: string, bg: string }>`
  display: flex;
  justify-content: space-between;
  height: 75%;
  align-items: center;
  border: 2px solid var(--color-${props => props.theme});
  border-radius: 8px;
  color: var(--color-${props => props.theme});
  width: 100%;
  background: var(--color-${props => props.bg});
  padding: 0 1rem 0 1rem;
  transition: all 0.5s ease-in-out;
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

const StyledDaemonsContainer = styled.div`
  height: 100%;
    display: flex;
  justify-content: space-around;
    align-items: center;
`;
