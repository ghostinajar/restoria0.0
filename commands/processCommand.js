import logger from "../logger.js";
import say from "./say.js";
import character from "./character.js"

function processCommand(parsedCommand, user) {
    //logger.info(`Processing command: ${JSON.stringify(parsedCommand)}`)
    let response;
    switch (parsedCommand.commandWord) {
        case 'say' : {
            response = say(parsedCommand, user)
            break;
        }
        case 'character' : {
            response = character(parsedCommand, user)
            //build a command to switch user's socket to characterState and pass it the character object
            break;
        }
        default : {response = {toUser : `Command couldn't be processed.`}};
    }
    return response;
}

export default processCommand;