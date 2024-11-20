import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function getRoomInZoneByCoords(coords, zone) {
    try {
        // Find the first room whose mapCoords matches the given coords
        return zone.rooms.find(room => room.mapCoords.every((value, index) => value === coords[index]));
    }
    catch (error) {
        catchErrorHandlerForFunction(`getRoomByCoords`, error);
        return undefined;
    }
}
export default getRoomInZoneByCoords;
