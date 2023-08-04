import {useEffect} from "react";
import styled from "@emotion/styled";

type Props = {
    lastActionTimestamp: number;
    cooldown: number;
    setCoolDown: (cooldown: number) => void;
}

export default function CooldownCounter({lastActionTimestamp, cooldown, setCoolDown}: Props) {

    useEffect(() => {
        const id = setInterval(() => {
            const now = Math.floor(Date.now() / 1000)
            const remainingCooldown = Math.max(0 , lastActionTimestamp + 120 - now)
            setCoolDown(remainingCooldown)
        }, 1000);

        return () => {
            clearInterval(id);
        };
    }, [lastActionTimestamp, setCoolDown]);

    function formatTime(timeInSeconds: number) {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = timeInSeconds % 60
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    return <StyledCooldownCounter>{formatTime(cooldown)}</StyledCooldownCounter>
}

const StyledCooldownCounter = styled.div`
  background: var(--color-black);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 2rem;
  border-radius: 8px;
  color: var(--color-secondary);
  border: 2px solid var(--color-secondary);
`;
