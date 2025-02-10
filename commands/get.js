// get
// user can get objects from the ground or from containers
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
async function get(parsedCommand, user) {
    try {
        console.log(`get command executed by ${user?.name}`);
        console.log(`parsedCommand:`, parsedCommand);
    }
    catch (error) {
        catchErrorHandlerForFunction(`get`, error, user?.name);
    }
}
export default get;
