// automap
// calls the map function only if user.preferences.autoMap === true
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import map from "./map.js";
async function automap(user) {
    try {
        if (!user.preferences.autoMap) {
            return;
        }
        map({ commandWord: "map" }, user);
    }
    catch (error) {
        catchErrorHandlerForFunction(`automap`, error, user?.name);
    }
}
export default automap;
