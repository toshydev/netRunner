import {useEffect, useState} from "react";

const COOLDOWN_DURATION = 120;

export default function useCooldown(lastActionTimestamp: number) {
    const [isOnCooldown, setIsOnCooldown] = useState(false);

    useEffect(() => {

        const now = Math.floor(Date.now() / 1000);
        const remainingCooldown = Math.max(0, lastActionTimestamp + COOLDOWN_DURATION - now);

        if (remainingCooldown > 0) {
            setIsOnCooldown(true);

            const cooldownInterval = setInterval(() => {
                const updatedCooldown = Math.max(0, lastActionTimestamp + COOLDOWN_DURATION - Math.floor(Date.now() / 1000));
                if (updatedCooldown === 0) {
                    setIsOnCooldown(false);
                    clearInterval(cooldownInterval);
                }
            }, 1000);

            return () => clearInterval(cooldownInterval);
        }
    }, [lastActionTimestamp]);

    return { isOnCooldown };
}
