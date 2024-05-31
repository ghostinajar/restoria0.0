function processCommand(parsedCommand, user) {
    logger.info(`Processing command: ${JSON.stringify(parsedCommand)}`)
    let response;
    switch (parsedCommand.commandWord) {
        case say : {
            response = {
                toUser : `You say, "${parsed.parsedCommand.string}"`,
                toBroadcast : `${user.displayName} says, "${parsed.parsedCommand.string}"` 
            }
        }
        case character : {
            //build a command to switch user's socket to characterState and pass it the character object
            response = {
                toUser : `User switching to character ${character.displayName}.`
            }
        }
    }
    return response;
}