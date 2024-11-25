// recall
// moves user to world recall
import WORLD_RECALL from "../constants/WORLD_RECALL.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
import relocateUser from "../util/relocateUser.js";
import look from "./look.js";

async function recall(user: IUser) {
  try {
    worldEmitter.emit(
      `messageFor${user.username}sRoom`,
      makeMessage(`success`, `${user.name} disappears.`)
    );
    await relocateUser(user, WORLD_RECALL);

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
    catchErrorHandlerForFunction("recall", error, user.name)
  }
}

export default recall;
