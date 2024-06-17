import mongoose from "mongoose";
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import isValidCommandWord from "./isValidCommandWord.js";
import parseCommand from "./parseCommand.js";
import processCommand from "./processCommand.js";

async function userSentCommandHandler (socket : any, userInput: string, user : IUser & mongoose.Document) {
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

