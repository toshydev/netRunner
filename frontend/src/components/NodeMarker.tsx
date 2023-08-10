import {Marker, MarkerProps} from "react-leaflet";
import {Node, Player} from "../models.ts";
import {nodeIcon} from "./icons/mapIcons.ts";
import {getDistanceBetweenCoordinates} from "../utils/calculation.ts";
import useCooldown from "../hooks/useCooldown.ts";
import {useEffect, useState} from "react";
import NodePopup from "./NodePopup.tsx";
import {useClickSound} from "../utils/sound.ts";


type Props = {
    node: Node
    player: Player
}

export default function NodeMarker({node, player}: Props) {
    const [isInRange, setIsInRange] = useState<boolean>(false)
    const [isPlayerOwned, setIsPlayerOwned] = useState<boolean>(false);
    const [isClaimable, setIsClaimable] = useState<boolean>(false);
    const {isOnCooldown: isUpdating} = useCooldown(node.lastUpdate);
    const {isOnCooldown: isAttacked} = useCooldown(node.lastAttack);

    const playClick = useClickSound()

    const distance = getDistanceBetweenCoordinates({
        latitude: player.coordinates.latitude,
        longitude: player.coordinates.longitude
    }, {
        latitude: node.coordinates.latitude,
        longitude: node.coordinates.longitude
    })

    useEffect(() => {
        if (distance <= 50) {
            setIsInRange(true)
        } else {
            setIsInRange(false)
        }
        if (player !== null) {
            setIsClaimable(node.health === 0 || node.ownerId === null)
            setIsPlayerOwned(node.ownerId === player.id)
        }
    }, [distance, node.health, node.ownerId, player])

    let status;
    if (isUpdating) {
        status = "update"
    } else if (isAttacked) {
        status = "attack"
    } else {
        status = "idle"
    }

    const icon = nodeIcon(isPlayerOwned, isClaimable, isInRange, status)

    const markerProps: MarkerProps = {
        position: [node.coordinates.latitude, node.coordinates.longitude],
        icon: icon,
        eventHandlers: {
            click: () => {
                playClick()
            }
        }
    }

    if (player && node) {
        return <Marker {...markerProps}>
            <NodePopup node={node} player={player} distance={distance} isUpdating={isUpdating} isAttacked={isAttacked}/>
        </Marker>
    }
}
