// get
// user can get objects from the ground or from containers

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function get(parsedCommand: IParsedCommand, user: IUser) {
  try {
    console.log(`get command executed by ${user?.name}`);
    console.log(`parsedCommand:`, parsedCommand);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`get`, error, user?.name);
  }
}

export default get;