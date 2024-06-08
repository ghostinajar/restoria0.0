import logger from "../logger.js";
import worldEmitter from '../model/classes/WorldEmitter.js';

function shout(parsedCommand, user) {
    let message = {
        userGen : true,
        type : `shout`,
        content : ``
    };
     
    if(!parsedCommand.string) {
        message.content = `Shout what?`
        worldEmitter.emit(`messageFor${user.name}`, message)
        return;
    }

    message.content = `You shout, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.name}`, message);
    message.content = `${user.displayName} shouts, "${parsedCommand.string}".`;
    worldEmitter.emit(`messageFor${user.name}sZone`, message);
    logger.comms(`${user._id} ${user.name} shouted, "${parsedCommand.string}".`)
}

export default shout;