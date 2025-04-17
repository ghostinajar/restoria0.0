// DIRECTIONS
// constants file for directions
import messageToUsername from "../util/messageToUsername.js";
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
export const directionCorrectionString = `What direction? Try: ${directions.join(", ")}, ${directionsAbbrev.join(", ")}).`;
export function expandAbbreviatedDirection(direction) {
    const expandedDirection = directions.find((dir) => dir.startsWith(direction));
    return expandedDirection ? expandedDirection : null;
}
// handles an invalid, missing, and abbreviated direction
export function processDirection(direction, user) {
    // handle invalid or missing direction
    if (!direction || !directions.some((dir) => dir.startsWith(direction))) {
        messageToUsername(user.username, directionCorrectionString, `rejection`, true);
        return null;
    }
    // expand direction abbreviation
    const expandedDirection = expandAbbreviatedDirection(direction);
    return expandedDirection;
}
