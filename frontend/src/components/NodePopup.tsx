import {Node, Player} from "../models.ts";
import {Popup} from "react-leaflet";
import NodePopupItem from "./NodePopupItem.tsx";

type Props = {
    node: Node
    player: Player
    distance: number
    isUpdating: boolean
    isAttacked: boolean
}

export default function NodePopup({node, player, distance, isUpdating, isAttacked}: Props) {
    return <Popup><NodePopupItem node={node} player={player} distance={distance} isUpdating={isUpdating} isAttacked={isAttacked}/></Popup>
}