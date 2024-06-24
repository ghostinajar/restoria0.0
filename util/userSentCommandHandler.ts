// userSentCommandHandler
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import isValidCommandWord from "./isValidCommandWord.js";
import parseCommand from "./parseCommand.js";
import processCommand from "./processCommand.js";

async function userSentCommandHandler(
  socket: any,
  userInput: string,
  user: IUser
) {
  logger.input(`${user.name} sent command: ${userInput}`);
  // Sanitize, parse, validate command
  // TODO sanitize command
  let parsedCommand = parseCommand(userInput);
  if (!isValidCommandWord(parsedCommand.commandWord)) {
    //TODO If invalid command word log IP (suspicious because client should prevent this)
    socket.emit(`redirectToLogin`, `Server rejected command.`);
  }
  await processCommand(parsedCommand, user);
  if (parsedCommand.commandWord !== `stats` && parsedCommand.commandWord !== `stat`) {
    await processCommand({commandWord: `stats`}, user);
  }
}

export default userSentCommandHandler;
