import logger from "../logger.js";
import author from "./author.js";
import character from "./character.js"
import say from "./say.js";

async function processCommand(parsedCommand, user) {
    //logger.info(`Processing command: ${JSON.stringify(parsedCommand)}`)
    let response;
    switch (parsedCommand.commandWord) {
        case 'author' : {
            response = await author(user)
            break;
        }
        case 'say' : {
            response = say(parsedCommand, user)
            break;
        }
        case 'character' : {
            response = character(parsedCommand, user)
            //build a command to switch user's socket to characterState and pass it the character object
            break;
        }
        default : {response = {echoToUser : `Command couldn't be processed.`}};
    }
    return response;
}

export default processCommand;