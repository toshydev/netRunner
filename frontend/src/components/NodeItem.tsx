import {ActionType, Node, Player} from "../models.ts";
import styled from "@emotion/styled";
import {Button, Typography} from "@mui/material";
import ActionButton from "./ActionButton.tsx";
import {useEffect, useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import axios from "axios";
import {getSecondsSinceTimestamp} from "../utils/calculation.ts";
import CooldownCounter from "./CooldownCounter.tsx";
import {css, keyframes} from "@emotion/react";

type Props = {
    node: Node;
    player: Player | null;
    distance: number;
}
export default function NodeItem({node, player, distance}: Props) {
    const [isInRange, setIsInRange] = useState<boolean>(false)
    const [isUpdating, setIsUpdating] = useState<boolean>(false)
    const [isAttacked, setIsAttacked] = useState<boolean>(false)
    const [initialLoad, setInitialLoad] = useState(true)
    const [level, setLevel] = useState<number>(node.level);
    const [owner, setOwner] = useState<string>("");
    const [notEnoughAP, setNotEnoughAP] = useState<boolean>(true);
    const [isPlayerOwned, setIsPlayerOwned] = useState<boolean>(false);
    const [isClaimable, setIsClaimable] = useState<boolean>(false);
    const [updateCooldown, setUpdateCooldown] = useState<number>(0);
    const [attackCooldown, setAttackCooldown] = useState<number>(0);
    const editNode = useStore(state => state.editNode);
    const deleteNode = useStore(state => state.deleteNode);
    const isLoading = useStore(state => state.isLoading);

    useEffect(() => {
        if (distance < 50) {
            setIsInRange(true)
        } else {
            setIsInRange(false)
        }
        if (getSecondsSinceTimestamp(node.lastUpdate) < 120) {
            setIsUpdating(true)
            setUpdateCooldown(120 - getSecondsSinceTimestamp(node.lastUpdate))
        } else {
            setIsUpdating(false)
            setUpdateCooldown(0)
        }
        if (getSecondsSinceTimestamp(node.lastAttack) < 120) {
            setIsAttacked(true)
            setAttackCooldown(120 - getSecondsSinceTimestamp(node.lastAttack))
        } else {
            setIsAttacked(false)
            setAttackCooldown(0)
        }
    }, [distance, node.lastAttack, node.lastUpdate, editNode])

    if (isUpdating) {
        setTimeout(() => {
            setIsUpdating(false)
        }, updateCooldown * 1000)
    }
    if (isAttacked) {
        setTimeout(() => {
            setIsAttacked(false)
        }, attackCooldown * 1000)
    }

    useEffect(() => {
        try {
            setLevel(node.level)
            fetchOwner()
        } catch (e) {
            console.error(e)
        } finally {
            if (player !== null) {
                setIsClaimable(node.health === 0 || node.ownerId === null)
                setIsPlayerOwned(node.ownerId === player.id)
                setNotEnoughAP(player.attack < node.level)
                setInitialLoad(false)
            }
        }
    }, [node, player, editNode, distance, isUpdating, isAttacked])


    function fetchOwner() {
        axios.get(node.ownerId && `/api/player/${node.ownerId}`)
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

    const claimDisabled = !isClaimable || !isInRange || isUpdating
    const abandonDisabled = !isPlayerOwned || isUpdating || !isInRange
    const hackDisabled = isPlayerOwned ? (isUpdating || !isInRange || notEnoughAP) : (isAttacked || !isInRange || notEnoughAP)

    if (!initialLoad && !isLoading && player !== null) {

        return <>
            <StyledListItem playerOwned={`${isPlayerOwned}`} status={`${isUpdating ? "update" : isAttacked ? "attack" : null}`}>
                {!isInRange && <ModalContainer>
                    <p>Out of Range</p>
                </ModalContainer>}
                <StyledNameContainer>
                    <StyledHeading length={node.name.length} variant={"h2"}>{node.name}</StyledHeading>
                </StyledNameContainer>
                <StyledStatsContainer>
                    <StyledTextPrimary>Health: {node.health}</StyledTextPrimary>
                    {isUpdating && <CooldownCounter lastActionTimestamp={node.lastUpdate} cooldown={updateCooldown}
                                      setCoolDown={setUpdateCooldown}/>}
                    {isAttacked && <CooldownCounter lastActionTimestamp={node.lastAttack} cooldown={attackCooldown}
                                                        setCoolDown={setAttackCooldown}/>}
                </StyledStatsContainer>
                <StyledOwnerArea>
                    <StyledClaimButton
                        disabled={claimDisabled}
                        onClick={() => handleEdit(ActionType.HACK)}
                    >{owner === "" ? "CLAIM" : owner}</StyledClaimButton>
                </StyledOwnerArea>
                <StyledDeleteButton onClick={() => deleteNode(node.id)}>X</StyledDeleteButton>
                <StyledDistanceInfo
                    outofrange={`${!isInRange}`}>{`Distance: ${distance / 1000} KM`}</StyledDistanceInfo>
                {node.ownerId !== null && <StyledActionArea>
                    {node.ownerId === player.id &&
                        <ActionButton inactive={abandonDisabled} action={ActionType.ABANDON}
                                      onAction={handleEdit}/>}
                    <ActionButton
                        inactive={hackDisabled}
                        action={ActionType.HACK} onAction={handleEdit}/>
                </StyledActionArea>}
                <StyledLevelArea>
                    <StyledLevelContainer>
                        <StyledLevel><strong>{level}</strong></StyledLevel>
                    </StyledLevelContainer>
                </StyledLevelArea>
                <StyledLocationContainer outofrange={`${!isInRange}`}>
                    <StyledTextPrimary>Lat: {node.coordinates.latitude}</StyledTextPrimary>
                    <StyledTextPrimary>Lon: {node.coordinates.longitude}</StyledTextPrimary>
                </StyledLocationContainer>
            </StyledListItem>
        </>
    } else {
        return <>loading ...</>
    }
}

const updateBlinker = keyframes`
    0% {
        outline: 0.25rem solid var(--color-primary);
      filter: drop-shadow(0 0 0.25rem var(--color-primary));
    }
    50% {
        outline: 0.25rem solid var(--color-semiblack);
      filter: drop-shadow(0 0 0 var(--color-primary));
    }
    100% {
        outline: 0.25rem solid var(--color-primary);
      filter: drop-shadow(0 0 0.25rem var(--color-primary));
    }
`;

const attackBlinker = keyframes`
    0% {
        outline: 0.25rem solid var(--color-secondary);
      filter: drop-shadow(0 0 0.25rem var(--color-secondary));
    }
    50% {
        outline: 0.25rem solid var(--color-semiblack);
      filter: drop-shadow(0 0 0 var(--color-secondary));
    }
    100% {
        outline: 0.25rem solid var(--color-secondary);
      filter: drop-shadow(0 0 0.25rem var(--color-secondary));
    }
`;

const StyledListItem = styled.li<{ playerOwned: string, status: string }>`
  color: ${({playerOwned}) => playerOwned === "true" ? "var(--color-primary)" : "var(--color-secondary)"};
  background: var(--color-semiblack);
  width: 100%;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 1fr) 2rem;
  position: relative;
  ${({status}) => status === "update" ? css`
    animation: ${updateBlinker} 1s linear infinite;
    ` : status === "attack" ? css`
    animation: ${attackBlinker} 1s linear infinite;
    ` : null}
`;

const StyledTextPrimary = styled(Typography)`
  color: inherit;
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
  color: inherit;
  font: inherit;
  font-size: ${({length}) => length > 10 ? "1.5rem" : "2rem"};
`;

const StyledStatsContainer = styled.div`
  display: flex;
  grid-column: 1 / 4;
  grid-row: 2;
  gap: 0.5rem;
`;

const StyledLocationContainer = styled.div<{ outofrange: string }>`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 2px solid ${({outofrange}) => outofrange === "true" ? "var(--color-secondary)" : "var(--color-primary)"};
  background: var(--color-black);
  color: ${({outofrange}) => outofrange === "true" ? "var(--color-secondary)" : "var(--color-primary)"};
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
  border: 3px solid currentColor;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledLevel = styled(Typography)`
  text-align: center;
  transform: rotate(-45deg);
  font-size: 1.5rem;
  font-family: inherit;
`

const StyledClaimButton = styled(Button)`
  margin-left: auto;
  background: var(--color-black);
  color: inherit;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  font: inherit;

  &:disabled {
    background: var(--color-black);
    border: 2px solid var(--color-grey);
    color: currentColor;
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

const StyledDistanceInfo = styled(Typography)<{ outofrange: string }>`
  color: ${({outofrange}) => outofrange === "true" ? "var(--color-secondary)" : "var(--color-primary)"};
  grid-column: 1 / 5;
  grid-row: 4;
  font-size: 1rem;
  font-family: inherit;
  align-self: center;
  z-index: 5;
`;

const ModalContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-black);
  opacity: 0.75;
  color: var(--color-secondary);
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;

  p {
    padding: 1rem;
    background: black;
    opacity: 1;
    border: 2px solid var(--color-secondary);
    filter: drop-shadow(0 0 0.25rem var(--color-secondary));
  }
`;
