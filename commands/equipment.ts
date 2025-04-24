// equipped
// shows user equipped items

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function equipped(parsedCommand: IParsedCommand, user: IUser) {
  try {
    
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`equipped`, error, user?.name);
  }
}

export default equipped;