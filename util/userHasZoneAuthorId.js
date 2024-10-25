// userHasZoneAuthorId
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "./makeMessage.js";
function userHasZoneAuthorId(zoneAuthorId, user) {
    console.log("zoneAuthorId:");
    console.log(zoneAuthorId);
    console.log("userId");
    console.log(user._id.toString());
    if (zoneAuthorId !== user._id.toString()) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `You aren't an author for this zone.`));
        return false;
    }
    return true;
}
export default userHasZoneAuthorId;
