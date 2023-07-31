import {create} from "zustand";
import axios from "axios";
import {ActionType, Node, NodeData, User} from "../models.ts";

type State = {
    user: User | null,
    nodes: Node[],
    isLoading: boolean,
    getUser: () => void,
    getNodes: () => void,
    addNode: (nodeData: NodeData) => void
    editNode: (nodeId: string, action: ActionType) => void
    deleteNode: (nodeId: string) => void
    getOwner: (ownerId: string) => Promise<string>
    logout: () => void
}

export const useStore = create<State>(set => ({
    user: null,
    nodes: [],
    isLoading: true,

    getUser: () => {
        set({isLoading: true})
        axios
            .get("/api/user")
            .then(response => response.data)
            .then(data => {
                set({user: data});
            })
            .catch(console.error)
            .then(() => set({isLoading: false}));
    },

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
    },

    deleteNode: (nodeId: string) => {
        set({ isLoading: true });
        axios
            .delete(`/api/nodes/${nodeId}`)
            .catch(console.error)
            .then(() => {
                set((state) => ({
                    nodes: state.nodes.filter((node) => node.id !== nodeId),
                }));
            })
            .then(() => set({ isLoading: false }));
    },

    getOwner: async (ownerId: string): Promise<string> => {
        set({isLoading: true})
        return await axios
            .get(`/api/user/${ownerId}`)
            .then(response => response.data)
            .then(data => {
                return data.username;
            })
    },

    logout: () => {
        set({isLoading: true})
        axios
            .post("/api/user/logout")
            .then(() => {
                set({user: null});
            })
            .catch(console.error)
            .then(() => set({isLoading: false}));

    }
}));
