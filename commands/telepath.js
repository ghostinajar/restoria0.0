// telepath
// allows users to communicate privately from any location
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import makeMessage from "../util/makeMessage.js";
async function telepath(parsedCommand, user) {
    try {
        let message = makeMessage("telepath", ``);
        if (!parsedCommand.directObject) {
            message.content = `Telepath who?`;
            worldEmitter.emit(`messageFor${user.username}`, message);
            return;
        }
        if (!parsedCommand.string) {
            message.content = `Telepath what?`;
            worldEmitter.emit(`messageFor${user.username}`, message);
            return;
        }
        const target = await new Promise((resolve) => {
            worldEmitter.once(`userManagerReturningUser${parsedCommand.directObject}`, resolve);
            worldEmitter.emit(`requestingUser`, parsedCommand.directObject);
        });
        if (!target) {
            message.content = `${parsedCommand.directObject} is not online.`;
            worldEmitter.emit(`messageFor${user.username}`, message);
            return;
        }
        message.content = `You telepath ${target.name}, "${parsedCommand.string}".`;
        worldEmitter.emit(`messageFor${user.username}`, message);
        message.content = `${user.name} telepaths you, "${parsedCommand.string}".`;
        worldEmitter.emit(`messageFor${target.username}`, message);
        logger.log(`comms`, `${user._id} (${user.name}) telepathed ${target.name}, "${parsedCommand.string}".`);
    }
    catch (error) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
        if (error instanceof Error) {
            logger.error(`telepath error for user ${user.username}: ${error.message}`);
        }
        else {
            logger.error(`telepath error for user ${user.username}: ${error}`);
        }
    }
}
export default telepath;
