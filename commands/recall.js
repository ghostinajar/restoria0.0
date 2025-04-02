// recall
// moves user to world recall
import WORLD_RECALL from "../constants/WORLD_RECALL.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
import relocateUser from "../util/relocateUser.js";
async function recall(user) {
    try {
        worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`success`, `${user.name} disappears.`));
        await relocateUser(user, WORLD_RECALL);
        worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`success`, `${user.name} appears.`));
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `You close your eyes and concentrate. When you open them, you're back in Restoria City.`));
    }
    catch (error) {
        catchErrorHandlerForFunction("recall", error, user.name);
    }
}
export default recall;
