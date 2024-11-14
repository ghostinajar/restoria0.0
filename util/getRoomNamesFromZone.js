import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function getRoomNamesFromZone(zone) {
    try {
        const roomNames = zone.rooms.map((room) => {
            return { _id: room._id, name: room.name };
        });
        return roomNames;
    }
    catch (error) {
        catchErrorHandlerForFunction("getRoomNamesFromZone", error);
    }
}
export default getRoomNamesFromZone;
