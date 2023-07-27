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

type Coordinates = {
    latitude: number,
    longitude: number,
    timestamp: number
}
