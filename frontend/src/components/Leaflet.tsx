import {MapContainer, Marker, Popup, TileLayer, useMapEvent} from "react-leaflet";
import {useStore} from "../hooks/useStore.ts";
import "./css/leaflet.css";
import {nodeIcon, playerIcon} from "./icons/mapIcons.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from "use-sound";
import ZoomIn from "../assets/sounds/zoom_in.mp3";
import ZoomOut from "../assets/sounds/zoom_out.mp3";
import {useState} from "react";

export default function Leaflet() {
    const [zoom, setZoom] = useState<number>(15)
    const nodes = useStore(state => state.nodes)
    const player = useStore(state => state.player)
    const user = useStore(state => state.user)
    const enemies = useStore(state => state.enemies)
    const volume = useStore(state => state.volume)
    const [playZoomIn] = useSound(ZoomIn, {volume})
    const [playZoomOut] = useSound(ZoomOut, {volume})

    function ZoomSound() {
        const map = useMapEvent("zoom", () => {
            setZoom(map.getZoom())
            if (map.getZoom() > zoom) {
                playZoomIn()
            }
            if (map.getZoom() < zoom) {
                playZoomOut()
            }
        })
        return null
    }


    if (player) {
        return (
            <MapContainer
                center={[player.coordinates.latitude, player.coordinates.longitude]}
                zoom={15}
                scrollWheelZoom={true}
                style={{minHeight: "75vh", minWidth: "95vw"}}
                id={"map"}
            >
                <ZoomSound/>
                <TileLayer
                    attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                    url={"api/map/{z}/{x}/{y}"}
                />
                {nodes.map(node => <Marker
                    key={node.id}
                    icon={nodeIcon(player.id, node.ownerId)}
                    position={[node.coordinates.latitude, node.coordinates.longitude]}>
                    <Popup>
                        A pretty CSS3 popup. <br/> Easily customizable.
                    </Popup>
                </Marker>)}
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
