// getOppositeDirection
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function getOppositeDirection(direction) {
    try {
        let oppositeDirection = "";
        switch (direction) {
            case "north":
                oppositeDirection = "south";
                break;
            case "east":
                oppositeDirection = "west";
                break;
            case "south":
                oppositeDirection = "north";
                break;
            case "west":
                oppositeDirection = "east";
                break;
            case "up":
                oppositeDirection = "down";
                break;
            case "down":
                oppositeDirection = "up";
                break;
            default:
                break;
        }
        return oppositeDirection;
    }
    catch (error) {
        catchErrorHandlerForFunction(`getOppositeDirection`, error);
    }
}
export default getOppositeDirection;
