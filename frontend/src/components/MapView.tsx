import {
    LayerGroup,
    LayersControl,
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents
} from "react-leaflet";
import {useStore} from "../hooks/useStore.ts";
import "./css/leaflet.css";
import {playerIcon} from "./icons/mapIcons.ts";
import {useZoomInSound, useZoomOutSound} from "../utils/sound.ts";
import {useEffect, useState} from "react";
import {getDistanceBetweenCoordinates} from "../utils/calculation.ts";
import NodeItem from "./NodeItem.tsx";
import {Node, Player} from "../models.ts";
import PlayerPopup from "./PlayerPopup.tsx";
import L from "leaflet";

type Props = {
    player: Player,
}

export default function MapView({player}: Props) {
    const [zoom, setZoom] = useState<number>(15)
    const [markers, setMarkers] = useState<Node[]>([])

    const user = useStore(state => state.user)
    const enemies = useStore(state => state.enemies)
    const gps = useStore(state => state.gps)
    const nodes = useStore(state => state.nodes)
    const isScanning = useStore(state => state.isScanning)
    const initialNodeFilter = useStore(state => state.initialNodeFilter)

    const range = 0.05;

    const playZoomIn = useZoomInSound()
    const playZoomOut = useZoomOutSound()

    // reload markers when scanning is done
    useEffect(() => {
        if (player && nodes) {
            const initialFilteredNodes = initialNodeFilter({
                latitude: player.coordinates.latitude,
                longitude: player.coordinates.longitude
            }, nodes);
            setMarkers(initialFilteredNodes)
        }
    }, [initialNodeFilter, nodes, player]);

    function getBounds(player: Player) {
        return L.latLngBounds(L.latLng(player.coordinates.latitude - range, player.coordinates.longitude - range),
            L.latLng(player.coordinates.latitude + range, player.coordinates.longitude + range))
    }

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
            map.setView([player.coordinates.latitude, player.coordinates.longitude], map.getZoom(), {
                animate: true
            })
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
                minZoom={10}
                maxZoom={18}
                maxBounds={getBounds(player)}
            >
                {gps ? <PlayerTracker/> : <ZoomSound/>}
                <TileLayer
                    attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                    url={"api/map/{z}/{x}/{y}"}
                />
                <LayersControl position={"topright"}>
                    <LayersControl.Overlay checked name={"Access points"}>
                        <LayerGroup>
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
                        </LayerGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name={"Netwalkers"}>
                        <LayerGroup>
                            <Marker
                                icon={playerIcon(user, player.name)}
                                position={[player.coordinates.latitude, player.coordinates.longitude]}/>
                            {enemies.map(enemy => <Marker
                                key={enemy.id}
                                icon={playerIcon(user, enemy.name)}
                                position={[enemy.coordinates.latitude, enemy.coordinates.longitude]}>
                                <PlayerPopup player={enemy}/>
                            </Marker>)}
                        </LayerGroup>
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
        );
    }
}
