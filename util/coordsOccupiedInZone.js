import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function coordsOccupiedInZone(zone, coords) {
    try {
        return zone.rooms.some(room => 
        // does every value of room.mapCoords match, in the same order?
        room.mapCoords.every((value, index) => value === coords[index]));
    }
    catch (error) {
        catchErrorHandlerForFunction(`coordsOccupiedInZone`, error);
        return false;
    }
}
export default coordsOccupiedInZone;
