import {create} from "zustand";
import axios from "axios";
import {ActionType, Coordinates, Node, NodeData, Player} from "../models.ts";
import {NavigateFunction} from "react-router-dom";

type State = {
    user: string,
    player: Player | null,
    nodes: Node[],
    isLoading: boolean,
    getPlayer: () => void,
    getUser: () => void,
    getNodes: () => void,
    addNode: (nodeData: NodeData) => void
    editNode: (nodeId: string, action: ActionType) => void
    deleteNode: (nodeId: string) => void
    login: (username: string, password: string, navigate: NavigateFunction) => void
    register: (username: string, email: string, password: string) => void
    logout: () => void
    updateLocation: (coordinates: Coordinates) => void
    gps: boolean
    setGps: (gps: boolean) => void
}

export const useStore = create<State>(set => ({
    user: "",
    player: null,
    nodes: [],
    isLoading: true,
    gps: false,

    getPlayer: () => {
        set({isLoading: true})
        axios
            .get("/api/player")
            .then(response => response.data)
            .catch(() => set({player: null}))
            .then(data => {
                set({player: data});
            })
            .then(() => set({isLoading: false}));
    },

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
                set((state) => ({nodes: [...state.nodes, data]}));
            })
            .catch(console.error)
            .then(() => set({isLoading: false}));
    },

    editNode: (nodeId: string, action: ActionType) => {
        set({isLoading: true});
        axios
            .put(`/api/nodes/${nodeId}`, action, {headers: {"Content-Type": "text/plain"}})
            .then((response) => response.data)
            .then((data) => {
                // Use the set function to update the nodes state immutably
                set((state) => ({
                    nodes: state.nodes.map((node) => (node.id === nodeId ? data : node)),
                }));
            })
            .catch(console.error)
            .then(() => {
                useStore.getState().getPlayer();
                set({isLoading: false})
            });
    },

    deleteNode: (nodeId: string) => {
        set({isLoading: true});
        axios
            .delete(`/api/nodes/${nodeId}`)
            .catch(console.error)
            .then(() => {
                set((state) => ({
                    nodes: state.nodes.filter((node) => node.id !== nodeId),
                }));
            })
            .then(() => set({isLoading: false}));
    },

    login: (username: string, password: string, navigate: NavigateFunction) => {
        set({isLoading: true});
        axios
            .post("/api/user/login", null, {auth: {username, password}})
            .then(response => {
                set({user: response.data});
                navigate("/");
            })
            .catch(console.error)
            .then(() => {
                set({isLoading: false})
            });
    },

    register: (username: string, email: string, password: string) => {
        set({isLoading: true});
        axios
            .post("/api/user/register", {username, email, password})
            .catch(console.error)
            .then(() => set({isLoading: false}));
    },

    logout: () => {
        set({isLoading: true});
        axios
            .post("/api/user/logout")
            .catch((error) => {
                console.error(error);
            })
            .then(() => {
                set({isLoading: false});
            });
    },

    updateLocation: (coordinates: Coordinates) => {
        set({isLoading: true});
        axios
            .put("/api/player/location", coordinates)
            .then((response) => response.data)
            .then(data => {
                set({player: data});
            })
            .catch(console.error)
            .then(() => set({isLoading: false}));
    },

    setGps: (gps: boolean) => {
        set({gps: gps});
    }
}));
