// stats
// shows a user their basic stats on one line
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";

function stats(user: IUser) {
  try {
    let statsMessage = makeMessage(
      `stats`,
      `< ${user.currentHp}/${user.maxHp}hp ${user.currentMp}/${user.maxMp}mp ${user.currentMv}/${user.maxMv}mv >`
    );
    worldEmitter.emit(`messageFor${user.username}`, statsMessage);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("stats", error, user.name);
  }
}

export default stats;
