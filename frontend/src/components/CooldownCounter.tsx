import {useEffect, useState} from "react";
import styled from "@emotion/styled";

type Props = {
    lastActionTimestamp: number;
};

export default function CooldownCounter({ lastActionTimestamp }: Props) {
    const [remainingCooldown, setRemainingCooldown] = useState(0);

    useEffect(() => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = Math.max(0, lastActionTimestamp + 120 - now);
        setRemainingCooldown(remaining);

        if (remaining > 0) {
            const cooldownInterval = setInterval(() => {
                const updatedRemaining = Math.max(0, lastActionTimestamp + 120 - Math.floor(Date.now() / 1000));
                setRemainingCooldown(updatedRemaining);
                if (updatedRemaining === 0) {
                    clearInterval(cooldownInterval);
                }
            }, 1000);

            return () => clearInterval(cooldownInterval);
        }
    }, [lastActionTimestamp]);

    function formatTime(timeInSeconds: number) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return (
        <StyledCooldownCounter>
            <StyledHeading>COOLDOWN</StyledHeading>
            <StyledCountdownText>
                {formatTime(remainingCooldown)}
            </StyledCountdownText>
        </StyledCooldownCounter>
    );
}

const StyledCooldownCounter = styled.div`
  width: 0;
  height: 0;
  border: 2.5rem solid transparent;
  border-top: 0;
  border-bottom: 4rem solid var(--color-secondary);
  color: var(--color-secondary);
  position: absolute;
  top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  filter: drop-shadow(0 0 2px var(--color-primary));
`;

const StyledCountdownText = styled.p`
  font-size: 1rem;
  color: black;
  text-shadow: 0 0 2px black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 125%);
`;

const StyledHeading = styled.h3`
  padding: 0 3rem;
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -175%);
    color: black;
    text-shadow: 0 0 2px black;
    z-index: 2;
  background: var(--color-secondary);
`;
