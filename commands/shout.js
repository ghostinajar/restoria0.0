// shout
// allows user to shout someting to the zone
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
function shout(parsedCommand, user) {
    try {
        let message = makeMessage("shout", ``);
        if (!parsedCommand.string) {
            message.content = `Shout what?`;
            worldEmitter.emit(`messageFor${user.username}`, message);
            return;
        }
        message.content = `You shout, "${parsedCommand.string}".`;
        worldEmitter.emit(`messageFor${user.username}`, message);
        message.content = `${user.name} shouts, "${parsedCommand.string}".`;
        worldEmitter.emit(`messageFor${user.username}sZone`, message);
        logger.log(`comms`, `${user._id} ${user.name} shouted, "${parsedCommand.string}".`);
    }
    catch (error) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
        if (error instanceof Error) {
            logger.error(`shout error for user ${user.username}: ${error.message}`);
        }
        else {
            logger.error(`shout error for user ${user.username}: ${error}`);
        }
    }
}
export default shout;
