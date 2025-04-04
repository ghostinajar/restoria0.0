// who
// shows user all users signed into Restoria
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

async function who(user: IUser) {
  try {
    // logger.debug(`Who command initiated`)
    const whoArray = await new Promise((resolve) => {
      worldEmitter.once(
        `userManagerReturningWhoArrayFor${user.username}`,
        resolve
      );
      worldEmitter.emit("requestingWhoArray", user.username);
    });
    if (!whoArray) {
      logger.error(`Error in who command.`);
      return;
    }
    worldEmitter.emit(`whoArrayFor${user.username}`, whoArray);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("who", error, user.name);
  }
}

export default who;
