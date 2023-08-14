import {Icon} from "leaflet";
import CharacterEnemy from "../../assets/svg/character_enemy.svg";
import PlayerAvatar from "../../assets/images/avatar.png";
import DatabaseNeutral from "../../assets/svg/database_neutral.svg";
import DatabasePlayer from "../../assets/svg/databanse_player.svg";
import DatabaseEnemy from "../../assets/svg/database_enemy.svg";
import RadioTowerNeutral from "../../assets/svg/radio_neutral.svg";
import RadioTowerPlayer from "../../assets/svg/radio_player.svg";
import RadioTowerEnemy from "../../assets/svg/radio_enemy.svg";
import TradingNeutral from "../../assets/svg/trading_neutral.svg";
import TradingPlayer from "../../assets/svg/trading_player.svg";
import TradingEnemy from "../../assets/svg/trading_enemy.svg";
import CpuNeutral from "../../assets/svg/cpu_neutral.svg";
import CpuPlayer from "../../assets/svg/cpu_player.svg";
import CpuEnemy from "../../assets/svg/cpu_enemy.svg";
import CctvNeutral from "../../assets/svg/cctv_neutral.svg";
import CctvPlayer from "../../assets/svg/cctv_player.svg";
import CctvEnemy from "../../assets/svg/cctv_enemy.svg";

export const nodeIcon = (nodeName: string, owner: string, status: string, inRange: boolean) => {
    const className = buildClass(owner, status, inRange)
    const iconUrl = getNodeTypeIcon(nodeName, owner)
    return new Icon({iconUrl: iconUrl, iconSize: [32, 32], className: className})
}

function buildClass(owner: string, status: string, inRange: boolean) {
    const baseClass = "node "
    let ownerClass = "";
    if (inRange) {
        switch (owner) {
            case "player":
                ownerClass = " --player"
                break;
            case "enemy":
                ownerClass = " --enemy"
                break;
            default:
                break;
        }
    }
    return baseClass + ownerClass + (status !== "none" && ` --${status}`)
}

function getNodeTypeIcon(nodeName: string, owner: string) {
    const defaultNames = ["Trading interface", "Server farm", "Database access", "CCTV control"];
    if (!defaultNames.includes(nodeName)) {
        return getDefaultIcon(owner)
    } else {
        if (nodeName === "Trading interface") {
            return getTradingIcon(owner)
        } else if (nodeName === "Server farm") {
            return getCpuIcon(owner)
        } else if (nodeName === "Database access") {
            return getDatabaseIcon(owner)
        } else {
            return getCctvIcon(owner)
        }
    }
}

function getDefaultIcon(owner: string) {
    switch (owner) {
        case "player":
            return RadioTowerPlayer
        case "enemy":
            return RadioTowerEnemy
        default:
            return RadioTowerNeutral
    }
}

function getTradingIcon(owner: string) {
    switch (owner) {
        case "player":
            return TradingPlayer
        case "enemy":
            return TradingEnemy
        default:
            return TradingNeutral
    }
}

function getCpuIcon(owner: string) {
    switch (owner) {
        case "player":
            return CpuPlayer
        case "enemy":
            return CpuEnemy
        default:
            return CpuNeutral
    }
}

function getDatabaseIcon(owner: string) {
    switch (owner) {
        case "player":
            return DatabasePlayer
        case "enemy":
            return DatabaseEnemy
        default:
            return DatabaseNeutral
    }
}

function getCctvIcon(owner: string) {
    switch (owner) {
        case "player":
            return CctvPlayer
        case "enemy":
            return CctvEnemy
        default:
            return CctvNeutral
    }
}

export const playerIcon = (userName: string, playerName: string) => {
    if (userName === playerName) {
        return new Icon({iconUrl: PlayerAvatar, iconSize: [32, 32], className: "player"})
    } else {
        return new Icon({iconUrl: CharacterEnemy, iconSize: [32, 32], className: "player__enemy"})
    }
}
