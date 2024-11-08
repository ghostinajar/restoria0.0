// stats
// shows a user their basic stats on one line
import logger from "../logger.js";
// stats
// shows a user their basic stats on one line
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
function stats(user) {
    try {
        let statsMessage = makeMessage(`stats`, `< ${user.runtimeProps?.currentHp}/${user.runtimeProps?.maxHp}hp ${user.runtimeProps?.currentMp}/${user.runtimeProps?.maxMp}mp ${user.runtimeProps?.currentMv}/${user.runtimeProps?.maxMv}mv >`);
        worldEmitter.emit(`messageFor${user.username}`, statsMessage);
    }
    catch (error) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
        if (error instanceof Error) {
            logger.error(`"stats" error for user ${user.username}: ${error.message}`);
        }
        else {
            logger.error(`"stats" error for user ${user.username}: ${error}`);
        }
    }
}
export default stats;
