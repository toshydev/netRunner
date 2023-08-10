import {useEffect, useState} from 'react';
import axios from 'axios';
import {Node} from "../models.ts";

export default function useNodes(ownerId: string) {
    const [nodes, setNodes] = useState<Node[]>();

    useEffect(() => {
        if (!ownerId) {
            return
        }
        axios
            .get(ownerId && `/api/nodes/${ownerId}`)
            .then((response) => response.data)
            .then((data: Node[]) => {
                setNodes(data);
            })
            .catch(console.error);
    }, [ownerId]);

    return nodes;
}
