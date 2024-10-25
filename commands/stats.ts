// stats
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";

function stats(user: IUser) {
  //show user's hp/maxhp mana/maxmana move/maxmove on one line
  let statsMessage = makeMessage(`stats`, `< ${user.runtimeProps?.currentHp}/${user.runtimeProps?.maxHp}hp ${user.runtimeProps?.currentMp}/${user.runtimeProps?.maxMp}mp ${user.runtimeProps?.currentMv}/${user.runtimeProps?.maxMv}mv >`)
  worldEmitter.emit(`messageFor${user.username}`, statsMessage)
}

export default stats;
