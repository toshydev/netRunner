import {Icon} from "leaflet";
import RadioTowerPlayer from "../../assets/svg/radio-tower-player.svg";
import RadioTowerEnemy from "../../assets/svg/radio-tower-enemy.svg";
import RadioTowerNeutral from "../../assets/svg/radio-tower-neutral.svg";
import PadlockNeutral from "../../assets/svg/padlock_neutral.svg";
import PadlockActive from "../../assets/svg/padlock_active.svg";
import CharacterPlayer from "../../assets/svg/character_player.svg";
import CharacterEnemy from "../../assets/svg/character_enemy.svg";

export const nodeIcon = (isPlayerOwned: boolean, isClaimable: boolean, isInRange: boolean, state: string) => {
    const iconUrl = getIconUrl(isPlayerOwned, isClaimable, isInRange)
    const className = buildIconClass(isPlayerOwned, isClaimable, state)
    return new Icon({iconUrl: iconUrl, iconSize: [32, 32], className: className})
}

function buildIconClass(isPlayerOwned: boolean, isClaimable: boolean, status: string) {
    let className = "node__";
    if (isClaimable) {
        className += "neutral"
    }
    else if (isPlayerOwned) {
        className += "player"
    } else {
        className += "enemy"
    }
    if (status === "update") {
        className += "--update"
    } else if (status === "attack") {
        className += "--attack"
    }
    return className
}

function getIconUrl(isPlayerOwned: boolean, isClaimable: boolean, isInRange: boolean) {
    if (isClaimable) {
        if (isInRange) {
            return PadlockActive
        } else {
            return PadlockNeutral
        }
    }
    else if (isPlayerOwned) {
        if (isInRange) {
            return RadioTowerPlayer
        } else {
            return RadioTowerNeutral
        }
    } else {
        if (isInRange) {
            return RadioTowerEnemy
        } else {
            return RadioTowerNeutral
        }
    }
}

export const playerIcon = (userName: string, playerName: string) => {
    if (userName === playerName) {
        return new Icon({iconUrl: CharacterPlayer, iconSize: [32, 32], className: "player"})
    } else {
        return new Icon({iconUrl: CharacterEnemy, iconSize: [32, 32], className: "player__enemy"})
    }
}
