import logger from "../logger.js";

function shout(parsedCommand, user) {
    const response = {
        style : `shout`,
        emitToUser : `You shout, "${parsedCommand.string}".`,
        broadcastToZone : `${user.displayName} shouts, "${parsedCommand.string}".` 
    };
    logger.comms(`${user._id} ${user.name} shouted, "${parsedCommand.string}".`)
    return response;
}

export default shout;