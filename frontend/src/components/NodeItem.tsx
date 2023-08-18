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
import {
    useClickSound,
    useElectricMachineSound,
    useUpgradeSound
} from "../utils/sound.ts";
import {Marker, MarkerProps, Popup} from "react-leaflet";
import {nodeIcon} from "./icons/mapIcons.ts";
import MiniActionButton from "./MiniActionButton.tsx";
import MiniDowngradeIcon from "./icons/MiniDowngradeIcon.tsx";
import MiniUpgradeIcon from "./icons/MiniUpgradeIcon.tsx";
import MiniAttackIcon from "./icons/MiniAttackIcon.tsx";
import getDistanceString from "../utils/getDistanceString.ts";


type Props = {
    node: Node;
    player: Player | null;
    distance: number;
    type: "list" | "map";
}

export default function NodeItem({node, player, distance, type}: Props) {
    const [isInRange, setIsInRange] = useState<boolean>(false)
    const [level, setLevel] = useState<number>(node.level);
    const [notEnoughAP, setNotEnoughAP] = useState<boolean>(true);
    const [isPlayerOwned, setIsPlayerOwned] = useState<boolean>(false);
    const [isClaimable, setIsClaimable] = useState<boolean>(false);
    const {isOnCooldown: isUpdating} = useCooldown(node.lastUpdate, node.level * 60);
    const {isOnCooldown: isAttacked} = useCooldown(node.lastAttack, node.level * 60);

    const playUpgrade = useUpgradeSound();
    const playClick = useClickSound();
    const playElectricMachine = useElectricMachineSound();

    const owner = useOwner(node.ownerId);
    const editNode = useStore(state => state.editNode);
    const navigate = useNavigate();

    useEffect(() => {
        if (distance < 250) {
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

    function handleEdit(action: ActionType) {
        editNode(node.id, action)
        if (isPlayerOwned) {
            playUpgrade()
        } else {
            playElectricMachine()
        }
    }

    function handleNavigate(path: string) {
        playClick()
        navigate(path)
    }

    const ownerButtonDisabled = node.ownerId === null || node.ownerId === ""
    const hackDisabled = isPlayerOwned ? (isUpdating || !isInRange || notEnoughAP) : (isAttacked || !isInRange)
    const abandonDisabled = !isPlayerOwned || isUpdating || !isInRange || node.health === 0

    let status;
    if (isUpdating) {
        status = "update"
    } else if (isAttacked) {
        status = "attack"
    } else {
        status = "none"
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

    const getOwnerString = () => {
        if (isPlayerOwned) {
            return "player"
        } else if (!isPlayerOwned && !isClaimable) {
            return "enemy"
        } else {
            return "none"
        }
    }

    const icon = nodeIcon(node.name, getOwnerString(), status, isInRange)

    const markerProps: MarkerProps = {
        position: [node.coordinates.latitude, node.coordinates.longitude],
        icon: icon,
        eventHandlers: {
            click: () => {
                playClick()
            }
        }
    }

    if (player && node && type === "list") {
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
                <StyledStatsContainer>
                    <HealthBar health={node.health}/>
                </StyledStatsContainer>
                <StyledOwnerArea>
                    <StyledOwnerButton
                        isplayerowned={`${isPlayerOwned}`}
                        onClick={() => !ownerButtonDisabled && handleNavigate(`/player/${owner}`)}
                    >{owner !== "" ? owner : <UnlockIcon/>}</StyledOwnerButton>
                </StyledOwnerArea>
                <StyledDistanceInfo
                    outofrange={`${!isInRange}`}>{`Distance: ${getDistanceString(distance)}`}</StyledDistanceInfo>
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
                <StyledStatusContainer>
                    {isUpdating && <CooldownCounter lastActionTimestamp={node.lastUpdate} duration={node.level * 60} label={"Update"}/>}
                    {isAttacked && <CooldownCounter lastActionTimestamp={node.lastAttack} duration={node.level * 60} label={"Attack"}/>}
                </StyledStatusContainer>
            </StyledListItem>
        </>
    } else if (player && node && type === "map") {
        return <Marker {...markerProps}>
            <Popup>
                <StyledPopupListItem isplayerowned={`${isPlayerOwned}`}
                                     status={`${status}`}
                                     css={animationStyles}>
                    {!isInRange && <PopupModalContainer>
                        <p>Out of Range</p>
                    </PopupModalContainer>}
                    <StyledPopupNameContainer>
                        <StyledPopupHeading length={node.name.length} variant={"h2"}>{node.name}</StyledPopupHeading>
                    </StyledPopupNameContainer>
                    <StyledPopupStatsContainer>
                        <HealthBar health={node.health}/>
                    </StyledPopupStatsContainer>
                    <StyledPopupOwnerArea>
                        <StyledPopupOwnerButton
                            isplayerowned={`${isPlayerOwned}`}
                            onClick={() => !ownerButtonDisabled && handleNavigate(`/player/${owner}`)}
                        >{owner !== "" ? owner : <UnlockIcon/>}</StyledPopupOwnerButton>
                    </StyledPopupOwnerArea>
                    <StyledPopupDistanceInfo
                        outofrange={`${!isInRange}`}>{`${getDistanceString(distance)}`}</StyledPopupDistanceInfo>
                    {node.ownerId !== null && <StyledPopupActionArea>
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
                    </StyledPopupActionArea>}
                    <StyledPopupLevelArea>
                        <StyledPopupLevelContainer>
                            <StyledPopupLevel><strong>{level}</strong></StyledPopupLevel>
                        </StyledPopupLevelContainer>
                    </StyledPopupLevelArea>
                    <StyledPopupStatusContainer>
                        {isUpdating && <CooldownCounter lastActionTimestamp={node.lastUpdate} duration={node.level * 60} label={"Update"}/>}
                        {isAttacked && <CooldownCounter lastActionTimestamp={node.lastAttack} duration={node.level * 60} label={"Attack"}/>}
                    </StyledPopupStatusContainer>
                </StyledPopupListItem>
            </Popup>
        </Marker>
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
  grid-template-rows: repeat(3, 1fr);
  position: relative;
  ${({css}) => css};
`;

const StyledNameContainer = styled.div`
  display: flex;
  grid-column: 1 / 3;
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

const StyledOwnerButton = styled(Button)<{ isplayerowned: string }>`
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

const StyledStatusContainer = styled.div`
  grid-column: 3 / 5;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

`;

const StyledDistanceInfo = styled(Typography)<{ outofrange: string }>`
  color: ${({outofrange}) => outofrange === "true" ? "var(--color-secondary)" : "var(--color-primary)"};
  grid-column: 1 / 4;
  grid-row: 3;
  font-size: 1.5rem;
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

const StyledPopupListItem = styled(Card)<{ isplayerowned: string; status: string, css: SerializedStyles | null }>`
  color: ${({isplayerowned}) =>
    isplayerowned === "true" ? "var(--color-primary)" : "var(--color-secondary)"};
  background: var(--color-semiblack);
  width: 100%;
  height: 100%;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  position: relative;
  font-family: "3270", monospace;
  border-radius: 0.5rem;
  ${({css}) => css};
`;

const StyledPopupNameContainer = styled.div`
  display: flex;
  grid-column: 1 / 4;
  grid-row: 1;
  align-items: center;
  padding-left: 0.5rem;
`;

const StyledPopupHeading = styled(Typography)<{ length: number }>`
  color: inherit;
  font: inherit;
  font-size: ${({length}) => length > 10 ? "0.8rem" : "1.5rem"};
`;

const StyledPopupStatsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 1 / 4;
  grid-row: 2;
`;

const StyledPopupOwnerArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 4;
  grid-row: 1;
`;

const StyledPopupActionArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  grid-column: 4;
  grid-row: 3;
  gap: 0.5rem;

`;

const StyledPopupLevelArea = styled.div`
  display: flex;
  grid-column: 4;
  grid-row: 2;
  justify-content: center;
  align-items: center;
  scale: 0.8;
`;

const StyledPopupLevelContainer = styled.div`
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

const StyledPopupLevel = styled(Typography)`
  text-align: center;
  transform: rotate(-45deg);
  font-size: 1.5rem;
  font-family: inherit;
`

const StyledPopupOwnerButton = styled(Button)<{ isplayerowned: string }>`
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

const StyledPopupStatusContainer = styled.div`
  grid-column: 2 / 4;
  grid-row: 3;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    font-size: 0.5rem;
  }
`;

const StyledPopupDistanceInfo = styled(Typography)<{ outofrange: string }>`
  color: ${({outofrange}) => outofrange === "true" ? "var(--color-secondary)" : "var(--color-primary)"};
  grid-column: 1 / 2;
  grid-row: 3;
  font-size: 0.5rem;
  font-family: inherit;
  align-self: center;
  z-index: 6;
  padding-left: 0.5rem;
`;

const PopupModalContainer = styled.div`
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
