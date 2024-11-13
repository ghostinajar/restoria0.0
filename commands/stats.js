import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
function stats(user) {
    try {
        let statsMessage = makeMessage(`stats`, `< ${user.runtimeProps?.currentHp}/${user.runtimeProps?.maxHp}hp ${user.runtimeProps?.currentMp}/${user.runtimeProps?.maxMp}mp ${user.runtimeProps?.currentMv}/${user.runtimeProps?.maxMv}mv >`);
        worldEmitter.emit(`messageFor${user.username}`, statsMessage);
    }
    catch (error) {
        catchErrorHandlerForFunction("stats", error, user.name);
    }
}
export default stats;
