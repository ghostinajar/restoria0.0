import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
function stats(user) {
    try {
        let statsMessage = makeMessage(`stats`, `< ${user.currentHp}/${user.maxHp}hp ${user.currentMp}/${user.maxMp}mp ${user.currentMv}/${user.maxMv}mv >`);
        worldEmitter.emit(`messageFor${user.username}`, statsMessage);
    }
    catch (error) {
        catchErrorHandlerForFunction("stats", error, user.name);
    }
}
export default stats;
