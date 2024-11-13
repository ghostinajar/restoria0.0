// who
// shows user all users signed into Restoria
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
async function who(user) {
    try {
        // logger.debug(`Who command initiated`)
        const whoArray = await new Promise((resolve) => {
            worldEmitter.once(`userManagerReturningWhoArrayFor${user.username}`, resolve);
            worldEmitter.emit("requestingWhoArray", user.username);
        });
        if (!whoArray) {
            logger.error(`Error in who command.`);
            return;
        }
        let message = makeMessage("who", JSON.stringify(whoArray));
        worldEmitter.emit(`messageFor${user.username}`, message);
    }
    catch (error) {
        catchErrorHandlerForFunction("who", error, user.name);
    }
}
export default who;
