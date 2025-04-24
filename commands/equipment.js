// equipped
// shows user equipped items
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
async function equipped(parsedCommand, user) {
    try {
    }
    catch (error) {
        catchErrorHandlerForFunction(`equipped`, error, user?.name);
    }
}
export default equipped;
