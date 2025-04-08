// getRoomByLocation
// given an ILocation, get the room object via zone manager
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function getRoomByLocation(location) {
    try {
        const requestedRoom = await new Promise((resolve) => {
            worldEmitter.once(`zoneManagerReturningRoom${location.inRoom.toString()}`, resolve);
            worldEmitter.emit(`roomRequested`, location);
        });
        return requestedRoom;
    }
    catch (error) {
        catchErrorHandlerForFunction(`getRoomByLocation`, error);
    }
}
export default getRoomByLocation;
