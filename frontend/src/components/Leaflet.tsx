import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import {useStore} from "../hooks/useStore.ts";
import "./css/leaflet.css";
import {playerIcon} from "./icons/mapIcons.ts";
import {useZoomInSound, useZoomOutSound} from "../utils/sound.ts";
import {useState} from "react";
import NodeMarker from "./NodeMarker.tsx";

type MapProps = {
    tracking: boolean
}

export default function Leaflet() {
    const [zoom, setZoom] = useState<number>(15)
    const nodes = useStore(state => state.nodes)
    const player = useStore(state => state.player)
    const user = useStore(state => state.user)
    const enemies = useStore(state => state.enemies)
    const gps = useStore(state => state.gps)

    const playZoomIn = useZoomInSound()
    const playZoomOut = useZoomOutSound()

    function MapFunctions({tracking}: MapProps) {
        const map = useMapEvents({
            zoom: () => {
                setZoom(map.getZoom())
                if (!tracking) {
                    if (map.getZoom() > zoom) {
                        playZoomIn()
                    }
                    if (map.getZoom() < zoom) {
                        playZoomOut()
                    }
                }
                return null
            },
        })
        if (player && tracking) {
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
                maxZoom={18}
            >
                <MapFunctions tracking={gps}/>
                <TileLayer
                    attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                    url={"api/map/{z}/{x}/{y}"}
                />
                {nodes.map(node => <NodeMarker
                    key={node.id}
                    node={node}
                    player={player}
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
