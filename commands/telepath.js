// telepath.js

import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import Message from "../model/classes/Message.js";

async function telepath(parsedCommand, player) {
    const target = await new Promise ((resolve) => {
        //TODO emit requestingPlayer, playerManager handles/emits
        worldEmitter.once(`userManagerReturningUser`, resolve);
        worldEmitter.emit(`requestingUser`, parsedCommand.directObject);
    });

    let message = new Message(true, 'telepath', ``);

    if (!parsedCommand.string) {
        message.content  = `Telepath what?`
        worldEmitter.emit(`messageFor${player.name}`, message);
        return;
    };

    if (!target) {
        message.content  = `${parsedCommand.directObject} is not online.`
        worldEmitter.emit(`messageFor${player.name}`, message);
        return;
    }

    message.content  = `You telepath ${target.displayName}, "${parsedCommand.string}".`
    worldEmitter.emit(`messageFor${player.name}`, message);

    message.content  = `${player.displayName} telepaths you, "${parsedCommand.string}".`
    worldEmitter.emit(`messageFor${target.name}`, message);

    logger.comms(`${player._id} (${player.name}) telepathed ${target.name}, "${parsedCommand.string}".`)
}

export default telepath;