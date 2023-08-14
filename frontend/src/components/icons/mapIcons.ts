import {Icon} from "leaflet";
import CharacterEnemy from "../../assets/svg/character_enemy.svg";
import PlayerAvatar from "../../assets/images/avatar.png";

export const nodeIcon = (nodeName: string, owner: string, status: string, inRange: boolean) => {
    const className = buildClass(owner, status, inRange)
    const iconUrl = buildPath(nodeName, owner)
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

function buildPath(nodeName: string, owner: string) {
    const defaultNames = ["Trading interface", "Server farm", "Database access"];
    const basePath = "../../src/assets/svg/";
    let iconPath = `${defaultNames.includes(nodeName) ? nodeName.replace(" ", "_").toLowerCase() : "radio_tower"}_`;
    switch (owner) {
        case "player":
            iconPath += "player.svg"
            break;
        case "enemy":
            iconPath += "enemy.svg"
            break;
        default:
            iconPath += "neutral.svg"
            break;
    }
    return basePath + iconPath
}

export const playerIcon = (userName: string, playerName: string) => {
    if (userName === playerName) {
        return new Icon({iconUrl: PlayerAvatar, iconSize: [32, 32], className: "player"})
    } else {
        return new Icon({iconUrl: CharacterEnemy, iconSize: [32, 32], className: "player__enemy"})
    }
}
