import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function getRoomOfUser(user) {
    try {
        const room = await new Promise((resolve) => {
            worldEmitter.once(`zoneManagerReturningRoom${user.location.inRoom.toString()}`, resolve);
            worldEmitter.emit("roomRequested", user.location);
        });
        if (!room) {
            throw new Error(`room for user ${user.name} not found!`);
        }
        return room;
    }
    catch (error) {
        catchErrorHandlerForFunction("functionName", error);
    }
}
export default getRoomOfUser;
