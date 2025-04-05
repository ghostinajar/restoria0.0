// roomSummary
// ADMIN ONLY command to log a summary of all rooms with their user/mob/item content

import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

async function roomSummary(user: IUser) {
  try {
    if (!user.isAdmin) {
      return;
    }
    worldEmitter.emit("roomSummaryRequested");
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`roomSummary`, error, user?.name);
  }
}

export default roomSummary;