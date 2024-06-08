// say.js

import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import Message from "../model/classes/Message.js";

function say(parsedCommand, user) {
    let message = new Message(true, 'say', ``);

    if (!parsedCommand.string) {
        message.content = `Say what?`;
        worldEmitter.emit(`messageFor${user.name}`, message);
        return;
    };
        
    message.content = `You say, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.name}`, message);
    message.content = `${user.displayName} says, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.name}sRoom`, message);
    logger.comms(`${user._id} ${user.name} said, "${parsedCommand.string}".`)
}

export default say;