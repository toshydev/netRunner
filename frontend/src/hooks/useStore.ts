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
                set((state) => ({ nodes: [...state.nodes, data] }));
            })
            .catch(console.error)
            .then(() => set({isLoading: false}));
    },

    editNode: (nodeId: string, action: ActionType) => {
        set({ isLoading: true });
        axios
            .put(`/api/nodes/${nodeId}`, action, { headers: { "Content-Type": "text/plain" } })
            .then((response) => response.data)
            .then((data) => {
                // Use the set function to update the nodes state immutably
                set((state) => ({
                    nodes: state.nodes.map((node) => (node.id === nodeId ? data : node)),
                }));
            })
            .catch(console.error)
            .then(() => set({ isLoading: false }));
    }
}));
