import logger from "../logger.js";

function say(parsedCommand, user) {
    const response = {
        emitToUser : `You say, "${parsedCommand.string}".`,
        broadcastToRoom : `${user.displayName} says, "${parsedCommand.string}".` 
    };
    logger.comms(`${user._id} ${user.name} said, "${parsedCommand.string}".`)
    return response;
}

export default say;