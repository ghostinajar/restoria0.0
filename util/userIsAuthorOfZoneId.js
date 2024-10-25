// userIsAuthorOfZone
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "./makeMessage.js";
function userIsAuthorOfZoneId(zoneId, user) {
    if (zoneId !== user._id.toString()) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You aren't an author for this zone.`));
        return false;
    }
    return true;
}
export default userIsAuthorOfZoneId;
