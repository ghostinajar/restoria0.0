// matchExitFrom
// match an exit (key item and default settings) from a room to its neighboring room
import { oppositeDirections } from "../constants/DIRECTIONS.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function matchExitFrom(originRoom, destinationRoom, directionFromOrigin) {
    try {
        // Check if the rooms are valid
        if (!originRoom || !destinationRoom) {
            throw new Error("Invalid room(s) provided.");
        }
        // Isolate the relevant exits between the two rooms
        const originExit = originRoom.exits[directionFromOrigin];
        const destinationExit = destinationRoom.exits[oppositeDirections[directionFromOrigin]];
        if (originExit && destinationExit) {
            destinationExit.hiddenByDefault = originExit.hiddenByDefault;
            destinationExit.closedByDefault = originExit.closedByDefault;
            destinationExit.keyItemBlueprint = originExit.keyItemBlueprint;
            destinationExit.keyItemZone = originExit.keyItemZone;
        }
        else {
            throw new Error("Exit not found in one of the rooms.");
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`mirrorExitFrom`, error);
    }
}
export default matchExitFrom;
