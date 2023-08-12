import {create} from "zustand";
import axios from "axios";
import {ActionType, Coordinates, Node, NodeData, Player} from "../models.ts";
import {NavigateFunction} from "react-router-dom";
import {toast} from "react-toastify";
import {getDistanceBetweenCoordinates} from "../utils/calculation.ts";

type State = {
    toggleSortDirection: () => void;
    sortNodesByDistance: (position: { latitude: number, longitude: number }, nodes: Node[]) => Node[],
    sortDirection: "asc" | "desc",
    user: string,
    player: Player | null,
    nodes: Node[],
    isLoading: boolean,
    isScanning: boolean,
    getPlayer: () => void,
    getUser: () => void,
    getNodes: () => void,
    addNode: (nodeData: NodeData, onSuccess: () => void, onError: () => void) => void
    editNode: (nodeId: string, action: ActionType) => void
    deleteNode: (nodeId: string, onSuccess: () => void, onError: () => void) => void
    login: (username: string, password: string, navigate: NavigateFunction, onSuccess: () => void, onError: () => void) => void
    register: (username: string, email: string, password: string) => void
    logout: (navigate: NavigateFunction, onSuccess: () => void, onError: () => void) => void
    updateLocation: (coordinates: Coordinates) => void
    gps: boolean
    setGps: (gps: boolean) => void
    ownerNodesFilter: boolean
    toggleOwnerNodesFilter: () => void
    filterNodesByOwner: (ownerId: string, nodes: Node[]) => Node[]
    rangeFilter: boolean
    toggleRangeFilter: () => void
    filterNodesByRange: (position: { latitude: number, longitude: number }, nodes: Node[]) => Node[]
    volume: number
    setVolume: (volume: number) => void
    enemies: Player[]
    getEnemies: () => void
    scanNodes: (position: Coordinates, onSuccess: () => void, onError: () => void) => void
}

export const useStore = create<State>(set => ({
    user: "",
    player: null,
    nodes: [],
    enemies: [],
    isLoading: true,
    isScanning: false,
    gps: false,
    sortDirection: "asc",
    ownerNodesFilter: false,
    rangeFilter: false,
    volume: 0.5,

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

    addNode: (nodeData: NodeData, onSuccess: () => void, onError: () => void) => {
        set({isLoading: true})
        axios
            .post("/api/nodes", nodeData)
            .then(response => response.data)
            .then(data => {
                onSuccess()
                set((state) => ({nodes: [...state.nodes, data]}));
            })
            .catch(error => {
                onError()
                console.error(error)
            })
            .then(() => set({isLoading: false}));
    },

    editNode: (nodeId: string, action: ActionType) => {
        set({isLoading: true});
        axios
            .put(`/api/nodes/${nodeId}`, action, {headers: {"Content-Type": "text/plain"}})
            .then((response) => response.data)
            .then((data) => {
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

    deleteNode: (nodeId: string, onSuccess: () => void, onError: () => void) => {
        set({isLoading: true});
        axios
            .delete(`/api/nodes/${nodeId}`)
            .catch(error => {
                onError()
                console.error(error)
            })
            .then(() => {
                onSuccess()
                set((state) => ({
                    nodes: state.nodes.filter((node) => node.id !== nodeId),
                }));
            })
            .then(() => set({isLoading: false}));
    },

    login: (username: string, password: string, navigate: NavigateFunction, onSuccess: () => void, onError: () => void) => {
        set({isLoading: true});
        axios
            .post("/api/user/login", null, {auth: {username, password}})
            .then((response) => {
                set({user: response.data});
                navigate("/");
                toast.success(`Welcome ${username}`, {autoClose: 2000});
                onSuccess();
            })
            .catch((error) => {
                console.error("Error during login:", error);
                toast.error("Invalid username or password", {autoClose: 2000});
                onError();
            })
            .then(() => {
                set({isLoading: false});
            });
    },

    register: (username: string, email: string, password: string) => {
        set({isLoading: true});
        axios
            .post("/api/user/register", {username, email, password})
            .catch(console.error)
            .then(() => set({isLoading: false}));
    },

    logout: (navigate: NavigateFunction, onSuccess: () => void, onError: () => void) => {
        set({isLoading: true});
        axios
            .post("/api/user/logout")
            .then(() => {
                set({user: "anonymousUser"});
                set({player: null});
                set({isLoading: false})
                navigate("/login");
                toast.success("Logged out", {autoClose: 2000});
                onSuccess();
            })
            .catch((error) => {
                console.error(error);
                set({isLoading: false})
                onError()
            })
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
    },

    toggleSortDirection: () => {
        const direction = useStore.getState().sortDirection;
        if (direction === "asc") {
            set({sortDirection: "desc"});
        } else {
            set({sortDirection: "asc"});
        }
    },

    sortNodesByDistance: (position: { latitude: number, longitude: number }, nodes: Node[]) => {
        const direction = useStore.getState().sortDirection;
        if (direction === "asc") {
            return nodes.sort((a, b) => {
                const distanceA = getDistanceBetweenCoordinates(position, {
                    latitude: a.coordinates.latitude,
                    longitude: a.coordinates.longitude
                });
                const distanceB = getDistanceBetweenCoordinates(position, {
                    latitude: b.coordinates.latitude,
                    longitude: b.coordinates.longitude
                });
                if (direction === "asc") {
                    return distanceA - distanceB;
                } else {
                    return distanceB - distanceA;
                }
            })
        } else {
            return nodes.slice();
        }
    },

    toggleOwnerNodesFilter: () => {
        set((state) => ({ownerNodesFilter: !state.ownerNodesFilter}));
    },

    filterNodesByOwner: (ownerId: string, nodes: Node[]) => {
        const filter = useStore.getState().ownerNodesFilter;
        if (filter) {
            return nodes.filter((node) => node.ownerId === ownerId);
        } else {
            return nodes.slice();
        }
    },

    toggleRangeFilter: () => {
        set((state) => ({rangeFilter: !state.rangeFilter}));
    },

    filterNodesByRange: (position: { latitude: number, longitude: number }, nodes: Node[]) => {
        const filter = useStore.getState().rangeFilter;
        if (filter) {
            return nodes.filter((node) => {
                const distance = getDistanceBetweenCoordinates(position, {
                    latitude: node.coordinates.latitude,
                    longitude: node.coordinates.longitude
                });
                return distance <= 50;
            });
        } else {
            return nodes.slice();
        }
    },

    setVolume: (newVolume: number) => {
        set({volume: newVolume});
    },

    getEnemies: () => {
        set({isLoading: true});
        axios
            .get("/api/player/enemies")
            .then((response) => response.data)
            .then(data => {
                set({enemies: data});
            })
            .catch(console.error)
            .then(() => set({isLoading: false}));
    },

    scanNodes: (position: Coordinates, onSuccess: () => void, onError: () => void) => {
        set({isScanning: true});
        axios
            .post("/api/nodes/scan", position)
            .then(response => response.data)
            .then(response => response.data)
            .then(data => {
                onSuccess()
                if (data !== undefined) {
                    set((state) => ({nodes: [...state.nodes, data]}));
                }
            })
            .catch(error => {
                onError()
                console.error(error)
            })
            .then(() => {
                useStore.getState().getNodes()
                set({isScanning: false})
            });
    }

}));
