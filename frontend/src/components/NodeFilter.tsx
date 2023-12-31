import styled from "@emotion/styled";
import {useStore} from "../hooks/useStore.ts";
import {Button} from "@mui/material";
import CharacterIcon from "./icons/CharacterIcon.tsx";
import NetworkIcon from "./icons/NetworkIcon.tsx";
import {useClickSound} from "../utils/sound.ts";

export default function NodeFilter() {
    const sortDirection = useStore(state => state.sortDirection);
    const toggleSortDirection = useStore(state => state.toggleSortDirection);
    const ownerNodesFilter = useStore(state => state.ownerNodesFilter);
    const toggleOwnerNodesFilter = useStore(state => state.toggleOwnerNodesFilter);
    const rangeFilter = useStore(state => state.rangeFilter);
    const toggleRangeFilter = useStore(state => state.toggleRangeFilter);

    const playClick = useClickSound()

    return <StyledContainer>
        <StyledFilterToggle direction={`${rangeFilter}`} onClick={() => {
            playClick()
            toggleRangeFilter()
        }}>
            <NetworkIcon/>
        </StyledFilterToggle>
        <StyledFilterToggle direction={`${ownerNodesFilter}`} onClick={() => {
            playClick()
            toggleOwnerNodesFilter()
        }}>
            <CharacterIcon/>
        </StyledFilterToggle>
        <StyledSortToggle direction={sortDirection} onClick={() => {
            playClick()
            toggleSortDirection()
        }}><span>{sortDirection === "asc" ? "▲" : "▼"}</span></StyledSortToggle>
    </StyledContainer>
}

const StyledContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 3rem;
  position: sticky;
  top: 6.5rem;
  z-index: 6;
`;

const StyledSortToggle = styled(Button)<{direction: string}>`
  color: var(--color-${props => props.direction === "asc" ? "primary" : "secondary"});
  background: var(--color-black);
  border: 2px solid var(--color-${props => props.direction === "asc" ? "primary" : "secondary"});
  border-radius: 8px;
  width: 4rem;
  height: 4rem;
  transform: scale(0.5);
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 0 0.75rem var(--color-black));
  transition: all 0.2s ease-in-out;

  &:hover {
    background: var(--color-black);
  }

  &:active {
    scale: 0.9;
  }
`;

const StyledFilterToggle = styled(StyledSortToggle)<{direction: string}>`
  color: var(--color-${props => props.direction === "true" ? "primary" : "grey"});
  border: 2px solid var(--color-${props => props.direction === "true" ? "primary" : "grey"});
`;
