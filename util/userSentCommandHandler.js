import logger from "../logger.js";
import isValidCommandWord from "./isValidCommandWord.js";
import parseCommand from "./parseCommand.js";
import processCommand from "./processCommand.js";
async function userSentCommandHandler(socket, userInput, user) {
    logger.input(`${user.name} sent command: ${userInput}`);
    // Sanitize, parse, validate command
    // TODO sanitize command
    let parsedInput = parseCommand(userInput);
    if (!isValidCommandWord(parsedInput.commandWord)) {
        //TODO If invalid command word log IP (suspicious because client should prevent this)
        socket.emit(`redirectToLogin`, `Server rejected command.`);
    }
    await processCommand(parsedInput, user);
}
export default userSentCommandHandler;
