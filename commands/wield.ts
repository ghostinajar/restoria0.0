// wield
// // user can WEILD a weapon-type item

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";

async function wield(user: IUser) {
  try {
    messageToUsername(user.username, `WIELD is still in development.`)
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`wield`, error, user?.name);
  }
}

export default wield;