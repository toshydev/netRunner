import {ActionType, Node} from "../models.ts";
import styled from "@emotion/styled";
import {Button, Typography} from "@mui/material";
import ActionButton from "./ActionButton.tsx";
import {useEffect, useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import axios from "axios";

type Props = {
    node: Node;
}
export default function NodeItem({node}: Props) {
    const [level, setLevel] = useState<number>(node.level);
    const [owner, setOwner] = useState<string>("");
    const editNode = useStore(state => state.editNode);
    const deleteNode = useStore(state => state.deleteNode);

    useEffect(() => {
        setLevel(node.level)
        fetchOwner()
    }, [node]);

    function fetchOwner() {
        axios.get(`/api/player/${node.ownerId}`)
            .then(response => response.data)
            .catch(() => setOwner(""))
            .then(data => {
                if (data) {
                    setOwner(data)
                } else {
                    setOwner("")
                }
            })
    }

    function handleEdit(action: ActionType) {
        editNode(node.id, action)
    }

    const date = new Date(node.lastUpdate * 1000);
    const formattedDate = date.toLocaleDateString("en-US") + " " + date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });

    return <>
        <StyledListItem>
            <StyledNameContainer>
                <StyledHeading length={node.name.length} variant={"h2"}>{node.name}</StyledHeading>
            </StyledNameContainer>
            <StyledStatsContainer>
                <StyledTextPrimary>Health: {node.health}</StyledTextPrimary>
                <StyledTextPrimary>last update: {formattedDate}</StyledTextPrimary>
            </StyledStatsContainer>
            <StyledOwnerArea>
                <StyledClaimButton
                    disabled={owner !== ""}
                    onClick={() => handleEdit(ActionType.HACK)}
                >{owner === "" ? "CLAIM" : owner}</StyledClaimButton>
            </StyledOwnerArea>
            <StyledDeleteButton onClick={() => deleteNode(node.id)}>X</StyledDeleteButton>
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
    </>
}

const StyledListItem = styled.li`
  background: var(--color-semiblack);
  width: 95%;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 1fr) 2rem;
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
    justify-content: center;
    align-items: center;
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

const StyledDeleteButton = styled(Button)`
  align-self: center;
  width: 4rem;
  height: 4rem;
  scale: 0.4;
  font-family: inherit;
  font-size: 3rem;
  background: var(--color-semiblack);
  color: var(--color-secondary);
  border: 2px solid var(--color-secondary);
  transition: all 0.2s ease-in-out;
  grid-column: 5 / 6;
  grid-row: 4;

  &:active {
    background: var(--color-secondary);
    color: var(--color-black);
    border: 2px solid var(--color-black);
    scale: 0.3;
  }
`;
