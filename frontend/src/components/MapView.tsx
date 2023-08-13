import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {useStore} from "../hooks/useStore.ts";
import "./css/leaflet.css";
import {playerIcon} from "./icons/mapIcons.ts";
import {useZoomInSound, useZoomOutSound} from "../utils/sound.ts";
import {useEffect, useState} from "react";
import {getDistanceBetweenCoordinates} from "../utils/calculation.ts";
import NodeItem from "./NodeItem.tsx";
import {Node} from "../models.ts";

export default function MapView() {
    const [zoom, setZoom] = useState<number>(15)
    const [markers, setMarkers] = useState<Node[]>([])
    const player = useStore(state => state.player)
    const user = useStore(state => state.user)
    const enemies = useStore(state => state.enemies)
    const gps = useStore(state => state.gps)
    const nodes = useStore(state => state.nodes)
    const isScanning = useStore(state => state.isScanning)

    const playZoomIn = useZoomInSound()
    const playZoomOut = useZoomOutSound()

    // reload markers when scanning is done
    useEffect(() => {
        setMarkers(nodes)
    }, [nodes]);

    function ZoomSound() {
        const map = useMapEvents({
            zoom: () => {
                setZoom(map.getZoom())
                if (!gps) {
                    if (map.getZoom() > zoom) {
                        playZoomIn()
                    }
                    if (map.getZoom() < zoom) {
                        playZoomOut()
                    }
                }
            }
        })
        return null
    }

    function PlayerTracker() {
        const map = useMap();
        if (player && gps) {
            map.flyTo([player.coordinates.latitude, player.coordinates.longitude])
        }
        return null
    }

    if (player && nodes) {
        return (
            <MapContainer
                center={[player.coordinates.latitude, player.coordinates.longitude]}
                zoom={15}
                scrollWheelZoom={true}
                style={{minHeight: "75vh", minWidth: "95vw"}}
                id={"map"}
                maxZoom={20}
            >
                {gps ? <PlayerTracker/> : <ZoomSound/>}
                <TileLayer
                    attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                    url={"api/map/{z}/{x}/{y}"}
                />
                {!isScanning && markers.map(node => <NodeItem
                    key={node.id}
                    type={"map"}
                    node={node}
                    player={player}
                    distance={getDistanceBetweenCoordinates({
                        latitude: player.coordinates.latitude,
                        longitude: player.coordinates.longitude
                    }, {
                        latitude: node.coordinates.latitude,
                        longitude: node.coordinates.longitude
                    })}
                />)}
                <Marker
                    icon={playerIcon(user, player.name)}
                    position={[player.coordinates.latitude, player.coordinates.longitude]}/>
                {enemies.map(enemy => <Marker
                    key={enemy.id}
                    icon={playerIcon(user, enemy.name)}
                    position={[enemy.coordinates.latitude, enemy.coordinates.longitude]}/>)}
            </MapContainer>
        );
    }
}