// shout

import logger from "../logger.js";
import worldEmitter from '../model/classes/WorldEmitter.js';
import makeMessage from "../util/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import { IUser } from "../model/classes/User.js";

function shout(parsedCommand: IParsedCommand, user: IUser) {
    let message = makeMessage('shout', ``);
    
    if(!parsedCommand.string) {
        message.content = `Shout what?`
        worldEmitter.emit(`messageFor${user.username}`, message)
        return;
    }

    message.content = `You shout, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}`, message);
    message.content = `${user.name} shouts, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.username}sZone`, message);
    logger.log(`comms`,`${user._id} ${user.name} shouted, "${parsedCommand.string}".`)
}

export default shout;