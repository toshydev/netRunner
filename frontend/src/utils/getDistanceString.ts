export default function getDistanceString(distance: number) {
    if (distance < 1000) {
        return `${distance}m`
    } else {
        return `${(distance / 1000).toFixed(1)}km`
    }
}