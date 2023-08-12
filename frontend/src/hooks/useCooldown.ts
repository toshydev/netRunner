import {useEffect, useState} from "react";

export default function useCooldown(lastActionTimestamp: number, cooldownDuration: number) {
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [counter, setCounter] = useState(0);

    useEffect(() => {

        const now = Math.floor(Date.now() / 1000);
        const remainingCooldown = Math.max(0, lastActionTimestamp + cooldownDuration - now);

        if (remainingCooldown > 0) {
            setIsOnCooldown(true);

            const cooldownInterval = setInterval(() => {
                const updatedCooldown = Math.max(0, lastActionTimestamp + cooldownDuration - Math.floor(Date.now() / 1000));
                setCounter(updatedCooldown);
                if (updatedCooldown === 0) {
                    setIsOnCooldown(false);
                    clearInterval(cooldownInterval);
                }
            }, 1000);

            return () => clearInterval(cooldownInterval);
        }
    }, [cooldownDuration, lastActionTimestamp]);

    return { isOnCooldown, counter };
}
