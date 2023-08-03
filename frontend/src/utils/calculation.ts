import {getDistance} from "geolib";

export function getSecondsSinceTimestamp(timestamp: number): number {
    return Math.floor((Date.now() / 1000 - timestamp));
}

export function getDistanceBetweenCoordinates(
    start: { latitude: number, longitude: number },
    end: { latitude: number, longitude: number }
): number {
    return getDistance(start, end);
}