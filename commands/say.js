// say

import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";

function say(parsedCommand, user) {
    let message = makeMessage(true, 'say', ``);

    if (!parsedCommand.string) {
        message.content = `Say what?`;
        worldEmitter.emit(`messageFor${user.username}`, message);
        return;
    };
        
    message.content = `You say, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}`, message);
    message.content = `${user.name} says, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}sRoom`, message);
    logger.comms(`${user._id} ${user.name} said, "${parsedCommand.string}".`)
}

export default say;