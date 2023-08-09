import {Icon} from "leaflet";
import RadioTowerPlayer from "../../assets/svg/radio-tower-player.svg";
import RadioTowerEnemy from "../../assets/svg/radio-tower-enemy.svg";
import Padlock from "../../assets/svg/padlock.svg";
import CharacterPlayer from "../../assets/svg/character_player.svg";
import CharacterEnemy from "../../assets/svg/character_enemy.svg";

export const nodeIcon = (playerId: string, nodeOwnerId: string) => {
    if (playerId === nodeOwnerId) {
        return new Icon({iconUrl: RadioTowerPlayer, iconSize: [32, 32], className: "node__player"})
    } else if (nodeOwnerId === null) {
        return new Icon({iconUrl: Padlock, iconSize: [32, 32], className: "node__neutral"})
    } else {
        return new Icon({iconUrl: RadioTowerEnemy, iconSize: [32, 32], className: "node__enemy"})
    }
}

export const playerIcon = (userName: string, playerName: string) => {
    if (userName === playerName) {
        return new Icon({iconUrl: CharacterPlayer, iconSize: [32, 32], className: "player"})
    } else {
        return new Icon({iconUrl: CharacterEnemy, iconSize: [32, 32], className: "player"})
    }
}
