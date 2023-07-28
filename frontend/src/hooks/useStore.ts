import {create} from "zustand";
import axios from "axios";
import {ActionType, Node, NodeData} from "../models.ts";

type State = {
    nodes: Node[],
    isLoading: boolean,
    getNodes: () => void,
    addNode: (nodeData: NodeData) => void
    editNode: (nodeId: string, action: ActionType) => void
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
        set({isLoading: true})
        axios
            .post("/api/nodes", nodeData)
            .then(response => response.data)
            .then(data => {
                set({nodes: [...useStore.getState().nodes, data]});
            })
            .catch(console.error)
            .then(() => set({isLoading: false}));
    },

    editNode: (nodeId: string, action: ActionType) => {
        set({isLoading: true})
        axios.put(`/api/nodes/${nodeId}`, action)
            .then(response => response.data)
            .then(data => {
                const nodes = useStore.getState().nodes;
                const index = nodes.findIndex(node => node.id === nodeId);
                nodes[index] = data;
                set({nodes: nodes});
            })
            .catch(console.error)
            .then(() => set({isLoading: false}));
    }
}));