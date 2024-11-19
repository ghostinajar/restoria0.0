//getMapCoordsInDirection
//return map coords for a potential room in a given direction
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function getMapCoordsInDirection(direction, fromCoords) {
    try {
        let mapCoords = [-1, -1, -1];
        switch (direction) {
            case "north": {
                mapCoords = [fromCoords[0], fromCoords[1] - 1, fromCoords[2]];
                break;
            }
            case "east": {
                mapCoords = [fromCoords[0] + 1, fromCoords[1], fromCoords[2]];
                break;
            }
            case "south": {
                mapCoords = [fromCoords[0], fromCoords[1] + 1, fromCoords[2]];
                break;
            }
            case "west": {
                mapCoords = [fromCoords[0] - 1, fromCoords[1], fromCoords[2]];
                break;
            }
            case "up": {
                mapCoords = [fromCoords[0], fromCoords[1], fromCoords[2] + 1];
                break;
            }
            case "down": {
                mapCoords = [fromCoords[0], fromCoords[1], fromCoords[2] - 1];
                break;
            }
            default:
                break;
        }
        let negCoords = [-1, -1, -1];
        if (mapCoords == negCoords) {
            mapCoords = fromCoords;
        }
        return mapCoords;
    }
    catch (error) {
        catchErrorHandlerForFunction(`getMapCoordsInDirection`, error);
        return fromCoords;
    }
}
export default getMapCoordsInDirection;
