export type User = {
    id: string,
    username: string,
}

export type Node = {
    id: string,
    ownerId: string,
    name: string,
    level: number,
    health: number,
    lastUpdated: string,
    lastAttacked: string,
    coordinates: Coordinates,
}

export type NodeData = {
    name: string,
    coordinates: Coordinates
}

export type Coordinates = {
    latitude: number,
    longitude: number,
    timestamp: number
}

export enum ActionType {
    HACK = "HACK",
    ABANDON = "ABANDON",
}
