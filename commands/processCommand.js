import logger from "../logger.js";

function processCommand(parsedCommand, user) {
    logger.info(`Processing command: ${JSON.stringify(parsedCommand)}`)
    let response;
    switch (parsedCommand.commandWord) {
        case 'say' : {
            response = {
                toUser : `You say, "${parsedCommand.string}"`,
                toBroadcast : `${user.displayName} says, "${parsedCommand.string}"` 
            };
            break;
        }
        // case 'character' : {
        //     //build a command to switch user's socket to characterState and pass it the character object
        //     const splitString = parsedCommand.string.split();
        //     const directObject = splitString[0];
        //     const character = user.characters.find(character => character.name === directObject);
        //     if (character) {
        //         response = {
        //             toUser : `Switching to character ${user.displayName}...`
        //         }
        //     } else {
        //         response = {
        //             toUser : `No character found by the name "${directObject}".`
        //         }
        //     }
        // }
        default : {response = {toUser : `Command couldn't be processed.`}};
    }
    return response;
}

export default processCommand;