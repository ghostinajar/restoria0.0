// DIRECTIONS
// constants file for directions
export const directions = ["north", "east", "south", "west", "up", "down"];
export const directionsAbbrev = ["n", "e", "s", "w", "u", "d"];
export const oppositeDirections = {
    north: "south",
    south: "north",
    east: "west",
    west: "east",
    up: "down",
    down: "up",
};
export const directionCorrectionString = `Invalid direction. Try: ${directions.join(", ")}, ${directionsAbbrev.join(", ")}).`;
export function expandAbbreviatedDirection(direction) {
    const expandedDirection = directions.find((dir) => dir.startsWith(direction));
    return expandedDirection ? expandedDirection : null;
}
export function isValidDirection(direction) {
    return directions.includes(direction);
}
