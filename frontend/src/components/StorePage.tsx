import styled from "@emotion/styled";
import {Button, Card, Typography} from "@mui/material";
import {useStore} from "../hooks/useStore.ts";
import {useEffect, useState} from "react";
import {keyframes} from "@emotion/react";
import {ItemSize} from "../models.ts";
import {useErrorSound, useLoginSuccessSound} from "../utils/sound.ts";

export default function StorePage() {
    const [isUpdating, setIsUpdating] = useState(false)
    const player = useStore(state => state.player)
    const buyDaemons = useStore(state => state.buyDaemons)
    const playError = useErrorSound()
    const playLoginSuccess = useLoginSuccessSound()

    useEffect(() => {
        const interval = setInterval(() => {
            setIsUpdating(false)
        }, 1500);
        return () => clearInterval(interval);
    }, [player]);

    function handleBuyDaemons(amount: ItemSize) {
        setIsUpdating(true)
        buyDaemons(amount, playLoginSuccess, playError)
    }

    if (player) {
        return <StyledCard>
            <StyledPlayerStats>
                <StyledText isupdating={`${isUpdating}`} color="secondary">Daemons: {player.attack}</StyledText>
                <StyledText isupdating={`${isUpdating}`}>Credits: {player.credits}$</StyledText>
            </StyledPlayerStats>
            <StyledSmallStoreItem disabled={player.credits < 1000} onClick={() => handleBuyDaemons(ItemSize.SMALL)}>
                <StyledItemHeading color={"secondary"} variant={"h5"}>1 Daemon</StyledItemHeading>
                <StyledItemHeading variant={"h6"}>Cost: 1000$</StyledItemHeading>
            </StyledSmallStoreItem>
            <StyledSmallStoreItem disabled={player.credits < 4000} onClick={() => handleBuyDaemons(ItemSize.MEDIUM)}>
                <StyledItemHeading color={"secondary"} variant={"h5"}>5 Daemons</StyledItemHeading>
                <StyledItemHeading variant={"h6"}>Cost: 4000$</StyledItemHeading>
            </StyledSmallStoreItem>
            <StyledLargeStoreItem disabled={player.credits < 7500} onClick={() => handleBuyDaemons(ItemSize.LARGE)}>
                <StyledItemHeading color={"secondary"} variant={"h4"}>10 Daemons</StyledItemHeading>
                <StyledItemHeading variant={"h5"}>Cost: 7500$</StyledItemHeading>
            </StyledLargeStoreItem>
        </StyledCard>
    }
}

const StyledCard = styled(Card)`
  margin: 0.5rem 0;
  width: 95%;
  height: 70vh;
  background: var(--color-semiblack);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2.5rem 2fr 2fr;
  padding: 1rem;
  gap: 1rem;
`;

const StyledPlayerStats = styled.div`
  grid-row: 1;
  grid-column: 1 / span 2;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const pulse = keyframes`
  0% {
    filter: drop-shadow(0 0 0.15rem currentColor);
  }
  50% {
    filter: drop-shadow(0 0 0.5rem currentColor);
  }
  100% {
    filter: drop-shadow(0 0 0.15rem currentColor);
  }
`;

const StyledText = styled(Typography)<{ isupdating?: string, color?: string }>`
  color: ${props => props.color === "secondary" ? "var(--color-secondary)" : "var(--color-primary)"};
  font-family: inherit;
  background: var(--color-black);
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  text-align: center;
  border: 2px solid ${props => props.color === "secondary" ? "var(--color-secondary)" : "var(--color-primary)"};
  border-radius: 0.5rem;
+;
  animation: ${props => props.isupdating === "true" ? pulse : "none"} 1s infinite;
`;

const StyledSmallStoreItem = styled(Button)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 2px solid var(--color-primary);
  border-radius: 0.5rem;
  background: var(--color-black);
  grid-row: 2;
  transition: scale 0.15s ease-in-out, filter 0.05s ease-in-out;

  &:active {
    scale: 0.95;
    filter: drop-shadow(0 0 1rem var(--color-primary));
  }

  &:hover {
    background: var(--color-black);
  }

  &:disabled {
    border-color: var(--color-grey);

    h4 {
      color: var(--color-grey);
    }

    h5 {
      color: var(--color-secondary);
    }
  }
`;

const StyledLargeStoreItem = styled(StyledSmallStoreItem)`
  grid-row: 3;
  grid-column: 1 / span 2;
`;

const StyledItemHeading = styled(Typography)<{ color?: string }>`
  color: ${({color}) => color === "secondary" ? "var(--color-secondary)" : "var(--color-primary)"};
  font-family: inherit;
`;
