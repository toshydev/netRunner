import {useEffect, useState} from "react";
import styled from "@emotion/styled";

type Props = {
    lastActionTimestamp: number;
    duration: number;
    label: "Update" | "Attack";
};

export default function CooldownCounter({ lastActionTimestamp, duration, label }: Props) {
    const [remainingCooldown, setRemainingCooldown] = useState(0);

    useEffect(() => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = Math.max(0, lastActionTimestamp + duration - now);
        setRemainingCooldown(remaining);

        if (remaining > 0) {
            const cooldownInterval = setInterval(() => {
                const updatedRemaining = Math.max(0, lastActionTimestamp + duration - Math.floor(Date.now() / 1000));
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

    return  <StyledCountdownText type={label}>
                {formatTime(remainingCooldown)}
            </StyledCountdownText>
}

const StyledCountdownText = styled.p<{type: string}>`
  font-size: 1rem;
  color: ${props => props.type === "Update" ? "var(--color-primary)" : "var(--color-secondary)"};
  border: 2px solid ${props => props.type === "Update" ? "var(--color-primary)" : "var(--color-secondary)"};
  border-radius: 5px;
  text-align: center;
  padding: 0 0.25rem;
  background: var(--color-black);
`;
