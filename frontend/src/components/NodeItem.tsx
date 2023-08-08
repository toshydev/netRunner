import {ActionType, Node, Player} from "../models.ts";
import styled from "@emotion/styled";
import {Button, Card, Typography} from "@mui/material";
import ActionButton from "./ActionButton.tsx";
import {useEffect, useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import {css, keyframes, SerializedStyles} from "@emotion/react";
import useOwner from "../hooks/useOwner.ts";
import CooldownCounter from "./CooldownCounter.tsx";
import useCooldown from "../hooks/useCooldown.ts";
import HealthBar from "./HealthBar.tsx";
import {useNavigate} from "react-router-dom";
import AttackIcon from "./icons/AttackIcon.tsx";
import UpgradeIcon from "./icons/UpgradeIcon.tsx";
import DowngradeIcon from "./icons/DowngradeIcon.tsx";
import UnlockIcon from "./icons/UnlockIcon.tsx";
import TrashIcon from "./icons/TrashIcon.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from "use-sound";
import upgrade from "../assets/sounds/upgrade.mp3";
import click from "../assets/sounds/click.mp3";
import loginSuccess from "../assets/sounds/login_success.mp3";
import error from "../assets/sounds/error.mp3";
import electricMachine from "../assets/sounds/electric_machine.mp3";

type Props = {
    node: Node;
    player: Player | null;
    distance: number;
}

export default function NodeItem({node, player, distance}: Props) {
    const [isInRange, setIsInRange] = useState<boolean>(false)
    const [level, setLevel] = useState<number>(node.level);
    const [notEnoughAP, setNotEnoughAP] = useState<boolean>(true);
    const [isPlayerOwned, setIsPlayerOwned] = useState<boolean>(false);
    const [isClaimable, setIsClaimable] = useState<boolean>(false);
    const [interactionText, setInteractionText] = useState<string>("");
    const [isInteraction, setIsInteraction] = useState<boolean>(false);
    const {isOnCooldown: isUpdating} = useCooldown(node.lastUpdate);
    const {isOnCooldown: isAttacked} = useCooldown(node.lastAttack);
    const volume = useStore(state => state.volume);

    const [playUpgrade] = useSound(upgrade, {volume: volume});
    const [playClick] = useSound(click, {volume: volume});
    const [playLoginSuccess] = useSound(loginSuccess, {volume: volume});
    const [playError] = useSound(error, {volume: volume});
    const [playElectricMachine] = useSound(electricMachine, {volume: volume});

    const owner = useOwner(node.ownerId);
    const editNode = useStore(state => state.editNode);
    const deleteNode = useStore(state => state.deleteNode);
    const navigate = useNavigate();

    useEffect(() => {
        if (distance < 50) {
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
                <StyledDeleteButton onClick={() => deleteNode(node.id, playLoginSuccess, playError)}>
                    <TrashIcon/>
                </StyledDeleteButton>
                <StyledDistanceInfo
                    outofrange={`${!isInRange}`}>{`Distance: ${distance / 1000} KM`}</StyledDistanceInfo>
                {node.ownerId !== null && <StyledActionArea>
                    {node.ownerId === player.id &&
                        <ActionButton inactive={abandonDisabled} action={ActionType.ABANDON}
                                      onAction={handleEdit}>
                            <DowngradeIcon/>
                        </ActionButton>}
                    <ActionButton
                        inactive={hackDisabled}
                        action={ActionType.HACK} onAction={handleEdit}>
                        {isPlayerOwned ? <UpgradeIcon/> : <AttackIcon/>}
                    </ActionButton>
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
  width: 95%;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr) 2rem;
  position: relative;
  ${({css}) => css};
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

const StyledClaimButton = styled(Button)<{ isplayerowned: string }>`
  margin-left: auto;
  background: var(--color-black);
  color: ${({isplayerowned}) => isplayerowned === "true" ? "var(--color-primary)" : "var(--color-secondary)"};
  border: 2px solid ${({isplayerowned}) => isplayerowned === "true" ? "var(--color-primary)" : "var(--color-secondary)"};
  border-radius: 8px;
  font: inherit;
  z-index: 5;
  
    &:active {
    background: var(--color-black);
    }
  
    &:hover {
    background: var(--color-black);
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
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  grid-column: 5 / 6;
  grid-row: 5;

  &:active {
    background: var(--color-secondary);
    color: var(--color-black);
    border: 2px solid var(--color-black);
    scale: 0.3;
  }
`;

const StyledStatusContainer = styled.div`
  grid-column: 4 / 6;
  grid-row: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

`;

const StyledDistanceInfo = styled(Typography)<{ outofrange: string }>`
  color: ${({outofrange}) => outofrange === "true" ? "var(--color-secondary)" : "var(--color-primary)"};
  grid-column: 1 / 5;
  grid-row: 4;
  font-size: 1rem;
  font-family: inherit;
  align-self: center;
  z-index: 4;
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
  font-size: 2rem;
  font-family: inherit;
  color: var(--color-primary);
  z-index: 5;
  animation: ${floatingText} 3s linear;
  text-shadow: 0 0 0.25rem var(--color-primary);
`;
