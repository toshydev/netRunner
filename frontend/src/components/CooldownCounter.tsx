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
            <StyledRotatingTriangle duration={4}/>
            <StyledRotatingTriangle duration={5}/>
            <StyledRotatingTriangle duration={6}/>
            <StyledRotatingTriangle duration={7}/>
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
  z-index: 3;
`;

const StyledRotatingTriangle = styled.div<{duration: number}>`
  width: 0;
    height: 0;
    border: 2.5rem solid transparent;
    border-top: 0;
    border-bottom: 4rem solid var(--color-secondary);
    color: var(--color-secondary);
    position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 0%);
   ${({duration}) => `animation: rotate ${duration}s ease-in-out infinite;`} 
    z-index: 0;
  
    @keyframes rotate {
        0% {
            transform: translate(-50%, 0%) rotate(0deg);
        }
        25% {
            transform: translate(-50%, 25%) rotate(180deg);
        }
        50% {
            transform: translate(-50%, 25%) rotate(-180deg);
        }
        100% {
            transform: translate(-50%, 0%) rotate(0deg);
        }
    }
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

const StyledHeading = styled.h2`
  padding: 0 5rem;
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -175%);
    color: black;
    text-shadow: 0 0 2px black;
    z-index: 2;
  background: var(--color-secondary);
`;
