import NodeItem from "./NodeItem.tsx";
import {useStore} from "../hooks/useStore.ts";
import styled from "@emotion/styled";
import {useEffect, useState} from "react";
import {Node, Player} from "../models.ts";
import {getDistanceBetweenCoordinates} from "../utils/calculation.ts";

type Props = {
    player: Player | null;
    nodes: Node[];
}

export default function NodeList({ player, nodes }: Props) {
    const [sortedNodes, setSortedNodes] = useState<Node[]>([]);
    const getNodes = useStore(state => state.getNodes);
    const user = useStore(state => state.user);
    const sortDirection = useStore(state => state.sortDirection);
    const sortNodesByDistance = useStore(state => state.sortNodesByDistance);
    const ownerNodesFilter = useStore(state => state.ownerNodesFilter);
    const filterNodesByOwner = useStore(state => state.filterNodesByOwner);
    const rangeFilter = useStore(state => state.rangeFilter);
    const filterNodesByRange = useStore(state => state.filterNodesByRange);

    useEffect(() => {
        if (user !== "" && user !== "anonymousUser") {
            if (nodes && player) {
                const filteredNodesbyOwner = filterNodesByOwner(player.id, nodes);
                const filteredNodesByRange = filterNodesByRange({latitude: player.coordinates.latitude, longitude: player.coordinates.longitude}, filteredNodesbyOwner, 250);
                setSortedNodes(sortNodesByDistance({latitude: player.coordinates.latitude, longitude: player.coordinates.longitude}, filteredNodesByRange));
            }
        }
    }, [getNodes, nodes, player, user, sortDirection, ownerNodesFilter, rangeFilter, filterNodesByOwner, filterNodesByRange, sortNodesByDistance]);

    if (player) {
        return (
            <StyledList>
                {sortedNodes.map(node => (
                    <NodeItem
                        key={node.id}
                        type={"list"}
                        node={node}
                        player={player}
                        distance={getDistanceBetweenCoordinates({
                            latitude: player.coordinates.latitude,
                            longitude: player.coordinates.longitude
                        }, {
                            latitude: node.coordinates.latitude,
                            longitude: node.coordinates.longitude
                        })}
                    />
                ))}
            </StyledList>
        );
    }
}

const StyledList = styled.ul`
  list-style: none;
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 8rem;
`;
