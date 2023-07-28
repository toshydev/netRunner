import {ActionType, Node} from "../models.ts";
import styled from "@emotion/styled";
import {Typography} from "@mui/material";
import ActionButton from "./ActionButton.tsx";

type Props = {
    node: Node;
}
export default function NodeItem({node}: Props) {
    return <StyledListItem>
        <StyledNameContainer>
            <StyledHeading length={node.name.length} variant={"h2"}>{node.name}</StyledHeading>
        </StyledNameContainer>
        <StyledStatsContainer>
            <StyledTextPrimary>Health: {node.health}</StyledTextPrimary>
            <StyledTextPrimary>last update: {node.lastUpdated}</StyledTextPrimary>
        </StyledStatsContainer>
        <StyledOwnerArea>
            <StyledTextSecondary>Owner: </StyledTextSecondary>
            <StyledOwnerContainer>
                <StyledTextPrimary>{node.ownerId}</StyledTextPrimary>
            </StyledOwnerContainer>
        </StyledOwnerArea>
        <StyledActionArea>
            <ActionButton action={ActionType.ABANDON} nodeId={node.id}/>
            <ActionButton action={ActionType.HACK} nodeId={node.id}/>
        </StyledActionArea>
        <StyledLevelArea>
            <StyledTextSecondary>LVL:</StyledTextSecondary>
            <StyledLevelContainer>
                <StyledLevel><strong>{node.level}</strong></StyledLevel>
            </StyledLevelContainer>
        </StyledLevelArea>
        <StyledLocationContainer>
            <StyledTextPrimary>Lat: {node.coordinates.latitude}</StyledTextPrimary>
            <StyledTextPrimary>Lon: {node.coordinates.longitude}</StyledTextPrimary>
        </StyledLocationContainer>
    </StyledListItem>
}

const StyledListItem = styled.li`
  background: var(--color-semiblack);
  width: 95%;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 1fr);
`;

const StyledTextSecondary = styled(Typography)`
  color: var(--color-secondary);
  font: inherit;
`;

const StyledTextPrimary = styled(Typography)`
  color: var(--color-primary);
  font: inherit;
`;

const StyledNameContainer = styled.div`
  display: flex;
  grid-column: 1 / 4;
  grid-row: 1;
  align-items: center;
  padding-right: 0.5rem;
`;

const StyledHeading = styled(Typography)<{ length: number }>`
  color: var(--color-primary);
  font: inherit;
  font-size: ${({length}) => length > 10 ? "1.5rem" : "2rem"};
`;

const StyledStatsContainer = styled.div`
  display: flex;
  grid-column: 1 / 4;
  grid-row: 2;
  gap: 0.5rem;
`;

const StyledLocationContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 2px solid var(--color-primary);
  background: var(--color-grey);
  padding: 0.5rem;
  grid-column: 1 / 4;
  grid-row: 3;
`;

const StyledOwnerArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  grid-column: 4 / 6;
  grid-row: 1;
`;

const StyledOwnerContainer = styled.div`
  width: 4rem;
  height: 2rem;
  border-radius: 8px;
  background: var(--color-grey);
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledActionArea = styled.div`
  display: flex;
  z-index: 1;
  grid-column: 5;
  grid-row: 2;
  
`;

const StyledLevelArea = styled.div`
  display: flex;
  grid-column: 4 / 6;
  grid-row: 2 / 4;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const StyledLevelContainer = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 8px;
  transform: rotate(45deg);
  background: var(--color-black);
  border: 3px solid var(--color-primary);
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledLevel = styled(Typography)`
  color: var(--color-primary);
  text-align: center;
  transform: rotate(-45deg);
  font-size: 1.5rem;
  font-family: inherit;
`
