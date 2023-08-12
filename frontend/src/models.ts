export type Player = {
    id: string,
    userId: string,
    name: string,
    coordinates: Coordinates,
    level: number,
    experience: number,
    experienceToNextLevel: number,
    health: number,
    maxHealth: number,
    attack: number,
    maxAttack: number,
    credits: number,
    lastScan: number
}

export type Node = {
    id: string,
    ownerId: string,
    name: string,
    level: number,
    health: number,
    lastUpdate: number,
    lastAttack: number,
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
