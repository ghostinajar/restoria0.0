import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function getRoomOfUser(user) {
    try {
        const room = await new Promise((resolve) => {
            worldEmitter.once(`zoneManagerReturningRoom${user.location.inRoom.toString()}`, resolve);
            worldEmitter.emit("roomRequested", user.location);
        });
        return room;
    }
    catch (error) {
        catchErrorHandlerForFunction("functionName", error);
    }
}
export default getRoomOfUser;
