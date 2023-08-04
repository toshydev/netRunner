import NodeItem from "./NodeItem.tsx";
import {useStore} from "../hooks/useStore.ts";
import styled from "@emotion/styled";
import AddButton from "./AddButton.tsx";
import {useEffect} from "react";
import {Player} from "../models.ts";
import {getDistanceBetweenCoordinates} from "../utils/calculation.ts";

type Props = {
    player: Player | null;
}

export default function NodeList({player}: Props) {
    const nodes = useStore(state => state.nodes);
    const getNodes = useStore(state => state.getNodes);
    const user = useStore(state => state.user);

    useEffect(() => {
        if (user !== "" && user !== "anonymousUser") {
            getNodes()
        }
    }, [getNodes, user]);

    if (player) {
        return <StyledList>
            {nodes.map(node => <NodeItem
                key={node.id}
                node={node}
                player={player}
                distance={getDistanceBetweenCoordinates({latitude: player.coordinates.latitude, longitude: player.coordinates.longitude}, {latitude: node.coordinates.latitude, longitude: node.coordinates.longitude})}
            />)}
            <AddButton/>
        </StyledList>
    } else {
        return <>loading ...</>
    }
}

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 8rem;

  li:first-of-type {
    margin-top: 1rem;
  }
`;
