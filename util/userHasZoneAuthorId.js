import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import makeMessage from "./makeMessage.js";
function userHasZoneAuthorId(zoneAuthorId, user) {
    try {
        if (zoneAuthorId !== user._id.toString()) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You aren't an author for this zone.`));
            return false;
        }
        return true;
    }
    catch (error) {
        catchErrorHandlerForFunction(`userHasZoneAuthorId`, error, user?.name);
        return false;
    }
}
export default userHasZoneAuthorId;
