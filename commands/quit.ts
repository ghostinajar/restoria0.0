// quit
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import resetUserLocation from "../util/resetUserLocation.js";

async function quit(user: IUser) {
  try {
    let message = makeMessage(`quit`, `Bye bye, ${user.name}!`);
    worldEmitter.emit(`messageFor${user.username}`, message);
    await resetUserLocation(user);
    worldEmitter.emit(`user${user.username}LeavingGame`, user);
  } catch (error: unknown) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `There was an error on our server. Ralu will have a look at it soon!`
      )
    );
    if (error instanceof Error) {
      logger.error(`"quit" error for user ${user.username}: ${error.message}`);
    } else {
      logger.error(`"quit" error for user ${user.username}: ${error}`);
    }
  }
}

export default quit;
