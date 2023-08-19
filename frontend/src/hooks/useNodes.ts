import {useEffect, useState} from 'react';
import axios from 'axios';
import {Node, Player} from "../models.ts";

export default function useNodes(ownerId: string, currentPlayer: Player | null) {
    const [nodes, setNodes] = useState<Node[]>();

    useEffect(() => {
        if (!ownerId || !currentPlayer) {
            return
        }
        axios
            .get(ownerId && `/api/nodes/${ownerId}`)
            .then((response) => response.data)
            .then((data: Node[]) => {
                setNodes(data);
            })
            .catch(console.error);
    }, [ownerId, currentPlayer]);

    return nodes;
}
