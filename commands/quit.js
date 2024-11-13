import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
import resetUserLocation from "../util/resetUserLocation.js";
async function quit(user) {
    try {
        let message = makeMessage(`quit`, `Bye bye, ${user.name}!`);
        worldEmitter.emit(`messageFor${user.username}`, message);
        await resetUserLocation(user);
        worldEmitter.emit(`user${user.username}LeavingGame`, user);
    }
    catch (error) {
        catchErrorHandlerForFunction("quit", error, user.name);
    }
}
export default quit;
