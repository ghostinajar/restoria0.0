// telepath.js

import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import makeMessage from "../types/makeMessage.js";
import { IParsedCommand } from "../util/parseCommand.js";
import { IUser } from "../model/classes/User.js";

async function telepath(parsedCommand : IParsedCommand, user : IUser) {
    let message = makeMessage('telepath', ``);
    
    if (!parsedCommand.directObject) {
        message.content  = `Telepath who?`
        worldEmitter.emit(`messageFor${user.username}`, message);
        return;
    };

    if (!parsedCommand.string) {
        message.content  = `Telepath what?`
        worldEmitter.emit(`messageFor${user.username}`, message);
        return;
    };

    const target : IUser = await new Promise ((resolve) => {
        worldEmitter.once(`userManagerReturningUser${parsedCommand.directObject}`, resolve);
        worldEmitter.emit(`requestingUser`, parsedCommand.directObject);
    });
    if (!target) {
        message.content  = `${parsedCommand.directObject} is not online.`
        worldEmitter.emit(`messageFor${user.username}`, message);
        return;
    }

    message.content  = `You telepath ${target.name}, "${parsedCommand.string}".`
    worldEmitter.emit(`messageFor${user.username}`, message);

    message.content  = `${user.name} telepaths you, "${parsedCommand.string}".`
    worldEmitter.emit(`messageFor${target.username}`, message);

    logger.log(`comms`,`${user._id} (${user.name}) telepathed ${target.name}, "${parsedCommand.string}".`)
}

export default telepath;