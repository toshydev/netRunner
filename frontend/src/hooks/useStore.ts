import {create} from "zustand";
import axios from "axios";
import {Node, NodeData} from "../models.ts";

type State = {
    nodes: Node[],
    isLoading: boolean,
    getNodes: () => void,
    addNode: (nodeData: NodeData) => void
}

export const useStore = create<State>(set => ({
    nodes: [],
    isLoading: true,
    getNodes: () => {
        set({isLoading: true})
        axios
            .get("/api/nodes")
            .then(response => response.data)
            .then(data => {
                set({nodes: data});
            })
            .catch(console.error)
            .then(() => set({isLoading: false}));
    },

    addNode: (nodeData: NodeData) => {
        axios.post("/api/nodes", nodeData)
            .then(response => response.data)
            .then(data => console.log(data))
            .catch(console.error)
    }
}));