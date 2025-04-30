import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import messageToUsername from "./messageToUsername.js";
function userHasZoneAuthorId(zoneAuthorId, user) {
    try {
        // admins can be authors anywhere
        if (user.isAdmin) {
            return true;
        }
        // fail if user isn't the zone's author
        if (zoneAuthorId !== user._id.toString()) {
            messageToUsername(user.username, `You aren't an author for this zone. You can SUGGEST a change instead.`, `help`, true);
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
