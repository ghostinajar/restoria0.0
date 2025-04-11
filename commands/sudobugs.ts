// sudobugs
// admin command to manage bugs and updates

import Bug from "../model/classes/Bug.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function sudobugs(parsedCommand: IParsedCommand, user: IUser) {
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

    const allBugs = await Bug.find(
      {},
      { date: 1, description: 1, isValid: 1, isFixed: 1, _id: 1 }
    );
    allBugs.forEach((bug) => {
      let valid = "";
      let fixed = "";
      let type = "red";
      if (bug.isValid) {
        valid = "valid";
        type = "yellow";
      }
      if (bug.isFixed) {
        fixed = "fixed";
        type = "green";
      }
      messageToUsername(user?.username, `${bug._id} ${valid} ${fixed}:\n${bug.description}`, type, true);
    });
    
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`sudobugs`, error, user?.name);
  }
}

export default sudobugs;
