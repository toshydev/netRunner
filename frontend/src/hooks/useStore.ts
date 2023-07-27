import {create} from "zustand";
import axios from "axios";
import {Node} from "../models.ts";

type State = {
    nodes: Node[],
    isLoading: boolean,
    getNodes: () => void
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
}))
