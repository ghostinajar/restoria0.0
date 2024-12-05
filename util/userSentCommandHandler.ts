// userSentCommandHandler
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import isValidCommandWord from "./isValidCommandWord.js";
import parseCommand from "./parseCommand.js";
import processCommand from "./processCommand.js";

async function userSentCommandHandler(
  socket: any,
  userInput: string,
  user: IUser
) {
  try {
    logger.input(`${user.name} sent command: ${userInput}`);
    let parsedCommand = parseCommand(userInput);
    console.log(parsedCommand)

    if (!isValidCommandWord(parsedCommand.commandWord)) {
      //TODO If invalid command word log IP (suspicious because client should prevent this)
      socket.emit(`redirectToLogin`, `Server rejected command`);
    }
    await processCommand(parsedCommand, user);
    if (
      parsedCommand.commandWord !== `stats` &&
      parsedCommand.commandWord !== `stat`
    ) {
      await processCommand({ commandWord: `stats` }, user);
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`userSentCommandHandler`, error, user?.name);
  }
}

export default userSentCommandHandler;
