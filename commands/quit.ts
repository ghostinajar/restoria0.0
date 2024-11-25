// quit
// quits user from the game
import WORLD_RECALL from "../constants/WORLD_RECALL.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
import relocateUser from "../util/relocateUser.js";

async function quit(user: IUser) {
  try {
    let message = makeMessage(`quit`, `Bye bye, ${user.name}!`);
    worldEmitter.emit(`messageFor${user.username}`, message);
    await relocateUser(user, WORLD_RECALL);
    worldEmitter.emit(`user${user.username}LeavingGame`, user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("quit", error, user.name)

  }
}

export default quit;
