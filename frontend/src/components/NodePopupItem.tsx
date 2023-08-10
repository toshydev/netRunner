import {ActionType, Node, Player} from "../models.ts";
import styled from "@emotion/styled";
import {Button, Card, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import {css, keyframes, SerializedStyles} from "@emotion/react";
import useOwner from "../hooks/useOwner.ts";
import CooldownCounter from "./CooldownCounter.tsx";
import HealthBar from "./HealthBar.tsx";
import {useNavigate} from "react-router-dom";
import UnlockIcon from "./icons/UnlockIcon.tsx";
import {useClickSound, useElectricMachineSound, useUpgradeSound} from "../utils/sound.ts";
import MiniActionButton from "./MiniActionButton.tsx";
import MiniDowngradeIcon from "./icons/MiniDowngradeIcon.tsx";
import MiniAttackIcon from "./icons/MiniAttackIcon.tsx";
import MiniUpgradeIcon from "./icons/MiniUpgradeIcon.tsx";

type Props = {
    node: Node;
    player: Player | null;
    distance: number;
    isUpdating: boolean;
    isAttacked: boolean;
}

export default function NodePopupItem({node, player, distance, isUpdating, isAttacked}: Props) {
    const [isInRange, setIsInRange] = useState<boolean>(false)
    const [level, setLevel] = useState<number>(node.level);
    const [notEnoughAP, setNotEnoughAP] = useState<boolean>(true);
    const [isPlayerOwned, setIsPlayerOwned] = useState<boolean>(false);
    const [isClaimable, setIsClaimable] = useState<boolean>(false);
    const [interactionText, setInteractionText] = useState<string>("");
    const [isInteraction, setIsInteraction] = useState<boolean>(false);

    const playUpgrade = useUpgradeSound();
    const playClick = useClickSound();
    const playElectricMachine = useElectricMachineSound();

    const owner = useOwner(node.ownerId);
    const editNode = useStore(state => state.editNode);
    const navigate = useNavigate();

    useEffect(() => {
        if (distance <= 50) {
            setIsInRange(true)
        } else {
            setIsInRange(false)
        }
    }, [distance, node.lastAttack, node.lastUpdate, editNode])

    useEffect(() => {
        try {
            setLevel(node.level)
        } catch (e) {
            console.error(e)
        } finally {
            if (player !== null) {
                setIsClaimable(node.health === 0 || node.ownerId === null)
                setIsPlayerOwned(node.ownerId === player.id)
                setNotEnoughAP(player.attack < node.level)
            }
        }
    }, [node, player, editNode, distance, isUpdating, isAttacked])

    useEffect(() => {
        if (isInteraction) {
            const timer = setTimeout(() => {
                setIsInteraction(false)
                setInteractionText("")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isInteraction])

    function handleEdit(action: ActionType) {
        editNode(node.id, action)
        buildText(action)
        if (isPlayerOwned) {
            playUpgrade()
        } else {
            playElectricMachine()
        }
        setIsInteraction(true)
    }

    function buildText(action: ActionType) {
        switch (action) {
            case ActionType.HACK:
                if (isPlayerOwned || owner === null) {
                    setInteractionText(`-${node.level}AP`)
                } else {
                    setInteractionText(`+${node.level * 10}$`)
                }
                break;
            case ActionType.ABANDON:
                setInteractionText("+1AP")
                break;
        }
    }

    function handleNavigate(path: string) {
        playClick()
        navigate(path)
    }

    const hackDisabled = isPlayerOwned ? (isUpdating || !isInRange || notEnoughAP) : (isAttacked || !isInRange || notEnoughAP)
    const claimDisabled = !isClaimable || !isInRange || isUpdating || isAttacked
    const abandonDisabled = !isPlayerOwned || isUpdating || !isInRange || node.health === 0

    let status = null;
    if (isUpdating) {
        status = "update"
    } else if (isAttacked) {
        status = "attack"
    }

    let animationStyles = null;
    if (status === "update") {
        animationStyles = css`
          animation: ${generateBlinkAnimation("var(--color-primary)")} 1s linear infinite;
        `;
    } else if (status === "attack") {
        animationStyles = css`
          animation: ${generateBlinkAnimation("var(--color-secondary)")} 1s linear infinite;
        `;
    }

    if (player) {
        return <>
            <StyledListItem isplayerowned={`${isPlayerOwned}`}
                            status={`${status}`}
                            css={animationStyles}>
                {!isInRange && <ModalContainer>
                    <p>Out of Range</p>
                </ModalContainer>}
                <StyledNameContainer>
                    <StyledHeading length={node.name.length} variant={"h2"}>{node.name}</StyledHeading>
                </StyledNameContainer>
                {isInteraction && <StyledFloatingText>{interactionText}</StyledFloatingText>}
                <StyledStatsContainer>
                    <HealthBar health={node.health}/>
                </StyledStatsContainer>
                <StyledOwnerArea>
                    <StyledClaimButton
                        isplayerowned={`${isPlayerOwned}`}
                        onClick={() => !claimDisabled ? handleEdit(ActionType.HACK) : handleNavigate(`/player/${owner}`)}
                    >{owner !== "" ? owner : <UnlockIcon/>}</StyledClaimButton>
                </StyledOwnerArea>
                <StyledDistanceInfo
                    outofrange={`${!isInRange}`}>{`${distance / 1000} KM`}</StyledDistanceInfo>
                {node.ownerId !== null && <StyledActionArea>
                    {node.ownerId === player.id &&
                            <MiniActionButton inactive={abandonDisabled} action={ActionType.ABANDON}
                                          onAction={handleEdit}>
                                <MiniDowngradeIcon/>
                            </MiniActionButton>}
                        <MiniActionButton
                            inactive={hackDisabled}
                            action={ActionType.HACK} onAction={handleEdit}>
                            {isPlayerOwned ? <MiniUpgradeIcon/> : <MiniAttackIcon/>}
                        </MiniActionButton>
                </StyledActionArea>}
                <StyledLevelArea>
                    <StyledLevelContainer>
                        <StyledLevel><strong>{level}</strong></StyledLevel>
                    </StyledLevelContainer>
                </StyledLevelArea>
                <StyledStatusContainer>
                    {isUpdating && <CooldownCounter lastActionTimestamp={node.lastUpdate} label={"Update"}/>}
                    {isAttacked && <CooldownCounter lastActionTimestamp={node.lastAttack} label={"Attack"}/>}
                </StyledStatusContainer>
            </StyledListItem>
        </>
    }
}

const generateBlinkAnimation = (color: string) => keyframes`
  0% {
    outline: 0.25rem solid ${color};
    filter: drop-shadow(0 0 0.25rem ${color});
  }
  50% {
    outline: 0.25rem solid var(--color-semiblack);
    filter: drop-shadow(0 0 0 ${color});
  }
  100% {
    outline: 0.25rem solid ${color};
    filter: drop-shadow(0 0 0.25rem ${color});
  }
`;

const StyledListItem = styled(Card)<{ isplayerowned: string; status: string, css: SerializedStyles | null }>`
  color: ${({isplayerowned}) =>
          isplayerowned === "true" ? "var(--color-primary)" : "var(--color-secondary)"};
  background: var(--color-semiblack);
  width: 100%;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  position: relative;
  font-family: "3270", monospace;
    border-radius: 0.5rem;
  ${({css}) => css};
`;

const StyledNameContainer = styled.div`
  display: flex;
  grid-column: 1 / 4;
  grid-row: 1;
  align-items: center;
  padding-left: 0.5rem;
`;

const StyledHeading = styled(Typography)<{ length: number }>`
  color: inherit;
  font: inherit;
  font-size: ${({length}) => length > 10 ? "1rem" : "1.5rem"};
`;

const StyledStatsContainer = styled.div`
  display: flex;
    justify-content: center;
    align-items: center;
  grid-column: 1 / 4;
  grid-row: 2;
`;

const StyledOwnerArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 4;
  grid-row: 1;
`;

const StyledActionArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  grid-column: 4;
  grid-row: 3;
  gap: 0.5rem;
  
`;

const StyledLevelArea = styled.div`
  display: flex;
  grid-column: 4;
  grid-row: 2;
  justify-content: center;
  align-items: center;
  scale: 0.8;
`;

const StyledLevelContainer = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  transform: rotate(45deg);
  background: var(--color-black);
  border: 3px solid currentColor;
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

const StyledClaimButton = styled(Button)<{ isplayerowned: string }>`
  margin-left: auto;
  background: var(--color-black);
  color: ${({isplayerowned}) => isplayerowned === "true" ? "var(--color-primary)" : "var(--color-secondary)"};
  border: 2px solid ${({isplayerowned}) => isplayerowned === "true" ? "var(--color-primary)" : "var(--color-secondary)"};
  border-radius: 8px;
  font: inherit;
  z-index: 5;
  scale: 0.75;

  &:active {
    background: var(--color-black);
  }

  &:hover {
    background: var(--color-black);
  }
`;

const StyledStatusContainer = styled.div`
  grid-column: 2 / 4;
  grid-row: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  
  p {
    font-size: 0.5rem;
  }
`;

const StyledDistanceInfo = styled(Typography)<{ outofrange: string }>`
  color: ${({outofrange}) => outofrange === "true" ? "var(--color-secondary)" : "var(--color-primary)"};
  grid-column: 1 / 2;
  grid-row: 3;
  font-size: 0.5rem;
  font-family: inherit;
  align-self: center;
  z-index: 4;
  padding-left: 0.5rem;
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
  font-size: 1rem;

  p {
    background: black;
    opacity: 1;
    border: 2px solid var(--color-secondary);
    filter: drop-shadow(0 0 0.25rem var(--color-secondary));
  }
`;

const floatingText = keyframes`
  0% {
    transform: translate(-50%, -75%);
  }
  50% {
    transform: translate(-50%, -200%);
  }
  100% {
    transform: translate(-50%, -300%);
  }
`;

const StyledFloatingText = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -75%);
  font-size: 1rem;
  font-family: inherit;
  color: var(--color-primary);
  z-index: 5;
  animation: ${floatingText} 3s linear;
  text-shadow: 0 0 0.25rem var(--color-primary);
`;
