// sudobug
// admin command to set isValid and isFixed values on bugs
// use SUDOBUGS first to get bug IDs and current values
// e.g. SUDOBUG 1234 valid fixed
// e.g. SUDOBUG 1234 invalid fixed
// e.g. SUDOBUG 1234 valid unfixed
// e.g. SUDOBUG 1234 invalid unfixed

import Bug from "../model/classes/Bug.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function sudobug(parsedCommand: IParsedCommand, user: IUser) {
  try {
    if (!user?.isAdmin) {
      messageToUsername(
        user?.username,
        `That command is only available to admin.`,
        "failure",
        true
      );
      return;
    }

    if (!parsedCommand.string) {
      messageToUsername(
        user?.username,
        `Please provide a bug ID and values, e.g. "SUDOBUG 1234 valid fixed".`,
        "failure",
        true
      );
      return;
    }

    const splitString = parsedCommand.string.split(" ");
    const bugId = splitString[0];
    const valid = splitString[1].toLowerCase() === "valid";
    const fixed = splitString[2].toLowerCase() === "fixed";
    const bug = await Bug.findById(bugId);
    if (!bug) {
      messageToUsername(
        user?.username,
        `Bug ${bugId} not found.`,
        "failure",
        true
      );
      return;
    }
    bug.isValid = valid;
    bug.isFixed = fixed;
    bug.date = new Date();
    await bug.save();
    
    messageToUsername(user?.username, `Bug ${bugId} updated to valid: ${valid} and fixed ${fixed}`, "success", true);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`sudobug`, error, user?.name);
  }
}

export default sudobug;
