import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";

async function telepath(parsedCommand, user) {
    const target = await new Promise ((resolve) => {
        worldEmitter.once(`userManagerReturningUser`, resolve);
        worldEmitter.emit(`requestingUser`, parsedCommand.directObject);
    });

    if (!target) {
        const response = {
            style : `telepath`,
            emitToUser : `${parsedCommand.directObject} is not online.`,
        };
        return response;
    }

    const response = {
        style : `telepath`,
        emitToUser : `You telepath ${target.displayName}, "${parsedCommand.string}".`,
        emitToTarget : `${user.displayName} telepaths you, "${parsedCommand.string}".`
    };
    //logger.debug(JSON.stringify(response));

    const eventName = `telepathTo${target.name.toLowerCase()}`;
    //logger.debug(eventName);
    worldEmitter.emit(eventName, response.emitToTarget);
    logger.comms(`${user._id} (${user.name}) telepathed ${target.name}, "${parsedCommand.string}".`)
    return response;
}

export default telepath;