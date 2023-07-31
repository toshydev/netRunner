import {ActionType, Node} from "../models.ts";
import styled from "@emotion/styled";
import {Button, Typography} from "@mui/material";
import ActionButton from "./ActionButton.tsx";
import {useEffect, useState} from "react";
import {useStore} from "../hooks/useStore.ts";

type Props = {
    node: Node;
}
export default function NodeItem({node}: Props) {
    const [level, setLevel] = useState<number>(node.level);
    const editNode = useStore(state => state.editNode);

    useEffect(() => {
        setLevel(node.level)
    }, [node]);

    function handleEdit(action: ActionType) {
        editNode(node.id, action)
    }

    return <StyledListItem>
        <StyledNameContainer>
            <StyledHeading length={node.name.length} variant={"h2"}>{node.name}</StyledHeading>
        </StyledNameContainer>
        <StyledStatsContainer>
            <StyledTextPrimary>Health: {node.health}</StyledTextPrimary>
            <StyledTextPrimary>last update: {node.lastUpdated}</StyledTextPrimary>
        </StyledStatsContainer>
        <StyledOwnerArea>
                <StyledClaimButton
                    disabled={node.ownerId !== null}
                    onClick={() => handleEdit(ActionType.HACK)}
                >{node.ownerId === null ? "CLAIM" : node.ownerId}</StyledClaimButton>
        </StyledOwnerArea>
        {node.ownerId !== null && <StyledActionArea>
            <ActionButton action={ActionType.ABANDON} onAction={handleEdit}/>
            <ActionButton action={ActionType.HACK} onAction={handleEdit}/>
        </StyledActionArea>}
        <StyledLevelArea>
            <StyledLevelContainer>
                <StyledLevel><strong>{level}</strong></StyledLevel>
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

const StyledActionArea = styled.div`
  display: flex;
  z-index: 1;
  grid-column: 4 / 6;
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

const StyledClaimButton = styled(Button)`
  margin-left: auto;
  background: var(--color-black);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  font: inherit;
  
  &:disabled {
    background: var(--color-black);
    border: 2px solid var(--color-secondary);
    color: var(--color-secondary);
  }
`;
