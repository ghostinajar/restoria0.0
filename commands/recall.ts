// recall
// moves user to world recall
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import resetUserLocation from "../util/resetUserLocation.js";
import look from "./look.js";

async function recall(user: IUser) {
  try {
    worldEmitter.emit(
      `messageFor${user.username}sRoom`,
      makeMessage(`success`, `${user.name} disappears.`)
    );
    await resetUserLocation(user);

    worldEmitter.emit(
      `messageFor${user.username}sRoom`,
      makeMessage(`success`, `${user.name} appears.`)
    );
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        `success`,
        `You close your eyes and concentrate. When you open them, you're back in Restoria City.`
      )
    );
    await look({ commandWord: "look" }, user);
  } catch (error: unknown) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "rejection",
        `There was an error on our server. Ralu will have a look at it soon!`
      )
    );
    if (error instanceof Error) {
      logger.error(`recall error for user ${user.username}: ${error.message}`);
    } else {
      logger.error(`recall error for user ${user.username}: ${error}`);
    }
  }
}

export default recall;
