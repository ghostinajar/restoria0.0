import logger from "../logger.js";
import author from "../commands/author.js";
import character from "../commands/character.js"
import say from "../commands/say.js";
import shout from "../commands/shout.js";
import telepath from "../commands/telepath.js";
import who from "../commands/who.js";


async function processCommand(parsedCommand, user) {
    //logger.info(`Processing command: ${JSON.stringify(parsedCommand)}`)
    let response;
    switch (parsedCommand.commandWord) {
        case 'author':
        case 'auth': {
            response = await author(user)
            break;
        }
        case 'say' : {
            response = say(parsedCommand, user)
            break;
        }
        case 'character' : 
        case 'char' : {
            response = character(parsedCommand, user)
            break;
        }
        case 'shout' : {
            response = shout(parsedCommand, user)
            break;
        }
        case 'telepath' : {
            response = telepath(parsedCommand, user)
            break;
        }
        case 'who' : {
            response = who()
            break;
        }
        default : {response = {echoToUser : `Command couldn't be processed.`}};
    }
    return response;
}

export default processCommand;