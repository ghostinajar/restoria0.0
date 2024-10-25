// say

import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import { IUser } from "../model/classes/User.js";

function say(parsedCommand : IParsedCommand, user : IUser) {
    let message = makeMessage('say', ``);

    if (!parsedCommand.string) {
        message.content = `Say what?`;
        worldEmitter.emit(`messageFor${user.username}`, message);
        return;
    };
        
    message.content = `You say, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}`, message);
    message.content = `${user.name} says, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}sRoom`, message);
    logger.log(`comms`,`${user._id} ${user.name} said, "${parsedCommand.string}".`)
}

export default say;